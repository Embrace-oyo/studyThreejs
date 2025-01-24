varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
const float PI=3.14159265359;
/** 长方形SDF **/
float sdBox(in vec2 p, in vec2 b){
    vec2 d=abs(p)-b;
    return length(max(d, 0.))+min(max(d.x, d.y), 0.);
}
mat2 rotation2d(float angle){
    float s=sin(angle);
    float c=cos(angle);

    return mat2(c, -s, s, c);
}

vec2 rotate(vec2 v, float angle){
    return rotation2d(angle)*v;
}
vec2 rot(vec2 uv, float a){
    return vec2(uv.x*cos(a)-uv.y*sin(a), uv.y*cos(a)+uv.x*sin(a));
}
void main() {
    vec2 uv = v_uv;
    /** 居中：将UV的坐标减去 0.5，再整体乘上 2 **/
    uv = (uv - 0.5) * 2.0;
    /** 我们需要计算画布的比例，将画布长除以画布宽就能算出，再将UV的x坐标与比例相乘即可。 **/
    uv.x *= iResolution.x / iResolution.y;
    /** 圆周运动 **/
    uv += vec2(cos(iTime), sin(iTime))*0.35;
    /** 自旋转 **/
    uv = rot(uv, iTime);
    /**
    比如我想要画一个长方形，
    那么我只需找到长方形的SDF函数（sdBox），
    调用它获取距离，
    再用step或smoothstep函数勾画出图形即可。
    **/
    float d = sdBox(uv, vec2(0.5, 0.5));
    /**
    我们可以将它的边界值定为edge1和edge2：
    如果目标值x小于边界值edge1，
    则返回 0；如果目标值x大于边界值edge2，
    则返回 1；如果目标值x在 2 个边界值之间，
    则返回从 0 到 1 平滑过渡的值
    **/
    float c = smoothstep(0.0, 0.002, d);
    gl_FragColor = vec4(vec3(c), 1.0);
}
