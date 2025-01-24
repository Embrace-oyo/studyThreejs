varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
void main() {
    vec2 uv = v_uv;
    vec3 color = vec3(0.110, 0.112, 0.521);
    vec3 tex = texture(iChannel0, uv).xyz;
    tex *= color * 3.0;
    gl_FragColor = vec4(tex, 1.0);
}
