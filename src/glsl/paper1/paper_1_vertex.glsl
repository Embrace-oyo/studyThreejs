uniform mat3 u_matrix;
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
void main() {
    gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);
    v_color = a_color;
}
