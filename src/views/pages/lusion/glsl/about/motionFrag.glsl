#define GLSLIFY 1
varying vec2 v_delta;
varying float v_headTail;
void main(){
    float ratio=sqrt(abs(v_headTail)*2.);
    float strength=sign(v_headTail)*ratio*-.5;
    gl_FragColor=vec4(v_delta, strength+.5, v_headTail+0.5);
}
