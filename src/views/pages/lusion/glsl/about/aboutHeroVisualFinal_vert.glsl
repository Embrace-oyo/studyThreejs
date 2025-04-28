#define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
