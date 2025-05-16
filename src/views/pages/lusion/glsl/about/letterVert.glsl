#define GLSLIFY 1
//#include <ufxVert>
#include "../common/ufxVert.glsl"
uniform float u_letterIdx;
varying vec2 v_pixel;
void main(){
    vec3 basePos=getBasePosition(position);
    vec3 screenPos=getScreenPosition(basePos);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(screenPos,1.0);
    v_pixel=vec2(u_letterIdx*5.+1.,1.)+vec2(uv.x,1.-uv.y)*vec2(3.,4.);
}
