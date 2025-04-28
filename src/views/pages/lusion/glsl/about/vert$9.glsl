#define GLSLIFY 1
attribute vec3 simUv;
uniform sampler2D u_simCurrPosLifeTexture;
uniform vec2 u_simTextureSize;
uniform float u_sceneHideRatio;
uniform float u_isEmissive;
uniform float u_noiseStableFactor;
uniform sampler2D u_lightFieldSlicedTexture;

//#include <lightFieldSlice>
#include "./lightFieldSlice.glsl"
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec3 v_worldNormal;
varying float v_depth;
varying float v_diff;
varying float v_ao;
varying float v_emission;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, simUv.xy);
    vec4 rands=hash43(simUv);
    float particleSize=mix(0.06, 0.175, u_isEmissive)*(0.5+rands.x*0.5);
    float particleSizeScale=linearStep(0.0, 0.1, currPositionInfo.w)*linearStep(1.0, 0.9, currPositionInfo.w);
    particleSize*=particleSizeScale*(1.0-u_sceneHideRatio);
    vec3 pos=position*particleSize+currPositionInfo.xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_viewNormal=normalMatrix*normal;
    v_worldNormal=normalize((vec4(v_viewNormal, 0.)*viewMatrix).xyz);
    vec3 rayGridDir=v_worldNormal;
    vec3 rayGridPos=lightFieldPosToGrid(v_worldPosition);
    vec4 indirectDiffuse=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+rayGridDir);
    float lifeFalloff=mix(0.5, 1., particleSizeScale);
    v_emission=(indirectDiffuse.a*0.55*lifeFalloff+0.45)*u_isEmissive;
    v_diff=(1.-indirectDiffuse.a)*lifeFalloff;
    v_diff*=linearStep(5., 1.5, length(v_worldPosition-vec3(0., 8., 0.)));
    v_ao=1.0-indirectDiffuse.a;

    //    #include <aboutHeroVisualFinal_vert>
    #include "./aboutHeroVisualFinal_vert.glsl"
}
