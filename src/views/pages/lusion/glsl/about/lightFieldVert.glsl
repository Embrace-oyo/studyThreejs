#define GLSLIFY 1
attribute vec3 position;
uniform sampler2D u_simCurrPosLifeTexture;
uniform float u_noiseStableFactor;

//#include <lightFieldSlice>
#include "./lightFieldSlice.glsl"
varying vec4 v_color;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    vec4 rands=hash43(position);
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, position.xy);
    float scale=linearStep(1.0, 0.9, currPositionInfo.w);
    vec3 pos=currPositionInfo.xyz;
    vec3 lightFieldGrid=clampedLightFieldPosToGrid(pos);
    vec2 lightFieldUv=lightFieldGridToUv(lightFieldGrid);
    gl_Position=vec4(lightFieldUv*2.0-1.0, 0.0, 1.0);
    gl_PointSize=1.0;
    vec3 color=position.x<0.005 ? vec3(1.): vec3(0.1);
    v_color=vec4(color, 1.)*scale;
}

