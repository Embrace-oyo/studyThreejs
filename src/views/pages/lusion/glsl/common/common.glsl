// === GLSL common functions ===

// Hash-based 2D random number generator
float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// Linear to gamma correction (可选)
vec3 linearToGamma(vec3 value, float gammaFactor) {
    return pow(value, vec3(1.0 / gammaFactor));
}

// Gamma to linear correction (可选)
vec3 gammaToLinear(vec3 value, float gammaFactor) {
    return pow(value, vec3(gammaFactor));
}

// Clamp and remap function (可选)
float remap(float value, float inMin, float inMax, float outMin, float outMax) {
    return mix(outMin, outMax, clamp((value - inMin) / (inMax - inMin), 0.0, 1.0));
}
