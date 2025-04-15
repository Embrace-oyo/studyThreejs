import{C as J,e as $,W as z,V as f,k as U,l as x,y as X,M as O,H as Q,aq as ee,w as L,D as te,a3 as G,aM as se,h as oe,o as ne,n as Y,v as ae,aN as ie,P as re,O as le,x as ce,a1 as he,aO as ue,a2 as fe,aP as me,ae as de,ah as B,ab as pe,aQ as ve,aR as ge,aS as _e,aT as Ee}from"./threejs-X_Qec1pD.js";import{v as Se,l as W,b as we,m as Fe,i as j,c as q,d as k,F as xe,n as be,p as Te,e as Ce,q as Le}from"./vendor-DXKZwkeo.js";import{_ as ye}from"../lib/index-C14GzQpN.js";const Re=""+new URL("../3DL/day-Br6N0u37.3DL",import.meta.url).href,De=""+new URL("../3dl/lut-CLMnDM_C.3dl",import.meta.url).href,Me=""+new URL("../3DL/night-e0VgbcMg.3DL",import.meta.url).href,Oe=""+new URL("../glb/bg_low_draco-BdiMFPUU.glb",import.meta.url).href,Ae=""+new URL("../glb/fish-DBENyeI8.glb",import.meta.url).href,Ne=""+new URL("../glb/footer_compressed-Bq8pdi2m.glb",import.meta.url).href,ke=""+new URL("../glb/reliefs_high_compressed-DXm6xJZZ.glb",import.meta.url).href,Ie=""+new URL("../png/Helvetica-neue-Cs0DNosQ.png",import.meta.url).href,Ue=""+new URL("../png/PSTimes-Regular-Cu6eXsXh.png",import.meta.url).href,Pe=""+new URL("../png/TimesNow-DPz6omyU.png",import.meta.url).href,He=""+new URL("../webp/black-dust-DskwAszf.webp",import.meta.url).href,ze=""+new URL("../jpg/dust-particle-DhlnsdIT.jpg",import.meta.url).href,Ge=""+new URL("../webp/marble-texture-BmTaI8WF.webp",import.meta.url).href,Be=""+new URL("../png/mask-noise-D_hW-73M.png",import.meta.url).href,We=""+new URL("../png/matcap-6-J7sycNqM.png",import.meta.url).href,je=""+new URL("../png/matcap2-C-HjeAET.png",import.meta.url).href,qe=""+new URL("../jpg/matcapSteel-u-CpuNd2.jpg",import.meta.url).href,Ve=""+new URL("../jpg/plaster-DakscGDu.jpg",import.meta.url).href,$e=""+new URL("../png/rgb-attenuation-0_9-u7bpJwy8.png",import.meta.url).href,Xe=""+new URL("../png/rgb-attenuation-1_2-H_wDyryO.png",import.meta.url).href,Ye=""+new URL("../png/rgb-fractal-CnKU7XIf.png",import.meta.url).href,Ze=""+new URL("../jpg/rgb-noise-DjfOYTA5.jpg",import.meta.url).href,Ke=""+new URL("../jpg/roughness-BetlA_7-.jpg",import.meta.url).href,Je=""+new URL("../png/sparkle-noise-y1FBpOfF.png",import.meta.url).href,Qe=""+new URL("../ktx2/normal_05-B2qMIf18.ktx2",import.meta.url).href,et=""+new URL("../ktx2/normal_06-DXxDDmdy.ktx2",import.meta.url).href,tt=""+new URL("../ktx2/rocks_normal-GcaE7209.ktx2",import.meta.url).href;var st=`#define GLSLIFY 1
attribute vec2 uv;
attribute vec3 position;
varying vec2 vUv;
void main(){
    vUv=uv;
    gl_Position=vec4(position, 1);
}`,ot=`precision highp float;
#define GLSLIFY 1
uniform sampler2D tMap;
uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;
uniform float uDeltaMult;
uniform float uOffset;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform vec2 uMouse2;
uniform vec2 uVelocity2;
uniform sampler2D tNoise;
uniform float uTime;
varying vec2 vUv;
vec4 getStamp(vec2 velocity, vec2 mouse){
    vec2 cursor=vUv-mouse;
    cursor.x*=uAspect;
    velocity*=50.0;
    float magnitude=1.0-pow(1.0-min(1.0, length(velocity)), 2.0);
    vec4 stamp=vec4(velocity, magnitude, 1.0);
    float falloff=smoothstep(uFalloff, 0.0, length(cursor))*uAlpha;
    return stamp*falloff;
}
void main(){
    vec2 uv=vUv;
    uv.y+=uOffset;
    vec4 data=texture2D(tMap, uv);
    float friction=(1.0/uDissipation)-1.0;
    float dissipation=1.0/(1.0+(uDeltaMult*friction));
    data*=dissipation;
    float noise=0.00+1.00*smoothstep(0.4, 1.0, texture2D(tNoise, (vUv*vec2(uAspect, 1.0))*0.35+vec2(0.01, 0.01)*uTime).g);
    float noise2=0.15+0.85*smoothstep(0.4, 1.0, texture2D(tNoise, (vUv*vec2(uAspect, 1.0))*0.8+vec2(0.01, 0.01)*uTime).g);
    vec4 stamp=getStamp(uVelocity, uMouse);
    data+=stamp*noise2*uDeltaMult;
    vec4 stamp2=getStamp(uVelocity2, uMouse2)*3.;
    stamp2.a=stamp2.b;
    stamp2.rg*=0.0;
    data+=stamp2*noise*uDeltaMult;
    data=min(data, vec4(1));
    data.rgb=max(data.rgb, vec3(-1));
    gl_FragColor=data;
}`;class nt{constructor(e,i,n){const o=this;this.base=e,this.renderer=this.base.renderer,this.camera=new J,this.scene=new $,this.uniform={value:null};const a={type:/(iPad|iPhone|iPod)/g.test(navigator.userAgent)?Q:ee,depthBuffer:!1};this.mask={read:new z(256,256,a),write:new z(256,256,a),swap:()=>{const r=o.mask.read;o.mask.read=o.mask.write,o.mask.write=r,o.uniform.value=o.mask.read.texture}},this.mask.swap(),this.aspect=1,this.mouse=new f,this.velocity=new f,this.mouse2=new f,this.velocity2=new f,this.geometry=new U,this.geometry.setAttribute("position",new x(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.geometry.setAttribute("uv",new x(new Float32Array([0,0,2,0,0,2]),2)),this.material=new X({vertexShader:st,fragmentShader:ot,uniforms:{tMap:o.uniform,uFalloff:{value:.5*.5},uAlpha:{value:.3},uDissipation:{value:.98},uDeltaMult:{value:1},tNoise:i,uTime:n,uAspect:{value:1},uMouse:{value:this.mouse},uVelocity:{value:this.velocity},uMouse2:{value:this.mouse2},uVelocity2:{value:this.velocity2},uOffset:{value:0}},depthTest:!1}),this.mesh=new O(this.geometry,this.material),this.mesh.material.needsUpdate=!0,this.scene.add(this.mesh),this.tick=this.tick.bind(this),this.base.tick.add(this.tick)}setFalloff(e){this.mesh.material.uniforms.uFalloff.value=e*.5}setDissipation(e){this.mesh.material.uniforms.uDissipation.value=e}setAlpha(e){this.mesh.material.uniforms.uAlpha.value=e}update(e=0){this.mesh.material.uniforms.uAspect.value=this.aspect,this.mesh.material.uniforms.uOffset.value=e,this.mesh.material.needsUpdate=!0,this.renderer.setRenderTarget(this.mask.write),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.mask.swap()}tick(e,i){const n=Math.min(e,32)/16;this.mesh.material.uniforms.uDeltaMult.value=n}}class at{constructor(e){this.base=e,this.pixel=new f,this.normal=new f(.5,.5),this.normalFlip=new f(-1,-1),this.tilt=new f,this.velocity=new f,this.width=0,this.height=0,this.lastTime=0,this.lastNormalFlip=new f(-1,-1),this.down=this.down.bind(this),this.move=this.move.bind(this),this.up=this.up.bind(this),this.resize=this.resize.bind(this),this.tick=this.tick.bind(this),!(typeof window>"u")&&this.handlers()}handlers(){window.addEventListener("pointerdown",this.down),window.addEventListener("pointermove",this.move),window.addEventListener("touchmove",this.move),window.addEventListener("pointerup",this.up),window.addEventListener("resize",this.resize),window.addEventListener("orientationchange",this.resize),this.resize(),this.base.tick.add(this.tick,70)}updateMouse(e){e.changedTouches&&e.changedTouches.length&&(e.x=e.changedTouches[0].pageX,e.y=e.changedTouches[0].pageY),e.x===void 0&&(e.x=e.pageX,e.y=e.pageY),this.pixel.set(e.x,e.y),this.normal.x=this.pixel.x/this.width,this.normal.y=this.pixel.y/this.height,this.normalFlip.x=this.normal.x,this.normalFlip.y=1-this.normal.y,this.tilt.x=this.normalFlip.x*2-1,this.tilt.y=this.normalFlip.y*2-1}resize(e,i){this.width=e,this.height=i}down(e){this.updateMouse(e)}move(e){this.updateMouse(e)}up(){}tick(e,i){this.lastNormalFlip.x===-1&&this.lastNormalFlip.copy(this.normalFlip);const n=this.normalFlip.x-this.lastNormalFlip.x,o=this.normalFlip.y-this.lastNormalFlip.y;this.lastNormalFlip.copy(this.normalFlip);const a=Math.min(32,e)/16;this.velocity.x=n*a,this.velocity.y=o*a}}class it{constructor({autoplay:e=!0}={}){this.queue=[],this.last=performance.now(),this.autoplay=e,this.frame=this.frame.bind(this),typeof window<"u"&&requestAnimationFrame(this.frame)}frame(e){this.autoplay&&this.update(e),requestAnimationFrame(this.frame)}step(e){this.update(this.last+e)}update(e){let i=e-this.last;this.autoplay&&(i=Math.min(150,i)),this.last=e;for(let n=this.queue.length-1;n>=0;n--){const o=this.queue[n];if(o.fps){let a=e-o.last;if(this.autoplay&&(a=Math.min(o.delta*5,a)),a<o.delta)continue;o(a===1/0?o.delta:a,e,++o.frame),o.last=e;continue}o(i,e)}}add(e,i){i&&(e.fps=i,e.last=-1/0,e.frame=-1,e.delta=1e3/i),this.queue.includes(e)||this.queue.unshift(e)}remove(e){this.queue.includes(e)&&this.queue.splice(this.queue.indexOf(e),1)}}var rt=`#define GLSLIFY 1
attribute vec2 uv;
attribute vec3 position;
varying vec2 vUv;
void main(){
    vUv=uv;
    gl_Position=vec4(position, 1);
}`,lt=`precision highp float;

#define GLSLIFY 1
#define PI 3.141592653589793
varying vec2 vUv;
uniform float uGradientStrength;
uniform sampler2D tPlaster;
uniform float uTextureStrength;
highp float rand(const in vec2 uv){
    const highp float a=12.9898, b=78.233, c=43758.5453;
    highp float dt=dot(uv.xy, vec2(a, b)), sn=mod(dt, PI);
    return fract(sin(sn)*c);
}
void main(){
    vec3 color=vec3(0);
    float alpha=1.0;
    color+=vec3(0.54504);
    vec2 uvPlaster=vUv/1.0;
    float plaster=texture2D(tPlaster, uvPlaster).g;
    color=mix(color, color*plaster, uTextureStrength);
    vec2 uv=vUv+rand(vUv)*0.01;
    float gradient=mix(1.0, 0.5, length(uv-vec2(0.0, 0.8)));
    color+=gradient*0.7*uGradientStrength;
    color=color*0.6+0.4;
    gl_FragColor.rgb=color;
    gl_FragColor.a=alpha;
}`,ct=`#define GLSLIFY 1
uniform sampler2D tFlow;
uniform sampler2D tMaskNoise;
uniform float uTime;
uniform float uAspect;
uniform float uScreenScroll;
uniform float uScrollSpeed;
uniform float uFastScroll;
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vEye;
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
vec2 rotate2d(vec2 v, float a){
    float c=cos(a);
    float s=sin(a);
    return mat2(c, -s, s, c)*v;
}
void main(){
    vUv=uv;
    vPos=position;
    vNormal=normalize(normalMatrix*normal);
    vec4 pos=vec4(position, 1.0);
    vec4 ndc=projectionMatrix*modelViewMatrix*pos;
    vec2 uvScreen=(ndc.xy/ndc.w+1.0)/2.0;
    vec4 flow=texture2D(tFlow, uvScreen);
    float extrude=mix(flow.b, flow.a, 0.5);
    vec2 fastScrollNoise=getFastScrollNoise(uTime, uvScreen+vec2(0., -uScreenScroll), tMaskNoise, vec4(SCROLL_EXTRUDE_SPEED, SCROLL_EXTRUDE_NOISE_SIZE, SCROLL_EXTRUDE_MASK));
    float fastScrollExtrude=fastScrollNoise.r*SCROLL_EXTRUDE_STRENGTH;
    extrude=mix(extrude, fastScrollExtrude, uFastScroll)*uOpacity;
    pos.z*=mix(0.05, 1.0, extrude);
    pos.xy*=1.004;
    vec4 mPos=modelMatrix*pos;
    vec3 center=vec3(0);
    float deformStrength=5.5*min(1.0, abs(uScrollSpeed));
    vec2 deformDiff=mPos.xy-center.xy;
    vec3 deformOrigin=center+vec3(0.0, 0.0, 0.0);
    mPos.xyz-=deformOrigin;
    float deformY=max(-1.0, min(1.0, deformDiff.x*deformStrength));
    mPos.xyz+=deformOrigin;
    vec4 mvPos=viewMatrix*mPos;
    vEye=(modelMatrix*vec4(position, 1.)).xyz-cameraPosition;
    gl_Position=projectionMatrix*mvPos;
}`,ht=`precision highp float;

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

vec4 sRGBTransferOETFNew(in vec4 value){
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
}
;
float cremap(float value, float start1, float stop1, float start2, float stop2){
    float r=start2+(stop2-start2)*((value-start1)/(stop1-start1));
    return clamp(r, min(start2, stop2), max(start2, stop2));
}
vec3 hsv2rgb(vec3 c){
    vec4 K=vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p=abs(fract(c.xxx+K.xyz)*6.0-K.www);
    return c.z*mix(K.xxx, clamp(p-K.xxx, 0.0, 1.0), c.y);
}
vec3 rgb2hsv(vec3 c){
    vec4 K=vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
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
    vec3 bake1=sRGBTransferOETFNew(texture2D(tBake1, vUv)).rgb;
    vec3 bake2=sRGBTransferOETFNew(texture2D(tBake2, vUv)).rgb;
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
}`;const I=9.995,V=1.33,ut=new L,ft=new L,H=new L;function mt(h,e=ft){const{innerWidth:i,innerHeight:n}={innerWidth,innerHeight},o=i/n;e instanceof L?H.copy(e):H.set(...e);const a=h.getWorldPosition(ut).distanceTo(H);if(h.isOrthographicCamera){const r=Math.abs(h.right-h.left),c=Math.abs(h.top-h.bottom);return{width:r/h.zoom,height:c/h.zoom,factor:1,distance:a,aspect:o}}else{const r=h.fov*Math.PI/180,c=2*Math.tan(r/2)*a,u=c*(i/n);return{width:u,height:c,factor:i/u,distance:a,aspect:o}}}function C(h,e,i){return(1-i)*h+i*e}class dt{constructor(e){this.base=e,this.config={scroll:{speed:.25},flowmap:{mouseEase:.4,dissipation:.953,falloff:.38,alpha:1},extrude:{textureStrength:1,gradientStrength:.17},camera:{fov:30,distance:15,fastModeZoom:.6,slowModeZoom:1,near:5,far:20},scrollExtrude:{noiseSize:7.77,speed:2,mask:{min:-1,max:1},strength:1.02},particles:{},chromaticMask:{fresnelSharpness:35,fresnelOpacity:.98,shadowRange:{min:.2,max:.42},shadowOpacity:.25},fluidEffect:{amplitude:.57,shadowStrength:.3,baseColor:{r:122,g:191,b:197},baseThreshold:1,fluidMagnitude:.15,fluidRedCoef:2,fluidGreenCoef:1,fluidBlueCoef:1.5,linesSpeed:2,linesScale:4,linesStrength:0,linesWaveLength:.15,hueShift:-.52,colorRange:2}},this.isPaused=!1,this.viewport=null,this._isMobile=!1,this._effectParams={showEffectFluid:!1,showEffectColors:!1,showEffectLines:!1},this._state={cameraZoom:1},this.scrollOffset=0,this.randomMouseMovementTimeline=null,this.tick=new it,this.mouse=new at(this),this.createRenderTargets(),this.createReliefScene(),this.initReliefContent(),this.onConfigUpdated(),this.loopRandomMouseMovement(),this.onWindowResize({innerWidth:this.base.width,innerHeight:this.base.height,renderWidth:this.base.width,renderHeight:this.base.height})}createRenderTargets(){this.renderTarget=new z,this.renderTarget.depthTexture=new te}createReliefScene(){this.camera=this.base.camera,this.scene=this.base.scene,this.renderer=this.base.renderer,this.tMaskNoise={value:this.base.maskNoise},this.tMaskNoise.value.wrapS=this.tMaskNoise.value.wrapT=G,this.tPlaster={value:this.base.plasterTexture},this.tPlaster.value.wrapS=this.tPlaster.value.wrapT=G,this.tFluidFlowmap={value:null},this.uScreen={value:new f},this.uResolution={value:new f},this.uAspect={value:1},this.uDPR={value:window.devicePixelRatio},this.uTime={value:0},this.uScroll={value:0},this.uScreenScroll={value:0},this.uScrollSpeed={value:0},this.uTransition={value:0},this.uTextureStrength={value:1},this.uGradientStrength={value:1},this.tDepth={value:null},this.tRelief={value:null},this.uFastScroll={value:0},this.uSwitchColorFastScroll={value:0},this.uOpacity={value:1},this.uSwitchColorTransition={value:0},this.scrollLast=0,this.scrollDelta=0,this.flowmap=new nt(this,this.tMaskNoise,this.uTime),this.tFlow=this.flowmap.uniform}initReliefContent(){this.plasterGeometry=new U,this.plasterGeometry.setAttribute("position",new x(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),this.plasterGeometry.setAttribute("uv",new x(new Float32Array([0,0,2,0,0,2]),2)),this.plasterMaterial=new X({vertexShader:rt,fragmentShader:lt,uniforms:{uGradientStrength:this.uGradientStrength,tPlaster:this.tPlaster,uTextureStrength:this.uTextureStrength},depthWrite:!1,depthTest:!1}),this.plaster=new O(this.plasterGeometry,this.plasterMaterial),this.plaster.frustumCulled=!1,this.plaster.renderOrder=-1,this.plaster.material.needsUpdate=!0,this.scene.add(this.plaster),this.sections=[],this.sectionsPerLine=1;const e={},i=[];this.base.reliefsModel.children.forEach(o=>{if(!o.geometry)return;const a=new O;a.geometry=o.geometry,a.position.copy(o.position),a.scale.copy(o.scale);const r=Math.round(o.position.y);e[r]||(e[r]=0),e[r]++,e[r]>this.sectionsPerLine&&(this.sectionsPerLine=e[r]),i.includes(r)||i.push(r);const c=i.indexOf(r),u={value:o.material.map},p={value:o.material.emissiveMap},g=this.base.attenuation;g.wrapS=g.wrapT=se;const w=new oe({vertexShader:ct,fragmentShader:ht,uniforms:{uResolution:this.uResolution,uAspect:this.uAspect,uDPR:this.uDPR,uTime:this.uTime,uScroll:this.uScroll,uScrollSpeed:this.uScrollSpeed,uScreenScroll:this.uScreenScroll,uOpacity:this.uOpacity,uSwitchColorTransition:this.uSwitchColorTransition,tMaskNoise:{value:g},tFlow:this.tFlow,uTransition:this.uTransition,tPlaster:this.tPlaster,uTextureStrength:this.uTextureStrength,uGradientStrength:this.uGradientStrength,uSwitchColorFastScroll:this.uSwitchColorFastScroll,tFluidFlowmap:this.tFluidFlowmap,uFastScroll:this.uFastScroll,uBrightnessFactor:{value:this._isMobile?.5:.6},uBrightnessOffset:{value:this._isMobile?.6:.4},tBake1:u,tBake2:p},defines:{SHOW_EFFECT_FLUID:0,SHOW_EFFECT_COLORS:0,SHOW_EFFECT_LINES:0,EFFECT_AMPLITUDE:0,EFFECT_SHADOW_STRENGTH:0,EFFECT_FLUID_MAGNITUDE:0,EFFECT_FLUID_RED_COEF:0,EFFECT_FLUID_GREEN_COEF:0,EFFECT_FLUID_BLUE_COEF:0,EFFECT_LINES_SPEED:0,EFFECT_LINES_SCALE:0,EFFECT_LINES_STRENGTH:0,EFFECT_LINES_WAVE_LENGTH:0,EFFECT_BASE_COLOR:0,EFFECT_BASE_THRESHOLD:0,EFFECT_HUE_SHIFT:0,EFFECT_COLOR_RANGE:0,CHROMATIC_FRESNEL_SHARPNESS:0,CHROMATIC_FRESNEL_OPACITY:0,CHROMATIC_SHADOW_RANGE:0,CHROMATIC_SHADOW_OPACITY:0,SCROLL_EXTRUDE_NOISE_SIZE:0,SCROLL_EXTRUDE_SPEED:0,SCROLL_EXTRUDE_MASK:0,SCROLL_EXTRUDE_STRENGTH:0}});a.material=w,a.renderOrder=c,this.sections.push(a),this.scene.add(a)})}onConfigUpdated(){function e(t,s){return s.set(parseInt(t.substring(1,3),16)/255,parseInt(t.substring(3,5),16)/255,parseInt(t.substring(5,7),16)/255,parseInt(t.substring(7,9),16)/255)}function i(t,s=4){return Number(t.toFixed(s))}function n(t,s=4){const l=i(t,s);return Number.isInteger(l)?`${l}.`:l.toString()}function o(t,s=4){return`vec3(${n(t.r,s)}, ${n(t.g,s)}, ${n(t.b,s)})`}function a(t,s=4){return`vec4(${n(t.x,s)}, ${n(t.y,s)}, ${n(t.z,s)}, ${n(t.w,s)})`}function r(t,s=4){return`vec3(${n(t.x,s)}, ${n(t.y,s)}, ${n(t.z,s)})`}function c(t,s=4){return`vec2(${n(t.x,s)}, ${n(t.y,s)})`}function u(t,s=4){return`vec3(${n(t.r/255,s)}, ${n(t.g/255,s)}, ${n(t.b/255,s)})`}const p=new ne,g=new f,w=new Y;function F(t,s){if(typeof t=="number")return n(t,s);if(typeof t=="string"&&t.startsWith("#"))return t.length===9?a(e(t,p)):o(w.set(t));if(typeof t=="string"||typeof t=="boolean")return t;if("w"in t)return a(t);if("z"in t)return r(t);if("y"in t)return c(t);if("r"in t)return u(t);if("min"in t)return c(g.set(t.min,t.max))}function v(t,s,l,m=!1){if(!t.defines)return!1;const d=t.defines[s]!==l;return t.defines[s],s in t.defines&&d&&(t.defines[s]=l),d}function _(t,s,l){let m=!1;for(const d in s)if(Object.prototype.hasOwnProperty.call(s,d)){const E=s[d],b=F(E,4),y=v(t,d,b,void 0);m||(m=y)}t.needsUpdate=m}this.camera.position.z=this.config.camera.distance,this.camera.near=this.config.camera.near,this.camera.far=this.config.camera.far,this.camera.updateProjectionMatrix(),this.flowmap.setDissipation(this.config.flowmap.dissipation),this.flowmap.setFalloff(this.config.flowmap.falloff),this.flowmap.setAlpha(this.config.flowmap.alpha),this.uTextureStrength.value=this.config.extrude.textureStrength,this.uGradientStrength.value=this.config.extrude.gradientStrength,this.sections.forEach(t=>{_(t.material,{CHROMATIC_FRESNEL_SHARPNESS:this.config.chromaticMask.fresnelSharpness,CHROMATIC_FRESNEL_OPACITY:this.config.chromaticMask.fresnelOpacity,CHROMATIC_SHADOW_RANGE:this.config.chromaticMask.shadowRange,CHROMATIC_SHADOW_OPACITY:this.config.chromaticMask.shadowOpacity,SHOW_EFFECT_FLUID:this._effectParams.showEffectFluid,SHOW_EFFECT_COLORS:this._effectParams.showEffectColors,SHOW_EFFECT_LINES:this._effectParams.showEffectLines,EFFECT_AMPLITUDE:this.config.fluidEffect.amplitude,EFFECT_SHADOW_STRENGTH:this.config.fluidEffect.shadowStrength,EFFECT_FLUID_MAGNITUDE:this.config.fluidEffect.fluidMagnitude,EFFECT_FLUID_RED_COEF:this.config.fluidEffect.fluidRedCoef,EFFECT_FLUID_GREEN_COEF:this.config.fluidEffect.fluidGreenCoef,EFFECT_FLUID_BLUE_COEF:this.config.fluidEffect.fluidBlueCoef,EFFECT_LINES_SPEED:this.config.fluidEffect.linesSpeed,EFFECT_LINES_SCALE:this.config.fluidEffect.linesScale,EFFECT_LINES_STRENGTH:this.config.fluidEffect.linesStrength,EFFECT_LINES_WAVE_LENGTH:this.config.fluidEffect.linesWaveLength,EFFECT_BASE_COLOR:this.config.fluidEffect.baseColor,EFFECT_BASE_THRESHOLD:this.config.fluidEffect.baseThreshold,EFFECT_HUE_SHIFT:this.config.fluidEffect.hueShift,EFFECT_COLOR_RANGE:this.config.fluidEffect.colorRange,SCROLL_EXTRUDE_NOISE_SIZE:this.config.scrollExtrude.noiseSize,SCROLL_EXTRUDE_SPEED:this.config.scrollExtrude.speed,SCROLL_EXTRUDE_MASK:this.config.scrollExtrude.mask,SCROLL_EXTRUDE_STRENGTH:this.config.scrollExtrude.strength})})}loopRandomMouseMovement(){var e;(e=this.randomMouseMovementTimeline)==null||e.kill(),this.randomMouseMovementTimeline=this.triggerRandomMouseMovement(),this.randomMouseMovementTimeline.call(()=>{this.loopRandomMouseMovement()},null,"+="+C(1,3,Math.random()).toFixed(2))}triggerRandomMouseMovement(){this.flowmap.velocity2.x=1,this.flowmap.velocity2.y=1;const e=Math.floor(Math.random()*3)+1;let i=null;const n=Se.timeline();for(let o=0;o<e;o++){const a=o!==e-1&&Math.random()<.7,r=a?C(.8,1,Math.random()):C(.7,.8,Math.random()),c=this.createRandomDirections(i),u={duration:r,ease:`rough({
					strength: ${a?3:2},
					points: ${Math.floor(r*12)},
					template: ${a?"power2.out":"none"},
					taper: none,
					randomize: true,
					clamp: true
				})`};n.fromTo(this.flowmap.mouse2,{x:c.start.x/2+.5},{x:c.end.x/2+.5,...u}),n.fromTo(this.flowmap.mouse2,{y:c.start.y/2+.5},{y:c.end.y/2+.5,...u}),i=c.end}return n.set(this.flowmap.mouse2,{x:-1,y:-1}),n}createRandomDirections(e=null){const i=e||new f((Math.random()-.5)*2,(Math.random()-.5)*2),n=i.angleTo(new f)+(Math.random()-.5)*2*Math.PI*.8,o=C(.7,.9,Math.random()),a=new f(Math.cos(n)*o,Math.sin(n)*o);return{start:i,end:a}}onWindowResize({innerWidth:e,innerHeight:i,renderWidth:n,renderHeight:o}){const a=e/i,r=window.devicePixelRatio;this.uScreen.value.set(e*r,i*r),this.uResolution.value.set(e*r,i*r),this.uDPR.value=r,this.uAspect.value=a,this.flowmap.aspect=a,this.viewport=mt(this.camera),this.camera.aspect=a;const c=V*(I-.1)/this.uAspect.value,u=this.config.camera.distance,p=2*Math.atan(c/(2*u))*(180/Math.PI);this.camera.fov=Math.min(this.config.camera.fov,p),this.camera.zoom=C(this.config.camera.slowModeZoom,this.config.camera.fastModeZoom,this.uFastScroll.value)*this._state.cameraZoom,this.camera.updateProjectionMatrix(),this.renderTarget.setSize(e,i),this.mouse.resize(e,i)}update(e,i){if(this.isPaused)return;this.uTime.value+=e,this.scene.position.y=this.uScroll.value*-I,this.uScreenScroll.value=this.scene.position.y*this.config.camera.fastModeZoom/this.viewport.height,this.sections.forEach((r,c)=>{const u=this.sections.length/this.sectionsPerLine*I,p=u*.5,g=r.position.y+this.scene.position.y;g<-p&&(r.position.y+=u),g>p&&(r.position.y-=u)}),this.scrollDelta=this.uScreenScroll.value-this.scrollLast,this.scrollDelta=Math.min(.2,Math.abs(this.scrollDelta))*Math.sign(this.scrollDelta),this.scrollLast=this.uScreenScroll.value,this.flowmap.mouse.lerp(this.mouse.normalFlip,this.config.flowmap.mouseEase),this.flowmap.velocity.lerp(this.mouse.velocity,this.mouse.velocity.length()?.1:.04),this.flowmap.update(-this.scrollDelta),this.uScrollSpeed.value+=(this.scrollDelta*5-this.uScrollSpeed.value)*.04;const n=V*(I-.1)/this.uAspect.value,o=this.config.camera.distance,a=2*Math.atan(n/(2*o))*(180/Math.PI);this.camera.fov=Math.min(this.config.camera.fov,a),this.camera.zoom=C(this.config.camera.slowModeZoom,this.config.camera.fastModeZoom,this.uFastScroll.value)*this._state.cameraZoom,this.camera.updateProjectionMatrix(),this.sceneUpdate()}sceneUpdate(){this.renderer.autoClear=!0,this.renderer.setClearColor(16777215,0),this.renderer.setRenderTarget(this.renderTarget),this.renderer.render(this.scene,this.camera),this.renderer.autoClear=!0,this.renderer.setRenderTarget(null),this.tDepth.value=this.renderTarget.depthTexture,this.tRelief.value=this.renderTarget.texture}}function M(h){return new URL(Object.assign({"../assets/3dl/day.3DL":Re,"../assets/3dl/lut.3dl":De,"../assets/3dl/night.3DL":Me,"../assets/glb/bg_low_draco.glb":Oe,"../assets/glb/fish.glb":Ae,"../assets/glb/footer_compressed.glb":Ne,"../assets/glb/reliefs_high_compressed.glb":ke,"../assets/img/Helvetica-neue.png":Ie,"../assets/img/PSTimes-Regular.png":Ue,"../assets/img/TimesNow.png":Pe,"../assets/img/black-dust.webp":He,"../assets/img/dust-particle.jpg":ze,"../assets/img/marble-texture.webp":Ge,"../assets/img/mask-noise.png":Be,"../assets/img/matcap-6.png":We,"../assets/img/matcap2.png":je,"../assets/img/matcapSteel.jpg":qe,"../assets/img/plaster.jpg":Ve,"../assets/img/rgb-attenuation-0,9.png":$e,"../assets/img/rgb-attenuation-1,2.png":Xe,"../assets/img/rgb-fractal.png":Ye,"../assets/img/rgb-noise.jpg":Ze,"../assets/img/roughness.jpg":Ke,"../assets/img/sparkle-noise.png":Je,"../assets/ktx/normal_05.ktx2":Qe,"../assets/ktx/normal_06.ktx2":et,"../assets/ktx/rocks_normal.ktx2":tt})[`../assets/${h}`],import.meta.url).href}class pt{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.renderer=new ae({powerPreference:"high-performance",antialias:!0,alpha:!0,premultipliedAlpha:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.renderer.toneMapping=ie,this.target.appendChild(this.renderer.domElement),this.scene=new $,this.scene.background=new Y(16250871),this.camera=new re(75,this.aspect,.01,1e4),this.camera.position.copy(new L(0,0,10)),this.camera.lookAt(new L(0,0,0)),this.camera.updateProjectionMatrix(),this.scene.add(this.camera),this.controls=new le(this.camera,this.renderer.domElement),this.controls.target.set(0,0,0),this.controls.update(),this.controls.enablePan=!0,this.controls.enableDamping=!0,this.clock=new ce,this.dateTime=performance.now(),this.assetsInit()}async assetsInit(){this.manager=new he,this.ktx2Loader=new ue(this.manager).setTranscoderPath("/basis/").detectSupport(this.renderer),this.textureLoader=new fe(this.manager),this.dracoLoader=new me().setDecoderPath("/draco/gltf/"),this.glbLoader=new de(this.manager),this.glbLoader.setDRACOLoader(this.dracoLoader),this.maskNoise=this.textureLoader.load(M("img/mask-noise.png")),this.plasterTexture=this.textureLoader.load(M("img/plaster.jpg")),this.glbLoader.load(M("glb/reliefs_high_compressed.glb"),e=>this.reliefsModel=e.scene),this.attenuation=this.textureLoader.load(M("img/rgb-attenuation-0,9.png")),this.maskNoise2=this.textureLoader.load(M("img/rgb-noise.jpg")),this.manager.onLoad=()=>{this.callback(),this.basRelief=new dt(this),this.animation(),this.resize()}}bufferToGeometry(e){const n=new Uint32Array(e,0,1)[0],o=JSON.parse(String.fromCharCode.apply(null,new Uint8Array(e,4,n))),a=new U,r=o.vertexCount,c=o.indexCount;let u=4+n;const p={};let g=!1;for(let F=0;F<o.attributes.length;F++){const v=o.attributes[F],_=v.id,t=_==="indices"?c:r,s=v.componentSize,l=window[v.storageType],m=new l(e,u,t*s),d=l.BYTES_PER_ELEMENT;let E;if(v.needsPack){E=new Float32Array(t*s);const b=v.packedComponents,y=b.length,A=v.storageType.includes("Int"),S=1<<d*8,T=A?S/2:0,N=1/S;for(let R=0,D=0;R<t;R++)for(let P=0;P<y;P++){const{delta:Z,from:K}=b[P];E[D]=(m[D]+T)*N*Z+K,D++}}else p[_]=u,E=m;_==="indices"?a.setIndex(new x(E,1)):(a.setAttribute(_,new x(E,s)),_==="normal"&&(g=!0)),u+=t*s*d}const w=[];if(o.sceneData){const F=new B,v=o.meshType,_=v==="Mesh"?3:v==="LineSegments"?2:1;for(let t=0;t<o.sceneData.length;t++){const s=o.sceneData[t];let l;if(s.vertexCount>0){const m=new U,d=a.index,E=d.array,b=E.constructor,y=b.BYTES_PER_ELEMENT;m.setIndex(new x(new b(E.buffer,s.faceIndex*d.itemSize*y*_+(p.indices||0),s.faceCount*d.itemSize*_),d.itemSize));const A=m.index.array;for(let S=0;S<A.length;S++)A[S]-=s.vertexIndex;for(const S in a.attributes){const T=a.attributes[S],N=T.array,R=N.constructor,D=R.BYTES_PER_ELEMENT;m.setAttribute(S,new x(new R(N.buffer,s.vertexIndex*T.itemSize*D+(p[S]||0),s.vertexCount*T.itemSize),T.itemSize))}switch(v){case"Mesh":l=new O(m,new Ee({flatShading:!g}));break;case"LineSegments":l=new ge(m,new _e);break;default:l=new pe(m,new ve({sizeAttenuation:!1,size:2}))}w.push(l)}else l=new B;s.parentIndex>-1?w[s.parentIndex].add(l):F.add(l),l.position.fromArray(s.position),l.quaternion.fromArray(s.quaternion),l.scale.fromArray(s.scale),l.name=s.name,l.userData.material=s.material,w[t]=l}a.userData.meshList=w,a.userData.sceneObject=F}return a}animation(){this.renderer.setAnimationLoop(()=>this.animation()),this.controls.update(),this.basRelief.update(this.clock.getDelta(),this.clock.getElapsedTime()),this.renderer.render(this.scene,this.camera)}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height)})}destroy(){this.scene.traverse(e=>{var i;e instanceof O&&((i=e.geometry)==null||i.dispose(),Object.values(e.material).forEach(n=>{n&&typeof n.dispose=="function"&&n.dispose()}))}),this.renderer.dispose()}}const vt={class:"plaster"},gt={class:"load"},_t={__name:"index",setup(h){const e=W(!1);W(0);let i=null;const n=()=>{e.value=!0};return we(()=>{i=new pt({parent:document.querySelector(".plaster"),target:document.querySelector(".canvas"),callback:n})}),Fe(()=>{i.destroy(),i=null,console.info("%c霓虹灯-销毁😁","color:#fff;background-color:red")}),(o,a)=>(j(),q("div",vt,[k("div",{class:Le(["loading",{loadOk:e.value}])},[k("div",gt,[(j(),q(xe,null,be("LOADING...",(r,c)=>k("span",{key:c,style:Te("--i:"+c)},Ce(r),5)),64))])],2),a[0]||(a[0]=k("div",{class:"canvas"},null,-1))]))}},Ft=ye(_t,[["__scopeId","data-v-2e627985"]]);export{Ft as default};
