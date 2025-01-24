varying vec2 v_uv;
uniform vec3 iResolution;
uniform float iTime;
void main() {
    vec2 uv = v_uv;
    uv = (uv - 0.5) * 2.0;
    uv.x*= iResolution.x / iResolution.y;
    float d = length(uv) - 0.5;
    d = sin(d * 40.0);
    d = smoothstep(0.0, 0.02, d);
    gl_FragColor = vec4(vec3(d), 1.0);
}
