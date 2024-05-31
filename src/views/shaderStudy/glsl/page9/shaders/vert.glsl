uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform float uDistort;
uniform float uFrequency;
uniform sampler2D uAudioData;
varying vec2 vUv;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vWorldPosition;
const float PI = 3.1415926;

#include "/node_modules/lygia/generative/cnoise.glsl"
#include "/node_modules/lygia/generative/fbm.glsl"


vec3 distort(vec3 p){
    //    float offset = cnoise(p/uFrequency+iTime*0.5);
    /* float f = texture2D(uAudioData, vec2(uv.x, 0.0)).r;
     float offset = fbm(p/uFrequency+f*0.5);
     float t = (p.y + offset) * PI * 12.0;
     float noise = (sin(t) * p.x + cos(t) * p.z) * 2.0;*/
    float t = (p.y + 1.0) * PI * 12.0;
    float n = (sin(t) * p.x + cos(t) * p.z) * 2.0;
    float f = texture2D(uAudioData, vec2(uv.x, 0.0)).r;
    float noise = fbm(p + t + n + f);
    noise *= uDistort;
    vNoise = noise;
    p+=noise*normal*.01;
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
