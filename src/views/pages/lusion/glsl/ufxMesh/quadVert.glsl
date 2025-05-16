#define GLSLIFY 1
#include "./ufxVert.glsl"
varying vec2 v_uv;
void main(){
    vec3 basePos=getBasePosition(position);
    vec3 screenPos=getScreenPosition(basePos);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(screenPos,1.0);
    v_uv=padUv(uv);
}
