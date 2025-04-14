uniform Global{
    vec2 resolution;
    float time;
    float dtRatio;
};

uniform float uCount;
uniform sampler2D tNoise;
uniform float uFlowerTime;

attribute float random;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying float vRandom;
varying float vProgress;
varying vec3 vNormal;
flat varying float vIndex;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

const float PI = 3.14159;
const float HALF_PI = PI * 0.5;
const float TWO_PI = PI * 2.0;

void main() {
    float index = float(gl_InstanceID);
    vIndex = index;

    vUv = uv;
    vRandom = random;
    vNormal = normalize(normalMatrix * normal);

    float idx = index / uCount;

    vec3 pos = position;
    float t = uFlowerTime * 0.075;

    // progress value from zero to one
    float progress01 = fract(idx + t + 0.5);
    vProgress = progress01;

    // waviness
    pos.x += cos(vUv.y * 8.0 - progress01 * 24.0 + random) * 0.02;

    // offset from exact center
    pos.z += 0.15;

    // scale petal width
    pos.x *= 1.2;

    // scale petal over progress
    float scale = 1.0;
    scale *= abs(progress01 - 0.5) * 2.0;
    scale = 1.0 - pow(scale, 3.0);
    pos *= scale;

    // curl around length axis
    mat2 rot0 = rotateAngle(-(vUv.x - 0.5) * (1.0 - progress01) * 1.5);
    pos.xy = rot0 * pos.xy;

    // unfold
    mat2 rot1 = rotateAngle(progress01 * PI - HALF_PI - vUv.y * 2.0 + 1.7 + sin(progress01 * 16.0 - vUv.y * 3.0 + 0.5) * 0.35 * pow(1.0 - progress01, 2.0));
    pos.yz = rot1 * pos.yz;

    // position in formation
    mat2 rot2 = rotateAngle(index * 4.854 + random * 0.05);
    pos.xz = rot2 * pos.xz;

    // offset in space to reduce intersections
    pos.y -= pow(progress01, 2.0) * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vHighPrecisionZW = gl_Position.zw;
}
