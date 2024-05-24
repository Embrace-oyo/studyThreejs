varying vec2 v_uv;
varying vec3 v_normal;
uniform float u_time;
void main(){
    vec3 color = v_normal;
    gl_FragColor = vec4(color, 1.0);
}
