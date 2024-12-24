#ifdef GL_ES
precision mediump float;
#endif

#define OCTAVES 2
#define RGB(r, g, b) vec3(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0)

// 窗口大小
uniform vec2 resolution;
// 全局时间
uniform float globalTime;

vec2 rand2(vec2 p) {
    p = vec2(dot(p, vec2(12.9898, 78.233)), dot(p, vec2(26.65125, 83.054543)));
    return fract(sin(p) * 43758.5453);
}

float rand(vec2 p) {
    return fract(sin(dot(p.xy, vec2(54.90898, 18.233))) * 4337.5453);
}


//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, // (3.0-sqrt(3.0))/6.0
    0.366025403784439, // 0.5*(sqrt(3.0)-1.0)
    -0.577350269189626, // -1.0 + 2.0 * C.x
    0.024390243902439);// 1.0 / 41.0
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);// Avoid truncation effects in permutation
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

// Thanks to andmar1x https://www.shadertoy.com/view/MtB3zW
float stars(in vec2 x, float numCells, float size, float br) {
    vec2 n = x * numCells;
    vec2 f = floor(n);

    float d = 1.0e10;
    for (int i = -1; i <= 1; ++i)
    {
        for (int j = -1; j <= 1; ++j)
        {
            vec2 g = f + vec2(float(i), float(j));
            g = n - g - rand2(mod(g, numCells)) + rand(g);
            // Control size
            g *= 1. / (numCells * size);
            d = min(d, dot(g, g));
        }
    }

    return br * (smoothstep(.95, 1., (1. - sqrt(d))));
}

float fractalNoise(in vec2 coord, in float persistence, in float lacunarity) {
    float n = 0.;
    float frequency = 3.;
    float amplitude = 2.;
    for (int o = 0; o < OCTAVES; ++o)
    {
        n += amplitude * snoise(coord * frequency);
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return n;
}

void main() {
    // 计算中心点
    vec2 coord = gl_FragCoord.xy / resolution.xy;
    vec2 starCoord = gl_FragCoord.xy / resolution.yy - vec2(.5, 0);
    // 定义颜色
    vec3 color1 = RGB(10, 70, 50) * 1.5;
    vec3 color2 = RGB(50, 0, 40) * 1.1;
    // 混合因子
    float dist = distance(coord, vec2(0.5, 0.3)) * 1.5;

    float time = -globalTime / 100.;

    mat2 RotationMatrix = mat2(cos(time), sin(time), -sin(time), cos(time));
    vec3 starField = stars(starCoord * RotationMatrix, 16., 0.03, 0.8) * vec3(.9, .9, .95);
    starField += stars(starCoord * RotationMatrix, 40., 0.025, 1.0) * vec3(.9, .9, .95) * max(0.0, fractalNoise(starCoord * RotationMatrix, .5, .2));

    vec3 aurora = RGB(0,255,130) * max(snoise(vec2((coord.x + sin(time)) * 15., coord.x * 40.)) * max((sin(10.0 * (coord.x + 2. * time)) *.1 + 1.26) - 2. * coord.y, 0.), 0.);
    vec3 aurora2 = RGB(0,235,170) * max(snoise(vec2((.09 * coord.x + sin(time * .5)) * 15., coord.x * 1.)) * max((sin(5.0 * (coord.x + 1.5 * time)) *.1 + 1.28) - 2. * coord.y, 0.), 0.);

    vec3 result = starField + aurora * aurora2.g * 3.5 + aurora2;

    gl_FragColor = vec4(mix(color1, color2, dist), 1.0);
    gl_FragColor.rgb += result;
}
