layout(location = 1) out highp vec4 gInfo;

uniform Global{vec2 resolution;float time;float dtRatio;};
uniform vec3 uColor;
uniform sampler2D tNoise;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;

void main() {
    vec3 color = uColor;

    float steppedTime = floor(time * 2.0);
    vec2 screenUV = gl_FragCoord.xy / resolution.xy;
    float noise = texture2D(tNoise, screenUV * 2.0 + steppedTime * 0.02).r * (1.0 - vUv.x);
    if (noise < 0.125) discard;

    gl_FragColor = vec4(color, 0.87946);
    gInfo = vec4(1.0, vec2(0.0), 0.0);
}
