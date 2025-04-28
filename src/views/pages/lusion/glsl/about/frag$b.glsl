#define GLSLIFY 1
uniform sampler2D u_prevTexture;
uniform sampler2D u_lightShadowTexture;
uniform vec3 u_lightPosition;
uniform vec2 u_blueNoiseOffset;
uniform float u_lightShadowMaxDistance;
uniform float u_radius;
uniform float u_texelSize;
varying vec2 v_uv;

#include "./getLightUv.glsl"
#include "../common/getBlueNoise.glsl"
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    vec3 blueNoise=getBlueNoise(gl_FragCoord.xy+u_blueNoiseOffset);
    vec2 uvDir=normalize(v_uv-0.5);
    vec2 uv=v_uv-uvDir*u_texelSize;
    vec3 worldPosition=vec3(uv*2.0-1.0, 0.0).xzy*u_radius;
    worldPosition.z*=-1.0;
    vec3 lightToWorld=worldPosition-u_lightPosition;
    float distToLight=length(lightToWorld);
    float expandRatio=linearStep(u_lightPosition.y, 14., distToLight);
    vec3 lightSampleStep=((vec3(lightToWorld.x, 0.0, lightToWorld.z)*(1.0-expandRatio*0.75)+(blueNoise-0.5)*expandRatio*4.)*25.0*expandRatio*expandRatio)/float(LIGHT_SHADOW_SAMPLE_COUNT)*-mix(0.06, 0.1, expandRatio);
    vec3 lightToWorldPos=lightToWorld+lightSampleStep*blueNoise.y;
    float accum=0.0;
    for (int i=0;i<LIGHT_SHADOW_SAMPLE_COUNT;i++){
        float selfDist=min(1.0, length(lightToWorldPos)/u_lightShadowMaxDistance);
        vec2 lightShadowUv=getLightUv(lightToWorldPos);
        float dist=texture2D(u_lightShadowTexture, lightShadowUv).r;
        float delta=selfDist-dist;
        accum+=delta>0. ? min(delta*delta*20., 1.): 1.0;
        lightToWorldPos+=lightSampleStep;
    }
    float shadowMask=accum/float(LIGHT_SHADOW_SAMPLE_COUNT);
    shadowMask=mix(shadowMask, 1.0, expandRatio);
    shadowMask=pow(shadowMask, 6.);
    float prevShadowMask=texture2D(u_prevTexture, v_uv).r;
    gl_FragColor=vec4(mix(prevShadowMask, shadowMask, shadowMask>prevShadowMask ? 0.5 : 0.2));
}
