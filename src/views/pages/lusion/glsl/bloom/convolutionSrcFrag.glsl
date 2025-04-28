#define GLSLIFY 1
uniform vec2 u_aspect;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main(){
    vec2 toCenter=(fract(v_uv+0.5)-0.5)*u_aspect;
    vec2 rotToCenter=mat2(0.7071067811865476, -0.7071067811865476, 0.7071067811865476, 0.7071067811865476)*toCenter;
    float res=exp(-length(toCenter)*1.0)*0.05+exp(-length(toCenter)*7.5)*0.5+exp(-length(toCenter)*25.0)*1.+exp(-length(toCenter*vec2(1.0, 10.0))*30.0)*20.+exp(-length(toCenter*vec2(1.0, 20.0))*60.0)*300.+exp(-length(toCenter*vec2(10.0, 1.0))*30.0)*20.+exp(-length(toCenter*vec2(20.0, 1.0))*60.0)*300.+exp(-length(rotToCenter*vec2(1.0, 8.0))*37.5)*12.+exp(-length(rotToCenter*vec2(1.0, 20.0))*75.0)*300.+exp(-length(rotToCenter*vec2(20.0, 1.0))*75.0)*300.;
    gl_FragColor=vec4(res, res, 0., 0.);
}
