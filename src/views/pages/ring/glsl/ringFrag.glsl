precision highp float;
#include "/node_modules/lygia/generative/srandom.glsl"
#include "/node_modules/lygia/sample/mirror.glsl"
varying vec2 vUv;
varying vec3 vPos;
uniform float iTime;
uniform vec2 iResolution;
uniform sampler2D uTexture;

#define time iTime * 0.15
#define PI 3.14159265
#define tau 6.2831853
mat2 makem2(in float theta){
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}
float noise(in vec2 x){
    return texture2D(uTexture, x*.01).x;
}
float fbm(in vec2 p){
    float z=2.;
    float rz = 0.;
    vec2 bp = p;
    for (float i= 1.;i < 6.;i++)
    {
        rz+= abs((noise(p)-0.5)*2.)/z;
        z = z*2.;
        p = p*2.;
    }
    return rz;
}
float dualfbm(in vec2 p){
    //get two rotated fbm calls and displace the domain
    vec2 p2 = p*.7;
    vec2 basis = vec2(fbm(p2-time*1.6), fbm(p2+time*1.7));
    basis = (basis-.5)*.2;
    p += basis;

    //coloring
    return fbm(p*makem2(time*0.2));
}
float circ(vec2 p){
    float r = length(p);
    r = log(sqrt(r));
    return abs(mod(r*4., tau)-3.14)*3.+.2;
}


void main(){
    vec3 pos = vPos * 4.0;
    vec2 uv = (vPos.xy - 0.5) * 2.0;
    float aspect = vPos.x / vPos.y;
//    uv.x*=aspect;
    uv*=4.0;
    float rz = dualfbm(uv);
    uv /= exp(mod(time*10.0, 3.14159));
    rz *= pow(abs((0.1-circ(uv))), 0.9);
    vec3 col = vec3(.2, 0.1, 0.4)/rz;
    col=pow(abs(col), vec3(.99));
    gl_FragColor = vec4(col, 1.0);
}
