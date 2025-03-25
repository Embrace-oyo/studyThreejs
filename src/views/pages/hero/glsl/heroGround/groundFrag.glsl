#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
uniform sampler2D u_texture;
uniform sampler2D u_groundShadowTexture;
uniform vec3 u_color;
uniform vec3 u_bgColor;
uniform vec3 u_lightPosition;
uniform float u_fogA;
uniform float u_fogB;
uniform float u_sceneRatio;
uniform float u_hudRatio;
uniform float u_noiseStableFactor;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define saturate(a) clamp(a, 0.0, 1.0)
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
vec3 applyFog(in vec3 rgb, in float distance, in vec3 rayOri, in vec3 rayDir){
    float a=u_fogA;
    float b=u_fogB;
    float fogAmount=(a/b)*exp(-rayOri.y*b)*(1.0-exp(-distance*rayDir.y*b))/rayDir.y;
    return mix(rgb, u_bgColor, fogAmount);
}
vec2 dHdxy_fwd(){
    vec2 dSTdx=dFdx(v_uv);
    vec2 dSTdy=dFdy(v_uv);
    float scale=0.1;
    float Hll=scale*texture2D(u_texture, v_uv).b;
    float dBx=scale*texture2D(u_texture, v_uv+dSTdx).b-Hll;
    float dBy=scale*texture2D(u_texture, v_uv+dSTdy).b-Hll;
    return vec2(dBx, dBy);
}
vec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection){
    vec3 vSigmaX=dFdx(surf_pos.xyz);
    vec3 vSigmaY=dFdy(surf_pos.xyz);
    vec3 vN=surf_norm;
    vec3 R1=cross(vSigmaY, vN);
    vec3 R2=cross(vN, vSigmaX);
    float fDet=dot(vSigmaX, R1)*faceDirection;
    vec3 vGrad=sign(fDet)*(dHdxy.x*R1+dHdxy.y*R2);
    return normalize(abs(fDet)*surf_norm-vGrad);
}

#include "../heroScatter/getScatter.glsl"
#include "../common/getBlueNoise.glsl"
void main(){
    vec3 blueNoise=getBlueNoise(gl_FragCoord.xy+vec2(48., 31.));
    vec3 mixedTexture=texture2D(u_texture, v_uv).rgb;
    float shadow=mixedTexture.r;
    float light=clamp(mixedTexture.g, 0.1, 1.0);
    float faceDirection=gl_FrontFacing ? 1.0 :-1.0;
    vec3 normal=normalize(v_viewNormal)*faceDirection;
    normal=perturbNormalArb(-v_viewPosition, normal, dHdxy_fwd(), faceDirection);
    vec3 N=inverseTransformDirection(normal, viewMatrix);
    vec3 L=normalize(u_lightPosition-v_worldPosition);
    vec3 V=normalize(cameraPosition-v_worldPosition);
    vec3 reflection=normalize(reflect(-V, N));
    float NdL=clamp(dot(N, L), 0.001, 1.0);
    float NdV=clamp(abs(dot(N, V)), 0.001, 1.0);
    vec3 lightToWorld=v_worldPosition-u_lightPosition;
    float distToLight=length(lightToWorld);
    float attenutation=1.0/(0.05+(0.025-0.005*u_noiseStableFactor)*distToLight*distToLight);
    float dist=1.0-pow(2.0*length(v_uv-0.5), 2.0);
    float rockShadows=texture2D(u_groundShadowTexture, (vec2(v_localPosition.x, -v_localPosition.z)+(blueNoise.xy-.5)*0.1)*0.0425+0.5).r;
    float spec=dot(reflect(V, N), L)*linearStep(0.9, 0.0, N.y)*4.;
    gl_FragColor.rgb=vec3(light+attenutation*spec);
    gl_FragColor.rgb*=shadow*(0.5+rockShadows*0.5)*(1.+spec);
    gl_FragColor.rgb=applyFog(gl_FragColor.rgb, length(cameraPosition-v_worldPosition), cameraPosition, -V);
    gl_FragColor.rgb+=getScatter(cameraPosition, v_worldPosition);

    #include "../heroVisualFinal/aboutHeroVisualFinal_frag.glsl"
    gl_FragColor.r=mix(gl_FragColor.r, shadow*(1.-abs(N.y)), u_hudRatio);
    gl_FragColor.r*=u_sceneRatio;
    gl_FragColor.g-=blueNoise.z*0.004;
    gl_FragColor.b=linearStep(15., 66., v_worldPosition.z);
    gl_FragColor.a=spec*shadow;
}
