varying vec2 vUv;
uniform float u_time;
uniform float u_speed;

vec2 hash(vec2 p) {
    p = vec2 (dot(p, vec2 (127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise2d(in vec2 p) {
    const float K1 = 0.366025404;// (sart(3)-1)/2;
    const float K2 = 0.211324865;// (3-sqrt(3))/6;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y)* K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);// vec2 of = 0.5 + 0.5*vec2 (sign(a.x-a.y), sign(a.y-a.x));
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h*h*h*h*vec3(dot(a, hash(i+0.0)), dot(b, hash(i+o)), dot(c, hash(i+1.0)));
    return dot(n, vec3(70.0));
}


float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

vec3 pos2col(vec2 ipos) {
    ipos += vec2(9.0, 0.0);// just moved pick some nice colors
    float r = random(ipos + vec2(12.0, 2.0));
    float g = random(ipos + vec2(7.0, 5.0));
    float b = random(ipos);
    vec3 col = vec3(r, g, b);
    return col;
}

vec3 colorNoise(vec2 st) {
    vec2 ipos = floor(st);
    vec2 fpos = fract(st);
    // Four corners in 2D if a tile
    vec3 a = pos2col(ipos);
    vec3 b = pos2col(ipos + vec2(1.0, 1.0));
    vec3 c = pos2col(ipos + vec2(0.0, 1.0));
    vec3 d = pos2col(ipos + vec2(1.0, 1.0));
    // Cubic Hermine Curve. Same as SmoothStep()
    vec2 u = fpos * fpos * (3.0 - 2.0 * fpos);
    // Mix 4 coorners percentages
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d- b) * u.x * u.y;
}

void main() {
    vec2 newUV = vUv + vec2(-u_time * 0.5, 0.0);
    float noiseMask = (noise2d(newUV * vec2(3.0, 100.0)) + 1.0) / 2.0;
    noiseMask = pow(clamp(noiseMask - 0.1, 0.0, 1.0), 11.0);
    noiseMask = smoothstep(0.0, 0.04, noiseMask) * 2.0;

    vec3 colorNoiseMask = colorNoise(newUV * vec2(10.0, 100.0)) * vec3(1.5, 1.0, 400.0);
    noiseMask *= smoothstep(0.02, 0.5, vUv.x) * smoothstep(0.02, 0.5, 1.0 - vUv.x);
    noiseMask *= smoothstep(0.01, 0.1, vUv.y) * smoothstep(0.01, 0.1, 1.0 - vUv.y);
    noiseMask *= smoothstep(1.0, 10.0, u_speed);


        gl_FragColor = vec4(vec3(colorNoiseMask), noiseMask);
//    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
