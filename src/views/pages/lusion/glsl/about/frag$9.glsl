#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec3 u_lightPosition;
uniform vec3 u_lightMixer;
uniform float u_sceneRatio;
uniform float u_hudRatio;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec2 v_uv;
varying float v_depth;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
#include "./getScatter.glsl"
void main(){
    vec3 worldNormal=normalize(v_worldNormal);
    vec3 worldToLight=u_lightPosition-v_worldPosition;
    float worldToLightDist=length(worldToLight);
    worldToLight/=worldToLightDist;
    vec3 cameraToWorld=normalize(v_worldPosition-cameraPosition);
    vec4 map=texture2D(u_texture, v_uv);
    float light=dot(u_lightMixer, map.rgb);
    light=pow(light, 1.25);
    float baseShade=map.a;
    vec3 color=vec3(baseShade*light);
    gl_FragColor=vec4(color, 0.);
    gl_FragColor.rgb+=getScatter(cameraPosition, v_worldPosition);

    #include "./aboutHeroVisualFinal_frag.glsl"
    gl_FragColor.r*=u_sceneRatio*(1.-u_hudRatio);
}
