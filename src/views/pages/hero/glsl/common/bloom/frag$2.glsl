#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_saturation;
uniform sampler2D u_blurTexture0;

#if ITERATION > 1
uniform sampler2D u_blurTexture1;

#endif
#if ITERATION > 2
uniform sampler2D u_blurTexture2;

#endif
#if ITERATION > 3
uniform sampler2D u_blurTexture3;

#endif
#if ITERATION > 4
uniform sampler2D u_blurTexture4;

#endif
uniform float u_bloomWeights[ITERATION];

#include "./common.glsl"
vec3 dithering(vec3 color){
    float grid_position=rand(gl_FragCoord.xy);
    vec3 dither_shift_RGB=vec3(0.25/255.0, -0.25/255.0, 0.25/255.0);
    dither_shift_RGB=mix(2.0*dither_shift_RGB, -2.0*dither_shift_RGB, grid_position);
    return color+dither_shift_RGB;
}
void main(){
    vec4 c=texture2D(u_texture, v_uv);
    gl_FragColor=c+(u_bloomWeights[0]*texture2D(u_blurTexture0, v_uv)
    #if ITERATION > 1
    +u_bloomWeights[1]*texture2D(u_blurTexture1, v_uv)
    #endif
    #if ITERATION > 2
    +u_bloomWeights[2]*texture2D(u_blurTexture2, v_uv)
    #endif
    #if ITERATION > 3
    +u_bloomWeights[3]*texture2D(u_blurTexture3, v_uv)
    #endif
    #if ITERATION > 4
    +u_bloomWeights[4]*texture2D(u_blurTexture4, v_uv)
    #endif
    );
    gl_FragColor.rgb=mix(vec3(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114))), gl_FragColor.rgb, u_saturation);
    gl_FragColor.rgb=dithering(gl_FragColor.rgb);
    gl_FragColor.a=1.0;
}
