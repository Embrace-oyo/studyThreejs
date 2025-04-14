layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;
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
    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    screenUv.x *= aspect;

    // animated grunge
    float steppedTime = floor(time * 3.0) * 3.14159 * 1.53;
    screenUv = rotateAngle(steppedTime) * screenUv;
    float n1 = texture2D(tNoise, screenUv * 4.31).r;
    float n2 = texture2D(tNoise, -screenUv * 1.814).r;
    float n3 = texture2D(tNoise, screenUv * 5.714).r;
    float noise = n1 * n2 * n3;
    noise = aastep(0.00015, noise);
    vec3 color = mix(uColor2, uColor1, noise);

    // color = uColor1;

    gl_FragColor = vec4(color, 0.0);
    gInfo = vec4(0.0);
}
