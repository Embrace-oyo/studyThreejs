#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform sampler2D u_motionTexture;
uniform float u_blurRatio;

#include "../common/getBlueNoise.glsl"

void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy+vec2(41., 25.));
    vec4 motion=texture2D(u_motionTexture, v_uv);
    motion.xy-=0.5;
    motion.xy*=(motion.z-.5)/16.*u_blurRatio*0.25;
    vec4 c=vec4(0.);
    vec2 offset=motion.xy*noise.xy;
    for (int i=0;i<16;i++){
        offset+=motion.xy;
        c+=texture2D(u_texture, v_uv+offset);
    }c/=16.;
    gl_FragColor=vec4(c.rrr, c.a);
    vec4 color=texture2D(u_texture, v_uv).rrra;
    gl_FragColor=max(color, gl_FragColor);
}
