#define GLSLIFY 1
varying vec3 v_worldPosition;
varying vec2 v_uv;
varying float v_depth;
varying float v_instanceId;
varying float v_opacity;
uniform sampler2D u_currSceneTexture;
uniform sampler2D u_fogTexture;
uniform vec2 u_resolution;
uniform vec3 u_lightPosition;
uniform float u_noiseStableFactor;
uniform float u_time;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define saturate(a) clamp(a, 0.0, 1.0)
#include "../common/getBlueNoise.glsl"
#include "./getScatter.glsl"
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    float faceDirection=gl_FrontFacing ? 1.0 :-1.0;
    vec2 screenPaintUv=gl_FragCoord.xy/u_resolution;
    vec2 fogMap=texture2D(u_fogTexture, v_uv).rg;
    vec4 currScene=texture2D(u_currSceneTexture, screenPaintUv);
    float depth=v_depth-fogMap.y*0.02;
    float depthMask=fogMap.x*1.35-fogMap.y*0.15;
    gl_FragColor.r=depthMask*v_opacity;
    gl_FragColor.gb=currScene.gb;
    gl_FragColor.a=exp(-length(v_worldPosition+vec3(0., 0., -max(0., fogMap.y-0.25)*10.+5.)-vec3(0., 0., 0.))*(0.22-fogMap.x*0.2))*fogMap.y*linearStep(0.0, 0.035, depth-currScene.g)*v_opacity*0.45;
}


