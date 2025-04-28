#define GLSLIFY 1
uniform sampler2D u_texture;
uniform float u_amount;
uniform float u_saturation;
varying vec2 v_uv;
void main(){
    gl_FragColor=texture2D(u_texture, v_uv)*u_amount;
    gl_FragColor.rgb=mix(vec3(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114))), gl_FragColor.rgb, u_saturation);
}
