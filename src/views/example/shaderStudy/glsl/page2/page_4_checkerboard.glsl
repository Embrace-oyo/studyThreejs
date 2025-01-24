varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
const float PI=3.14159265359;

void main() {
    vec2 uv = v_uv;
    /** 我们需要计算画布的比例，将画布长除以画布宽就能算出，再将UV的x坐标与比例相乘即可。 **/
    uv.x *= iResolution.x / iResolution.y;
    uv = fract(uv * 2.0);
    float x = smoothstep(0.2, 0.5, step(0.5, uv.x));
    float y = smoothstep(0.2, 0.5, step(0.5, uv.y));
    float c = abs(x - y);
    gl_FragColor = vec4(vec3(c), 1.0);
}
