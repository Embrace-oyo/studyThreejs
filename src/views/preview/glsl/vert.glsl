varying vec2 vUv;
void main() {
    vec3 pos = position;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
}
