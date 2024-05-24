varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
const float PI=3.14159265359;

void main() {
    vec2 uv = v_uv;
    /** 我们需要计算画布的比例，将画布长除以画布宽就能算出，再将UV的x坐标与比例相乘即可。 **/
    uv.x *= iResolution.x / iResolution.y;
    uv = fract(uv * 5.0);
    /** 用布尔运算里的“并”操作，将这 2 种图形合并。 **/
    vec3 c = vec3(min(step(0.15, uv.x), step(0.15, uv.y)));
    gl_FragColor = vec4(c, 1.0);
}
