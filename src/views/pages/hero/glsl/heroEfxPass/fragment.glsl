#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec3 u_colorBurn;
uniform float u_colorBurnAlpha;
uniform vec3 u_colorDodge;
uniform float u_colorDodgeAlpha;
varying vec2 v_uv;
vec3 colorDodge(in vec3 src, in vec3 dst){
    return mix(step(0., src)*(min(vec3(1.), dst/(1.-src))), vec3(1.), step(1., dst));
}
vec3 colorBurn(in vec3 src, in vec3 dst){
    return mix(step(0., src)*(1.-min(vec3(1.), (1.-dst)/src)), vec3(1.), step(1., dst));
}
void main(){
    vec4 texture=texture2D(u_texture, v_uv);
    vec3 colorBurn=mix(texture.rgb, colorBurn(u_colorBurn, texture.rgb), u_colorBurnAlpha);
    vec3 colorDodge=mix(texture.rgb, colorDodge(u_colorDodge, texture.rgb), u_colorDodgeAlpha);
    texture.rgb=mix(colorBurn, colorDodge, texture.rgb);
    gl_FragColor=texture;
}


