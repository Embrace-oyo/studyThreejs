varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    vUv = uv;

    vClipSpace = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipSpace;

}
