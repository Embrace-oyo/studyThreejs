#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec2 u_outResolution;
uniform float u_sharpness;

#define FSR_RCAS_LIMIT (0.25-(1.0/16.0))
vec4 FsrRcasLoadF(vec2 p);
void FsrRcasCon(out float con, float sharpness){
    con=exp2(-sharpness);
}
vec3 FsrRcasF(vec2 ip, float con){
    vec2 sp=vec2(ip);
    vec3 b=FsrRcasLoadF(sp+vec2(0, -1)).rgb;
    vec3 d=FsrRcasLoadF(sp+vec2(-1, 0)).rgb;
    vec3 e=FsrRcasLoadF(sp).rgb;
    vec3 f=FsrRcasLoadF(sp+vec2(1, 0)).rgb;
    vec3 h=FsrRcasLoadF(sp+vec2(0, 1)).rgb;
    float bL=b.g+.5*(b.b+b.r);
    float dL=d.g+.5*(d.b+d.r);
    float eL=e.g+.5*(e.b+e.r);
    float fL=f.g+.5*(f.b+f.r);
    float hL=h.g+.5*(h.b+h.r);
    float nz=.25*(bL+dL+fL+hL)-eL;
    nz=clamp(abs(nz)/(max(max(bL, dL), max(eL, max(fL, hL)))-min(min(bL, dL), min(eL, min(fL, hL)))), 0., 1.);
    nz=1.-.5*nz;
    vec3 mn4=min(b, min(f, h));
    vec3 mx4=max(b, max(f, h));
    vec2 peakC=vec2(1., -4.);
    vec3 hitMin=mn4/(4.*mx4);
    vec3 hitMax=(peakC.x-mx4)/(4.*mn4+peakC.y);
    vec3 lobeRGB=max(-hitMin, hitMax);
    float lobe=max(-FSR_RCAS_LIMIT, min(max(lobeRGB.r, max(lobeRGB.g, lobeRGB.b)), 0.))*con;

    #ifdef FSR_RCAS_DENOISE
    lobe*=nz;

    #endif
    return (lobe*(b+d+h+f)+e)/(4.*lobe+1.);
}
vec4 FsrRcasLoadF(vec2 p){
    return texture2D(u_texture, p/u_outResolution.xy);
}
void main(){
    vec2 uv=gl_FragCoord.xy/u_outResolution.xy;
    float con;
    FsrRcasCon(con, u_sharpness);
    vec3 col=FsrRcasF(gl_FragCoord.xy, con);
    gl_FragColor=vec4(col, 1.);
}
