#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float addH;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vSinAll;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    // Flat Shading
    vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
    vec3 normal = vNormal;
    float diff = dot(normal, light);

    vec4 color = vec4(convertHsvToRgb(vec3(0.2 + vSinAll * 0.15 + addH, 0.2, 1.0)), 0.4);

    gl_FragColor = color * vec4(vec3(diff), 1.0);
}
