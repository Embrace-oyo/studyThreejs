#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uMousePosition;
uniform float uRadius;
uniform float uStrength;
uniform float uLength;
uniform float uAspect;
uniform sampler2D bufferTrail;

varying vec2 vUv;

vec2 correctAspect(vec2 uv) {
    uv.x *= uAspect;

    return uv;
}


void main() {
    vec3 color = texture2D(bufferTrail, vUv).rgb;
    vec2 uv = vUv;

    float mouse = distance(correctAspect(uMousePosition), correctAspect(uv));

    mouse = max(uRadius - mouse, 0.0);
    mouse *= uStrength;

    color -= uLength;
    color += mouse;

    color = clamp(color, vec3(0.0), vec3(1.0));

    gl_FragColor = vec4(color, 1.0);
}
