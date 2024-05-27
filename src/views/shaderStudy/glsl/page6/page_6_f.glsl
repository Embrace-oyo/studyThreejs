varying vec2 v_uv;
void main() {
    vec2 uv = v_uv;
    float ambIntensity = 0.2;
    vec3 col = vec3(0.0);
    vec3 objectColor = vec3(1.0);
    vec3 lightColor = vec3(0.875, 0.286, 0.333);
    vec3 ambient = lightColor * ambIntensity;
    col += ambient * objectColor;
    gl_FragColor = vec4(col, 1.0);
}
