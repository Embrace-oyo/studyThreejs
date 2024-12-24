#ifdef GL_ES
precision mediump float;
#endif

#define RGB(r, g, b) vec3(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0)

uniform float globalTime;

varying vec2 vUv;

float treeFill(in float size, in vec2 offset) {
    vec2 p = vUv;
    vec2 q = p - vec2(0.5,0.5);
    vec2 q1 = 100.0 / size * q - offset;
    float r= mod(-0.8*q1.y,1.-0.06*q1.y) * -0.05*q1.y - .1*q1.y;
    float fill = (1.0 - smoothstep(r, r+0.001, abs(q1.x+0.5*sin(0.9 * globalTime + p.x * 25.0)*(1.0 + q1.y/13.0)))) * smoothstep(0.0, 0.01, q1.y + 13.0);
    return fill;
}

vec4 tree(in float size, in vec2 offset) {
    float glowDist = 0.12;
    vec3 glowColor = RGB(11, 115, 95);
    float tree = treeFill(size, offset);
    float treeGlow = treeFill(size, vec2(offset.x + glowDist, offset.y));
    return max(vec4(glowColor * (treeGlow - tree), treeGlow), vec4(0.0));
}

void main() {
    vec2 c = vUv;
    vec2 p = vUv;
    p *= 0.3;
    p.y = p.y * 30.0 - 4.0;
    p.x = p.x * 30.0;
    vec2 q = (p - vec2(0.5,0.5)) * 5.5;

    vec4 col = tree(1.0, vec2(-30.0, 7.0));
    col += tree(1.2, vec2(-15.0, 8.0));
    col += tree(1.1, vec2(-12.0, 4.0));
    col += tree(1.0, vec2(-9.0, 6.0));
    col += tree(1.1, vec2(-10.0, 3.0));
    col += tree(1.0, vec2(-3.0, 4.0));
    col += tree(1.1, vec2(-1.5, 5.0));
    col += tree(1.0, vec2(5.0, 3.0));
    col += tree(1.3, vec2(12.0, 8.0));
    col += tree(0.9, vec2(15.0, 7.0));
    col += tree(1.0, vec2(18.0, 7.0));
    col += tree(1.1, vec2(26.0, 7.0));

    gl_FragColor = vec4(max(col.rgb * p.y, vec3(0.0)), col.a);
}
