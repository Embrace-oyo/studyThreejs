precision highp float;

#define GLSLIFY 1
uniform float uTime;

uniform vec2 uResolution;

uniform sampler2D tMaskNoise;
uniform sampler2D tFlow;
uniform sampler2D tBake1;
uniform sampler2D tBake2;
uniform sampler2D tPlaster;
uniform float uScreenScroll;
uniform float uTextureStrength;
uniform float uGradientStrength;
uniform float uOpacity;
uniform float uSwitchColorTransition;
uniform float uSwitchColorFastScroll;
uniform float uFastScroll;
uniform sampler2D tFluidFlowmap;
uniform float uBrightnessFactor;
uniform float uBrightnessOffset;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vEye;
vec4 sRGBTransferOETF(in vec4 value){
    return vec4(mix(pow(value.rgb, vec3(0.41666))*1.055-vec3(0.055), value.rgb*12.92, vec3(lessThanEqual(value.rgb, vec3(0.0031308)))), value.a);
}
float circularIn(float t){
    return 1.0-sqrt(1.0-t*t);
}
vec2 getFastScrollNoise(float time, vec2 screenUv, sampler2D noiseTexture, vec4 params){
    float speed=params.x;
    float noiseSize=params.y;
    vec2 mask=params.zw;
    float t=time*speed;
    vec2 uvFastScrollNoise=screenUv/noiseSize+t*0.007;
    vec2 uvFastScrollNoise2=screenUv/noiseSize-t*0.007;
    vec3 fastScrollNoise=texture2D(noiseTexture, uvFastScrollNoise).rgb;
    vec3 fastScrollNoise2=texture2D(noiseTexture, uvFastScrollNoise2).rgb;
    fastScrollNoise=(fastScrollNoise+fastScrollNoise2)/2.;
    vec3 colorDot=vec3(sin(vec3(t, t+1.047, t+2.094)));
    float colorAvg=(abs(colorDot.r)+abs(colorDot.g)+abs(colorDot.b))/3.;
    colorDot/=colorAvg;
    vec3 colorDot2=vec3(sin(vec3(t+1.047, t+2.094, t)));
    float colorAvg2=(abs(colorDot2.r)+abs(colorDot2.g)+abs(colorDot2.b))/3.;
    colorDot2/=colorAvg2;
    float fastScrollExtrude=smoothstep(mask.x, mask.y, dot(normalize(fastScrollNoise-0.5), colorDot));
    float fastScrollExtrude2=smoothstep(mask.x, mask.y, dot(normalize(fastScrollNoise-0.5), colorDot2));
    return vec2(circularIn(fastScrollExtrude), circularIn(fastScrollExtrude2));
}
struct FluidEffectConfig{
    float amplitude;
    float shadowStrength;
    float fluidMagnitude;
    float fluidRedCoef;
    float fluidGreenCoef;
    float fluidBlueCoef;
    float linesSpeed;
    float linesScale;
    float linesStrength;
    float linesWaveLength;
    vec3 baseColor;
    float baseThreshold;
    float hueShift;
    float colorRange;
};
float cremap(float value, float start1, float stop1, float start2, float stop2){ float r=start2+(stop2-start2)*((value-start1)/(stop1-start1));
    return clamp(r, min(start2, stop2), max(start2, stop2));
}
vec3 hsv2rgb(vec3 c){ vec4 K=vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);
    return c.z*mix(K.xxx, clamp(p-K.xxx, 0.0, 1.0), c.y);
}
vec3 rgb2hsv(vec3 c){ vec4 K=vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p=mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q=mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
    float d=q.x-min(q.w, q.y);
    float e=1.0e-10;
    return vec3(abs(q.z+(q.w-q.y)/(6.0*d+e)), d/(q.x+e), q.x);
}
vec3 applyFluidEffect(FluidEffectConfig config, vec3 color, vec4 fluid, vec2 uv, float time, float mask, vec3 normal){
    float rgbVel=(fluid.r+fluid.g)*0.005*4.;
    vec3 rgbCoef=vec3(config.fluidRedCoef, config.fluidGreenCoef, config.fluidBlueCoef);
    vec3 aberrationColor=vec3(sin(rgbVel*rgbCoef));
    float fluidEdges=smoothstep(0.0, 1.0, fluid.b*config.fluidMagnitude);
    vec2 uvLines=uv+time*0.01*config.linesSpeed;
    uvLines.x=uvLines.x*1000.0/config.linesScale;
    uvLines.y=sin(uvLines.y*50.0*config.linesWaveLength)*20.0/config.linesScale;
    float lines=smoothstep(-1.0, 0.5, sin(uvLines.x+uvLines.y));
    lines=mix(1.0, lines, config.linesStrength);
    vec3 normalVector=normal;
    normalVector.z*=config.colorRange;
    normalVector=normalize(normalVector);
    vec3 normalColor=(normalVector+1.)/2.;
    normalColor=rgb2hsv(normalColor);
    normalColor.r=fract(normalColor.r+config.hueShift);
    normalColor=hsv2rgb(normalColor);
    vec3 effectColor=normalColor;
    color=mix(color, effectColor, mask*fluidEdges*lines*config.amplitude);

    #ifdef SHOW_EFFECT_FLUID
    color=vec3(fluidEdges);

    #endif
    #ifdef SHOW_EFFECT_COLORS
    color=mix(vec3(1.), effectColor, fluidEdges*config.amplitude);

    #endif
    #ifdef SHOW_EFFECT_LINES
    color=vec3(lines);

    #endif
    return color;
}
const FluidEffectConfig effectConfig=FluidEffectConfig(EFFECT_AMPLITUDE, EFFECT_SHADOW_STRENGTH, EFFECT_FLUID_MAGNITUDE, EFFECT_FLUID_RED_COEF, EFFECT_FLUID_GREEN_COEF, EFFECT_FLUID_BLUE_COEF, EFFECT_LINES_SPEED, EFFECT_LINES_SCALE, EFFECT_LINES_STRENGTH, EFFECT_LINES_WAVE_LENGTH, EFFECT_BASE_COLOR, EFFECT_BASE_THRESHOLD, EFFECT_HUE_SHIFT, EFFECT_COLOR_RANGE);
vec3 ContrastSaturationBrightness(vec3 color, float brt, float sat, float con){
    const float AvgLumR=0.5;
    const float AvgLumG=0.5;
    const float AvgLumB=0.5;
    const vec3 LumCoeff=vec3(0.2125, 0.7154, 0.0721);
    vec3 AvgLumin=vec3(AvgLumR, AvgLumG, AvgLumB);
    vec3 brtColor=color*brt;
    vec3 intensity=vec3(dot(brtColor, LumCoeff));
    vec3 satColor=mix(intensity, brtColor, sat);
    vec3 conColor=mix(AvgLumin, satColor, con);
    return conColor;
}
void main(){
    vec3 color=vec3(0);
    float alpha=1.0;
    vec2 uvScreen=gl_FragCoord.xy/uResolution;
    vec4 flow=texture2D(tFlow, uvScreen)*2.;
    float extrude=mix(flow.b, flow.a, 0.5);
    vec2 fastScrollNoise=getFastScrollNoise(uTime, uvScreen+vec2(0., -uScreenScroll), tMaskNoise, vec4(SCROLL_EXTRUDE_SPEED, SCROLL_EXTRUDE_NOISE_SIZE, SCROLL_EXTRUDE_MASK));
    float fastScrollExtrude=fastScrollNoise.r*SCROLL_EXTRUDE_STRENGTH;
    extrude=mix(extrude, fastScrollExtrude, uFastScroll)*uOpacity;
    float gradient=mix(1.0, 0.5, length(uvScreen-vec2(0.0, 0.8)));
    vec3 bake1=sRGBTransferOETF(texture2D(tBake1, vUv)).rgb;
    vec3 bake2=sRGBTransferOETF(texture2D(tBake2, vUv)).rgb;
    float level0=bake2.b;
    float level1=bake2.g;
    float level2=bake2.r;
    float level3=bake1.b;
    float level4=bake1.g;
    float level5=bake1.r;
    float o=level0;
    o=0.54504;
    o=mix(o, level1, smoothstep(0.0, 0.2, extrude));
    o=mix(o, level2, smoothstep(0.2, 0.4, extrude));
    o=mix(o, level3, smoothstep(0.4, 0.6, extrude));
    o=mix(o, level4, smoothstep(0.6, 0.8, extrude));
    o=mix(o, level5, smoothstep(0.8, 1.0, extrude));
    color+=vec3(o);
    vec2 uvPlaster=vPos.xy/10.0;
    float plaster=texture2D(tPlaster, uvPlaster).g;
    color=mix(color, color*plaster, uTextureStrength);
    color+=gradient*0.7*uGradientStrength;
    color=color*uBrightnessFactor+uBrightnessOffset;
    vec3 dFdxPos=dFdx(vEye);
    vec3 dFdyPos=dFdy(vEye);
    vec3 normal=normalize(cross(dFdxPos, dFdyPos));
    float fresnelFactor=abs(dot(normal, vec3(0., 0., 1.)));
    float inversefresnelFactor=1.0-fresnelFactor;
    inversefresnelFactor=1.-pow(inversefresnelFactor, CHROMATIC_FRESNEL_SHARPNESS);
    float waveMask=max(smoothstep(1., 0.1, mix(inversefresnelFactor, 1., 1.-CHROMATIC_FRESNEL_OPACITY)), smoothstep(CHROMATIC_SHADOW_RANGE.y, CHROMATIC_SHADOW_RANGE.x, level5)*CHROMATIC_SHADOW_OPACITY)*uOpacity;
    vec4 fluid=texture2D(tFluidFlowmap, uvScreen);
    fluid+=mix(0., fastScrollNoise.g*2., uFastScroll);
    color=applyFluidEffect(effectConfig, color, fluid, vUv, uTime, waveMask, normal);
    vec3 fastModeColor=ContrastSaturationBrightness(color, 2., 1., 0.08);
    fastModeColor+=0.3;
    vec3 whiteRender=mix(color, fastModeColor, uFastScroll);
    float blackFluidR=pow(o*(length(fluid)*0.0003)+o, 5.5);
    float blackFluidG=pow(o*(length(fluid)*0.0003)+o, 5.5);
    float blackFluidB=pow(o*(length(fluid)*0.0003)+o, 5.5);
    vec3 blackRender=vec3(blackFluidR, blackFluidG, blackFluidB);
    color=mix(whiteRender, blackRender, uSwitchColorTransition);
    gl_FragColor.rgb=color;
    gl_FragColor.a=alpha;
}
