precision mediump float;
uniform float time;
uniform vec2 mousePosition;
uniform float audioData;
varying vec2 vUv;
varying float vElevation;
varying float vDisplacement;

float PI = 3.141592;

float mod289(float x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 perm(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }

float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fbm(vec2 pos, float t){
    float r;
    r    =    noise(vec3(pos, t) * 01.0) * 01.0000;
    r    +=    noise(vec3(pos, t) * 02.0) * 00.5000;
    r    +=    noise(vec3(pos, t) * 04.0) * 00.2500;
    r    +=    noise(vec3(pos, t) * 08.0) * 00.1250;
    r    +=    noise(vec3(pos, t) * 16.0) * 00.0625;
    return r / 1.9375;
}

void main() {
    vUv = uv;
    float t = time*.5;
    float t2 = time*.1 + cos(time * .2) * .05;
    vec2 pos = vUv * (2.0 + vUv.y);

    vec2 displacement = vec2(t2, t) + (2.0 + mousePosition * .5) + audioData * 0.05;

    float p = fbm(displacement * 2.0 + pos * 2.0, t * 1.1);
    vec2 pos2 = pos + vec2(p);

    float q = fbm(displacement * 3.0 + pos2 * 2.0, t * 1.23);
    vec2 pos3 = pos + vec2(q);

    float r = fbm(displacement * 4.0 + pos3 * 2.0, t * 1.23);
    vec2 pos4 = pos + vec2(r);

    float s = fbm(displacement * 5.0 + pos4 * 2.0, t * 1.32);

    float d = length(vUv - (.5 + mousePosition));

    float ratioElevation = pow((1.0 - d), 5.0);

    vElevation = s + .1 + ratioElevation * .2;

    vElevation *= 1.0 - smoothstep(0.0, 1.0, length(uv - .5));

    vec3 finalPos = position;
    finalPos.z = -30.0 + pow(s + ratioElevation + audioData, .5) * 40.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4 (finalPos, 1.0);
}
