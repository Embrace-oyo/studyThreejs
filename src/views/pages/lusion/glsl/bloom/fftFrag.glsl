#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec2 u_texelSize;
uniform float u_subtransformSize;
uniform float u_normalization;
uniform bool u_isForward;
const float TWOPI=6.283185307179586;
void main(){
    #ifdef HORIZTONAL
    float index=gl_FragCoord.x-.5;

    #else
    float index=gl_FragCoord.y-.5;

    #endif
    float evenIndex=floor(index/u_subtransformSize)*(u_subtransformSize*0.5)+mod(index, u_subtransformSize*0.5);

    #ifdef HORIZTONAL
    vec2 evenPos=vec2(evenIndex, gl_FragCoord.y)*u_texelSize;
    vec2 oddPos=evenPos+vec2(.5, 0.);

    #else
    vec2 evenPos=vec2(gl_FragCoord.x, evenIndex)*u_texelSize;
    vec2 oddPos=evenPos+vec2(0., .5);

    #endif
    vec4 even=texture2D(u_texture, evenPos);
    vec4 odd=texture2D(u_texture, oddPos);
    float twiddleArgument=(u_isForward ? TWOPI :-TWOPI)*(index/u_subtransformSize);
    vec2 twiddle=vec2(cos(twiddleArgument), sin(twiddleArgument));
    gl_FragColor=(even+vec4(twiddle.x*odd.xy-twiddle.y*odd.zw, twiddle.y*odd.xy+twiddle.x*odd.zw))*u_normalization;
}
