#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec4 u_textureChannelMixer;
uniform vec3 u_lightColor;
uniform vec3 u_lightPosition;
uniform float u_noiseStableFactor;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying float v_depth;
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}

#include "./getScatter.glsl"
void main(){
    float pattern=dot(u_textureChannelMixer, texture2D(u_texture, v_uv));
    vec3 viewNormal=normalize(v_viewNormal);
    vec3 worldNormal=inverseTransformDirection(viewNormal, viewMatrix);
    vec3 worldToLight=u_lightPosition-v_worldPosition;
    float worldToLightDist=length(worldToLight);
    float attenutation=1.0/(0.05+(0.02-0.005*u_noiseStableFactor)*worldToLightDist*worldToLightDist);
    worldToLight/=worldToLightDist;
    vec3 cameraToWorld=normalize(v_worldPosition-cameraPosition);
    float diff=0.25+0.75*dot(worldNormal, worldToLight);
    float spec=0.8*dot(reflect(cameraToWorld, worldNormal), worldToLight);
    vec3 color=vec3(pattern);
    color*=attenutation*(0.05+diff+spec*diff);
    gl_FragColor=vec4(color*0.85+0.15, spec*(0.3+u_noiseStableFactor));
    gl_FragColor.rgb+=getScatter(cameraPosition, v_worldPosition);

    #include "./aboutHeroVisualFinal_frag.glsl"
}
