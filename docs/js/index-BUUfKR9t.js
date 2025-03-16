import{V as c,e as g,ap as y,aq as P,J as _,W as u,s as w,h as p,p as S,M as l,K as b,ai as T,v as M,x as F,a7 as N,a2 as C,a3 as R,L as f}from"./threejs-DBMWHTjA.js";import{v as D,L as A,l as h,b as E,m as I,i as d,c as x,d as s,F as L,n as B,p as q,e as U,q as O}from"./vendor-jP0BXN2k.js";import{_ as W}from"../lib/index-ChcEMU0S.js";const X=""+new URL("../png/flow-cc4lJDvv.png",import.meta.url).href,Y=""+new URL("../jpg/oil-BsEP9Bb3.jpg",import.meta.url).href;function H(i,e,n){return i*(1-n)+e*n}function a(i,e,n){return H(i,e,1-Math.exp(-n))}function k(i,e,n){return Math.min(Math.max(i,e),n)}function G(i,e,n){return(i-e)/(n-e)}var j=`varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
}`,V=`#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 uMousePosition;
uniform float uRadius;
uniform float uStrength;
uniform float uLength;
uniform float uAspect;
uniform sampler2D bufferTrail;

varying vec2 vUv;

vec2 correctAspect(vec2 uv) {
    uv.x *= uAspect;

    return uv;
}

void main() {
    vec3 color = texture2D(bufferTrail, vUv).rgb;
    vec2 uv = vUv;

    float mouse = distance(correctAspect(uMousePosition), correctAspect(uv));

    mouse = max(uRadius - mouse, 0.0);
    mouse *= uStrength;

    color -= uLength;
    color += mouse;

    color = clamp(color, vec3(0.0), vec3(1.0));

    gl_FragColor = vec4(color, 1.0);
}`;class Q{constructor(e){this.base=e,this.renderer=this.base.renderer,this.width=this.base.planeWidth,this.height=this.base.planeHeight,this.isTouchCapable="ontouchstart"in window,this.isAvailable=this.isAvailable(),this.maxRadius=19,this.radiusScale=1.2,this.mouse=new c(.5,.5),this.smoothedMouse=new c(.5,.5),this.mouseSmoothRatio=.25,this.scene=new g,this.bufferScene=new g,this.camera=new y(this.width/-2,this.width/2,this.height/2,this.height/-2,-1e4,1e4),this.camera.position.z=100;const n=this.renderer.getContext().getExtension("OES_texture_float")?P:_,t={format:b,type:n};this.renderTargetA=new u(this.width,this.height,t),this.renderTargetB=new u(this.width,this.height,t),this.scene.add(this.createQuad()),this.bindEvents(),this.initGUI()}initGUI(){this.settings={strength:this.bufferMaterial.uniforms.uStrength.value,length:this.bufferMaterial.uniforms.uLength.value};const e=()=>{this.bufferMaterial.uniforms.uStrength.value=this.settings.strength,this.bufferMaterial.uniforms.uLength.value=this.settings.length},n=this.base.gui.addFolder("Trail");n.add(this,"radiusScale",.5,2).onChange(e).name("radius").step(.01),n.add(this.settings,"strength",.1,2).onChange(e),n.add(this.settings,"length",.001,.1).onChange(e),n.close(),e()}createQuad(){const e=new w(this.width,this.height);this.bufferMaterial=new p({uniforms:{uMousePosition:{value:this.smoothedMouse},bufferTrail:{value:this.renderTargetA.texture},uRadius:{value:.1},uStrength:{value:1.6},uLength:{value:.02},uAspect:{value:this.width/this.height}},vertexShader:j,fragmentShader:V}),this.renderMaterial=new S({map:this.renderTargetB.texture});const n=new l(e,this.bufferMaterial);return this.bufferScene.add(n),new l(e,this.renderMaterial)}render(){this.renderer.setRenderTarget(this.renderTargetB),this.renderer.clear(),this.renderer.render(this.bufferScene,this.camera),[this.renderTargetA,this.renderTargetB]=[this.renderTargetB,this.renderTargetA],this.renderMaterial.map=this.renderTargetB.texture,this.bufferMaterial.uniforms.bufferTrail.value=this.renderTargetA.texture}update(){this.render(),this.updateMouse(),this.bufferMaterial.uniforms.uLength.value=this.settings.length}updateMouse(){this.smoothedMouse.set(a(this.smoothedMouse.x,this.mouse.x,this.mouseSmoothRatio),a(this.smoothedMouse.y,this.mouse.y,this.mouseSmoothRatio));const e=k(this.mouse.distanceTo(this.smoothedMouse),0,1)*100,n=G(e,0,this.maxRadius),t=D.parseEase("circ.out")(n);this.bufferMaterial.uniforms.uRadius.value=a(0,.25,t)*this.radiusScale,this.bufferMaterial.uniforms.uStrength.value=this.getStrength(t)}getStrength(e){const n=this.settings.strength,t=n-.4;return a(t,n,e)}bindEvents(){this.isTouchCapable?(window.addEventListener("touchstart",e=>this.onMouseMove(e),!1),window.addEventListener("touchmove",e=>this.onMouseMove(e),!1)):window.addEventListener("mousemove",e=>this.onMouseMove(e),!1)}isAvailable(){const e=this.renderer.getContext();return!(!e.getExtension("OES_texture_float")||e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)===0)}onMouseMove(e){let n,t;e.changedTouches&&e.changedTouches.length&&(n=e.changedTouches[0].clientX,t=e.changedTouches[0].clientY),n===void 0&&(n=e.clientX,t=e.clientY);const r=n-(window.innerWidth-this.width)*.5,o=t-(window.innerHeight-this.height)*.5;this.mouse.x=r/this.width,this.mouse.y=-(o/this.height)+1}}var $=`varying vec2 vUv;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

    gl_Position = projectionMatrix * mvPosition;
}`,J=`#ifdef GL_ES
precision highp float;
#endif

#ifndef FNC_MOD289
#define FNC_MOD289

float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

#endif
#ifndef FNC_MOD289
#define FNC_MOD289

float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

#endif

#ifndef FNC_PERMUTE
#define FNC_PERMUTE

float permute(const in float v) { return mod289(((v * 34.0) + 1.0) * v); }
vec2 permute(const in vec2 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec3 permute(const in vec3 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec4 permute(const in vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }

#endif
#ifndef FNC_TAYLORINVSQRT
#define FNC_TAYLORINVSQRT
float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
#endif
#ifndef FNC_QUINTIC
#define FNC_QUINTIC 

float quintic(const in float v) { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec2  quintic(const in vec2 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec3  quintic(const in vec3 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }
vec4  quintic(const in vec4 v)  { return v*v*v*(v*(v*6.0-15.0)+10.0); }

#endif

#ifndef FNC_CNOISE
#define FNC_CNOISE

float cnoise(in vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod289(Pi); 
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;

    vec4 i = permute(permute(ix) + iy);

    vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
    vec4 gy = abs(gx) - 0.5 ;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;

    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);

    vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;

    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));

    vec2 fade_xy = quintic(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

float cnoise(in vec3 P) {
    vec3 Pi0 = floor(P); 
    vec3 Pi1 = Pi0 + vec3(1.0); 
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec3 Pf0 = fract(P); 
    vec3 Pf1 = Pf0 - vec3(1.0); 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 * (1.0 / 7.0);
    vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 * (1.0 / 7.0);
    vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = quintic(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
}

float cnoise(in vec4 P) {
    vec4 Pi0 = floor(P); 
    vec4 Pi1 = Pi0 + 1.0; 
    Pi0 = mod289(Pi0);
    Pi1 = mod289(Pi1);
    vec4 Pf0 = fract(P); 
    vec4 Pf1 = Pf0 - 1.0; 
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = vec4(Pi0.zzzz);
    vec4 iz1 = vec4(Pi1.zzzz);
    vec4 iw0 = vec4(Pi0.wwww);
    vec4 iw1 = vec4(Pi1.wwww);

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);
    vec4 ixy00 = permute(ixy0 + iw0);
    vec4 ixy01 = permute(ixy0 + iw1);
    vec4 ixy10 = permute(ixy1 + iw0);
    vec4 ixy11 = permute(ixy1 + iw1);

    vec4 gx00 = ixy00 * (1.0 / 7.0);
    vec4 gy00 = floor(gx00) * (1.0 / 7.0);
    vec4 gz00 = floor(gy00) * (1.0 / 6.0);
    gx00 = fract(gx00) - 0.5;
    gy00 = fract(gy00) - 0.5;
    gz00 = fract(gz00) - 0.5;
    vec4 gw00 = vec4(0.75) - abs(gx00) - abs(gy00) - abs(gz00);
    vec4 sw00 = step(gw00, vec4(0.0));
    gx00 -= sw00 * (step(0.0, gx00) - 0.5);
    gy00 -= sw00 * (step(0.0, gy00) - 0.5);

    vec4 gx01 = ixy01 * (1.0 / 7.0);
    vec4 gy01 = floor(gx01) * (1.0 / 7.0);
    vec4 gz01 = floor(gy01) * (1.0 / 6.0);
    gx01 = fract(gx01) - 0.5;
    gy01 = fract(gy01) - 0.5;
    gz01 = fract(gz01) - 0.5;
    vec4 gw01 = vec4(0.75) - abs(gx01) - abs(gy01) - abs(gz01);
    vec4 sw01 = step(gw01, vec4(0.0));
    gx01 -= sw01 * (step(0.0, gx01) - 0.5);
    gy01 -= sw01 * (step(0.0, gy01) - 0.5);

    vec4 gx10 = ixy10 * (1.0 / 7.0);
    vec4 gy10 = floor(gx10) * (1.0 / 7.0);
    vec4 gz10 = floor(gy10) * (1.0 / 6.0);
    gx10 = fract(gx10) - 0.5;
    gy10 = fract(gy10) - 0.5;
    gz10 = fract(gz10) - 0.5;
    vec4 gw10 = vec4(0.75) - abs(gx10) - abs(gy10) - abs(gz10);
    vec4 sw10 = step(gw10, vec4(0.0));
    gx10 -= sw10 * (step(0.0, gx10) - 0.5);
    gy10 -= sw10 * (step(0.0, gy10) - 0.5);

    vec4 gx11 = ixy11 * (1.0 / 7.0);
    vec4 gy11 = floor(gx11) * (1.0 / 7.0);
    vec4 gz11 = floor(gy11) * (1.0 / 6.0);
    gx11 = fract(gx11) - 0.5;
    gy11 = fract(gy11) - 0.5;
    gz11 = fract(gz11) - 0.5;
    vec4 gw11 = vec4(0.75) - abs(gx11) - abs(gy11) - abs(gz11);
    vec4 sw11 = step(gw11, vec4(0.0));
    gx11 -= sw11 * (step(0.0, gx11) - 0.5);
    gy11 -= sw11 * (step(0.0, gy11) - 0.5);

    vec4 g0000 = vec4(gx00.x,gy00.x,gz00.x,gw00.x);
    vec4 g1000 = vec4(gx00.y,gy00.y,gz00.y,gw00.y);
    vec4 g0100 = vec4(gx00.z,gy00.z,gz00.z,gw00.z);
    vec4 g1100 = vec4(gx00.w,gy00.w,gz00.w,gw00.w);
    vec4 g0010 = vec4(gx10.x,gy10.x,gz10.x,gw10.x);
    vec4 g1010 = vec4(gx10.y,gy10.y,gz10.y,gw10.y);
    vec4 g0110 = vec4(gx10.z,gy10.z,gz10.z,gw10.z);
    vec4 g1110 = vec4(gx10.w,gy10.w,gz10.w,gw10.w);
    vec4 g0001 = vec4(gx01.x,gy01.x,gz01.x,gw01.x);
    vec4 g1001 = vec4(gx01.y,gy01.y,gz01.y,gw01.y);
    vec4 g0101 = vec4(gx01.z,gy01.z,gz01.z,gw01.z);
    vec4 g1101 = vec4(gx01.w,gy01.w,gz01.w,gw01.w);
    vec4 g0011 = vec4(gx11.x,gy11.x,gz11.x,gw11.x);
    vec4 g1011 = vec4(gx11.y,gy11.y,gz11.y,gw11.y);
    vec4 g0111 = vec4(gx11.z,gy11.z,gz11.z,gw11.z);
    vec4 g1111 = vec4(gx11.w,gy11.w,gz11.w,gw11.w);

    vec4 norm00 = taylorInvSqrt(vec4(dot(g0000, g0000), dot(g0100, g0100), dot(g1000, g1000), dot(g1100, g1100)));
    g0000 *= norm00.x;
    g0100 *= norm00.y;
    g1000 *= norm00.z;
    g1100 *= norm00.w;

    vec4 norm01 = taylorInvSqrt(vec4(dot(g0001, g0001), dot(g0101, g0101), dot(g1001, g1001), dot(g1101, g1101)));
    g0001 *= norm01.x;
    g0101 *= norm01.y;
    g1001 *= norm01.z;
    g1101 *= norm01.w;

    vec4 norm10 = taylorInvSqrt(vec4(dot(g0010, g0010), dot(g0110, g0110), dot(g1010, g1010), dot(g1110, g1110)));
    g0010 *= norm10.x;
    g0110 *= norm10.y;
    g1010 *= norm10.z;
    g1110 *= norm10.w;

    vec4 norm11 = taylorInvSqrt(vec4(dot(g0011, g0011), dot(g0111, g0111), dot(g1011, g1011), dot(g1111, g1111)));
    g0011 *= norm11.x;
    g0111 *= norm11.y;
    g1011 *= norm11.z;
    g1111 *= norm11.w;

    float n0000 = dot(g0000, Pf0);
    float n1000 = dot(g1000, vec4(Pf1.x, Pf0.yzw));
    float n0100 = dot(g0100, vec4(Pf0.x, Pf1.y, Pf0.zw));
    float n1100 = dot(g1100, vec4(Pf1.xy, Pf0.zw));
    float n0010 = dot(g0010, vec4(Pf0.xy, Pf1.z, Pf0.w));
    float n1010 = dot(g1010, vec4(Pf1.x, Pf0.y, Pf1.z, Pf0.w));
    float n0110 = dot(g0110, vec4(Pf0.x, Pf1.yz, Pf0.w));
    float n1110 = dot(g1110, vec4(Pf1.xyz, Pf0.w));
    float n0001 = dot(g0001, vec4(Pf0.xyz, Pf1.w));
    float n1001 = dot(g1001, vec4(Pf1.x, Pf0.yz, Pf1.w));
    float n0101 = dot(g0101, vec4(Pf0.x, Pf1.y, Pf0.z, Pf1.w));
    float n1101 = dot(g1101, vec4(Pf1.xy, Pf0.z, Pf1.w));
    float n0011 = dot(g0011, vec4(Pf0.xy, Pf1.zw));
    float n1011 = dot(g1011, vec4(Pf1.x, Pf0.y, Pf1.zw));
    float n0111 = dot(g0111, vec4(Pf0.x, Pf1.yzw));
    float n1111 = dot(g1111, Pf1);

    vec4 fade_xyzw = quintic(Pf0);
    vec4 n_0w = mix(vec4(n0000, n1000, n0100, n1100), vec4(n0001, n1001, n0101, n1101), fade_xyzw.w);
    vec4 n_1w = mix(vec4(n0010, n1010, n0110, n1110), vec4(n0011, n1011, n0111, n1111), fade_xyzw.w);
    vec4 n_zw = mix(n_0w, n_1w, fade_xyzw.z);
    vec2 n_yzw = mix(n_zw.xy, n_zw.zw, fade_xyzw.y);
    float n_xyzw = mix(n_yzw.x, n_yzw.y, fade_xyzw.x);
    return 2.2 * n_xyzw;
}
#endif

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
}`;class K extends T{constructor(e){super(),this.base=e,this.width=this.base.planeWidth,this.height=this.base.planeHeight,this.uniforms={uFlowSpeed:{value:.085},uTime:{value:1},uTexture:{type:"t",value:this.base.oilTex},uTrailTexture:{type:"t",value:this.base.trail.renderTargetB.texture},uFlowMap:{type:"t",value:this.base.flowTex},uFlowOffset:{value:0},uFlowMapBlurRadius:{value:15},uNoiseSpeed:{value:.3},uNoiseScaleX:{value:3.3},uNoiseScaleY:{value:4.4},uNoiseAmplitude:{value:.05},uResolution:{value:new c(this.base.width,this.base.height)}},this.init()}init(){this.material=new p({uniforms:this.uniforms,vertexShader:$,fragmentShader:J});const e=new w(this.width,this.height);this.mesh=new l(e,this.material),this.add(this.mesh),this.initGUI()}initGUI(){const e={flowSpeed:this.material.uniforms.uFlowSpeed.value,flowBlurRadius:this.material.uniforms.uFlowMapBlurRadius.value,noiseSpeed:this.material.uniforms.uNoiseSpeed.value,noiseScaleX:this.material.uniforms.uNoiseScaleX.value,noiseScaleY:this.material.uniforms.uNoiseScaleY.value,noiseAmplitude:this.material.uniforms.uNoiseAmplitude.value},n=()=>{this.material.uniforms.uFlowSpeed.value=e.flowSpeed,this.material.uniforms.uFlowMapBlurRadius.value=e.flowBlurRadius,this.material.uniforms.uNoiseSpeed.value=e.noiseSpeed,this.material.uniforms.uNoiseScaleX.value=e.noiseScaleX,this.material.uniforms.uNoiseScaleY.value=e.noiseScaleY,this.material.uniforms.uNoiseAmplitude.value=e.noiseAmplitude},t=this.base.gui.addFolder("Oil"),r=t.addFolder("Flow");r.add(e,"flowSpeed",.001,.5).onChange(n),r.add(e,"flowBlurRadius",0,50).onChange(n);const o=t.addFolder("Noise");o.add(e,"noiseSpeed",0,3).step(.05).name("speed").onChange(n),o.add(e,"noiseScaleX",0,25).name("frequency X").onChange(n),o.add(e,"noiseScaleY",0,25).name("frequency Y").onChange(n),o.add(e,"noiseAmplitude",0,1).step(.01).name("amplitude").onChange(n)}update(e,n){this.material.uniforms.uTime.value=n*1.5}}function m(i){return new URL(Object.assign({"../assets/flow.png":X,"../assets/oil.jpg":Y})[`../assets/${i}`],import.meta.url).href}class Z{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.renderer=new M({powerPreference:"high-performance",antialias:!0,alpha:!1,failIfMajorPerformanceCaveat:!0,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(16777215),this.target.appendChild(this.renderer.domElement),this.scene=new g,this.clock=new F,this.gui=new N({container:this.parent}),this.gui.domElement.style.position="absolute",this.gui.domElement.style.right="0",this.gui.domElement.style.top="0",this.gui.domElement.style.zIndex="999",this.optionInit(),this.cameraInit(),this.assetsInit(),this.resize()}optionInit(){this.maxDeltaTime=1/30,this.time=0,this.lastTime=performance.now(),this.PLANE_ASPECT_RATIO=9/16,this.planeWidth=this.width,this.planeHeight=this.planeWidth*this.PLANE_ASPECT_RATIO,this.touchHandler=A(window,{target:window,filtered:!0,preventSimulated:!1})}cameraInit(){this.camera=new y(this.width/-2,this.width/2,this.height/2,this.height/-2,-1e4,1e4),this.camera.position.z=500}assetsInit(){this.manager=new C,this.textureLoad=new R(this.manager),this.oilTex=this.textureLoad.load(m("oil.jpg")),this.oilTex.minFilter=f,this.flowTex=this.textureLoad.load(m("flow.png")),this.flowTex.minFilter=f,this.manager.onLoad=()=>{this.callback(),this.trail=new Q(this),this.oil=new K(this),this.oil.position.y=(this.planeHeight-this.height)*.5,this.scene.add(this.oil),this.animation(),this.bindEvents()}}animation(){this.renderer.setAnimationLoop(()=>this.animation());const e=Date.now(),n=Math.min(this.maxDeltaTime,(e-this.lastTime)/1e3);this.time+=n,this.lastTime=e,this.trail.update(),this.scene.traverse(t=>{typeof t.update=="function"&&t.update(n,this.time)}),this.renderer.setRenderTarget(null),this.renderer.render(this.scene,this.camera)}bindEvents(){this.touchHandler.on("move",(e,n)=>{this.traverse("onMouseMove",e,n)})}traverse(e,...n){this.scene.traverse(t=>{typeof t[e]=="function"&&t[e].apply(t,n)})}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.planeWidth=this.width,this.planeHeight=this.planeWidth*this.PLANE_ASPECT_RATIO,this.camera.left=-this.width/2,this.camera.right=this.width/2,this.camera.top=this.height/2,this.camera.bottom=-this.height/2,this.camera.updateProjectionMatrix(),this.trail.bufferMaterial.uniforms.uAspect.value=this.planeWidth/this.planeHeight,this.oil.material.uniforms.uResolution.value=new c(this.width,this.height),this.traverse("onResize",{width:this.planeWidth,height:this.planeHeight}),this.renderer.setSize(this.width,this.height)})}destroy(){}}const ee={class:"oil"},ne={class:"load"},te={__name:"index",setup(i){const e=h(!1);h(0);let n=null;const t=()=>{e.value=!0};return E(()=>{n=new Z({parent:document.querySelector(".oil"),target:document.querySelector(".canvas"),callback:t})}),I(()=>{n.destroy(),n=null,console.info("%c油画-销毁😁","color:#fff;background-color:red")}),(r,o)=>(d(),x("div",ee,[s("div",{class:O(["loading",{loadOk:e.value}])},[s("div",ne,[(d(),x(L,null,B("LOADING...",(z,v)=>s("span",{key:v,style:q("--i:"+v)},U(z),5)),64))])],2),o[0]||(o[0]=s("div",{class:"canvas"},null,-1))]))}},se=W(te,[["__scopeId","data-v-1d76afbf"]]);export{se as default};
