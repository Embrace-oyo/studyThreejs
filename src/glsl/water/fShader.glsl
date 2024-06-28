varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;

#define TAU 6.28318530718
#define MAX_ITER 8

vec3 palette(in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d){
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {

    vec2 uv = v_uv;
    uv.x *= iResolution.x / iResolution.y;
    float time = iTime * .095 + 23.0;
    vec2 p = mod(uv * TAU, TAU) - 213.0;
    vec2 i = vec2(p);
    float c = 1.0;
    float inten = .005;

    for (int n = 0; n < MAX_ITER; n++) {
        float t = time * (1.0 - (3.5 / float(n + 1)));
        i = p + vec2(cos(t - i.x) + sin(t + i.y), sin(t - i.y) + cos(t + i.x));
        c += 1.0 / length(vec2(p.x / (sin(i.x + t) / inten), p.y / (cos(i.y + t) / inten)));
    }

    c /= float(MAX_ITER);
    c = 1.17 - pow(c, 1.4);
    vec3 colour = vec3(pow(abs(c), 10.0));
    colour *= 1.1;
    colour = clamp(colour + vec3(0.095), 0.0, 1.0);

    float palettePhase = abs(sin(uv.x * uv.y + iTime * 0.05)) + iTime * 0.1;
    vec3 col = palette(palettePhase, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(2.0, 1.0, 0.0), vec3(0.50, 0.20, 0.25));
    col *=  colour;

    gl_FragColor = vec4(col, 1.0);
}
