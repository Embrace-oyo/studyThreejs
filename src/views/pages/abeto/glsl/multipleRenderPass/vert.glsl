uniform Global{vec2 resolution;float time;float dtRatio;};

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}
