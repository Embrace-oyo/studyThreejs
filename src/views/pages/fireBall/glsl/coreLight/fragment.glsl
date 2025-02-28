precision highp float;

uniform float time;
uniform sampler2D noiseTex;
varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float noise1 = texture2D(noiseTex, vUv * 0.25 + vec2(time * 0.1, 0.0)).r;
    float noise2 = texture2D(noiseTex, vUv * 0.25 + vec2(time * -0.1, 0.0)).g;
    float noise = (noise1 + noise2) / 2.0;
    vec3 hsv = vec3(
    noise * 0.5 + time * 0.1,
    0.7,
    0.7
    );
    vec3 rgb = convertHsvToRgb(hsv) * (1.0 - smoothstep(0.4, 1.0, length(p))) + (1.0 - smoothstep(0.67, 0.74, length(p)));
    float opacity = 1.0 - smoothstep(0.9, 1.0, length(p));

    if (opacity < 0.01) discard;

    gl_FragColor = vec4(rgb, opacity);
}
