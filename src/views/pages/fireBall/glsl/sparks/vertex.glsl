attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec3 iDirection;
attribute float iTime;
attribute float iDuration;
attribute float iDistance;
attribute float iScale;
attribute vec3 iRotate;
attribute vec2 iUvDiff;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec2 vUv;
varying vec2 vUvDiff;
varying float vOpacity;
varying float vStep;

mat4 calcRotateMat4X(float radian) {
    return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(radian), -sin(radian), 0.0,
    0.0, sin(radian), cos(radian), 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

mat4 calcRotateMat4Y(float radian) {
    return mat4(
    cos(radian), 0.0, sin(radian), 0.0,
    0.0, 1.0, 0.0, 0.0,
    -sin(radian), 0.0, cos(radian), 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

mat4 calcRotateMat4Z(float radian) {
    return mat4(
    cos(radian), -sin(radian), 0.0, 0.0,
    sin(radian), cos(radian), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

mat4 calcRotateMat4(vec3 radian) {
    return calcRotateMat4X(radian.x) * calcRotateMat4Y(radian.y) * calcRotateMat4Z(radian.z);
}

mat4 calcScaleMat4(vec3 scale) {
    return mat4(
    scale.x, 0.0, 0.0, 0.0,
    0.0, scale.y, 0.0, 0.0,
    0.0, 0.0, scale.z, 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

void main(void) {
    float stp = iTime / iDuration;

    mat4 rotateMat = calcRotateMat4(iRotate * time * 2.0);
    mat4 scaleMat = calcScaleMat4(vec3(iScale));
    vec3 transformed = position + vec3(cos(time * 3.0) * 6.0 * stp, 0.0, sin(time * 3.0) * 6.0 * stp);
    transformed = (rotateMat * scaleMat * vec4(transformed, 1.0)).xyz;
    transformed = transformed + iPosition + iDirection * iDistance * stp;
    vec4 mPosition = modelMatrix * vec4(transformed, 1.0);

    vUv = uv;
    vUvDiff = iUvDiff;
    vOpacity = step(0.0, iTime);
    vStep = stp;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}
