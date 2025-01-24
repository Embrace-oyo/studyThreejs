varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

void main() {
    vec2 uv = v_uv;

    vec2 p = v_uv;
    p -= 0.5;

    vec3 col = vec3(1.0);

    float d = length(p);
    float c = smoothstep(0.8, 0.4, d);

    vec3 t = texture(iChannel0, uv).xyz;

    t*=c;

    gl_FragColor = vec4(t, 1.0);
}
