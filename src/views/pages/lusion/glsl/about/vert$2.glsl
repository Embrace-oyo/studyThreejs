#define GLSLIFY 1
attribute vec3 instancePos;
attribute vec4 instanceRands;
attribute float instanceDensity;
uniform float u_time;
uniform float u_showRatio;
varying vec2 v_uv;
varying vec2 v_charUv;
varying vec3 v_worldPosition;
varying vec4 v_instanceRands;
varying float v_opacity;
void main(){
    float charCount=mix(50., 100., instanceRands.y);
    vec3 pos=position;
    v_uv=uv;
    pos.xy*=vec2(1., 6./5.*charCount);
    v_charUv=vec2(1.-position.x, position.y*charCount)+vec2(.5, 0.);
    v_charUv.y-=u_time*mix(2., 10., instanceRands.x);
    pos=pos*0.75+instancePos;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.);
    v_worldPosition=(modelMatrix*vec4(pos, 1.)).xyz;
    v_instanceRands=instanceRands;
    v_opacity=mix(.5, 1., instanceDensity)*u_showRatio;
}
