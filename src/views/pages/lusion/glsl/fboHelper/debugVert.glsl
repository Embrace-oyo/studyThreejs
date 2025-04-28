#define GLSLIFY 1
attribute vec3 position;attribute vec2 uv;uniform vec4 u_transform;varying vec2 v_uv;void main(){ v_uv=uv;gl_Position=vec4(position.xy*u_transform.zw+u_transform.xy, 0.0, 1.0); }
