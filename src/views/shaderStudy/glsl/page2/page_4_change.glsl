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
/** 圆形SDF **/
float sdCircle(vec2 p, float r){
    return length(p)-r;
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
    /**
    尝试创建 2 个SDF图形（沿用之前的圆形和长方形），
    将它们的形状用mix函数混合起来，
    混合程度就用随着时间变化的iTime变量，
    外面包了 2 层函数：sin函数负责周期性的变化，
    abs函数负责确保混合程度的值是正的。
    **/
    float box = sdBox(uv, vec2(0.8, 0.5));
    float circle = sdCircle(uv, 0.5);
    float d = mix(box, circle, abs(sin(iTime)));
    float c = smoothstep(0.0, 0.002, d);
    gl_FragColor = vec4(vec3(c), 1.0);
}
