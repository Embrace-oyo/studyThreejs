attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSinAll;
varying vec3 vNormal;

mat4 calcTranslateMat4(vec3 v) {
    return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    v.x, v.y, v.z, 1.0
    );
}

void main(void) {
    vNormal = normal; // 变换法线到视图空间
    float sin1 = sin(time + position.x / 16.0);
    float sin2 = sin(time + position.y / 8.0);
    float sin3 = sin(time - length(position.xy + 50.0) / 4.0);
    float sinAll = (sin1 + sin2 * 0.5 + sin3 * 0.2) / 1.7;
    mat4 waveMat = calcTranslateMat4(vec3(0.0, 0.0, sinAll * 1.5));

    // coordinate transformation
    vec4 mPosition = modelMatrix * waveMat * vec4(position, 1.0);

    vPosition = mPosition.xyz;
    vUv = uv;
    vSinAll = sinAll;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}
