uniform float uTime;
varying vec2 vUv;
attribute float aSize;
varying vec3 vColor;
attribute vec4 aShift;
const float PI = 3.1415925;

void main() {
    vec3 color1 = vec3(227., 155., 0.);
    vec3 color2 = vec3(100., 50., 255.);
    vUv = uv;
    float d = length(abs(position) / vec3(40., 10., 40.));
    d = clamp(d, 0., 1.);
    vColor = mix(color1, color2, d) / 255.;


    vec3 transformed = position;
    float theta = mod(aShift.x + aShift.z * uTime, PI * 2.);
    float phi = mod(aShift.y + aShift.z * uTime, PI * 2.);
    transformed += vec3(sin(phi) * cos(theta), cos(phi), sin(phi) * sin(theta)) * aShift.w;



    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
    gl_PointSize = aSize * 80.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
