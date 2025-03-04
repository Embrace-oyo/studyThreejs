precision highp float;

uniform float time;
uniform float hex;

varying vec2 vUv;
varying vec3 vColor;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec3 rgb = mix(
    convertHsvToRgb(vec3(0.5, 0.8, 0.7)),
    convertHsvToRgb(vec3(0.0, 0.2, 0.95)),
    vUv.y * 4.0 - 1.15
    );

    gl_FragColor = vec4(rgb, 1.0);
}
