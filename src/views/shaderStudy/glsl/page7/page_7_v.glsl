precision mediump float;
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_worldPosition;
void main() {
    vec3 p = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    v_uv = uv;

}
