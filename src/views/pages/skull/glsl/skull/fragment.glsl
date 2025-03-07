//#extension GL_OES_standard_derivatives : enable
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;

uniform float time;
uniform float renderOutline;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;


vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    // Flat Shading
    vec3 light = normalize(vec3(-1.0, 1.0, 0.2));
    vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    float diff = dot(normal, light);

    float noiseR = texture2D(
    noiseTex,
    normal.yz * 0.2 + vec2(time * 0.02, 0.0)
    ).r * 2.0 - 1.0;
    float noiseG = texture2D(
    noiseTex,
    normal.zx * 0.2 + vec2(0.0, time * 0.02)
    ).g * 2.0 - 1.0;
    float noiseB = texture2D(
    noiseTex,
    normal.xy * 0.2 - time * 0.02
    ).b * 2.0 - 1.0;
    float noise = length(vec3(noiseR, noiseG, noiseB));

    vec3 hsvNoise = vec3(noise * 0.1, noise * 0.1, -noise * 0.1);
    vec3 hsv1 = vec3(0.55, 0.55, 0.8) + hsvNoise;
    vec3 hsv2 = vec3(0.88, 0.55, 1.0) + hsvNoise;
    vec3 rgb = mix(convertHsvToRgb(hsv1), convertHsvToRgb(hsv2), diff);

    vec3 hsv3 = vec3(0.55, 0.05, 0.95);
    vec3 color = (rgb * (1.0 - vColor) + convertHsvToRgb(hsv3) * vColor) * (1.0 - renderOutline);
    vec3 colorOutline = vec3(1.0) * renderOutline;

    gl_FragColor = vec4(color + colorOutline, 1.0);
}
