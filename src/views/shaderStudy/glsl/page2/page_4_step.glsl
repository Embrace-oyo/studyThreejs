varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
void main() {
    vec2 uv = v_uv;
    /** 居中：将UV的坐标减去 0.5，再整体乘上 2 **/
    uv = (uv - 0.5) * 2.0;
    /** 我们需要计算画布的比例，将画布长除以画布宽就能算出，再将UV的x坐标与比例相乘即可。 **/
    uv.x *= iResolution.x / iResolution.y;
    /** 为了计算UV上点到原点的距离，我们可以用GLSL的内置函数——length函数来实现。 **/
    float d = length(uv);
    /**
    它接受 2 个参数：
    边界值edge和目标值x，
    如果目标值x大于边界值edge，
    则返回 1，反之返回 0。
    **/
    float c = step(0.5, d);
    gl_FragColor = vec4(vec3(c), 1.0);
}
