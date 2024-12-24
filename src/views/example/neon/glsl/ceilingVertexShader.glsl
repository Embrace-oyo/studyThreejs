varying vec4 vClipSpace;

void main() {

    vClipSpace = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipSpace;

}
