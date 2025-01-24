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
    /** 我们取距离d的倒数，并且乘上一个比较小的值。 **/
    float c = 0.25 / d;
    /**
    目前光的辐射范围太大了，要稍微缩小一些。
    我们来认识一个新的内置函数——pow函数，
    它用于计算数字的指数幂，比如pow(4.,3.)，
    返回的值就是 4 的 3 次方——64，也就是说，
    pow这个函数能让数值指数般地增长。（当然，小数也是可以的，比如pow(4.,3.6)。）
     **/
    c = pow(c, 1.6);
    gl_FragColor = vec4(vec3(c), 1.0);
}
