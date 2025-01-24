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
    //    uv = fract(uv * 16.0);
    /** 居中：将UV的坐标减去 0.5，再整体乘上 2 **/
    //    uv = (uv - 0.5) * 2.0;
    /** 我们需要计算画布的比例，将画布长除以画布宽就能算出，再将UV的x坐标与比例相乘即可。 **/
    //    uv.x *= iResolution.x / iResolution.y;
    uv.y += sin(uv.x * 6.0) * 0.4;
    uv = fract(uv * 16.0);
    vec3 c = vec3(step(0.5, uv.y));
    gl_FragColor = vec4(c, 1.0);
}
