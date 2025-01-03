varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
void main() {
    vec2 uv = v_uv;
    /** 居中：将UV的坐标减去 0.5，再整体乘上 2 **/
    uv = (uv - 0.5) * 2.0;
    /** 为了计算UV上点到原点的距离，我们可以用GLSL的内置函数——length函数来实现。 **/
    float d = length(uv);
    gl_FragColor = vec4(vec3(d), 1.0);
}
