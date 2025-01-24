varying vec2 v_uv;
uniform float pixelRatio;
uniform float iTime;
void main() {
    vec3 p = position;
    gl_Position= projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 50.0 * pixelRatio;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize *= (1.0/-mvPosition.z);
    v_uv = uv;
}
