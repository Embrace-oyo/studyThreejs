varying vec3 v_color;
void main() {
    // 圆形
    /*float strength = distance(gl_PointCoord, vec2(0.5));
    strength = step(0.5, strength);
    strength = 1.0 - strength;*/
    // 散射点图形
    /* float strength = distance(gl_PointCoord, vec2(0.5));
     strength *= 2.0;
     strength = 1.0 - strength;*/
    // 光点
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength = 1.0 - strength;
    strength = pow(strength, 10.0);

    // 处理颜色
    vec3 color = mix(vec3(0.0), v_color, strength);
    gl_FragColor = vec4(color, 1.0);
}
