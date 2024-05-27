precision mediump float;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_worldPosition;
void main() {
    vec3 p = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    v_uv = uv;
    //    v_normal = normal;
    v_normal=(modelMatrix*vec4(normal, 0.)).xyz;
    v_worldPosition = vec3(modelMatrix * vec4(p, 1.0));

}
