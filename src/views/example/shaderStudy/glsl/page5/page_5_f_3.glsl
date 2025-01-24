varying vec2 v_uv;
void main() {
    vec2 uv = gl_PointCoord;
    uv = (uv - 0.5) * 2.0;
    float d = length(uv);
    float c = 0.05 / d;
    c = pow(c, 2.0);
    gl_FragColor = vec4(vec3(1.0), c);
}
