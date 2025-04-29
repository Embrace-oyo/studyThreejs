#define GLSLIFY 1
uniform sampler2D u_letterTexture;
uniform float u_time;
varying vec2 v_charUv;
varying vec2 v_uv;
varying vec3 v_worldPosition;
varying vec4 v_instanceRands;
varying float v_opacity;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    float fade=1.-linearStep(15., 66., v_worldPosition.z);
    float MAX_CHAR=42.;
    float charIdx=floor(mod(v_charUv.y, MAX_CHAR));
    float charTime=u_time*mix(1., 2., v_instanceRands.y+hash43(vec3(charIdx, -100., v_instanceRands.z)).x);
    vec4 charRands=hash43(vec3(charIdx, v_instanceRands.w, floor(charTime*-2.)));
    charIdx=mod(charIdx+floor(charRands.x*MAX_CHAR), MAX_CHAR);
    vec2 charUv=vec2((v_charUv.x+charIdx)/MAX_CHAR, mod(v_charUv.y, 1.));
    float shade=texture2D(u_letterTexture, charUv).r;
    gl_FragColor=vec4(shade)*charRands.w*charRands.y*v_opacity;
    gl_FragColor*=smoothstep(0.5, 0.35, abs(v_uv.y-.5))*(0.5+fade*0.5)*(0.3+v_instanceRands.z*1.25)*smoothstep(100., 150., mod(v_charUv.y-200.*v_instanceRands.y, 200.));
    gl_FragColor.a*=3.;
}

