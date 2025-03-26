#define GLSLIFY 1
uniform sampler2D u_texture;
uniform float u_luminosityThreshold;
uniform float u_smoothWidth;
uniform float u_amount;

#ifdef USE_HALO
uniform vec2 u_texelSize;
uniform vec2 u_aspect;
uniform float u_haloWidth;
uniform float u_haloRGBShift;
uniform float u_haloStrength;
uniform float u_haloMaskInner;
uniform float u_haloMaskOuter;

#ifdef USE_LENS_DIRT
uniform sampler2D u_dirtTexture;
uniform vec2 u_dirtAspect;

#endif
#endif
#ifdef USE_CONVOLUTION
uniform float u_convolutionBuffer;

#endif
varying vec2 v_uv;
void main(){
    vec2 uv=v_uv;

    #ifdef USE_CONVOLUTION
    uv=(uv-0.5)*(1.0+u_convolutionBuffer)+0.5;

    #endif
    vec4 texel=texture2D(u_texture, uv);
    vec3 luma=vec3(0.299, 0.587, 0.114);
    float v=dot(texel.xyz, luma);
    float alpha=texel.a*u_amount;
    gl_FragColor=vec4(texel.rgb*alpha, 1.0);

    #ifdef USE_HALO
    vec2 toCenter=(uv-0.5)*u_aspect;
    vec2 ghostUv=1.0-(toCenter+0.5);
    vec2 ghostVec=(vec2(0.5)-ghostUv);
    vec2 direction=normalize(ghostVec);
    vec2 haloVec=direction*u_haloWidth;
    float weight=length(vec2(0.5)-fract(ghostUv+haloVec));
    weight=pow(1.0-weight, 3.0);
    vec3 distortion=vec3(-u_texelSize.x, 0.0, u_texelSize.x)*u_haloRGBShift;
    float zoomBlurRatio=fract(atan(toCenter.y, toCenter.x)*40.0)*0.05+0.95;
    ghostUv*=zoomBlurRatio;
    vec2 haloUv=ghostUv+haloVec;
    vec3 halo=vec3(texture2D(u_texture, haloUv+direction*distortion.r).r, texture2D(u_texture, haloUv+direction*distortion.g).g, texture2D(u_texture, haloUv+direction*distortion.b).b)*u_haloStrength*smoothstep(u_haloMaskInner, u_haloMaskOuter, length(toCenter));

    #ifdef USE_LENS_DIRT
    vec2 dirtUv=(uv-0.5)*u_dirtAspect+0.5;
    vec3 dirt=texture2D(u_dirtTexture, dirtUv).rgb;
    gl_FragColor.rgb+=(halo+alpha+0.05*dirt)*dirt;

    #else
    gl_FragColor.rgb+=halo;

    #endif
    #endif
    #ifdef USE_CONVOLUTION
    gl_FragColor.rgb*=max(abs(uv.x-0.5), abs(uv.y-0.5))>0.5 ? 0. : 1.;

    #endif
}
