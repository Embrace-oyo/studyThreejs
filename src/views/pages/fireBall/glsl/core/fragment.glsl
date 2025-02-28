precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;
varying float vEdge;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float noise1 = texture2D(noiseTex, vUv + vec2(time * 0.1, 0.0)).r;
    float noise2 = texture2D(noiseTex, vUv + vec2(time * -0.1, 0.0)).g;
    vec3 hsv = vec3(
    (noise1 + noise2) * 0.35 + time * 0.1,
    1.0 - vEdge,
    0.02 + vEdge * 0.98
    );
    vec3 rgb = convertHsvToRgb(hsv);

    gl_FragColor = vec4(rgb, 1.0);
}
