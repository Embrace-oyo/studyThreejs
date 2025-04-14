layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uThickness;

varying vec2 vUv;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

void main() {
    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    screenUv.x *= aspect;

    vec2 uv = screenUv;
    vec2 noiseUv = screenUv;

    float steppedTime = floor(time * 3.0) * 3.14159 * 0.2;
    noiseUv = rotateAngle(steppedTime) * noiseUv;

    // distort border slightly with noise
    float n0 = texture2D(tNoise, noiseUv).r;
    float gradient = smoothstep(0.0, 0.2, vUv.x + n0 * 0.1);
    if (gradient < 0.5) {
        discard;
    }

    vec3 color = uColor1;
    gl_FragColor = vec4(color, 0.87946);

    gInfo = vec4(1.0, vec3(0.0, 0.0, 1.0));
}
