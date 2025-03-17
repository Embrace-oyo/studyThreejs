uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main(){
    vec2 q = vUv;
    vec3 e = vec3(vec2(1.0) / iResolution, 0.0);

    float p10 = texture(iChannel0, q - e.zy).x;
    float p01 = texture(iChannel0, q - e.xz).x;
    float p21 = texture(iChannel0, q + e.xz).x;
    float p12 = texture(iChannel0, q + e.zy).x;

    vec3 grad = normalize(vec3(p21 - p01, p12 - p10, 1.0));
    vec4 c = texture(tDiffuse, q + grad.xy * 0.35);
    vec3 light = normalize(vec3(0.2, -0.5, 0.7));
    float diffues = dot(grad, light);
    float spec = pow(max(0.2, -reflect(light, grad).z), 32.0);

    gl_FragColor = mix(c, vec4(0.7, 0.8, 1.0, 1.0), 0.25) * max(diffues, 0.0) + spec;
}
