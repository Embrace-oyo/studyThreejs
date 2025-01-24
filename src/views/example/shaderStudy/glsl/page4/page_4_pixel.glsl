varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel3;


void main() {
    vec2 uv = v_uv;
    vec2 size = vec2(100.0);
    uv = floor(uv * size) / size;
    vec3 t = texture(iChannel3, uv).xyz;
    gl_FragColor = vec4(t, 1.0);
}
