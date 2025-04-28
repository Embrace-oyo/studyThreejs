#define GLSLIFY 1
uniform sampler2D u_lightFieldSlicedTexture;
uniform float u_noiseStableFactor;
uniform float u_emissiveRatio;
uniform float u_contrast;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec3 v_viewNormal;
varying float v_depth;
varying float v_diff;
varying float v_emission;
varying float v_ao;

//#include <lightFieldSlice>
//#include <getScatter>
//#include <getBlueNoise>
#include "./lightFieldSlice.glsl"
#include "./getScatter.glsl"
#include "../common/getBlueNoise.glsl"

float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy);
    vec3 viewNormal=normalize(v_viewNormal);
    vec3 worldNormal=normalize(v_worldNormal);
    vec3 rayGridPos=lightFieldPosToGrid(v_worldPosition);
    vec3 rayGridDir=worldNormal;
    vec3 rayGridSpecDir=reflect(normalize(v_worldPosition-cameraPosition), worldNormal);
    vec4 indirectSpecular=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+normalize(rayGridSpecDir+(noise-.5)*0.25)*(1.+noise.z));
    float specular=indirectSpecular.r;
    vec3 rayGridRefractDir=refract(normalize(v_worldPosition-cameraPosition), worldNormal, 1./1.4);
    vec4 refractionInfo=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+normalize(rayGridRefractDir+(noise-.5)*0.25)*(1.5+noise.z));
    float refraction=refractionInfo.r*(1.-refractionInfo.a*0.75);
    float shade=v_diff*0.45+specular+refraction;
    shade+=getScatter(cameraPosition, v_worldPosition)*1.35;
    float viewShade=linearStep(-1., 1., dot(viewNormal, vec3(.5773)));
    shade=mix(shade, viewShade, v_emission*v_ao)*(.4+v_ao*.6);
    gl_FragColor=vec4(mix(shade, smoothstep(0., 1., shade), 0.5), v_depth, 1., mix(v_diff*v_diff+v_emission, 1., u_emissiveRatio));
}

