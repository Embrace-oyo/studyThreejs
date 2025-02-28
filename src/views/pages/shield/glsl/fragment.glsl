#include "/node_modules/lygia/generative/cnoise.glsl"
#include "/node_modules/lygia/generative/snoise.glsl"
#include "/node_modules/lygia/generative/curl.glsl"
#include "/node_modules/lygia/generative/fbm.glsl"
#include "/node_modules/lygia/generative/gnoise.glsl"
#include "/node_modules/lygia/generative/pnoise.glsl"
#include "/node_modules/lygia/generative/srandom.glsl"
#include "/node_modules/lygia/generative/voronoi.glsl"
#include "/node_modules/lygia/generative/wavelet.glsl"
#include "/node_modules/lygia/generative/worley.glsl"

varying vec2 vUv;
varying float vIntensity;
varying vec3 vPos;
uniform float uThickness;
uniform vec3 uColor;
uniform float uAmp;
uniform float uFreq;
uniform float uTime;

void main() {
    // cnoise
    //    float noise = cnoise(vPos * uFreq + uTime * 0.3) * uAmp;
    // snoise
    //    float noise = snoise(vPos * uFreq + uTime * 0.3) * uAmp;
    //    vec3 noise = snoise3(vPos * uFreq + uTime * 0.3) * uAmp;
    // curl
        vec3 noise = curl(vPos * uFreq + uTime * 0.3) * uAmp;
    // fbm
    //    float noise = fbm(vPos * uFreq + uTime * 0.3) * uAmp;
    //    noise *= noise;
    // gnoise
    //    float noise = gnoise(vPos * uFreq + uTime * 0.3) * uAmp;
    // pnoise
    //    float noise = pnoise(vPos * uFreq + uTime * 0.3, vPos) * uAmp;
    // srandom
    //    float noise = srandom(vPos * uFreq + uTime * 0.3) * uAmp;
    // voronoi
    //    vec3 noise = voronoi(vUv * uFreq, uTime * 0.3) * uAmp;
    //    vec3 noise = voronoi(vPos * uFreq + uTime * 0.3) * uAmp;
    // wavelet
    //    float noise = wavelet(vPos * uFreq + uTime * 0.3) * uAmp;
    // worley
    //    float noise = worley(vUv * uFreq + uTime * 0.3) * uAmp;
    gl_FragColor = vec4(noise * vIntensity * uColor, 1.0);
}
