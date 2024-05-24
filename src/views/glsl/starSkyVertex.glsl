uniform float u_size;
uniform float u_time;
attribute float a_scale;
attribute vec3 a_randomness;
varying vec3 v_color;
void main() {
    // position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float angle = atan(modelPosition.x, modelPosition.z);
    float distanceToCenter = length(modelPosition.xz);
    float angleOffset = (1.0 / distanceToCenter) * u_time * 0.2;
    angle += angleOffset;
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;
    modelPosition.xyz += a_randomness;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    // size
    gl_PointSize = u_size * a_scale;
    gl_PointSize *= (1.0 / - viewPosition.z);
    // color
    v_color = color;
}
