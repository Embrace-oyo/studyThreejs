varying vec2 v_uv;
void main() {
    vec2 uv = v_uv;
    gl_FragColor = vec4(uv, 1.0, 1.0);
}
