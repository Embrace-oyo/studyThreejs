varying mat4 m_matrix;

void main(void) {
    m_matrix = inverse(modelMatrix);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
