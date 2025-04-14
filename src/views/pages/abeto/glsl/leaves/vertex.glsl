uniform Global{ vec2 resolution;float time;float dtRatio; };

uniform float uCount;

attribute vec4 rand;
attribute vec2 texuv;
uniform sampler2D tTexture1;
uniform sampler2D tTexture2;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec3 vNormal;
varying vec4 vRandom;
varying float vProgress;
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
    vRandom = rand;

    vec3 pos = position;
    pos *= mix(1.2, 1.6, step(rand.x, 0.5));

    // rotation value from fluid sim
    float interactionRotation = texture2D(tTexture2, texuv).a * 5.0;

    // curl upwards
    mat2 rot = rotateAngle(0.25 * sin(uv.y * 3.5 + time + rand.z * 12.0 + rand.y + rand.x + interactionRotation * 3.0) + 0.2 * (1.0 - pow(1.0 - position.z, 2.0)));
    pos.yz = rot * pos.yz;

    // random rotation angle
    mat2 rot0 = rotateAngle(time * mix(0.25, 0.75, rand.z) + rand.z * 3.14 * 2.0);
    mat2 rot1 = rotateAngle((rand.y + rand.z + rand.x) * 3.14 * 2.0 + interactionRotation);
    mat2 rot2 = rotateAngle(rand.x * 3.14 * 2.0);
    pos.xy = rot0 * pos.xy;
    pos.zx = rot1 * pos.zx;
    pos.yz = rot2 * pos.yz;

    vec3 norm = normal;
    norm.xy = rot0 * norm.xy;
    norm.zx = rot1 * norm.zx;
    norm.yz = rot2 * norm.yz;
    vNormal = normalize(normalMatrix * norm);

    vec3 offset = texture2D(tTexture1, texuv).xyz;

    pos += offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vHighPrecisionZW = gl_Position.zw;
}
