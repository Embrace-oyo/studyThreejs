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
    float d = sdBox(uv, vec2(0.8, 0.5));
    float c = smoothstep(0.0, 0.002, d);
    //    vec3 outC = vec3(1.0);
    vec3 outC = mix(vec3(1.0), vec3(0.6, 0.1, 1.0), cos(iTime) + uv.x + uv.y);
    vec3 inC = mix(vec3(0.0, 0.5, 0.5), vec3(1.0, 0.5, 0.5), cos(iTime) - uv.x - uv.y + 0.8);
    vec3 col = mix(inC, outC, c);
    uv.x+=cos(iTime);
    uv.y+=sin(iTime);
    col.xy*=uv;
    gl_FragColor = vec4(col, 1.0);
}
