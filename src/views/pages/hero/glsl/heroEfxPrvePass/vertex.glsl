precision highp float;

precision highp int;

#define IS_WEBGL2 true
precision mediump sampler2DArray;

#define attribute in
#define varying out
#define texture2D texture
#define GLSLIFY 1
attribute vec2 position;
varying vec2 v_uv;
void main(){
    v_uv=position*0.5+0.5;
    gl_Position=vec4(position, 0.0, 1.0);
}


