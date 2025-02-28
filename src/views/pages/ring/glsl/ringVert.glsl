precision highp float;
varying vec2 vUv;
varying vec3 vPos;
void main(){
    // 基本的顶点位置变换
    gl_Position = projectionMatrix *  modelViewMatrix * vec4(position, 1.0);
    vUv = uv;
    vPos = position;
}
