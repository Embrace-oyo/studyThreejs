#define GLSLIFY 1
varying float v_distToLight;
void main(){
    gl_FragColor=vec4(v_distToLight);
}
