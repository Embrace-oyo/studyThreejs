#define GLSLIFY 1
varying float v_dist;
void main(){
    float alpha=smoothstep(0., 0.+fwidth(v_dist), v_dist);
    gl_FragColor=vec4(1., 1., 1., alpha);
}
