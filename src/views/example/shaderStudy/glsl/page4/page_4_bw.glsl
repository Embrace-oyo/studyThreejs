varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

void main() {
    vec2 uv = v_uv;
    vec3 t = texture(iChannel0, uv).rgb;
    // 使用加权平均法计算灰度值
    float gray = 0.2989 * t.r + 0.5870 * t.g + 0.1140 * t.b;
    gl_FragColor = vec4(vec3(gray), 1.0);
}
