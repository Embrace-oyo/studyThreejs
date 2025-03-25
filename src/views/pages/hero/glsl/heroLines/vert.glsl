#define GLSLIFY 1
attribute float t;
attribute float totalLength;
attribute float lineId;
varying float v_t;
varying float v_totalLength;
varying float v_thicknessRatio;
varying vec3 v_viewNormal;
varying vec3 v_worldNormal;
varying vec3 v_worldPosition;
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
void main(){
    v_t=t;
    v_totalLength=totalLength;
    float yIndex=floor(position.y+.5);
    v_thicknessRatio=step(mod(yIndex, 4.), 0.5);
    vec3 pos=position+normal*mix(0.04, 0.1, v_thicknessRatio);
    vec3 nor=normalize(normalMatrix*normal);
    v_viewNormal=nor;
    v_worldNormal=inverseTransformDirection(nor, viewMatrix);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    gl_Position.z-=0.1/gl_Position.w;
}

