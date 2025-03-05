varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

uniform float time;
uniform float acceleration;


#include "/node_modules/lygia/generative/snoise.glsl"
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 rotate(vec3 p, float radian_x, float radian_y, float radian_z) {
    mat3 mx = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(radian_x), -sin(radian_x),
    0.0, sin(radian_x), cos(radian_x)
    );
    mat3 my = mat3(
    cos(radian_y), 0.0, sin(radian_y),
    0.0, 1.0, 0.0,
    -sin(radian_y), 0.0, cos(radian_y)
    );
    mat3 mz = mat3(
    cos(radian_z), -sin(radian_z), 0.0,
    sin(radian_z), cos(radian_z), 0.0,
    0.0, 0.0, 1.0
    );
    return mx * my * mz * p;
}
vec3 getRotate(vec3 p) {
    return rotate(p, radians(time / 6.0), radians(time / 7.0), radians(time / 8.0));
}
void main() {
    float updateTime = time / 400.0;
    vec3 p_rotate = getRotate(position);
    float noise = snoise(vec3(p_rotate / 12.1 + updateTime * 0.5));
    vec3 p_noise = p_rotate + p_rotate * noise / 20.0 * (min(acceleration, 6.0) + 1.0);
    vPosition = p_noise;
    vColor = hsv2rgb(vec3(updateTime + position.y / 400.0, 0.05 + min(acceleration / 10.0, 0.25), 1.0));
    invertMatrix = inverse(modelMatrix);
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p_noise, 1.0);
}
