#define GLSLIFY 1
uniform sampler2D u_bgTexture;
uniform vec2 u_resolution;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main(){
    vec2 bgUv=gl_FragCoord.xy/u_resolution;
    vec4 bgColor=texture2D(u_bgTexture, bgUv);
    float imagePaddingThreshold=max(abs(v_uv.x-.5), abs(v_uv.y-.5));
    float imageAlpha=smoothstep(0.5, 0.5-fwidth(imagePaddingThreshold), imagePaddingThreshold);
    vec4 image=texture2D(u_texture, v_uv);
    image.a*=imageAlpha;
    gl_FragColor.rgb=mix(bgColor.rgb, image.rgb, image.a);
    gl_FragColor.a=image.a;
}

