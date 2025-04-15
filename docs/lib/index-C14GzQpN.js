const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["../js/index-CAHsJx4-.js","../js/threejs-X_Qec1pD.js","../js/vendor-DXKZwkeo.js","../css/index-Bl6ipH4k.css","../js/index-pogUuLpn.js","../css/index-C05-o8ct.css","../js/index-CVS9JMhV.js","../css/index-Ch-InTHb.css","../js/index-B2hE1P5H.js","../css/index-DgWBcHb_.css","../js/index-dquu4niJ.js","../css/index-XIkNw_2V.css","../js/index-B-gDKs8n.js","../css/index-CJdAcRxi.css","../js/index-D55f2h14.js","../css/index-CalSGsvb.css","../js/index-jvtZaVW7.js","../css/index-BJ12sJ_a.css","../js/index-DUEqPxk3.js","../css/index-DLr19ePF.css","../js/index-BBeI3tgI.js","../css/index-D-bT-swi.css","../js/index-IXefkxps.js","../css/index-CN6MICyQ.css","../js/index-B18Ly5Hp.js","../css/index-BtZl3eGo.css","../js/index-8HAievkT.js","../css/index-BQMKi0uO.css","../js/index-BWagsfS8.js","../css/index-C6iMrlRV.css","../js/index-BX1YP_Sr.js","../css/index-yGQefXFg.css","../js/index-Ggkp6R9U.js","../css/index-DDIhedHU.css","../js/index-NL8buhBQ.js","../css/index-C_5UfyWM.css","../js/index-BePO7l49.js","../css/index-C4AxXMzj.css","../js/index-nAh8__9_.js","../css/index-CRXqHAWo.css","../js/index-BrRPBUze.js","../css/index-Cs8SGN1B.css","../js/layout-B8Eqwa4K.js","../css/layout-D8OUFrav.css"])))=>i.map(i=>d[i]);
import{g as z,h as E,i as d,f as _,Z as R,u as f,_ as L,$ as C,a0 as D,a1 as P,a2 as A}from"../js/vendor-DXKZwkeo.js";import"../js/threejs-X_Qec1pD.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))c(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const m of i.addedNodes)m.tagName==="LINK"&&m.rel==="modulepreload"&&c(m)}).observe(document,{childList:!0,subtree:!0});function r(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function c(t){if(t.ep)return;t.ep=!0;const i=r(t);fetch(t.href,i)}})();const I={__name:"App",setup(n){const e=z();return(r,c)=>{const t=E("router-view");return d(),_(t,null,{default:R(({Component:i})=>[f(e).meta.keepAlive?(d(),_(L(i),{key:f(e).name})):C("",!0)]),_:1})}}},O="modulepreload",T=function(n,e){return new URL(n,e).href},y={},o=function(e,r,c){let t=Promise.resolve();if(r&&r.length>0){const m=document.getElementsByTagName("link"),a=document.querySelector("meta[property=csp-nonce]"),u=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));t=Promise.allSettled(r.map(s=>{if(s=T(s,c),s in y)return;y[s]=!0;const v=s.endsWith(".css"),w=v?'[rel="stylesheet"]':"";if(!!c)for(let x=m.length-1;x>=0;x--){const l=m[x];if(l.href===s&&(!v||l.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${s}"]${w}`))return;const p=document.createElement("link");if(p.rel=v?"stylesheet":O,v||(p.as="script"),p.crossOrigin="",p.href=s,u&&p.setAttribute("nonce",u),document.head.appendChild(p),v)return new Promise((x,l)=>{p.addEventListener("load",x),p.addEventListener("error",()=>l(new Error(`Unable to preload CSS for ${s}`)))})}))}function i(m){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=m,window.dispatchEvent(a),!a.defaultPrevented)throw m}return t.then(m=>{for(const a of m||[])a.status==="rejected"&&i(a.reason);return e().catch(i)})},M=""+new URL("../png/小米SU7-3jRbxA2D.png",import.meta.url).href,V=""+new URL("../png/消散特效-seDKkSHN.png",import.meta.url).href,b=""+new URL("../png/流体效果-BV44AnDM.png",import.meta.url).href,U=""+new URL("../png/能量护盾效果-HRpmJdeE.png",import.meta.url).href,N=""+new URL("../png/泳池-BZJE4vaE.png",import.meta.url).href,S=""+new URL("../png/太空探索-BcIdcbEU.png",import.meta.url).href,F=""+new URL("../png/火球-BEFsBhMp.png",import.meta.url).href,j=""+new URL("../png/霓虹灯特效-FsVP7qHv.png",import.meta.url).href,B=""+new URL("../png/极光和树-B-FkmEiN.png",import.meta.url).href,k=""+new URL("../png/扩散光环效果-Cw1XGbaT.png",import.meta.url).href,q=""+new URL("../png/头骨-5y14jdui.png",import.meta.url).href,Y=""+new URL("../png/金属方块-0ya2ewVu.png",import.meta.url).href,K=""+new URL("../png/岛屿-CN1mJnho.png",import.meta.url).href,Z=""+new URL("../png/海洋-Dg2MAcTb.png",import.meta.url).href,X=""+new URL("../png/油画-DKEW3sVh.png",import.meta.url).href,H=""+new URL("../png/涟漪-UoXD9Wre.png",import.meta.url).href,$=""+new URL("../png/浮雕-CzzLRMTO.png",import.meta.url).href,W=""+new URL("../png/宇航员-BB6pvbnY.png",import.meta.url).href,G=""+new URL("../png/开花-DRFAiIRl.png",import.meta.url).href,J=[{path:"su7",name:"小米SU7",meta:{img:M},component:()=>o(()=>import("../js/index-CAHsJx4-.js"),__vite__mapDeps([0,1,2,3]),import.meta.url)},{path:"dissipate",name:"消散特效",meta:{img:V},component:()=>o(()=>import("../js/index-pogUuLpn.js"),__vite__mapDeps([4,1,2,5]),import.meta.url)},{path:"fluid",name:"流体效果",meta:{img:b},component:()=>o(()=>import("../js/index-CVS9JMhV.js"),__vite__mapDeps([6,1,2,7]),import.meta.url)},{path:"shield",name:"能量护盾效果",meta:{img:U},component:()=>o(()=>import("../js/index-B2hE1P5H.js"),__vite__mapDeps([8,1,2,9]),import.meta.url)},{path:"water",name:"泳池🏊",meta:{img:N},component:()=>o(()=>import("../js/index-dquu4niJ.js"),__vite__mapDeps([10,1,2,11]),import.meta.url)},{path:"spaceDiscover",name:"太空探索🚀",meta:{img:S},component:()=>o(()=>import("../js/index-B-gDKs8n.js"),__vite__mapDeps([12,1,2,13]),import.meta.url)},{path:"fireBall",name:"火球🔥",meta:{img:F},component:()=>o(()=>import("../js/index-D55f2h14.js"),__vite__mapDeps([14,1,2,15]),import.meta.url)},{path:"neon",name:"霓虹灯特效💡",meta:{img:j},component:()=>o(()=>import("../js/index-jvtZaVW7.js"),__vite__mapDeps([16,1,2,17]),import.meta.url)},{path:"aurora",name:"极光和树🌲",meta:{img:B},component:()=>o(()=>import("../js/index-DUEqPxk3.js"),__vite__mapDeps([18,1,2,19]),import.meta.url)},{path:"ring",name:"扩散光环效果😇",meta:{img:k},component:()=>o(()=>import("../js/index-BBeI3tgI.js"),__vite__mapDeps([20,1,2,21]),import.meta.url)},{path:"skull",name:"头骨🦴",meta:{img:q},component:()=>o(()=>import("../js/index-IXefkxps.js"),__vite__mapDeps([22,1,2,23]),import.meta.url)},{path:"metalCube",name:"金属方块♦️",meta:{img:Y},component:()=>o(()=>import("../js/index-B18Ly5Hp.js"),__vite__mapDeps([24,1,2,25]),import.meta.url)},{path:"land",name:"岛屿🏝️",meta:{img:K},component:()=>o(()=>import("../js/index-8HAievkT.js"),__vite__mapDeps([26,1,2,27]),import.meta.url)},{path:"ocean",name:"海洋🌊",meta:{img:Z},component:()=>o(()=>import("../js/index-BWagsfS8.js"),__vite__mapDeps([28,1,2,29]),import.meta.url)},{path:"oil",name:"油画🖼️",meta:{img:X},component:()=>o(()=>import("../js/index-BX1YP_Sr.js"),__vite__mapDeps([30,1,2,31]),import.meta.url)},{path:"ripples",name:"涟漪",meta:{img:H},component:()=>o(()=>import("../js/index-Ggkp6R9U.js"),__vite__mapDeps([32,1,2,33]),import.meta.url)},{path:"plaster",name:"浮雕",meta:{img:$},component:()=>o(()=>import("../js/index-NL8buhBQ.js"),__vite__mapDeps([34,1,2,35]),import.meta.url)},{path:"hero",name:"宇航员",meta:{img:W},component:()=>o(()=>import("../js/index-BePO7l49.js"),__vite__mapDeps([36,1,2,37]),import.meta.url)},{path:"flower",name:"开花🌼",meta:{img:G},component:()=>o(()=>import("../js/index-nAh8__9_.js"),__vite__mapDeps([38,1,2,39]),import.meta.url)}],Q=D({history:P(),routes:[{path:"/",redirect:"/index"},{path:"/index",name:"Home",meta:{keepAlive:!0},component:()=>o(()=>import("../js/index-BrRPBUze.js"),__vite__mapDeps([40,2,1,41]),import.meta.url)},{path:"/layout",name:"Layout",meta:{keepAlive:!0},component:()=>o(()=>import("../js/layout-B8Eqwa4K.js"),__vite__mapDeps([42,2,1,43]),import.meta.url),children:J}]}),h=A(I);h.use(Q);h.mount("#app");const xn=(n,e)=>{const r=n.__vccOpts||n;for(const[c,t]of e)r[c]=t;return r},g=(n,e,r)=>Math.min(Math.max(n,e),r),nn=n=>n/Math.PI*180,en=(n,e,r)=>n*(1-r)+e*r,tn=n=>n*Math.PI/180,on=(n,e)=>Math.random()*(e-n)+n,rn=(n,e)=>Math.floor(Math.random()*(e-n+1))+n,an=(n,e,r)=>{if(n>=e)return 0;const c=g((r-n)/(e-n),0,1);return c*c*(3-2*c)},cn=(n,e,r)=>[Math.sin(n)*Math.cos(e)*r,Math.cos(n)*r,Math.sin(n)*Math.sin(e)*r],mn=(n,e)=>e>=n?1:0,ln={clamp:g,degrees:nn,mix:en,radians:tn,randomArbitrary:on,randomInt:rn,smoothstep:an,spherical:cn,step:mn};var un=`varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 vColor;
varying mat4 invertMatrix;

uniform float time;
uniform float acceleration;

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
#ifndef FNC_GRAD4
#define FNC_GRAD4
vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    return p;
}
#endif

#ifndef FNC_SNOISE
#define FNC_SNOISE
float snoise(in vec2 v) {
    const vec4 C = vec4(0.211324865405187,  
                        0.366025403784439,  
                        -0.577350269189626,  
                        0.024390243902439); 
    
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    
    vec2 i1;
    
    
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    
    
    
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    
    i = mod289(i); 
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    
    

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    
    
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float snoise(in vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    
    
    
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;      

    
    i = mod289(i);
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float snoise(in vec4 v) {
    const vec4  C = vec4( 0.138196601125011,  
                        0.276393202250021,  
                        0.414589803375032,  
                        -0.447213595499958); 

    
    vec4 i  = floor(v + dot(v, vec4(.309016994374947451)) ); 
    vec4 x0 = v -   i + dot(i, C.xxxx);

    

    
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    
    
    
    
    
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;

    
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    
    
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}

vec2 snoise2( vec2 x ){
    float s  = snoise(vec2( x ));
    float s1 = snoise(vec2( x.y - 19.1, x.x + 47.2 ));
    return vec2( s , s1 );
}

vec3 snoise3( vec3 x ){
    float s  = snoise(vec3( x ));
    float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
    float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
    return vec3( s , s1 , s2 );
}

vec3 snoise3( vec4 x ){
    float s  = snoise(vec4( x ));
    float s1 = snoise(vec4( x.y - 19.1 , x.z + 33.4 , x.x + 47.2, x.w ));
    float s2 = snoise(vec4( x.z + 74.2 , x.x - 124.5 , x.y + 99.4, x.w ));
    return vec3( s , s1 , s2 );
}

#endif
vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 rotate(vec3 p, float radian_x, float radian_y, float radian_z) {
    mat3 mx = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(radian_x), -sin(radian_x),
    0.0, sin(radian_x), cos(radian_x)
    );
    mat3 my = mat3(
    cos(radian_y), 0.0, sin(radian_y),
    0.0, 1.0, 0.0,
    -sin(radian_y), 0.0, cos(radian_y)
    );
    mat3 mz = mat3(
    cos(radian_z), -sin(radian_z), 0.0,
    sin(radian_z), cos(radian_z), 0.0,
    0.0, 0.0, 1.0
    );
    return mx * my * mz * p;
}
vec3 getRotate(vec3 p) {
    return rotate(p, radians(time / 6.0), radians(time / 7.0), radians(time / 8.0));
}
void main() {
    float updateTime = time / 400.0;
    vec3 p_rotate = getRotate(position);
    float noise = snoise(vec3(p_rotate / 12.1 + updateTime * 0.5));
    vec3 p_noise = p_rotate + p_rotate * noise / 20.0 * (min(acceleration, 6.0) + 1.0);
    vPosition = p_noise;
    vColor = hsv2rgb(vec3(updateTime + position.y / 400.0, 0.05 + min(acceleration / 10.0, 0.25), 1.0));
    invertMatrix = inverse(modelMatrix);
    vNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p_noise, 1.0);
}`,dn=`uniform float time;
uniform float acceleration;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vColor;
varying mat4 invertMatrix;

void main() {
    vec3 normal = vNormal;
    vec3 inv_light = normalize(invertMatrix * vec4(0.7, -0.7, 0.7, 1.0)).xyz;
    float diff = (dot(normal, inv_light) + 1.0) / 4.0 + 0.4;
    gl_FragColor = vec4(vColor * diff, 1.0);
}`;export{ln as M,xn as _,J as e,dn as f,un as v};
