uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform float uDistort;
uniform float uFrequency;
uniform float uAudioData;
varying vec2 vUv;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vWorldPosition;
const float PI = 3.1415926;

#include "/node_modules/lygia/generative/cnoise.glsl"
#include "/node_modules/lygia/generative/pnoise.glsl"
#include "/node_modules/lygia/generative/fbm.glsl"
#include "/node_modules/lygia/generative/curl.glsl"


vec3 distort(vec3 p){
//    vec3 noise = curl(p) * PI * uDistort / uFrequency * (uAudioData * 0.3);
    float noise = cnoise(p) * PI * uDistort / uFrequency * (uAudioData * 0.3);
    vNoise = noise;
    p += noise * normal * 0.01;
    return p;
}

    #include "/src/views/shaderStudy/glsl/page9/shaders/fixNormal.glsl"


void main(){
    vec3 p=position;
    vec3 dp=distort(p);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(dp, 1.);

    vUv=uv;
    vec3 fNormal=fixNormal(p, dp, normal, RADIUS/SEGMENTS);
    vNormal=(modelMatrix*vec4(fNormal, 0.)).xyz;
    vWorldPosition=vec3(modelMatrix*vec4(dp, 1));
}
