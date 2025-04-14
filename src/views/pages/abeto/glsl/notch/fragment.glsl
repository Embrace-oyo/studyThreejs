layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;
uniform sampler2D tMap;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

void main() {
    // distort uvs slightly with noise
    vec2 uv = vUv;
    vec2 noiseUv = vUv * 0.5;
    float steppedTime = floor(time * 3.0) * 3.14159 * 0.2;
    noiseUv = rotateAngle(steppedTime) * noiseUv;
    float n0 = texture2D(tNoise, noiseUv).r;
    uv += n0 * 0.006;

    // scale
    uv -= 0.5;
    uv *= 1.2;
    uv += 0.5;

    // sample text
    float text = texture2D(tMap, uv).r;

    // remove edges so they don't overlap border
    // if (text < 0.6) discard;

    text = aastep(0.7, text);
    vec3 color = mix(uColor1, uColor2, text);

    gl_FragColor = vec4(color, 0.87946);
    gInfo = vec4(1.0, vec3(0.0, 0.0, 1.0));
}
