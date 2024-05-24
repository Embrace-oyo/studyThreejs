varying vec2 vUv;
uniform float uTime;
varying vec3 vColor;
void main() {
    float d = length(gl_PointCoord - 0.5);
    float c = smoothstep(0.5, 0.001, d);
    gl_FragColor = vec4(vColor * c, 1.0);
}
