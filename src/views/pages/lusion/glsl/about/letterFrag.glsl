#define GLSLIFY 1
uniform sampler2D u_texture;
uniform float u_opacity;
uniform float u_time;
varying vec2 v_pixel;
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    vec4 rands=hash43(vec3(floor(v_pixel), floor(u_opacity*3.)+floor(u_time+sin(u_time*3.)*1.5)));
    float opacity=mix(pow(rands.x, 5.), 0.95+rands.y*0.05, smoothstep(.75, 1., u_opacity))*u_opacity;
    vec2 uv=(floor(v_pixel)+.5)/vec2(210., 6.);
    float mask=texture2D(u_texture, uv).r;
    vec2 dd=abs(fract(v_pixel)-.5);
    float dotMask=step(max(dd.x, dd.y), .05);
    gl_FragColor=vec4(1., 1., 1., max(dotMask*.3*(opacity*0.5+u_opacity*0.5), mask*opacity));
}

