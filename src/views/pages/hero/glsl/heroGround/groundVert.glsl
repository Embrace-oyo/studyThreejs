#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
void main(){
    vec3 pos=position;
    vec4 mvPosition=modelViewMatrix*vec4(position, 1.);
    gl_Position=projectionMatrix*mvPosition;
    v_worldPosition=(modelMatrix*vec4(position, 1.)).xyz;
    v_viewNormal=normalMatrix*normal;
    v_viewPosition=-mvPosition.xyz;
    v_uv=uv;
    v_localPosition=position;

    #include "../heroVisualFinal/aboutHeroVisualFinal_vert.glsl"
}
