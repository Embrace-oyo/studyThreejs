uniform vec2 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform sampler2D iChannel0;
varying vec2 vUv;

void main(){
    vec3 e = vec3(vec2(1.0) / iResolution, 0.0);
    vec2 q = vUv;

    vec4 c = texture(iChannel0, q);
    float p11 = c.y;

    float p10 = texture(iChannel0, q - e.zy).x;
    float p01 = texture(iChannel0, q - e.xz).x;
    float p21 = texture(iChannel0, q + e.xz).x;
    float p12 = texture(iChannel0, q + e.zy).x;

    float d = 0.0;

    if (iMouse.z > 0.0){
        d = smoothstep(4.5, 0.5, length(iMouse.xy - gl_FragCoord.xy));
    } else {
        float t = iTime * 10.0;
        vec2 pos = fract(float(t) * vec2(0.456665, 0.708618)) * iResolution;
        float amp = 1.0 - step(0.25, fract(t));
        d = -amp * smoothstep(4.5, 0.5, length(pos - gl_FragCoord.xy));
    }

    d+= -(p11 - 0.5) * 2.0 + (p10 + p01 + p21 + p12 - 2.0);
    d *= 0.99;
    d *= float(iTime >= 2.0);
    d = d * 0.5 + 0.5;

    gl_FragColor = vec4(d, c.x, 0.0, 0.0);
}
