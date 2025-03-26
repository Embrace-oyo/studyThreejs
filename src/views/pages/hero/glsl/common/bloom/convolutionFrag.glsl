#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform sampler2D u_bloomTexture;
uniform float u_convolutionBuffer;

#include "./common.glsl"
vec3 dithering(vec3 color){
    float grid_position=rand(gl_FragCoord.xy);
    vec3 dither_shift_RGB=vec3(0.25/255.0, -0.25/255.0, 0.25/255.0);
    dither_shift_RGB=mix(2.0*dither_shift_RGB, -2.0*dither_shift_RGB, grid_position);
    return color+dither_shift_RGB;
}
void main(){
    vec4 c=texture2D(u_texture, v_uv);
    vec2 bloomUv=(v_uv-0.5)/(1.0+u_convolutionBuffer)+0.5;
    gl_FragColor=c+texture2D(u_bloomTexture, bloomUv);
    gl_FragColor.rgb=dithering(gl_FragColor.rgb);
    gl_FragColor.a=1.0;
}


