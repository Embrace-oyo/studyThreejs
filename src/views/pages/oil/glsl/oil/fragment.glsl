#ifdef GL_ES
precision highp float;
#endif

#include "/node_modules/lygia/generative/cnoise.glsl"

vec4 blur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 off1 = vec2(1.411764705882353) * direction;
    vec2 off2 = vec2(3.2941176470588234) * direction;
    vec2 off3 = vec2(5.176470588235294) * direction;
    color += texture2D(image, uv) * 0.1964825501511404;
    color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
    color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
    color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
    color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
    return color;
}

varying vec2 vUv;

uniform float uTime;
uniform float uFlowSpeed;
uniform float uFlowMapBlurRadius;

uniform float uNoiseSpeed;
uniform float uNoiseScaleX;
uniform float uNoiseScaleY;
uniform float uNoiseAmplitude;

uniform vec2 uResolution;

uniform sampler2D uTexture;
uniform sampler2D uFlowMap;
uniform sampler2D uTrailTexture;

vec2 correctAspect(vec2 uv) {
    uv.x *= uResolution.x / uResolution.y;

    return uv;
}

float getTrail(vec2 uv) {
    float trail = texture2D(uTrailTexture, uv).r;

    return trail;
}

vec2 applyTrail(vec2 flowDir, float trail) {
    flowDir.x -= trail;
    flowDir.y += trail * 0.075;

    return flowDir;
}

float applyNoise(vec2 uv) {
    float x = uv.x * uNoiseScaleX;
    float y = uv.y * uNoiseScaleY;

    float n = cnoise(vec3(x, y, uTime * uNoiseSpeed));

    n *= uNoiseAmplitude;

    return n;
}

vec2 getFlowDir(vec2 uv) {
    vec4 horizontalBlur = blur(uFlowMap, uv, uResolution, vec2(uFlowMapBlurRadius, 0.0));
    vec4 verticalBlur = blur(uFlowMap, uv, uResolution, vec2(0.0, uFlowMapBlurRadius));

    vec4 texture = mix(horizontalBlur, verticalBlur, 0.5);

    vec2 flowDir = texture.rg;

    flowDir -= vec2(0.5, 0.5);

    return flowDir;
}

vec3 flow(vec2 uv) {
    float phase1 = fract(uTime * uFlowSpeed + 0.5);
    float phase2 = fract(uTime * uFlowSpeed + 1.0);

    vec2 flowDir = getFlowDir(uv);

    float trail = getTrail(uv);
    flowDir = applyTrail(flowDir, trail);

    // mirroring phase
    phase1 = 1.0 - phase1;
    phase2 = 1.0 - phase2;

    vec2 distordedUv = uv + applyNoise(uv);

    vec3 color1 = texture2D(
    uTexture,
    distordedUv + flowDir * phase1).rgb;

    vec3 color2 = texture2D(
    uTexture,
    distordedUv + flowDir * phase2).rgb;

    float flowLerp = abs((0.5 - phase1) / 0.5);
    vec3 finalColor = mix(color1, color2, flowLerp);

    return finalColor;
}

void main() {
    vec2 uv = vUv;

    vec3 color = flow(uv);

    gl_FragColor = vec4(color, 1.0);
}
