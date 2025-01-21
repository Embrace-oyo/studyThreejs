varying vec2 v_uv;
varying float v_height;
void main() {
//    vec2 uv = v_uv;
//    gl_FragColor = vec4(uv, 1.0, 1.0);

    vec3 color = vec3(0.0, 0.7, 0.3); // 草地
    if (v_height > 4.0) {
        color = vec3(0.8, 0.8, 0.8); // 雪山
    } else if (v_height > 1.0) {
        color = vec3(0.5, 0.3, 0.1); // 岩石
    }
    gl_FragColor = vec4(color, 1.0);
}
