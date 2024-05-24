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
    在Shader中，值的显示范围只会是[0,1]之间，
    也就是说，小于 0 的负数实际显示的值还是 0（黑色），
    大于 1 的数实际显示的值还是 1（白色）。
    我们可以利用这一点，给距离d减去一个值（这里我取了 0.5），
    制造出一片负数的区域，而这片区域不就是我们所要的黑色吗？
    **/
    d-=0.5;
    /**
    我们可以将它的边界值定为edge1和edge2：
    如果目标值x小于边界值edge1，
    则返回 0；如果目标值x大于边界值edge2，
    则返回 1；如果目标值x在 2 个边界值之间，
    则返回从 0 到 1 平滑过渡的值
    **/
    float c = smoothstep(0.0, 0.22, d);
    gl_FragColor = vec4(vec3(c), 1.0);
}
