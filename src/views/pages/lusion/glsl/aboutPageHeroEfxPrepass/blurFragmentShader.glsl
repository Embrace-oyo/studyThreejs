#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_aspect;
uniform float u_blurRatio;

//#include <getBlueNoise>
#include "../common/getBlueNoise.glsl"
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy);
    vec4 tex=texture2D(u_texture, v_uv);
    vec2 ra=vec2(0.);
    float fi=0.;
    float theta=noise.x*6.283185307179586;
    vec2 strength=vec2(1., 1.*u_aspect)*.006*tex.b*u_blurRatio;
    for (int i=0;i<8;i++){
        theta+=10.166407384630519;
        ra+=texture2D(u_texture, v_uv+vec2(cos(theta), sin(theta))*sqrt((fi+.5)/8.)*strength).ra;
        fi+=1.;
    }
    ra/=8.;
    gl_FragColor=ra.xxxy;
}
