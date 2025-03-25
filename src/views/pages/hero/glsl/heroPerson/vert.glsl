#define GLSLIFY 1
attribute vec2 boneIndices;
attribute vec2 boneWeights;
uniform vec3 u_bonePoses[BONE_COUNT];
uniform vec4 u_boneOrients[BONE_COUNT];
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec2 v_uv;
varying float v_depth;
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
vec3 qrotate(vec4 q, vec3 v){
    return v+2.0*cross(q.xyz, cross(q.xyz, v)+q.w*v);
}
void main(){
    vec3 pos=vec3(0.0);
    vec3 nor=vec3(0.0);
    vec3 bonePos;
    vec4 boneOrient;
    bonePos=u_bonePoses[int(boneIndices.x)];
    boneOrient=u_boneOrients[int(boneIndices.x)];
    pos+=(qrotate(boneOrient, position)+bonePos)*boneWeights.x;
    nor+=qrotate(boneOrient, normal)*boneWeights.x;
    bonePos=u_bonePoses[int(boneIndices.y)];
    boneOrient=u_boneOrients[int(boneIndices.y)];
    pos+=(qrotate(boneOrient, position)+bonePos)*boneWeights.y;
    nor+=qrotate(boneOrient, normal)*boneWeights.y;
    vec4 mvPosition=modelViewMatrix*vec4(pos, 1.0);
    gl_Position=projectionMatrix*mvPosition;
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_worldNormal=inverseTransformDirection(nor, viewMatrix);
    v_uv=uv;

    #include "../heroVisualFinal/aboutHeroVisualFinal_vert.glsl"
}
