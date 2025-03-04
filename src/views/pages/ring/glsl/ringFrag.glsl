precision highp float;
#include "/node_modules/lygia/generative/fbm.glsl"
//#include "/node_modules/lygia/sdf/circleSDF.glsl"
varying vec2 vUv;
varying vec3 vPos;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D uTexture;

#define time iTime * 0.15
#define PI 3.14159265
#define tau 6.2831853

float circ(vec2 p){
    float m = mod(time * 10.0, PI);
    p = p / exp(m);
    float r = length(p);
    r = sqrt(r);
    r = log(r);
    r = mod(r * 4.0, tau);
    r = abs(r - PI);
    r = r * 3.0;
    r = r + 0.2;
    return r;
}
mat2 makem2(in float theta){
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}
mat3 rotX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(1, 0,  0,
    0, c, -s,
    0, s,  c);
}
mat3 rotY(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(c,  0, s,
    0,  1, 0,
    -s,  0, c);
}
mat3 rotZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat3(c, -s, 0,
    s,  c, 0,
    0,  0, 1);
}

void main(){
    vec2 uv = (vUv - 0.5) * 2.0;
    float c = circ(uv);
    vec3 pos = vPos;
    float f1 = fbm(pos + time * 1.6);
    float f2 = fbm(pos - time * 1.7);
    float switchPoint = 2.0;
    float t = smoothstep(switchPoint - 0.1, switchPoint + 0.1, length(vUv));
    float mixF = mix(f1, f2, t);
    mixF = (mixF-0.5)*0.2;
    pos+=mixF;
    mixF = fbm(pos);
    mixF *= pow(abs(0.1 - c), 0.7);
    vec3 col = vec3(.2, 0.1, 0.4)/mixF;
    col=pow(abs(col), vec3(.99));
    gl_FragColor = vec4(vec3(col), 1.0);
}
