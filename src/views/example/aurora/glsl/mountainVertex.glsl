uniform vec3 mvPosition;

varying vec2 vUv;
varying float fogDepth;

void main() {
    fogDepth = -mvPosition.z;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
