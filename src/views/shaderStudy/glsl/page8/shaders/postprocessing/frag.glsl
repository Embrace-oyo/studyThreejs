#include "/node_modules/lygia/generative/random.glsl"

uniform float iTime;
uniform vec2 iResolution;
uniform vec2 iMouse;
uniform sampler2D tDiffuse;
uniform float uRGBShift;

varying vec2 vUv;

vec3 grain(vec2 uv, vec3 col){
    float noise=random(uv+iTime);
    col+=(noise-.5)*.1;
    return col;
}
vec4 RGBShift(sampler2D tex, vec2 uv, float amount){
    vec2 rUv=uv;
    vec2 gUv=uv;
    vec2 bUv=uv;
    float noise=random(uv+iTime)*.5+.5;
    vec2 offset=amount*vec2(cos(noise), sin(noise));
    rUv+=offset;
    gUv+=offset*.5;
    bUv+=offset*.25;
    vec4 rTex=texture(tex, rUv);
    vec4 gTex=texture(tex, gUv);
    vec4 bTex=texture(tex, bUv);
    vec4 col=vec4(rTex.r, gTex.g, bTex.b, gTex.a);
    return col;
}
void main(){
    vec2 uv=vUv;
    vec4 tex=RGBShift(tDiffuse, uv, uRGBShift);
    vec3 col=tex.xyz;
    col=grain(uv, col);
    gl_FragColor=vec4(col, 1.);
}
