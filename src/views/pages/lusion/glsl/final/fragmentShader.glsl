#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec3 u_bgColor;
uniform float u_opacity;
uniform float u_vignetteFrom;
uniform float u_vignetteTo;
uniform vec2 u_vignetteAspect;
uniform vec3 u_vignetteColor;
uniform float u_saturation;
uniform float u_contrast;
uniform float u_brightness;
uniform vec3 u_tintColor;
uniform float u_tintOpacity;
uniform float u_ditherSeed;
float hash13(vec3 p3){
    p3=fract(p3*.1031);
    p3+=dot(p3, p3.yzx+33.33);
    return fract((p3.x+p3.y)*p3.z);
}
vec3 screen(vec3 cb, vec3 cs){
    return cb+cs-(cb*cs);
}
vec3 colorDodge(vec3 cb, vec3 cs){
    return mix(min(vec3(1.0), cb/(1.0-cs)), vec3(1.0), step(vec3(1.0), cs));
}
void main(){ vec2 uv=v_uv;
    vec3 color=texture2D(u_texture, uv).rgb;
    float luma=dot(color, vec3(0.299, 0.587, 0.114));
    color=mix(vec3(luma), color, 1.0+u_saturation);
    color=0.5+(1.0+u_contrast)*(color-0.5);
    color+=u_brightness;
    color=mix(color, screen(colorDodge(color, u_tintColor), u_tintColor), u_tintOpacity);
    float d=length((uv-0.5)*u_vignetteAspect)*2.0;
    color=mix(color, u_vignetteColor, smoothstep(u_vignetteFrom, u_vignetteTo, d));
    gl_FragColor=vec4(mix(u_bgColor, color, u_opacity)+hash13(vec3(gl_FragCoord.xy, u_ditherSeed))/255.0, 1.0);
}
