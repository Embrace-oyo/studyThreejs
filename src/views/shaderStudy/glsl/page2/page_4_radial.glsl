varying vec2 v_uv;
uniform vec3 iResolution;
uniform float iTime;

vec2 cart2polar(vec2 uv){
    /** 极坐标系的坐标由 2 个维度组成：极角φ和半径r **/
    /** 第一个维度极角φ，用atan函数计算直角坐标的反正切值即可算出。 **/
    float phi=atan(uv.y, uv.x);
    /** 第二个维度半径r，用length函数计算直角坐标到原点的距离即可算出。 **/
    float r=length(uv);
    return vec2(phi, r);
}

void main() {
    vec2 uv = v_uv;
    uv = (uv - 0.5) * 2.0;
    uv.x*= iResolution.x / iResolution.y;
    uv = cart2polar(uv);
    float c = cos(uv.x * 8.0);
    gl_FragColor = vec4(vec3(c), 1.0);
}
