var Ie=Object.defineProperty;var Re=(d,e,t)=>e in d?Ie(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t;var r=(d,e,t)=>Re(d,typeof e!="symbol"?e+"":e,t);import{H as ve,e as ne,C as Ae,k as W,l as C,M as w,j as J,o as Q,bb as Fe,bc as Me,y as De,W as Le,al as $,ak as k,L as j,U as me,N as ze,b5 as Ee,A as Ne,aq as we,bd as Oe,n as P,be as oe,bf as K,bg as M,V as S,T as Ue,a3 as ge,w as m,ai as Z,aj as Ge,as as Be,ah as D,ab as Te,aQ as He,aR as Ye,aS as je,aT as Ve,z as ae,ap as Qe,bh as We,aF as X,aG as H,h as O,s as fe,bi as de,bj as Ze,g as Ce,bk as ke,bl as Je,bm as Xe,bn as qe,bo as Ke,bp as $e,a2 as et,b8 as tt,v as it,P as rt,O as nt,x as ot,ag as at,an as st,r as lt,p as ut,K as ct,Q as ht,ax as dt,a1 as vt}from"./threejs-X_Qec1pD.js";import{T as ft,U as mt,X as ce,Y as gt,l as _e,b as _t,m as xt,i as xe,c as pe,d as ee,F as pt,n as bt,p as St,e as At,q as wt}from"./vendor-DXKZwkeo.js";import{_ as Tt}from"../lib/index-C14GzQpN.js";const Ct="data:application/octet-stream;base64,dAEAAHsidmVydGV4Q291bnQiOjgsImluZGV4Q291bnQiOjMwLCJhdHRyaWJ1dGVzIjpbeyJpZCI6InBvc2l0aW9uIiwibmVlZHNQYWNrIjp0cnVlLCJjb21wb25lbnRTaXplIjozLCJzdG9yYWdlVHlwZSI6IlVpbnQxNkFycmF5IiwicGFja2VkQ29tcG9uZW50cyI6W3siZnJvbSI6LTE4Ny4xNDExMTMsImRlbHRhIjo0NTQuMTkxODMzfSx7ImZyb20iOi0xLjAxODc4MzU3LCJkZWx0YSI6OTk5Ljk5OTk4NDU3fSx7ImZyb20iOi0yMDAsImRlbHRhIjoyNjUuMzk2NjU5OTAwMDAwMDN9XX0seyJpZCI6ImluZGljZXMiLCJuZWVkc1BhY2siOmZhbHNlLCJjb21wb25lbnRTaXplIjoxLCJzdG9yYWdlVHlwZSI6IlVpbnQ4QXJyYXkifV0sIm1lc2hUeXBlIjoiTWVzaCJ9IAAAAAAAAP//AAAAAAAAAAD/////AAD//wAA//////////////////8AAAAA//8AAAADAQIFAwMGAQADAQAEAgQABwMAAgYDBQUCBAMAAg==",Pt=""+new URL("../buf/camera_spline-CNvrAI6C.buf",import.meta.url).href,yt=""+new URL("../buf/edan-hxcw_eoe.buf",import.meta.url).href,It=""+new URL("../buf/ffi-CVfsxSqo.buf",import.meta.url).href,Rt="data:application/octet-stream;base64,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",Ft=""+new URL("../buf/line_capability-DfRH6ewq.buf",import.meta.url).href,Mt=""+new URL("../buf/line_office-BqDg7h85.buf",import.meta.url).href,Dt=""+new URL("../buf/lorenzo-De-Y8wQK.buf",import.meta.url).href,Lt=""+new URL("../buf/marcolp-DFDap1PE.buf",import.meta.url).href,zt=""+new URL("../buf/person-BDffNXwT.buf",import.meta.url).href,Et=""+new URL("../buf/person_idle-B6cUtJv3.buf",import.meta.url).href,Nt=""+new URL("../buf/rock_0-q6K_L2md.buf",import.meta.url).href,Ot="data:application/octet-stream;base64,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",Ut=""+new URL("../buf/rock_1-CNf9jvuk.buf",import.meta.url).href,Gt="data:application/octet-stream;base64,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",Bt=""+new URL("../buf/rock_2-BLJTWxCD.buf",import.meta.url).href,Ht="data:application/octet-stream;base64,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",Yt=""+new URL("../buf/rock_3-DCMGIqI2.buf",import.meta.url).href,jt="data:application/octet-stream;base64,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",Vt=""+new URL("../buf/rock_animation_0-BvSApY4e.buf",import.meta.url).href,Qt=""+new URL("../buf/rock_animation_1-BvrVgBY1.buf",import.meta.url).href,Wt=""+new URL("../buf/rock_animation_2-CbfqWDfG.buf",import.meta.url).href,Zt=""+new URL("../buf/rock_animation_3-iC3aHFej.buf",import.meta.url).href,kt=""+new URL("../buf/sophie-B-C7hUL_.buf",import.meta.url).href,Jt="data:application/octet-stream;base64,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",Xt="data:application/octet-stream;base64,7AEAAHsidmVydGV4Q291bnQiOjMzLCJpbmRleENvdW50IjoxNDQsImF0dHJpYnV0ZXMiOlt7ImlkIjoibm9ybWFsIiwibmVlZHNQYWNrIjp0cnVlLCJjb21wb25lbnRTaXplIjozLCJzdG9yYWdlVHlwZSI6IkludDE2QXJyYXkiLCJwYWNrZWRDb21wb25lbnRzIjpbeyJmcm9tIjotMSwiZGVsdGEiOjJ9LHsiZnJvbSI6LTEsImRlbHRhIjoyfSx7ImZyb20iOi0xLCJkZWx0YSI6MX1dfSx7ImlkIjoicG9zaXRpb24iLCJuZWVkc1BhY2siOnRydWUsImNvbXBvbmVudFNpemUiOjMsInN0b3JhZ2VUeXBlIjoiVWludDE2QXJyYXkiLCJwYWNrZWRDb21wb25lbnRzIjpbeyJmcm9tIjotMC41LCJkZWx0YSI6MX0seyJmcm9tIjotMC41LCJkZWx0YSI6MX0seyJmcm9tIjotMC41LCJkZWx0YSI6MC41fV19LHsiaWQiOiJpbmRpY2VzIiwibmVlZHNQYWNrIjpmYWxzZSwiY29tcG9uZW50U2l6ZSI6MSwic3RvcmFnZVR5cGUiOiJVaW50OEFycmF5In1dLCJtZXNoVHlwZSI6Ik1lc2gifSAgIAAAAAAAgEybAAD74QCAAAD/f/eiiSb74b+J+zD/f8u4NEf74X6lgVr/f3bZCF374QTPQHb+fwAAs2T74QAA/3//f4kmCF374fswQHb/fzRHNEf74YFagVr+fwhdiSb74UB2+zD/f7NkAAD74f9/AAD/fwhddtn74UB2BM//fzRHy7j74YFafqX/f4km96L74fswv4n/fwAATJv74QAAAID/f3bZ96L74QTPv4n+f8u4y7j74X6lfqX/f/eidtn74b+JBM//f/9//38AAEsb/3/6YQAA/3////Yiiab6Yb4J+7D//8o4NMf6YX0lgdr//3VZCN36YQNPQPb+//9/s+T6Yf9//////4mmCN36YfuwQPb//zTHNMf6YYHagdr+/wjdiab6YUD2+7D//7Pk/3/6Yf///3///wjddVn6YUD2A0///zTHyjj6YYHafSX//4mm9iL6Yfuwvgn///9/Sxv6Yf9/AAD//3VZ9iL6YQNPvgn+/8o4yjj6YX0lfSX///YidVn6Yb4JA0///wABAwMCBAADBQMEBgAFBwcGCAAHCQcICgAJCwsKDAALDQsMDgANDw8OEAAPEREQEgARExMSFAATFRUUFgAVFxUWGAAXGRcYGgAZGxsaHAAbHRscHgAdHx8eIAAfAQEgAh8gAR0eHxseHRkaGxcaGRUYFxMUFRESEw8QEQ0ODwsODQkKCwcKCQUGBwMGBQECAw==",qt="data:application/octet-stream;base64,6AEAAHsidmVydGV4Q291bnQiOjE3LCJpbmRleENvdW50Ijo0OCwiYXR0cmlidXRlcyI6W3siaWQiOiJub3JtYWwiLCJuZWVkc1BhY2siOnRydWUsImNvbXBvbmVudFNpemUiOjMsInN0b3JhZ2VUeXBlIjoiSW50MTZBcnJheSIsInBhY2tlZENvbXBvbmVudHMiOlt7ImZyb20iOi0xLCJkZWx0YSI6Mn0seyJmcm9tIjotMSwiZGVsdGEiOjJ9LHsiZnJvbSI6LTEsImRlbHRhIjoxfV19LHsiaWQiOiJwb3NpdGlvbiIsIm5lZWRzUGFjayI6dHJ1ZSwiY29tcG9uZW50U2l6ZSI6Mywic3RvcmFnZVR5cGUiOiJVaW50MTZBcnJheSIsInBhY2tlZENvbXBvbmVudHMiOlt7ImZyb20iOi0wLjUsImRlbHRhIjoxfSx7ImZyb20iOi0wLjUsImRlbHRhIjoxfSx7ImZyb20iOi0wLjUsImRlbHRhIjowLjV9XX0seyJpZCI6ImluZGljZXMiLCJuZWVkc1BhY2siOmZhbHNlLCJjb21wb25lbnRTaXplIjoxLCJzdG9yYWdlVHlwZSI6IlVpbnQ4QXJyYXkifV0sIm1lc2hUeXBlIjoiTWVzaCJ9AAAAAACAAIAAAP9/v4n7MP9/fqWBWv9/BM9Adv5/AAD/f/9/+zBAdv9/gVqBWv5/QHb7MP9//38AAP9/QHYEz/9/gVp+pf9/+zC/if9/AAAAgP9/BM+/if5/fqV+pf9/v4kEz/9//3//fwAAAAD/f///vgn7sP//fSWB2v//A09A9v7//3//////+7BA9v//gdqB2v7/QPb7sP//////f///QPYDT///gdp9Jf//+7C+Cf///38AAP//A0++Cf7/fSV9Jf//vgkDT///AAECAAIDAAMEAAQFAAUGAAYHAAcIAAgJAAkKAAoLAAsMAAwNAA0OAA4PAA8QABAB",Kt="data:application/octet-stream;base64,6AEAAHsidmVydGV4Q291bnQiOjksImluZGV4Q291bnQiOjI0LCJhdHRyaWJ1dGVzIjpbeyJpZCI6Im5vcm1hbCIsIm5lZWRzUGFjayI6dHJ1ZSwiY29tcG9uZW50U2l6ZSI6Mywic3RvcmFnZVR5cGUiOiJJbnQxNkFycmF5IiwicGFja2VkQ29tcG9uZW50cyI6W3siZnJvbSI6LTEsImRlbHRhIjoyfSx7ImZyb20iOi0xLCJkZWx0YSI6Mn0seyJmcm9tIjotMSwiZGVsdGEiOjF9XX0seyJpZCI6InBvc2l0aW9uIiwibmVlZHNQYWNrIjp0cnVlLCJjb21wb25lbnRTaXplIjozLCJzdG9yYWdlVHlwZSI6IlVpbnQxNkFycmF5IiwicGFja2VkQ29tcG9uZW50cyI6W3siZnJvbSI6LTAuNSwiZGVsdGEiOjF9LHsiZnJvbSI6LTAuNSwiZGVsdGEiOjF9LHsiZnJvbSI6LTAuNSwiZGVsdGEiOjAuNX1dfSx7ImlkIjoiaW5kaWNlcyIsIm5lZWRzUGFjayI6ZmFsc2UsImNvbXBvbmVudFNpemUiOjEsInN0b3JhZ2VUeXBlIjoiVWludDhBcnJheSJ9XSwibWVzaFR5cGUiOiJNZXNoIn0gAAAAAACAAIAAAP9/fqWBWv9/AAD/f/9/gVqBWv5//38AAP9/gVp+pf9/AAAAgP9/fqV+pf9//3//fwAAAAD/f///fSWB2v///3//////gdqB2v7/////f///gdp9Jf///38AAP//fSV9Jf//AAECAAIDAAMEAAQFAAUGAAYHAAcIAAgB",$t=""+new URL("../buf/sunny-BGwp3_VD.buf",import.meta.url).href,ei=""+new URL("../buf/terrain-hr0TKo8d.buf",import.meta.url).href,ti=""+new URL("../buf/terrain_lines-C5Y9IXJ_.buf",import.meta.url).href,ii=""+new URL("../png/LDR_RGB1_0-BHt__6eT.png",import.meta.url).href,ri="data:image/png;base64,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",ni=""+new URL("../png/flip_texture-Crkj0MgY.png",import.meta.url).href,oi=""+new URL("../png/fog-BKF5cgPz.png",import.meta.url).href,ai="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAANIAAAAGAQMAAACM+FI4AAAABlBMVEUAAAD///+l2Z/dAAAAfUlEQVR4XmPAB5R4jlt2KUxpN2hLlnmq6RXc8YzzSKJEugCDEAND8AQVRS6FGe2aXkETXDVdAlqUJTmE5ywUaFBkYAiaoGbopzSjVdOvmMdV84gyS6OFn3DLYgYGoFwwz3GFU4oiqRodQnOcBU8ptzznPCbIcUigRYgBHwAAAikhHcv6sPQAAAAASUVORK5CYII=",si="data:image/webp;base64,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",li=""+new URL("../webp/person-Di86XWJU.webp",import.meta.url).href,ui=""+new URL("../webp/person_light-C5OXjE4N.webp",import.meta.url).href,ci=""+new URL("../webp/rocks-kzDeMXYl.webp",import.meta.url).href,hi=""+new URL("../webp/terrain_shadow_light_height-DW7rOz-r.webp",import.meta.url).href;var be=`#define GLSLIFY 1
attribute vec2 position;
varying vec2 v_uv;
void main(){
    v_uv=position*0.5+0.5;
    gl_Position=vec4(position, 0.0, 1.0);
}`,he=`#define GLSLIFY 1
uniform sampler2D u_texture;
varying vec2 v_uv;
void main(){
    gl_FragColor=texture2D(u_texture, v_uv);
}`,di=`#define GLSLIFY 1
uniform vec4 u_color;
varying vec2 v_uv;
void main(){
    gl_FragColor=u_color;
}`,vi=`#define GLSLIFY 1
attribute vec3 position;
uniform vec2 u_delta;
varying vec2 v_uv[9];
void main(){
    vec2 uv=position.xy*0.5+0.5;
    v_uv[0]=uv;
    vec2 delta=u_delta;
    v_uv[1]=uv-delta;
    v_uv[2]=uv+delta;
    delta+=u_delta;
    v_uv[3]=uv-delta;
    v_uv[4]=uv+delta;
    delta+=u_delta;
    v_uv[5]=uv-delta;
    v_uv[6]=uv+delta;
    delta+=u_delta;
    v_uv[7]=uv-delta;
    v_uv[8]=uv+delta;
    gl_Position=vec4(position, 1.0);
}`,fi=`#define GLSLIFY 1
uniform sampler2D u_texture;
varying vec2 v_uv[9];
void main(){
    vec4 color=texture2D(u_texture, v_uv[0])*0.1633;
    color+=texture2D(u_texture, v_uv[1])*0.1531;
    color+=texture2D(u_texture, v_uv[2])*0.1531;
    color+=texture2D(u_texture, v_uv[3])*0.12245;
    color+=texture2D(u_texture, v_uv[4])*0.12245;
    color+=texture2D(u_texture, v_uv[5])*0.0918;
    color+=texture2D(u_texture, v_uv[6])*0.0918;
    color+=texture2D(u_texture, v_uv[7])*0.051;
    color+=texture2D(u_texture, v_uv[8])*0.051;
    gl_FragColor=color;
}`,mi=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec2 u_delta;
varying vec2 v_uv;
void main(){
    vec4 color=texture2D(u_texture, v_uv)*0.1633;
    vec2 delta=u_delta;
    color+=texture2D(u_texture, v_uv-delta)*0.1531;
    color+=texture2D(u_texture, v_uv+delta)*0.1531;
    delta+=u_delta;
    color+=texture2D(u_texture, v_uv-delta)*0.12245;
    color+=texture2D(u_texture, v_uv+delta)*0.12245;
    delta+=u_delta;
    color+=texture2D(u_texture, v_uv-delta)*0.0918;
    color+=texture2D(u_texture, v_uv+delta)*0.0918;
    delta+=u_delta;
    color+=texture2D(u_texture, v_uv-delta)*0.051;
    color+=texture2D(u_texture, v_uv+delta)*0.051;
    gl_FragColor=color;
}`,gi=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec4 u_channelMixerR;
uniform vec4 u_channelMixerG;
uniform vec4 u_channelMixerB;
uniform vec4 u_channelMixerA;
varying vec2 v_uv;
void main(){
    vec4 color=texture2D(u_texture, v_uv);
    gl_FragColor=vec4(dot(color, u_channelMixerR), dot(color, u_channelMixerG), dot(color, u_channelMixerB), dot(color, u_channelMixerA));
}`;function _i(d,e,t,i){return function(){d|=0,e|=0,t|=0,i|=0;var o=(d+e|0)+i|0;return i=i+1|0,d=e^e>>>9,e=t+(t<<3)|0,t=t<<21|t>>>11,t=t+o|0,(o>>>0)/4294967296}}class Pe{constructor(){r(this,"PI",Math.PI);r(this,"PI2",this.PI*2);r(this,"HALF_PI",this.PI*.5);r(this,"DEG2RAD",this.PI/180);r(this,"RAD2DEG",180/this.PI)}linearStep(e,t,i){return this.clamp((i-e)/(t-e),0,1)}step(e,t){return t<e?0:1}clamp(e,t,i){return e<t?t:e>i?i:e}mod(e,t){return e-t*Math.floor(e/t)}mix(e,t,i){return e+(t-e)*i}cMix(e,t,i){return e+(t-e)*this.clamp(i,0,1)}unMix(e,t,i){return(i-e)/(t-e)}cUnMix(e,t,i){return this.clamp((i-e)/(t-e),0,1)}saturate(e){return this.clamp(e,0,1)}fit(e,t,i,o,n,a){return e=this.cUnMix(t,i,e),a&&(e=a(e)),o+e*(n-o)}unClampedFit(e,t,i,o,n,a){return e=this.unMix(t,i,e),a&&(e=a(e)),o+e*(n-o)}lerp(e,t,i){return e*(1-i)+t*i}loop(e,t,i){return e-=t,i-=t,(e<0?(i-Math.abs(e)%i)%i:e%i)+t}normalize(e,t,i){return Math.max(0,Math.min(1,e-t/i-t))}smoothstep(e,t,i){return i=this.cUnMix(e,t,i),i*i*(3-i*2)}fract(e){return e-Math.floor(e)}hash(e){return this.fract(Math.sin(e)*43758.5453123)}hash2(e,t){return this.fract(Math.sin(e*12.9898+t*4.1414)*43758.5453)}sign(e){return e?e<0?-1:1:0}isPowerOfTwo(e){return(e&-e)===e}powerTwoCeilingBase(e){return Math.ceil(Math.log(e)/Math.log(2))}powerTwoCeiling(e){return this.isPowerOfTwo(e)?e:1<<this.powerTwoCeilingBase(e)}powerTwoFloorBase(e){return Math.floor(Math.log(e)/Math.log(2))}powerTwoFloor(e){return this.isPowerOfTwo(e)?e:1<<this.powerTwoFloorBase(e)}latLngBearing(e,t,i,o){let n=Math.sin(o-t)*Math.cos(i),a=Math.cos(e)*Math.sin(i)-Math.sin(e)*Math.cos(i)*Math.cos(o-t);return Math.atan2(n,a)}distanceTo(e,t){return Math.sqrt(e*e+t*t)}distanceSqrTo(e,t){return e*e+t*t}distanceTo3(e,t,i){return Math.sqrt(e*e+t*t+i*i)}distanceSqrTo3(e,t,i){return e*e+t*t+i*i}latLngDistance(e,t,i,o){let n=Math.sin((i-e)/2),a=Math.sin((o-t)/2),s=n*n+Math.cos(e)*Math.cos(i)*a*a;return 2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s))}cubicBezier(e,t,i,o,n){let a=(t-e)*3,s=(i-t)*3-a,l=o-e-a-s,u=n*n,v=u*n;return l*v+s*u+a*n+e}cubicBezierFn(e,t,i,o){let n=(t-e)*3,a=(i-t)*3-n,s=o-e-n-a;return l=>{let u=l*l,v=u*l;return s*v+a*u+n*l+e}}normalizeAngle(e){return e+=this.PI,e=e<0?this.PI2-Math.abs(e%this.PI2):e%this.PI2,e-=this.PI,e}closestAngleTo(e,t){return e+this.normalizeAngle(t-e)}randomRange(e,t){return e+Math.random()*(t-e)}randomRangeInt(e,t){return Math.floor(this.randomRange(e,t+1))}padZero(e,t){return e.toString().length>=t?e:(Math.pow(10,t)+Math.floor(e)).toString().substring(1)}lerpColor(e,t,i){const o=e>>16,n=e>>8&255,a=e&255,s=t>>16,l=t>>8&255,u=t&255,v=o+i*(s-o),c=n+i*(l-n),h=a+i*(u-a);return(v<<16)+(c<<8)+(h|0)}getSeedRandomFn(e){let t=1779033703,i=3144134277,o=1013904242,n=2773480762;for(let a=0,s;a<e.length;a++)s=e.charCodeAt(a),t=i^Math.imul(t^s,597399067),i=o^Math.imul(i^s,2869860233),o=n^Math.imul(o^s,951274213),n=t^Math.imul(n^s,2716044179);return _i(Math.imul(o^t>>>18,597399067),Math.imul(n^i>>>22,2869860233),Math.imul(t^o>>>17,951274213),Math.imul(i^n>>>19,2716044179))}}class xi{constructor(e){this.base=e,this.renderer=this.base.renderer,this.floatType=ve,this.isWebGL2=this.renderer.capabilities.isWebGL2,this.scene=new ne,this.camera=new Ae,this.camera.position.z=1,this.geometry=new W,this.geometry.setAttribute("position",new C(new Float32Array([-1,-1,0,4,-1,0,-1,4,0]),3)),this.mesh=new w(this.geometry),this.mesh.frustumCulled=!1,this.scene.add(this.mesh),this.paramsInit()}paramsInit(){this.precisionPrefix=`precision ${this.renderer.capabilities.precision} float;`,this.precisionPrefix2=`precision ${this.renderer.capabilities.precision} float;
			precision ${this.renderer.capabilities.precision} int;
			#define IS_WEBGL2 true
		`,this.isWebGL2?(this.vertexPrefix=`${this.precisionPrefix2}
				precision mediump sampler2DArray;
				#define attribute in
				#define varying out
				#define texture2D texture
			`,this.fragmentPrefix=`${this.precisionPrefix2}
				#define varying in
				out highp vec4 pc_fragColor;
				#define gl_FragColor pc_fragColor
				#define gl_FragDepthEXT gl_FragDepth
				#define texture2D texture
				#define textureCube texture
				#define texture2DProj textureProj
				#define texture2DLodEXT textureLod
				#define texture2DProjLodEXT textureProjLod
				#define textureCubeLodEXT textureLod
				#define texture2DGradEXT textureGrad
				#define texture2DProjGradEXT textureProjGrad
				#define textureCubeGradEXT textureGrad
			`):(this.vertexPrefix=this.precisionPrefix,this.fragmentPrefix=this.precisionPrefix),this.renderer.getContext().getExtension("OES_standard_derivatives"),this.vertexShader=this.isWebGL2?this.precisionPrefix2+be:this.precisionPrefix+he,this.copyMaterial=this.createRawShaderMaterial({uniforms:{u_texture:{value:null}},fragmentShader:he,depthTest:!1,depthWrite:!1,blending:J}),this.clearMaterial=this.createRawShaderMaterial({uniforms:{u_color:{value:new Q(1,1,1,1)}},fragmentShader:di,depthTest:!1,depthWrite:!1,blending:J})}createRawShaderMaterial(e){return e=Object.assign({depthTest:!1,depthWrite:!1,blending:J,vertexShader:be,fragmentShader:he,derivatives:!1},e),e.vertexShader=(e.vertexShaderPrefix?e.vertexShaderPrefix:e.derivatives?this.vertexPrefix:this.vertexPrefix)+e.vertexShader,e.fragmentShader=(e.fragmentShaderPrefix?e.fragmentShaderPrefix:e.derivatives?this.fragmentPrefix:this.fragmentPrefix)+e.fragmentShader,delete e.vertexShaderPrefix,delete e.fragmentShaderPrefix,delete e.derivatives,e.glslVersion=this.isWebGL2?Fe:Me,new De(e)}createRenderTarget(e,t,i=!1,o=!1,n=0){return new Le(e,t,{wrapS:$,wrapT:$,magFilter:i?k:j,minFilter:i?k:j,type:typeof o=="boolean"?o?this.floatType:me:o,anisotropy:0,colorSpace:ze,depthBuffer:!1,stencilBuffer:!1,samples:n})}createDataTexture(e,t,i,o=!1,n=!0){let a=new Ee(e,t,i,Ne,o?we:me,Oe,$,$,n?k:j,n?k:j,0);return a.needsUpdate=!0,a}clearMultisampleRenderTargetState(e){if(e=e||this.renderer.getRenderTarget(),e&&e.samples>0){const t=this.renderer.properties.get(e);let i=this.renderer.getContext();i.bindFramebuffer(i.READ_FRAMEBUFFER,t.__webglMultisampledFramebuffer),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,t.__webglFramebuffer);const o=e.width,n=e.height;let a=i.COLOR_BUFFER_BIT;e.depthBuffer&&(a|=i.DEPTH_BUFFER_BIT),e.stencilBuffer&&(a|=i.STENCIL_BUFFER_BIT),i.blitFramebuffer(0,0,o,n,0,0,o,n,a,i.NEAREST),i.bindFramebuffer(i.FRAMEBUFFER,t.__webglMultisampledFramebuffer)}}renderMesh(e,t,i=this.camera){this.mesh.visible=!1,this.scene.add(e),this.renderer.setRenderTarget(t),this.renderer.render(this.scene,i),this.renderer.setRenderTarget(null),this.scene.remove(e),this.mesh.visible=!0}copy(e,t){const i=this.copyMaterial;i.uniforms.u_texture.value=e,this.render(i,t)}render(e,t){this.mesh.material=e,this.renderer.setRenderTarget(t),this.renderer.render(this.scene,this.camera)}getColorState(){if(!this.renderer)return{autoClear:!0,autoClearColor:!0,autoClearStencil:!0,autoClearDepth:!0,clearColor:0,clearAlpha:1};const e=new P;return this.renderer.getClearColor(e),{autoClear:this.renderer.autoClear,autoClearColor:this.renderer.autoClearColor,autoClearStencil:this.renderer.autoClearStencil,autoClearDepth:this.renderer.autoClearDepth,clearColor:e.getHex(),clearAlpha:this.renderer.getClearAlpha()}}setColorState(e){this.renderer.setClearColor(e.clearColor,e.clearAlpha),this.renderer.autoClear=e.autoClear,this.renderer.autoClearColor=e.autoClearColor,this.renderer.autoClearStencil=e.autoClearStencil,this.renderer.autoClearDepth=e.autoClearDepth}clearColor(e,t,i,o,n){this.clearMaterial.uniforms.u_color.value.set(e,t,i,o),this.render(this.clearMaterial,n)}}class pi{constructor(e){r(this,"blackTexture");r(this,"whiteTexture");r(this,"transparentTexture");r(this,"channelMixerMaterial");this.base=e,this.blackTexture=this._createPixelTexture([0,0,0,255]),this.whiteTexture=this._createPixelTexture([255,255,255,255]),this.transparentTexture=this._createPixelTexture([0,0,0,0])}_createPixelTexture(e){return this.base.fboHelper.createDataTexture(new Uint8Array(e),1,1,!1,!0)}mixChannels(e,t,i=-1,o=-1,n=-1,a=-1){this.channelMixerMaterial||(this.channelMixerMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_channelMixerR:{value:new Q},u_channelMixerG:{value:new Q},u_channelMixerB:{value:new Q},u_channelMixerA:{value:new Q}},vertexShader:this.base.fboHelper.vertexShader,fragmentShader:this.base.fboHelper.precisionPrefix+`

`+gi,blending:oe,blendEquation:K,blendDst:M,blendSrc:M,blendEquationAlpha:K,blendDstAlpha:M,blendSrcAlpha:M})),this.channelMixerMaterial.uniforms.u_texture.value=e,this.channelMixerMaterial.uniforms.u_channelMixerR.value.set(+(i%4==0),+(i%4==1),+(i%4==2),+(i%4==3)).multiplyScalar(i<0?0:1),this.channelMixerMaterial.uniforms.u_channelMixerG.value.set(+(o%4==0),+(o%4==1),+(o%4==2),+(o%4==3)).multiplyScalar(o<0?0:1),this.channelMixerMaterial.uniforms.u_channelMixerB.value.set(+(n%4==0),+(n%4==1),+(n%4==2),+(n%4==3)).multiplyScalar(n<0?0:1),this.channelMixerMaterial.uniforms.u_channelMixerA.value.set(+(a%4==0),+(a%4==1),+(a%4==2),+(a%4==3)).multiplyScalar(a<0?0:1);let s=this.base.fboHelper.getColorState();this.base.fboHelper.renderer.autoClear=!1,this.base.fboHelper.render(this.channelMixerMaterial,t),this.base.fboHelper.setColorState(s)}}class bi{constructor(e){r(this,"material",null);this.base=e}getBlur9Material(){let e=this.base.fboHelper.MAX_VARYING_VECTORS>8;return this.blur9Material||(this.blur9Material=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_delta:{value:new S}},vertexShader:e?this.base.fboHelper.precisionPrefix+`

`+vi:this.base.fboHelper.vertexShader,fragmentShader:this.base.fboHelper.precisionPrefix+`

`+(e?fi:mi),depthWrite:!1,depthTest:!1})),this.blur9Material}blur(e,t,i,o,n,a){let s=.25,l=Math.ceil(i.width*t)||0,u=Math.ceil(i.height*t)||0;this.material||(this.material=this.getBlur9Material()),o||console.warn("You have to pass intermediateRenderTarget to blur")(l!==o.width||u!==o.height)&&o.setSize(l,u),n?a||n.setSize(i.width,i.height):n=i,this.material.uniforms.u_texture.value=i.texture||i,this.material.uniforms.u_delta.value.set(e/l*s,0),this.base.fboHelper.render(this.material,o),this.material.uniforms.u_texture.value=o.texture||o,this.material.uniforms.u_delta.value.set(0,e/u*s),this.base.fboHelper.render(this.material,n)}}class Si{constructor(e){r(this,"shaderUniforms",{u_blueNoiseTexture:{value:null},u_blueNoiseLinearTexture:{value:null},u_blueNoiseTexelSize:{value:null},u_blueNoiseCoordOffset:{value:new S}});r(this,"TEXTURE_SIZE",128);this.base=e,this.blueNoiseTexture=this.base.blueNoiseTexture;let t=new Ue,i=this.blueNoiseTexture;t.generateMipmaps=!1,t.minFilter=t.magFilter=j,t.wrapS=t.wrapT=ge,t.image=i.image,i.generateMipmaps=!1,i.minFilter=i.magFilter=k,i.wrapS=i.wrapT=ge,i.needsUpdate=!0,t.needsUpdate=!0,this.shaderUniforms.u_blueNoiseTexture.value=i,this.shaderUniforms.u_blueNoiseLinearTexture.value=t,this.shaderUniforms.u_blueNoiseTexelSize.value=new S(1/this.TEXTURE_SIZE,1/this.TEXTURE_SIZE)}update(){this.shaderUniforms.u_blueNoiseCoordOffset.value.set(Math.random(),Math.random())}}const B=class B{constructor(e){r(this,"_scale",1);r(this,"_amplitude",1);r(this,"_r",[]);this.math=new Pe;let t=e?this.math.getSeedRandomFn(e):Math.random;for(let i=0;i<B.MAX_VERTICES;++i)this._r.push(t()-.5)}getVal(e){const t=e*this._scale,i=Math.floor(t),o=t-i,n=o*o*(3-2*o),a=i&B.MAX_VERTICES_MASK,s=a+1&B.MAX_VERTICES_MASK;return this.math.mix(this._r[a],this._r[s],n)*this._amplitude}getFbm(e,t){let i=0,o=.5;for(let n=0;n<t;n++)i+=o*this.getVal(e),e*=2,o*=.5;return i}get amplitude(){return this._amplitude}set amplitude(e){this._amplitude=e}get scale(){return this._scale}set scale(e){this._scale=e}};r(B,"MAX_VERTICES",512),r(B,"MAX_VERTICES_MASK",B.MAX_VERTICES-1);let ie=B;const q=class q{constructor(){r(this,"_v$2",new m);r(this,"_position",new m);r(this,"_rotation",new Z);r(this,"_euler",new Ge);r(this,"_scale",new m(1,1,1));r(this,"_matrix",new Be);r(this,"_enablePositionNoise",!0);r(this,"_enableRotationNoise",!0);r(this,"_positionFrequency",.25);r(this,"_rotationFrequency",.25);r(this,"_positionAmplitude",.3);r(this,"_rotationAmplitude",.003);r(this,"_positionScale",new m(1,1,1));r(this,"_rotationScale",new m(1,1,0));r(this,"_positionFractalLevel",3);r(this,"_rotationFractalLevel",3);r(this,"_times",new Float32Array(6));r(this,"_noise",new ie);this.rehash()}rehash(){for(let e=0;e<6;e++)this._times[e]=Math.random()*-1e4}update(e){const t=e===void 0?16.666666666666668:e;if(this._enablePositionNoise){for(let i=0;i<3;i++)this._times[i]+=this._positionFrequency*t;this._v$2.set(this._noise.getFbm(this._times[0],this._positionFractalLevel),this._noise.getFbm(this._times[1],this._positionFractalLevel),this._noise.getFbm(this._times[2],this._positionFractalLevel)),this._v$2.multiply(this._positionScale),this._v$2.multiplyScalar(this._positionAmplitude*q.FBM_NORM),this._position.copy(this._v$2)}if(this._enableRotationNoise){for(let i=0;i<3;i++)this._times[i+3]+=this._rotationFrequency*t;this._v$2.set(this._noise.getFbm(this._times[3],this._rotationFractalLevel),this._noise.getFbm(this._times[4],this._rotationFractalLevel),this._noise.getFbm(this._times[5],this._rotationFractalLevel)),this._v$2.multiply(this._rotationScale),this._v$2.multiplyScalar(this._rotationAmplitude*q.FBM_NORM),this._euler.set(this._v$2.x,this._v$2.y,this._v$2.z),this._rotation.setFromEuler(this._euler)}this._matrix.compose(this._position,this._rotation,this._scale)}get positionAmplitude(){return this._positionAmplitude}set positionAmplitude(e){this._positionAmplitude=e}get positionFrequency(){return this._positionFrequency}set positionFrequency(e){this._positionFrequency=e}get rotationAmplitude(){return this._rotationAmplitude}set rotationAmplitude(e){this._rotationAmplitude=e}get rotationFrequency(){return this._rotationFrequency}set rotationFrequency(e){this._rotationFrequency=e}get matrix(){return this._matrix}set matrix(e){this._matrix=e}};r(q,"FBM_NORM",1/.75);let re=q;const b=d=>{const t=new Uint32Array(d,0,1)[0],i=JSON.parse(String.fromCharCode.apply(null,new Uint8Array(d,4,t))),o=new W,n=i.vertexCount,a=i.indexCount;let s=4+t;const l={};let u=!1;for(let c=0;c<i.attributes.length;c++){const h=i.attributes[c],_=h.id,p=_==="indices"?a:n,g=h.componentSize,A=window[h.storageType],L=new A(d,s,p*g),y=A.BYTES_PER_ELEMENT;let x;if(h.needsPack){x=new Float32Array(p*g);const I=h.packedComponents,E=I.length,z=h.storageType.includes("Int"),R=1<<y*8,F=z?R/2:0,G=1/R;for(let N=0,U=0;N<p;N++)for(let V=0;V<E;V++){const{delta:se,from:Y}=I[V];x[U]=(L[U]+F)*G*se+Y,U++}}else l[_]=s,x=L;_==="indices"?o.setIndex(new C(x,1)):(o.setAttribute(_,new C(x,g)),_==="normal"&&(u=!0)),s+=p*g*y}const v=[];if(i.sceneData){const c=new D,h=i.meshType,_=h==="Mesh"?3:h==="LineSegments"?2:1;for(let p=0;p<i.sceneData.length;p++){const g=i.sceneData[p];let A;if(g.vertexCount>0){const L=new W,y=o.index,x=y.array,I=x.constructor,E=I.BYTES_PER_ELEMENT;L.setIndex(new C(new I(x.buffer,g.faceIndex*y.itemSize*E*_+(l.indices||0),g.faceCount*y.itemSize*_),y.itemSize));const z=L.index.array;for(let R=0;R<z.length;R++)z[R]-=g.vertexIndex;for(const R in o.attributes){const F=o.attributes[R],G=F.array,N=G.constructor,U=N.BYTES_PER_ELEMENT;L.setAttribute(R,new C(new N(G.buffer,g.vertexIndex*F.itemSize*U+(l[R]||0),g.vertexCount*F.itemSize),F.itemSize))}switch(h){case"Mesh":A=new w(L,new Ve({flatShading:!u}));break;case"LineSegments":A=new Ye(L,new je);break;default:A=new Te(L,new He({sizeAttenuation:!1,size:2}))}v.push(A)}else A=new D;g.parentIndex>-1?v[g.parentIndex].add(A):c.add(A),A.position.fromArray(g.position),A.quaternion.fromArray(g.quaternion),A.scale.fromArray(g.scale),A.name=g.name,A.userData.material=g.material,v[p]=A}o.userData.meshList=v,o.userData.sceneObject=c}return o};var Ai=`#define GLSLIFY 1
uniform vec2 u_aspect;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main(){
    vec2 toCenter=(fract(v_uv+0.5)-0.5)*u_aspect;
    vec2 rotToCenter=mat2(0.7071067811865476, -0.7071067811865476, 0.7071067811865476, 0.7071067811865476)*toCenter;
    float res=exp(-length(toCenter)*1.0)*0.05+exp(-length(toCenter)*7.5)*0.5+exp(-length(toCenter)*25.0)*1.+exp(-length(toCenter*vec2(1.0, 10.0))*30.0)*20.+exp(-length(toCenter*vec2(1.0, 20.0))*60.0)*300.+exp(-length(toCenter*vec2(10.0, 1.0))*30.0)*20.+exp(-length(toCenter*vec2(20.0, 1.0))*60.0)*300.+exp(-length(rotToCenter*vec2(1.0, 8.0))*37.5)*12.+exp(-length(rotToCenter*vec2(1.0, 20.0))*75.0)*300.+exp(-length(rotToCenter*vec2(20.0, 1.0))*75.0)*300.;
    gl_FragColor=vec4(res, res, 0., 0.);
}`,wi=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform float u_luminosityThreshold;
uniform float u_smoothWidth;
uniform float u_amount;

#ifdef USE_HALO
uniform vec2 u_texelSize;
uniform vec2 u_aspect;
uniform float u_haloWidth;
uniform float u_haloRGBShift;
uniform float u_haloStrength;
uniform float u_haloMaskInner;
uniform float u_haloMaskOuter;

#ifdef USE_LENS_DIRT
uniform sampler2D u_dirtTexture;
uniform vec2 u_dirtAspect;

#endif
#endif
#ifdef USE_CONVOLUTION
uniform float u_convolutionBuffer;

#endif
varying vec2 v_uv;
void main(){
    vec2 uv=v_uv;

    #ifdef USE_CONVOLUTION
    uv=(uv-0.5)*(1.0+u_convolutionBuffer)+0.5;

    #endif
    vec4 texel=texture2D(u_texture, uv);
    vec3 luma=vec3(0.299, 0.587, 0.114);
    float v=dot(texel.xyz, luma);
    float alpha=texel.a*u_amount;
    gl_FragColor=vec4(texel.rgb*alpha, 1.0);

    #ifdef USE_HALO
    vec2 toCenter=(uv-0.5)*u_aspect;
    vec2 ghostUv=1.0-(toCenter+0.5);
    vec2 ghostVec=(vec2(0.5)-ghostUv);
    vec2 direction=normalize(ghostVec);
    vec2 haloVec=direction*u_haloWidth;
    float weight=length(vec2(0.5)-fract(ghostUv+haloVec));
    weight=pow(1.0-weight, 3.0);
    vec3 distortion=vec3(-u_texelSize.x, 0.0, u_texelSize.x)*u_haloRGBShift;
    float zoomBlurRatio=fract(atan(toCenter.y, toCenter.x)*40.0)*0.05+0.95;
    ghostUv*=zoomBlurRatio;
    vec2 haloUv=ghostUv+haloVec;
    vec3 halo=vec3(texture2D(u_texture, haloUv+direction*distortion.r).r, texture2D(u_texture, haloUv+direction*distortion.g).g, texture2D(u_texture, haloUv+direction*distortion.b).b)*u_haloStrength*smoothstep(u_haloMaskInner, u_haloMaskOuter, length(toCenter));

    #ifdef USE_LENS_DIRT
    vec2 dirtUv=(uv-0.5)*u_dirtAspect+0.5;
    vec3 dirt=texture2D(u_dirtTexture, dirtUv).rgb;
    gl_FragColor.rgb+=(halo+alpha+0.05*dirt)*dirt;

    #else
    gl_FragColor.rgb+=halo;

    #endif
    #endif
    #ifdef USE_CONVOLUTION
    gl_FragColor.rgb*=max(abs(uv.x-0.5), abs(uv.y-0.5))>0.5 ? 0. : 1.;

    #endif
}`,Se=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec2 u_texelSize;
uniform float u_subtransformSize;
uniform float u_normalization;
uniform bool u_isForward;
const float TWOPI=6.283185307179586;
void main(){
    #ifdef HORIZTONAL
    float index=gl_FragCoord.x-.5;

    #else
    float index=gl_FragCoord.y-.5;

    #endif
    float evenIndex=floor(index/u_subtransformSize)*(u_subtransformSize*0.5)+mod(index, u_subtransformSize*0.5);

    #ifdef HORIZTONAL
    vec2 evenPos=vec2(evenIndex, gl_FragCoord.y)*u_texelSize;
    vec2 oddPos=evenPos+vec2(.5, 0.);

    #else
    vec2 evenPos=vec2(gl_FragCoord.x, evenIndex)*u_texelSize;
    vec2 oddPos=evenPos+vec2(0., .5);

    #endif
    vec4 even=texture2D(u_texture, evenPos);
    vec4 odd=texture2D(u_texture, oddPos);
    float twiddleArgument=(u_isForward ? TWOPI :-TWOPI)*(index/u_subtransformSize);
    vec2 twiddle=vec2(cos(twiddleArgument), sin(twiddleArgument));
    gl_FragColor=(even+vec4(twiddle.x*odd.xy-twiddle.y*odd.zw, twiddle.y*odd.xy+twiddle.x*odd.zw))*u_normalization;
}`,Ti=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform sampler2D u_kernelTexture;
void main(){
    vec4 a=texture2D(u_texture, v_uv);
    vec4 b=texture2D(u_kernelTexture, v_uv);
    gl_FragColor=vec4(a.xy*b.xy-a.zw*b.zw, a.xy*b.zw+a.zw*b.xy);
}`,Ci=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform float u_amount;
uniform float u_saturation;
varying vec2 v_uv;
void main(){
    gl_FragColor=texture2D(u_texture, v_uv)*u_amount;
    gl_FragColor.rgb=mix(vec3(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114))), gl_FragColor.rgb, u_saturation);
}`,Pi=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform sampler2D u_bloomTexture;
uniform float u_convolutionBuffer;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate

#define saturate(a) clamp(a, 0.0, 1.0)
#endif
#define whiteComplement(a) (1.0 - saturate( a ))

float pow2(const in float x) { return x*x; }
vec3 pow2(const in vec3 x) { return x*x; }
float pow3(const in float x) { return x*x*x; }
float pow4(const in float x) { float x2 = x*x; return x2*x2; }
float max3(const in vec3 v) { return max(max(v.x, v.y), v.z); }
float average(const in vec3 v) { return dot(v, vec3(0.3333333)); }

highp float rand(const in vec2 uv) {

    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);

    return fract(sin(sn) * c);

}

#ifdef HIGH_PRECISION
float precisionSafeLength(vec3 v) { return length(v); }
#else
float precisionSafeLength(vec3 v) {
    float maxComponent = max3(abs(v));
    return length(v / maxComponent) * maxComponent;
}
#endif

struct IncidentLight {
    vec3 color;
    vec3 direction;
    bool visible;
};

struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};

#ifdef USE_ALPHAHASH

varying vec3 vPosition;

#endif

vec3 transformDirection(in vec3 dir, in mat4 matrix) {

    return normalize((matrix * vec4(dir, 0.0)).xyz);

}

vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {

    
    

    return normalize((vec4(dir, 0.0) * matrix).xyz);

}

mat3 transposeMat3(const in mat3 m) {

    mat3 tmp;

    tmp[0] = vec3(m[0].x, m[1].x, m[2].x);
    tmp[1] = vec3(m[0].y, m[1].y, m[2].y);
    tmp[2] = vec3(m[0].z, m[1].z, m[2].z);

    return tmp;

}

float luminance(const in vec3 rgb) {

    

    const vec3 weights = vec3(0.2126729, 0.7151522, 0.0721750);

    return dot(weights, rgb);

}

bool isPerspectiveMatrix(mat4 m) {

    return m[2][3] == - 1.0;

}

vec2 equirectUv(in vec3 dir) {

    

    float u = atan(dir.z, dir.x) * RECIPROCAL_PI2 + 0.5;

    float v = asin(clamp(dir.y, - 1.0, 1.0)) * RECIPROCAL_PI + 0.5;

    return vec2(u, v);

}

vec3 BRDF_Lambert(const in vec3 diffuseColor) {

    return RECIPROCAL_PI * diffuseColor;

}

vec3 F_Schlick(const in vec3 f0, const in float f90, const in float dotVH) {

    
    

    
    
    float fresnel = exp2((- 5.55473 * dotVH - 6.98316) * dotVH);

    return f0 * (1.0 - fresnel) + (f90 * fresnel);

}

float F_Schlick(const in float f0, const in float f90, const in float dotVH) {

    
    

    
    
    float fresnel = exp2((- 5.55473 * dotVH - 6.98316) * dotVH);

    return f0 * (1.0 - fresnel) + (f90 * fresnel);

}
vec3 dithering(vec3 color){
    float grid_position=rand(gl_FragCoord.xy);
    vec3 dither_shift_RGB=vec3(0.25/255.0, -0.25/255.0, 0.25/255.0);
    dither_shift_RGB=mix(2.0*dither_shift_RGB, -2.0*dither_shift_RGB, grid_position);
    return color+dither_shift_RGB;
}
void main(){
    vec4 c=texture2D(u_texture, v_uv);
    vec2 bloomUv=(v_uv-0.5)/(1.0+u_convolutionBuffer)+0.5;
    gl_FragColor=c+texture2D(u_bloomTexture, bloomUv);
    gl_FragColor.rgb=dithering(gl_FragColor.rgb);
    gl_FragColor.a=1.0;
}`,yi=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_direction;
float gaussianPdf(in float x, in float sigma){
    return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;
}
void main(){
    vec2 invSize=1.0/u_resolution;
    float fSigma=float(SIGMA);
    float weightSum=gaussianPdf(0.0, fSigma);
    vec3 diffuseSum=texture2D(u_texture, v_uv).rgb*weightSum;
    for (int i=1;
    i<KERNEL_RADIUS;
    i++){ float x=float(i);
        float w=gaussianPdf(x, fSigma);
        vec2 uvOffset=u_direction*invSize*x;
        vec3 sample1=texture2D(u_texture, v_uv+uvOffset).rgb;
        vec3 sample2=texture2D(u_texture, v_uv-uvOffset).rgb;
        diffuseSum+=(sample1+sample2)*w;
        weightSum+=2.0*w;
    }
    gl_FragColor=vec4(diffuseSum/weightSum, 1.0);
}`,Ii=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_saturation;
uniform sampler2D u_blurTexture0;

#if ITERATION > 1
uniform sampler2D u_blurTexture1;

#endif
#if ITERATION > 2
uniform sampler2D u_blurTexture2;

#endif
#if ITERATION > 3
uniform sampler2D u_blurTexture3;

#endif
#if ITERATION > 4
uniform sampler2D u_blurTexture4;

#endif
uniform float u_bloomWeights[ITERATION];

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate

#define saturate(a) clamp(a, 0.0, 1.0)
#endif
#define whiteComplement(a) (1.0 - saturate( a ))

float pow2(const in float x) { return x*x; }
vec3 pow2(const in vec3 x) { return x*x; }
float pow3(const in float x) { return x*x*x; }
float pow4(const in float x) { float x2 = x*x; return x2*x2; }
float max3(const in vec3 v) { return max(max(v.x, v.y), v.z); }
float average(const in vec3 v) { return dot(v, vec3(0.3333333)); }

highp float rand(const in vec2 uv) {

    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);

    return fract(sin(sn) * c);

}

#ifdef HIGH_PRECISION
float precisionSafeLength(vec3 v) { return length(v); }
#else
float precisionSafeLength(vec3 v) {
    float maxComponent = max3(abs(v));
    return length(v / maxComponent) * maxComponent;
}
#endif

struct IncidentLight {
    vec3 color;
    vec3 direction;
    bool visible;
};

struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};

#ifdef USE_ALPHAHASH

varying vec3 vPosition;

#endif

vec3 transformDirection(in vec3 dir, in mat4 matrix) {

    return normalize((matrix * vec4(dir, 0.0)).xyz);

}

vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {

    
    

    return normalize((vec4(dir, 0.0) * matrix).xyz);

}

mat3 transposeMat3(const in mat3 m) {

    mat3 tmp;

    tmp[0] = vec3(m[0].x, m[1].x, m[2].x);
    tmp[1] = vec3(m[0].y, m[1].y, m[2].y);
    tmp[2] = vec3(m[0].z, m[1].z, m[2].z);

    return tmp;

}

float luminance(const in vec3 rgb) {

    

    const vec3 weights = vec3(0.2126729, 0.7151522, 0.0721750);

    return dot(weights, rgb);

}

bool isPerspectiveMatrix(mat4 m) {

    return m[2][3] == - 1.0;

}

vec2 equirectUv(in vec3 dir) {

    

    float u = atan(dir.z, dir.x) * RECIPROCAL_PI2 + 0.5;

    float v = asin(clamp(dir.y, - 1.0, 1.0)) * RECIPROCAL_PI + 0.5;

    return vec2(u, v);

}

vec3 BRDF_Lambert(const in vec3 diffuseColor) {

    return RECIPROCAL_PI * diffuseColor;

}

vec3 F_Schlick(const in vec3 f0, const in float f90, const in float dotVH) {

    
    

    
    
    float fresnel = exp2((- 5.55473 * dotVH - 6.98316) * dotVH);

    return f0 * (1.0 - fresnel) + (f90 * fresnel);

}

float F_Schlick(const in float f0, const in float f90, const in float dotVH) {

    
    

    
    
    float fresnel = exp2((- 5.55473 * dotVH - 6.98316) * dotVH);

    return f0 * (1.0 - fresnel) + (f90 * fresnel);

}
vec3 dithering(vec3 color){
    float grid_position=rand(gl_FragCoord.xy);
    vec3 dither_shift_RGB=vec3(0.25/255.0, -0.25/255.0, 0.25/255.0);
    dither_shift_RGB=mix(2.0*dither_shift_RGB, -2.0*dither_shift_RGB, grid_position);
    return color+dither_shift_RGB;
}
void main(){
    vec4 c=texture2D(u_texture, v_uv);
    gl_FragColor=c+(u_bloomWeights[0]*texture2D(u_blurTexture0, v_uv)
    #if ITERATION > 1
    +u_bloomWeights[1]*texture2D(u_blurTexture1, v_uv)
    #endif
    #if ITERATION > 2
    +u_bloomWeights[2]*texture2D(u_blurTexture2, v_uv)
    #endif
    #if ITERATION > 3
    +u_bloomWeights[3]*texture2D(u_blurTexture3, v_uv)
    #endif
    #if ITERATION > 4
    +u_bloomWeights[4]*texture2D(u_blurTexture4, v_uv)
    #endif
    );
    gl_FragColor.rgb=mix(vec3(dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114))), gl_FragColor.rgb, u_saturation);
    gl_FragColor.rgb=dithering(gl_FragColor.rgb);
    gl_FragColor.a=1.0;
}`;class Ri extends ae{constructor(t){super();r(this,"ITERATION",5);r(this,"USE_CONVOLUTION",!0);r(this,"USE_HD",!0);r(this,"USE_LENS_DIRT",!1);r(this,"amount",1);r(this,"radius",0);r(this,"threshold",.1);r(this,"smoothWidth",1);r(this,"highPassMultiplier",1);r(this,"haloWidth",.8);r(this,"haloRGBShift",.03);r(this,"haloStrength",.21);r(this,"haloMaskInner",.3);r(this,"haloMaskOuter",.5);r(this,"saturation",1);r(this,"renderOrder",10);r(this,"directionX",new S(1,0));r(this,"directionY",new S(0,1));r(this,"convolutionMixDownScale",1);r(this,"convolutionBuffer",.1);r(this,"highPassMaterial");r(this,"highPassRenderTarget");r(this,"fftHMaterial");r(this,"fftVMaterial");r(this,"srcMaterial");r(this,"convolutionSrcFrag",Ai);r(this,"srcSize",256);r(this,"srcRT");r(this,"fftCacheRT1");r(this,"fftCacheRT2");r(this,"fftSrcRT");r(this,"fftBloomOutCacheMaterial");r(this,"fftBloomOutCacheRT");r(this,"convolutionMixMaterial");r(this,"renderTargetsHorizontal",[]);r(this,"renderTargetsVertical",[]);r(this,"blurMaterials",[]);this.base=t;const i=this.base.height/Math.sqrt(this.base.width*this.base.width+this.base.height*this.base.height)*2;this.texelSize={value:new S(1/this.base.width,1/this.base.height)},this.aspect={value:new S(this.base.width/this.base.height*i,i)};const o=new W;o.setAttribute("position",new C(new Float32Array([-1,-1,0,4,-1,0,-1,4,0]),3)),o.setAttribute("a_uvClamp",new C(new Float32Array([0,0,1,1,0,0,1,1,0,0,1,1]),4)),this._camera=new Qe(-1,1,1,-1,0,1),this.mesh=new w(o,null),this.init(),this.setSize(this.base.width,this.base.height)}init(){let t=ve;if(this.highPassRenderTarget=this.base.fboHelper.createRenderTarget(1,1,!this.USE_HD,t),this.highPassMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_luminosityThreshold:{value:1},u_smoothWidth:{value:1},u_amount:{value:1},u_haloWidth:{value:1},u_haloRGBShift:{value:1},u_haloStrength:{value:1},u_haloMaskInner:{value:1},u_haloMaskOuter:{value:1},u_texelSize:null,u_aspect:{value:new S},u_dirtTexture:{value:null},u_dirtAspect:{value:new S}},fragmentShader:wi}),this.highPassMaterial.defines.USE_LENS_DIRT=this.USE_LENS_DIRT,this.USE_CONVOLUTION)this.highPassMaterial.defines.USE_CONVOLUTION=!0,this.highPassMaterial.uniforms.u_convolutionBuffer={value:.15},this.fftSrcRT=this.base.fboHelper.createRenderTarget(1,1,!0,t),this.fftCacheRT1=this.base.fboHelper.createRenderTarget(1,1,!0,t),this.fftCacheRT2=this.fftCacheRT1.clone(),this.fftBloomOutCacheRT=this.base.fboHelper.createRenderTarget(1,1),this.srcMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_aspect:{value:new S}},fragmentShader:this.convolutionSrcFrag}),this.fftHMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_texelSize:{value:new S},u_subtransformSize:{value:0},u_normalization:{value:0},u_isForward:{value:0}},fragmentShader:Se}),this.fftHMaterial.defines.HORIZTONAL=!0,this.fftVMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:this.fftHMaterial.uniforms,fragmentShader:Se}),this.convolutionMixMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_kernelTexture:{value:this.fftSrcRT.texture}},fragmentShader:Ti}),this.fftBloomOutCacheMaterial=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_amount:{value:0},u_saturation:{value:0}},fragmentShader:Ci}),this.material=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_bloomTexture:{value:this.fftBloomOutCacheRT.texture},u_convolutionBuffer:this.highPassMaterial.uniforms.u_convolutionBuffer},fragmentShader:Pi,blending:J});else{for(let i=0;i<this.ITERATION;i++){this.renderTargetsHorizontal.push(this.base.fboHelper.createRenderTarget(1,1,!1,t)),this.renderTargetsVertical.push(this.base.fboHelper.createRenderTarget(1,1,!1,t));const o=3+i*2;this.blurMaterials[i]=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_resolution:{value:new S},u_direction:{value:null}},fragmentShader:yi,defines:{KERNEL_RADIUS:o,SIGMA:o}})}this.material=this.base.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_bloomStrength:{value:1},u_bloomWeights:{value:[]},u_saturation:{value:0}},fragmentShader:Ii,blending:J,defines:{ITERATION:this.ITERATION}});for(let i=0;i<this.ITERATION;i++)this.material.uniforms[`u_blurTexture${i}`]={value:this.renderTargetsVertical[i].texture}}}setDirtTexture(t){this.highPassMaterial.uniforms.u_dirtTexture.value=t}setSize(t,i){const o=i/Math.sqrt(t*t+i*i)*2;if(this.aspect.value.set(t/i*o,o),this.texelSize.value.set(1/t,1/i),this.USE_CONVOLUTION){let n=this.base.math.powerTwoCeiling(t/2)>>this.convolutionMixDownScale,a=this.base.math.powerTwoCeiling(i/2)>>this.convolutionMixDownScale;if(this.highPassRenderTarget.setSize(n,a),n!==this.fftCacheRT1.width||a!==this.fftCacheRT1.height){this.fftSrcRT.setSize(n,a),this.fftCacheRT1.setSize(n,a),this.fftCacheRT2.setSize(n,a),this.fftBloomOutCacheRT.setSize(n,a);let s=i/Math.max(t,i);this.srcMaterial.uniforms.u_aspect.value.set(t/i*s,s),this.base.fboHelper.render(this.srcMaterial,this.fftCacheRT1),this.renderFFT(this.fftCacheRT1,this.fftSrcRT,!0)}}else{let n=Math.ceil(t/2),a=Math.ceil(i/2);this.highPassRenderTarget.setSize(n,a);for(let s=0;s<this.ITERATION;s++)this.renderTargetsHorizontal[s].setSize(n,a),this.renderTargetsVertical[s].setSize(n,a),this.blurMaterials[s].uniforms.u_resolution.value.set(n,a),n=Math.ceil(n/2),a=Math.ceil(a/2)}}dispose(){var t,i,o;if(!this.USE_CONVOLUTION){(t=this.highPassRenderTarget)==null||t.dispose();for(let n=0;n<this.ITERATION;n++)(i=this.renderTargetsHorizontal[n])==null||i.dispose(),(o=this.renderTargetsVertical[n])==null||o.dispose()}}needsRender(){return!!this.amount}renderFFT(t,i,o){const n=t.width,a=t.height,s=Math.round(Math.log2(n)),l=Math.round(Math.log2(a)),u=s+l,v=u%2===0,c=this.fftHMaterial.uniforms;for(let h=0;h<u;h++){const _=h<s;c.u_texture.value=t.texture,c.u_normalization.value=h===0?1/Math.sqrt(n*a):1,c.u_isForward.value=o,c.u_texelSize.value.set(1/n,1/a),c.u_subtransformSize.value=Math.pow(2,(_?h:h-s)+1),this.base.fboHelper.render(_?this.fftHMaterial:this.fftVMaterial,i);const p=t;t=i,i=p}v&&this.base.fboHelper.copy(t.texture,i)}render(t,i,o){const n=this.base.width,a=this.base.height,s=this.highPassMaterial;s.uniforms.u_texture.value=o.texture,s.uniforms.u_luminosityThreshold.value=this.threshold,s.uniforms.u_smoothWidth.value=this.smoothWidth,s.uniforms.u_amount.value=this.highPassMultiplier,s.uniforms.u_haloWidth.value=this.haloWidth,s.uniforms.u_haloRGBShift.value=this.haloRGBShift*n,s.uniforms.u_haloStrength.value=this.haloStrength,s.uniforms.u_haloMaskInner.value=this.haloMaskInner,s.uniforms.u_haloMaskOuter.value=this.haloMaskOuter,s.uniforms.u_texelSize=this.texelSize,s.uniforms.u_aspect=this.aspect;let l=this.haloStrength>0,u=a/Math.sqrt(n*n+a*a)*2;if(s.uniforms.u_aspect.value.set(n/a*u,u),u=a/Math.max(n,a),s.uniforms.u_dirtAspect.value.set(n/a*u,u),s.defines.USE_HALO!==l&&(s.defines.USE_HALO=l,s.needsUpdate=!0),this.USE_CONVOLUTION&&(s.uniforms.u_convolutionBuffer.value=this.convolutionBuffer),this.mesh.material=s,this.base.fboHelper.renderMesh(this.mesh,this.highPassRenderTarget),this.USE_CONVOLUTION){this.base.fboHelper.copy(this.highPassRenderTarget.texture,this.fftCacheRT1),this.renderFFT(this.fftCacheRT1,this.fftCacheRT2,!0),this.convolutionMixMaterial.uniforms.u_texture.value=this.fftCacheRT2.texture,this.base.fboHelper.render(this.convolutionMixMaterial,this.fftCacheRT1),this.renderFFT(this.fftCacheRT1,this.fftCacheRT2,!1);let v=this.amount*1024;v=v/Math.pow(this.base.math.powerTwoCeilingBase(this.fftCacheRT1.width*this.fftCacheRT1.height),4)*.85,this.fftBloomOutCacheMaterial.uniforms.u_amount.value=v,this.fftBloomOutCacheMaterial.uniforms.u_saturation.value=this.saturation,this.fftBloomOutCacheMaterial.uniforms.u_texture.value=this.fftCacheRT2.texture,this.mesh.material=this.fftBloomOutCacheMaterial,this.base.fboHelper.renderMesh(this.mesh,this.fftBloomOutCacheRT)}else{let v=this.highPassRenderTarget;for(let c=0;c<this.ITERATION;c++){const h=this.blurMaterials[c];h.uniforms.u_texture.value=v.texture,h.uniforms.u_direction.value=this.directionX,this.mesh.material=h,this.base.fboHelper.renderMesh(this.mesh,this.renderTargetsHorizontal[c]),h.uniforms.u_texture.value=this.renderTargetsHorizontal[c].texture,h.uniforms.u_direction.value=this.directionY,this.mesh.material=h,this.base.fboHelper.renderMesh(this.mesh,this.renderTargetsVertical[c]),v=this.renderTargetsVertical[c]}this.material.uniforms.u_texture.value=o.texture,this.material.uniforms.u_saturation.value=this.base.math.mix(1,this.saturation,.5);for(let c=0;c<this.ITERATION;c++){const h=(this.ITERATION-c)/this.ITERATION;this.material.uniforms.u_bloomWeights.value[c]=this.amount*(h+(1.2-h*2)*this.radius)/Math.pow(2,this.ITERATION-c-1)}}this.material.uniforms.u_texture.value=o.texture,this.base.fboHelper.render(this.material,this.renderToScreen?null:i)}}var Fi=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec3 u_bgColor;
uniform float u_opacity;
uniform float u_vignetteFrom;
uniform float u_vignetteTo;
uniform vec2 u_vignetteAspect;
uniform vec3 u_vignetteColor;
uniform float u_saturation;
uniform float u_contrast;
uniform float u_brightness;
uniform vec3 u_tintColor;
uniform float u_tintOpacity;
uniform float u_ditherSeed;
float hash13(vec3 p3){ p3=fract(p3*.1031);
    p3+=dot(p3, p3.yzx+33.33);
    return fract((p3.x+p3.y)*p3.z);
}
vec3 screen(vec3 cb, vec3 cs){
    return cb+cs-(cb*cs);
}
vec3 colorDodge(vec3 cb, vec3 cs){
    return mix(min(vec3(1.0), cb/(1.0-cs)), vec3(1.0), step(vec3(1.0), cs));
}
void main(){
    vec2 uv=v_uv;
    vec3 color=texture2D(u_texture, uv).rgb;
    float luma=dot(color, vec3(0.299, 0.587, 0.114));
    color=mix(vec3(luma), color, 1.0+u_saturation);
    color=0.5+(1.0+u_contrast)*(color-0.5);
    color+=u_brightness;
    color=mix(color, screen(colorDodge(color, u_tintColor), u_tintColor), u_tintOpacity);
    float d=length((uv-0.5)*u_vignetteAspect)*2.0;
    color=mix(color, u_vignetteColor, smoothstep(u_vignetteFrom, u_vignetteTo, d));
    gl_FragColor=vec4(mix(u_bgColor, color, u_opacity)+hash13(vec3(gl_FragCoord.xy, u_ditherSeed))/255.0, 1.0);
}`;class Mi extends ae{constructor(t){super();r(this,"vignetteFrom",.6);r(this,"vignetteTo",1.6);r(this,"vignetteAspect",new S);r(this,"vignetteColor",new P);r(this,"saturation",1);r(this,"contrast",0);r(this,"brightness",1);r(this,"tintColor",new P);r(this,"tintOpacity",1);r(this,"bgColor",new P);r(this,"opacity",1);r(this,"isActive",!1);r(this,"renderOrder",30);this.base=t,this.fboHelper=t.fboHelper,this.init()}init(){this.material=this.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_vignetteFrom:{value:0},u_vignetteTo:{value:0},u_vignetteAspect:{value:this.vignetteAspect},u_vignetteColor:{value:this.vignetteColor},u_saturation:{value:0},u_contrast:{value:0},u_brightness:{value:0},u_tintColor:{value:this.tintColor},u_tintOpacity:{value:0},u_bgColor:{value:this.bgColor},u_opacity:{value:0},u_ditherSeed:{value:0}},fragmentShader:Fi})}render(t,i,o){const n=this.base.width,a=this.base.height;let s=this.material.uniforms;s.u_vignetteFrom.value=this.vignetteFrom,s.u_vignetteTo.value=this.vignetteTo;const l=a/Math.sqrt(n*n+a*a);this.vignetteAspect.set(n/a*l,l),s.u_saturation.value=this.saturation-1,s.u_contrast.value=this.contrast,s.u_brightness.value=this.brightness-1,s.u_tintOpacity.value=this.tintOpacity,s.u_opacity.value=this.opacity,s.u_ditherSeed.value=Math.random()*1e3,this.material.uniforms.u_texture.value=o.texture,this.base.fboHelper.render(this.material,this.renderToScreen?null:i),this.base.base.composer.swapBuffers()}}var Di=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
void main(){
    gl_FragColor=texture2D(u_texture, v_uv).rrra;
}`,Li=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform sampler2D u_motionTexture;
uniform float u_blurRatio;

#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}

void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy+vec2(41., 25.));
    vec4 motion=texture2D(u_motionTexture, v_uv);
    motion.xy-=0.5;
    motion.xy*=(motion.z-.5)/16.*u_blurRatio*0.25;
    vec4 c=vec4(0.);
    vec2 offset=motion.xy*noise.xy;
    for (int i=0;i<16;i++){
        offset+=motion.xy;
        c+=texture2D(u_texture, v_uv+offset);
    }c/=16.;
    gl_FragColor=vec4(c.rrr, c.a);
    vec4 color=texture2D(u_texture, v_uv).rrra;
    gl_FragColor=max(color, gl_FragColor);
}`,zi=`#define GLSLIFY 1
varying vec2 v_uv;
uniform sampler2D u_texture;
uniform float u_aspect;
uniform float u_blurRatio;

#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy);
    vec4 tex=texture2D(u_texture, v_uv);
    vec2 ra=vec2(0.);
    float fi=0.;
    float theta=noise.x*6.283185307179586;
    vec2 strength=vec2(1., 1.*u_aspect)*.006*tex.b*u_blurRatio;
    for (int i=0;i<8;i++){
        theta+=10.166407384630519;
        ra+=texture2D(u_texture, v_uv+vec2(cos(theta), sin(theta))*sqrt((fi+.5)/8.)*strength).ra;
        fi+=1.;
    }ra/=8.;
    gl_FragColor=ra.xxxy;
}`;class Ei extends ae{constructor(t){super();r(this,"isActive",!0);r(this,"cacheRT",null);r(this,"motionBlurRatio",1);r(this,"motionRT");r(this,"motionTmpRT");r(this,"useMotionBlur",!1);r(this,"blurRatio",0);r(this,"scene",new ne);r(this,"camera",new Ae);r(this,"renderOrder",5);this.base=t,this.width=this.base.width,this.height=this.base.height,this.fboHelper=this.base.fboHelper,this.cacheRT=this.fboHelper.createRenderTarget(1,1),this.motionRT=this.fboHelper.createRenderTarget(1,1),this.motionRT.depthBuffer=!0,this.motionTmpRT=this.fboHelper.createRenderTarget(1,1),this.material=this.fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:null},u_motionTexture:{value:this.motionRT.texture},u_aspect:{value:1},u_blurRatio:{value:0}},this.base.blueNoise.shaderUniforms),fragmentShader:Di}),this.motionBlurMaterial=this.fboHelper.createRawShaderMaterial({uniforms:this.material.uniforms,fragmentShader:Li}),this.blurMaterial=this.fboHelper.createRawShaderMaterial({uniforms:this.material.uniforms,fragmentShader:zi}),this.setSize(this.width,this.height)}setSize(t,i){this.cacheRT.setSize(t,i),this.material.uniforms.u_aspect.value=t/i}renderMotion(t,i,o,n){let a=this.base.renderer,s=this.fboHelper.getColorState(),l=a.getRenderTarget();this.motionRT.setSize(o,n),a.setRenderTarget(this.motionRT),a.setClearColor(8355711,0),a.clear(),this.fboHelper.renderMesh(t,this.motionRT,i),this.base.blur.blur(2,1,this.motionRT,this.motionTmpRT,this.motionRT),a.setRenderTarget(l),this.fboHelper.setColorState(s),this.useMotionBlur=!0}render(t,i,o){if(this.fboHelper.copy(o.texture,this.cacheRT),this.useMotionBlur?(this.useMotionBlur=!1,this.material=this.motionBlurMaterial,this.material.uniforms.u_blurRatio.value=this.motionBlurRatio):(this.material=this.blurRatio>0?this.blurMaterial:this.material,this.material.uniforms.u_blurRatio.value=this.blurRatio),this.renderToScreen){this.material.uniforms.u_texture.value=o.texture,this.fboHelper.render(this.material,i);let n=this.fboHelper.getColorState();this.fboHelper.renderer.autoClear=!1,this.fboHelper.renderer.setRenderTarget(i),this.fboHelper.renderer.render(this.scene,this.camera),this.fboHelper.setColorState(n)}else this.material.uniforms.u_texture&&(this.material.uniforms.u_texture.value=o.texture),this.fboHelper.render(this.material,this.renderToScreen?null:i)}dispose(){this.cacheRT.dispose(),this.motionRT.dispose(),this.motionTmpRT.dispose(),this.material.dispose(),this.motionBlurMaterial.dispose(),this.blurMaterial.dispose()}}var Ni=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec3 u_colorBurn;
uniform float u_colorBurnAlpha;
uniform vec3 u_colorDodge;
uniform float u_colorDodgeAlpha;
varying vec2 v_uv;
vec3 colorDodge(in vec3 src, in vec3 dst){
    return mix(step(0., src)*(min(vec3(1.), dst/(1.-src))), vec3(1.), step(1., dst));
}
vec3 colorBurn(in vec3 src, in vec3 dst){
    return mix(step(0., src)*(1.-min(vec3(1.), (1.-dst)/src)), vec3(1.), step(1., dst));
}
void main(){
    vec4 texture=texture2D(u_texture, v_uv);
    vec3 colorBurn=mix(texture.rgb, colorBurn(u_colorBurn, texture.rgb), u_colorBurnAlpha);
    vec3 colorDodge=mix(texture.rgb, colorDodge(u_colorDodge, texture.rgb), u_colorDodgeAlpha);
    texture.rgb=mix(colorBurn, colorDodge, texture.rgb);
    gl_FragColor=texture;
}`;class Oi extends ae{constructor(t){super();r(this,"colorBurn",new P("#000"));r(this,"colorDodge",new P("#000"));r(this,"hudRatio",1);r(this,"isActive",!0);r(this,"renderOrder",20);r(this,"randSimplex1Ds",[]);r(this,"_sceneColorBurn",new P("#00f0ff"));r(this,"_sceneColorDodge",new P("#005aff"));r(this,"_sceneColorBurnAlpha",.15);r(this,"_sceneColorDodgeAlpha",.12);r(this,"_hudColorBurn",new P("#79a8ff"));r(this,"_hudColorDodge",new P("#a5ff44"));r(this,"_hudColorBurnAlpha",1);r(this,"_hudColorDodgeAlpha",.7);this.base=t,this.fboHelper=t.fboHelper,this.math=t.math,this.init()}init(){this.material=this.fboHelper.createRawShaderMaterial({uniforms:{u_texture:{value:null},u_colorBurn:{value:this.colorBurn},u_colorBurnAlpha:{value:1},u_colorDodge:{value:this.colorDodge},u_colorDodgeAlpha:{value:1}},fragmentShader:Ni})}render(t,i,o){let n=this.material.uniforms;this.colorBurn.copy(this._sceneColorBurn).lerp(this._hudColorBurn,this.hudRatio),this.colorDodge.copy(this._sceneColorDodge).lerp(this._hudColorDodge,this.hudRatio),n.u_colorBurnAlpha.value=this.math.mix(this._sceneColorBurnAlpha,this._hudColorBurnAlpha,this.hudRatio*this.hudRatio),n.u_colorDodgeAlpha.value=this.math.mix(this._sceneColorDodgeAlpha,this._hudColorDodgeAlpha,this.hudRatio*this.hudRatio),this.material.uniforms.u_texture&&(this.material.uniforms.u_texture.value=o.texture),this.fboHelper.render(this.material,this.renderToScreen?null:i)}setSize(){}dispose(){}}class Ui{constructor(e){r(this,"shadowMapSize",1024);r(this,"position",new m(0,8,0));r(this,"shadowRenderTarget",null);r(this,"shaderUniforms",{u_lightPosition:{value:this.position},u_lightColor:{value:new P("#000")},u_lightShadowMaxDistance:{value:12},u_lightShadowTexture:{value:null},u_lightShadowTextureTexelSize:{value:new S(1/this.shadowMapSize,1/(this.shadowMapSize*2))}});this.base=e,this.fboHelper=this.base.fboHelper,this.renderer=this.base.renderer,this.shadowRenderTarget=this.fboHelper.createRenderTarget(this.shadowMapSize,this.shadowMapSize*2,!0,ve);let t=this.shaderUniforms.u_lightShadowTexture.value=this.shadowRenderTarget.texture;this.shadowRenderTarget.depthBuffer=!0,t.format=We}update(){let e=this.renderer,t=this.fboHelper.getColorState(),i=e.getRenderTarget();e.setRenderTarget(this.shadowRenderTarget),e.setClearColor(16777215,1),e.clear(),e.setRenderTarget(i),this.fboHelper.setColorState(t)}renderMesh(e){let t=this.renderer,i=this.fboHelper.getColorState(),o=t.getRenderTarget();t.autoClearColor=!1,this.fboHelper.renderMesh(e,this.shadowRenderTarget),t.setRenderTarget(o),this.fboHelper.setColorState(i)}postUpdate(e){let t=this.renderer,i=this.fboHelper.getColorState(),o=t.getRenderTarget();t.autoClear=!1,t.setRenderTarget(o),this.fboHelper.setColorState(i)}}var Gi=`#define GLSLIFY 1
uniform sampler2D u_simPrevPosLifeTexture;
uniform sampler2D u_simDefaultPosLifeTexture;
uniform float u_introDeltaTime;
uniform float u_noiseTime;
uniform float u_noiseScale;
uniform float u_noiseStableFactor;
uniform vec3 u_lightPosition;
varying vec2 v_uv;

#define PI2 6.283185307179586
vec4 mod289(vec4 x){
    return x-floor(x*(1.0/289.0))*289.0;
}
float mod289(float x){
    return x-floor(x*(1.0/289.0))*289.0;
}
vec4 permute(vec4 x){
    return mod289(((x*34.0)+1.0)*x);
}
float permute(float x){
    return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r){
    return 1.79284291400159-0.85373472095314*r;
}
float taylorInvSqrt(float r){
    return 1.79284291400159-0.85373472095314*r;
}
vec4 grad4(float j, vec4 ip){
    const vec4 ones=vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p, s;
    p.xyz=floor(fract(vec3(j)*ip.xyz)*7.0)*ip.z-1.0;
    p.w=1.5-dot(abs(p.xyz), ones.xyz);
    s=vec4(lessThan(p, vec4(0.0)));
    p.xyz=p.xyz+(s.xyz*2.0-1.0)*s.www;
    return p;
}

#define F4 0.309016994374947451
vec4 simplexNoiseDerivatives(vec4 v){
    const vec4 C=vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    vec4 i=floor(v+dot(v, vec4(F4)));
    vec4 x0=v-i+dot(i, C.xxxx);
    vec4 i0;
    vec3 isX=step(x0.yzw, x0.xxx);
    vec3 isYZ=step(x0.zww, x0.yyz);
    i0.x=isX.x+isX.y+isX.z;
    i0.yzw=1.0-isX;
    i0.y+=isYZ.x+isYZ.y;
    i0.zw+=1.0-isYZ.xy;
    i0.z+=isYZ.z;
    i0.w+=1.0-isYZ.z;
    vec4 i3=clamp(i0, 0.0, 1.0);
    vec4 i2=clamp(i0-1.0, 0.0, 1.0);
    vec4 i1=clamp(i0-2.0, 0.0, 1.0);
    vec4 x1=x0-i1+C.xxxx;
    vec4 x2=x0-i2+C.yyyy;
    vec4 x3=x0-i3+C.zzzz;
    vec4 x4=x0+C.wwww;
    i=mod289(i);
    float j0=permute(permute(permute(permute(i.w)+i.z)+i.y)+i.x);
    vec4 j1=permute(permute(permute(permute(i.w+vec4(i1.w, i2.w, i3.w, 1.0))+i.z+vec4(i1.z, i2.z, i3.z, 1.0))+i.y+vec4(i1.y, i2.y, i3.y, 1.0))+i.x+vec4(i1.x, i2.x, i3.x, 1.0));
    vec4 ip=vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);
    vec4 p0=grad4(j0, ip);
    vec4 p1=grad4(j1.x, ip);
    vec4 p2=grad4(j1.y, ip);
    vec4 p3=grad4(j1.z, ip);
    vec4 p4=grad4(j1.w, ip);
    vec4 norm=taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0*=norm.x;
    p1*=norm.y;
    p2*=norm.z;
    p3*=norm.w;
    p4*=taylorInvSqrt(dot(p4, p4));
    vec3 values0=vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));
    vec2 values1=vec2(dot(p3, x3), dot(p4, x4));
    vec3 m0=max(0.5-vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
    vec2 m1=max(0.5-vec2(dot(x3, x3), dot(x4, x4)), 0.0);
    vec3 temp0=-6.0*m0*m0*values0;
    vec2 temp1=-6.0*m1*m1*values1;
    vec3 mmm0=m0*m0*m0;
    vec2 mmm1=m1*m1*m1;
    float dx=temp0[0]*x0.x+temp0[1]*x1.x+temp0[2]*x2.x+temp1[0]*x3.x+temp1[1]*x4.x+mmm0[0]*p0.x+mmm0[1]*p1.x+mmm0[2]*p2.x+mmm1[0]*p3.x+mmm1[1]*p4.x;
    float dy=temp0[0]*x0.y+temp0[1]*x1.y+temp0[2]*x2.y+temp1[0]*x3.y+temp1[1]*x4.y+mmm0[0]*p0.y+mmm0[1]*p1.y+mmm0[2]*p2.y+mmm1[0]*p3.y+mmm1[1]*p4.y;
    float dz=temp0[0]*x0.z+temp0[1]*x1.z+temp0[2]*x2.z+temp1[0]*x3.z+temp1[1]*x4.z+mmm0[0]*p0.z+mmm0[1]*p1.z+mmm0[2]*p2.z+mmm1[0]*p3.z+mmm1[1]*p4.z;
    float dw=temp0[0]*x0.w+temp0[1]*x1.w+temp0[2]*x2.w+temp1[0]*x3.w+temp1[1]*x4.w+mmm0[0]*p0.w+mmm0[1]*p1.w+mmm0[2]*p2.w+mmm1[0]*p3.w+mmm1[1]*p4.w;
    return vec4(dx, dy, dz, dw)*49.0;
}
vec3 curl(in vec3 p, in float noiseTime, in float persistence){
    vec4 xNoisePotentialDerivatives=vec4(0.0);
    vec4 yNoisePotentialDerivatives=vec4(0.0);
    vec4 zNoisePotentialDerivatives=vec4(0.0);
    for (int i=0;
    i<2;
    ++i){
        float twoPowI=pow(2.0, float(i));
        float scale=0.5*twoPowI*pow(persistence, float(i));
        xNoisePotentialDerivatives+=simplexNoiseDerivatives(vec4(p*twoPowI, noiseTime))*scale;
        yNoisePotentialDerivatives+=simplexNoiseDerivatives(vec4((p+vec3(123.4, 129845.6, -1239.1))*twoPowI, noiseTime))*scale;
        zNoisePotentialDerivatives+=simplexNoiseDerivatives(vec4((p+vec3(-9519.0, 9051.0, -123.0))*twoPowI, noiseTime))*scale;
    }
    return vec3(xNoisePotentialDerivatives[3]-zNoisePotentialDerivatives[1], zNoisePotentialDerivatives[2]-yNoisePotentialDerivatives[3], yNoisePotentialDerivatives[1]-xNoisePotentialDerivatives[2]);
}
void main(){
    vec4 posLife=texture2D(u_simPrevPosLifeTexture, v_uv);
    vec3 posLifeOrigin=posLife.xyz-u_lightPosition;
    posLife.w-=(0.5+u_noiseStableFactor)*u_introDeltaTime;
    if (posLife.w<0.0){
        vec3 defPosOrigin=texture2D(u_simDefaultPosLifeTexture, v_uv).xyz;
        vec3 defPos=defPosOrigin*(1.25+sin(u_noiseTime*2.5+v_uv.x*21.)*0.25)+u_lightPosition;
        posLife.w+=1.;
        posLife.xyz=defPos;
    }
    vec3 toLight=posLife.xyz-u_lightPosition;
    vec3 axis=vec3(sin(u_noiseTime), cos(u_noiseTime*2.+v_uv.y*6.283185), 0.0);
    vec3 spinDir=cross(axis, toLight);
    float dist=length(toLight);
    if (dist>0.01){
        float spinStrength=u_introDeltaTime*(0.1+smoothstep(0.5, 2.0, dist-v_uv.x*0.5)*(v_uv.y<0.5 ? 1. :-1.)*mix(2., 4., v_uv.x))*mix(0.75, 1.5, u_noiseStableFactor);
        posLife.xyz+=spinDir*spinStrength;
    }
    posLife.xyz+=(1.25+0.5*u_noiseScale)*curl((posLife.xyz-u_lightPosition)*(0.4+0.3*u_noiseStableFactor), u_noiseTime, 0.2)*u_introDeltaTime*mix(0.4, 1.5, posLife.w*posLife.w)*mix(0.75, 1.25, v_uv.x);
    gl_FragColor=posLife;
}`;class Bi{constructor(e){r(this,"SIM_TEXTURE_WIDTH",128);r(this,"SIM_TEXTURE_HEIGHT",192);r(this,"currPositionRenderTarget",null);r(this,"prevPositionRenderTarget",null);r(this,"ORIGIN",new m(0,8,0));r(this,"isPlaying",!0);r(this,"isFirstSim",!0);r(this,"noiseSpeed",.4);r(this,"_noise",new ie);r(this,"noiseScaleTime",Math.random());r(this,"noiseStableFactorTime",Math.random());r(this,"noiseStableFactor",Math.random());r(this,"shaderUniforms",{u_simCurrPosLifeTexture:{value:null},u_simPrevPosLifeTexture:{value:null},u_simDefaultPosLifeTexture:{value:null},u_simTextureSize:{value:new S(this.SIM_TEXTURE_WIDTH,this.SIM_TEXTURE_HEIGHT)},u_noiseStableFactor:{value:0}});this.base=e,this.math=e.math,this.fboHelper=e.fboHelper,this.heroLight=e.heroLight,this.currPositionRenderTarget=this.fboHelper.createRenderTarget(this.SIM_TEXTURE_WIDTH,this.SIM_TEXTURE_HEIGHT,!0,we),this.prevPositionRenderTarget=this.currPositionRenderTarget.clone(),this.positionMaterial=this.fboHelper.createRawShaderMaterial({uniforms:{u_lightPosition:this.heroLight.shaderUniforms.u_lightPosition,u_simPrevPosLifeTexture:this.shaderUniforms.u_simPrevPosLifeTexture,u_simDefaultPosLifeTexture:this.shaderUniforms.u_simDefaultPosLifeTexture,u_introDeltaTime:this.base.shaderUniforms.u_introDeltaTime,u_noiseTime:{value:0},u_noiseScale:{value:0},u_noiseStableFactor:this.shaderUniforms.u_noiseStableFactor},fragmentShader:Gi});let t=this.SIM_TEXTURE_WIDTH*this.SIM_TEXTURE_HEIGHT,i=new Float32Array(t*4);for(let n=0,a=0;n<t;n++,a+=4){let s=Math.random(),l=Math.random(),u=s*2*Math.PI,v=Math.acos(2*l-1),c=.25+Math.cbrt(Math.random())*.5,h=Math.sin(u),_=Math.cos(u),p=Math.sin(v),g=Math.cos(v);i[a+0]=c*p*_,i[a+1]=c*p*h,i[a+2]=c*g,i[a+3]=n/t-1}let o=this.shaderUniforms.u_simDefaultPosLifeTexture.value=this.fboHelper.createDataTexture(i,this.SIM_TEXTURE_WIDTH,this.SIM_TEXTURE_HEIGHT,!0,!0);this.fboHelper.copy(o,this.currPositionRenderTarget)}update(e){if(this.isPlaying){let t=this.currPositionRenderTarget;this.currPositionRenderTarget=this.prevPositionRenderTarget,this.prevPositionRenderTarget=t,this.shaderUniforms.u_simCurrPosLifeTexture.value=this.currPositionRenderTarget.texture,this.shaderUniforms.u_simPrevPosLifeTexture.value=this.prevPositionRenderTarget.texture,this.positionMaterial.uniforms.u_noiseTime.value+=e*this.noiseSpeed,this.noiseScaleTime+=e;const i=this._noise.getFbm(this.noiseScaleTime,3);this.positionMaterial.uniforms.u_noiseScale.value=10*Math.abs(i),this.noiseStableFactorTime+=.5*e,this.noiseStableFactor+=.05*Math.abs(this._noise.getFbm(this.noiseStableFactorTime,3)),this.shaderUniforms.u_noiseStableFactor.value=this.math.fit(this.base.introRatio,0,.4,0,1)*this.math.smoothstep(.9,.95,.5+.5*Math.sin(this.noiseStableFactor)),this.fboHelper.render(this.positionMaterial,this.currPositionRenderTarget)}}}var Hi=`#define GLSLIFY 1
uniform sampler2D u_prevSliceTexture;
uniform sampler2D u_drawnSliceTexture;
varying vec2 v_uv;

#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}
vec4 sampleSlice4(vec3 gridPos){
    vec3 sliceOffset=vec3(-.5, .5, 0.);
    return (texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.xxz)))+texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.xyz)))+texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.yxz)))+texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.yyz))))/4.;
}
void main(){
    vec3 gridPos=vec3(mod(gl_FragCoord.xy, u_lightFieldGridCount.xy), dot(floor(gl_FragCoord.xy/u_lightFieldGridCount.xy), vec2(1., u_lightFieldSliceColRowCount.x))+.5);
    vec4 prev=texture2D(u_prevSliceTexture, v_uv);
    vec4 curr=(sampleSlice4(gridPos+vec3(0., 0., -1.))+sampleSlice4(gridPos)*2.+sampleSlice4(gridPos+vec3(0., 0., 1.)))*.25;
    prev+=(curr-prev)*mix(0.15, 0.08, clamp(prev.r, 0., 1.));
    gl_FragColor=prev;
}`;class Yi{constructor(e){r(this,"GRID_COUNT",new m(64,64,64));r(this,"VOLUME_SIZE",new m(8,0,0));r(this,"container",new D);r(this,"prevSliceRenderTarget",null);r(this,"currSliceRenderTarget",null);r(this,"drawnSliceRenderTarget",null);r(this,"sliceTo3DMesh",null);r(this,"sliceBlendMaterial");r(this,"sliceColumnCount",0);r(this,"sliceRowCount",0);r(this,"gridSize",0);r(this,"SHOW_TEST_VOXELS",!1);r(this,"shaderUniforms",{u_lightFieldTexture3D:{value:null},u_lightFieldMaxLod:{value:0},u_lightFieldSlicedTexture:{value:null},u_lightFieldSlicedTextureSize:{value:new S},u_lightFieldSliceColRowCount:{value:new S},u_lightFieldGridSize:{value:0},u_lightFieldGridCount:{value:this.GRID_COUNT},u_lightFieldVolumeOffset:{value:new m},u_lightFieldVolumeSize:{value:new m}});this.base=e,this.fboHelper=e.fboHelper,this.gridSize=this.VOLUME_SIZE.x/(this.GRID_COUNT.x-1),this.shaderUniforms.u_lightFieldGridSize.value=this.gridSize,this.VOLUME_SIZE.y=this.gridSize*(this.GRID_COUNT.y-1),this.VOLUME_SIZE.z=this.gridSize*(this.GRID_COUNT.z-1),this.shaderUniforms.u_lightFieldVolumeSize.value.setScalar(this.gridSize).add(this.VOLUME_SIZE),this.shaderUniforms.u_lightFieldMaxLod.value=Math.log2(Math.min(this.GRID_COUNT.x,this.GRID_COUNT.y,this.GRID_COUNT.z));let t=this.GRID_COUNT.x*this.GRID_COUNT.y*this.GRID_COUNT.z,i=this.sliceColumnCount=Math.ceil(Math.sqrt(t)/this.GRID_COUNT.x),o=this.sliceRowCount=Math.ceil(this.GRID_COUNT.z/i);this.shaderUniforms.u_lightFieldSliceColRowCount.value.set(i,o);let n=this.GRID_COUNT.x*i,a=this.GRID_COUNT.y*o;this.shaderUniforms.u_lightFieldSlicedTextureSize.value.set(n,a),this.currSliceRenderTarget=this.fboHelper.createRenderTarget(n,a),this.prevSliceRenderTarget=this.currSliceRenderTarget.clone(),this.drawnSliceRenderTarget=this.currSliceRenderTarget.clone(),this.fboHelper.clearColor(0,0,0,0,this.currSliceRenderTarget),this.sliceBlendMaterial=this.fboHelper.createRawShaderMaterial({uniforms:{u_lightFieldSlicedTextureSize:this.shaderUniforms.u_lightFieldSlicedTextureSize,u_lightFieldSliceColRowCount:this.shaderUniforms.u_lightFieldSliceColRowCount,u_lightFieldGridCount:this.shaderUniforms.u_lightFieldGridCount,u_lightFieldVolumeOffset:this.shaderUniforms.u_lightFieldVolumeOffset,u_lightFieldVolumeSize:this.shaderUniforms.u_lightFieldVolumeSize,u_prevSliceTexture:{value:null},u_drawnSliceTexture:{value:this.drawnSliceRenderTarget.texture}},fragmentShader:Hi})}update(e){let t=this.VOLUME_SIZE.clone().multiplyScalar(.5).sub(this.base.heroLight.position).multiplyScalar(-1);this.shaderUniforms.u_lightFieldVolumeOffset.value.setScalar(-this.gridSize/2).add(t);let i=this.base.renderer,o=this.fboHelper.getColorState(),n=i.getRenderTarget();i.setRenderTarget(this.drawnSliceRenderTarget),i.setClearColor(0,0),i.clear(),i.setRenderTarget(n),this.fboHelper.setColorState(o)}renderMesh(e){let t=this.base.renderer,i=this.fboHelper.getColorState(),o=t.getRenderTarget();t.autoClearColor=!1,this.fboHelper.renderMesh(e,this.drawnSliceRenderTarget),t.setRenderTarget(o),this.fboHelper.setColorState(i)}postUpdate(){let e=this.base.renderer,t=this.fboHelper.getColorState(),i=e.getRenderTarget();e.autoClear=!1;let o=this.prevSliceRenderTarget;this.prevSliceRenderTarget=this.currSliceRenderTarget,this.currSliceRenderTarget=o,this.shaderUniforms.u_lightFieldSlicedTexture.value=this.currSliceRenderTarget.texture,this.sliceBlendMaterial.uniforms.u_prevSliceTexture.value=this.prevSliceRenderTarget.texture,this.fboHelper.render(this.sliceBlendMaterial,this.currSliceRenderTarget),e.setRenderTarget(i),this.fboHelper.setColorState(t)}}class ji{constructor(e){r(this,"shaderUniforms",{u_lightScatterDivider:{value:new S(1.1,5.5)},u_lightScatterPowInv:{value:0},u_lightScatterRatio:{value:0},u_lightScatterPos0:{value:new m(0,18,0)},u_lightScatterPos1:{value:new m(0,0,0)}});this.base=e,this._brownianMotion0=new re,this._brownianMotion1=new re}update(){let e=this.base.math.fit(this.base.introRatio,0,.2,2,.7);e=this.base.math.fit(this.base.introRatio,.7,.85,e,.4),this.shaderUniforms.u_lightScatterPowInv.value=e,this.shaderUniforms.u_lightScatterRatio.value=this.base.math.fit(0,.7,.85,1,0,ft)}}var Vi=`#define GLSLIFY 1
attribute vec3 simUv;
uniform sampler2D u_simCurrPosLifeTexture;
uniform vec2 u_simTextureSize;
uniform float u_sceneHideRatio;
uniform float u_isEmissive;
uniform float u_noiseStableFactor;
uniform sampler2D u_lightFieldSlicedTexture;

#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec3 v_worldNormal;
varying float v_depth;
varying float v_diff;
varying float v_ao;
varying float v_emission;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, simUv.xy);
    vec4 rands=hash43(simUv);
    float particleSize=mix(0.06, 0.175, u_isEmissive)*(0.5+rands.x*0.5);
    float particleSizeScale=linearStep(0.0, 0.1, currPositionInfo.w)*linearStep(1.0, 0.9, currPositionInfo.w);
    particleSize*=particleSizeScale*(1.0-u_sceneHideRatio);
    vec3 pos=position*particleSize+currPositionInfo.xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_viewNormal=normalMatrix*normal;
    v_worldNormal=normalize((vec4(v_viewNormal, 0.)*viewMatrix).xyz);
    vec3 rayGridDir=v_worldNormal;
    vec3 rayGridPos=lightFieldPosToGrid(v_worldPosition);
    vec4 indirectDiffuse=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+rayGridDir);
    float lifeFalloff=mix(0.5, 1., particleSizeScale);
    v_emission=(indirectDiffuse.a*0.55*lifeFalloff+0.45)*u_isEmissive;
    v_diff=(1.-indirectDiffuse.a)*lifeFalloff;
    v_diff*=linearStep(5., 1.5, length(v_worldPosition-vec3(0., 8., 0.)));
    v_ao=1.0-indirectDiffuse.a;

    #define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
}`,Qi=`#define GLSLIFY 1
uniform sampler2D u_lightFieldSlicedTexture;
uniform float u_noiseStableFactor;
uniform float u_emissiveRatio;
uniform float u_contrast;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec3 v_viewNormal;
varying float v_depth;
varying float v_diff;
varying float v_emission;
varying float v_ao;

#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}
#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy);
    vec3 viewNormal=normalize(v_viewNormal);
    vec3 worldNormal=normalize(v_worldNormal);
    vec3 rayGridPos=lightFieldPosToGrid(v_worldPosition);
    vec3 rayGridDir=worldNormal;
    vec3 rayGridSpecDir=reflect(normalize(v_worldPosition-cameraPosition), worldNormal);
    vec4 indirectSpecular=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+normalize(rayGridSpecDir+(noise-.5)*0.25)*(1.+noise.z));
    float specular=indirectSpecular.r;
    vec3 rayGridRefractDir=refract(normalize(v_worldPosition-cameraPosition), worldNormal, 1./1.4);
    vec4 refractionInfo=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+normalize(rayGridRefractDir+(noise-.5)*0.25)*(1.5+noise.z));
    float refraction=refractionInfo.r*(1.-refractionInfo.a*0.75);
    float shade=v_diff*0.45+specular+refraction;
    shade+=getScatter(cameraPosition, v_worldPosition)*1.35;
    float viewShade=linearStep(-1., 1., dot(viewNormal, vec3(.5773)));
    shade=mix(shade, viewShade, v_emission*v_ao)*(.4+v_ao*.6);
    gl_FragColor=vec4(mix(shade, smoothstep(0., 1., shade), 0.5), v_depth, 1., mix(v_diff*v_diff+v_emission, 1., u_emissiveRatio));
}`,Wi=`#define GLSLIFY 1
attribute vec3 simUv;
uniform sampler2D u_simCurrPosLifeTexture;
uniform vec2 u_simTextureSize;
uniform float u_sceneHideRatio;
uniform float u_isEmissive;
uniform float u_noiseStableFactor;
uniform sampler2D u_lightFieldSlicedTexture;

#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec3 v_worldNormal;
varying float v_depth;
varying float v_diff;
varying float v_ao;
varying float v_emission;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, simUv.xy);
    vec4 rands=hash43(simUv);
    float particleSize=mix(0.06, 0.175, u_isEmissive)*(0.5+rands.x*0.5);
    float particleSizeScale=linearStep(0.0, 0.1, currPositionInfo.w)*linearStep(1.0, 0.9, currPositionInfo.w);
    particleSize*=particleSizeScale*(1.0-u_sceneHideRatio);
    vec3 pos=position*particleSize+currPositionInfo.xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_viewNormal=normalMatrix*normal;
    v_worldNormal=normalize((vec4(v_viewNormal, 0.)*viewMatrix).xyz);
    vec3 rayGridDir=v_worldNormal;
    vec3 rayGridPos=lightFieldPosToGrid(v_worldPosition);
    vec4 indirectDiffuse=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+rayGridDir);
    float lifeFalloff=mix(0.5, 1., particleSizeScale);
    v_emission=(indirectDiffuse.a*0.55*lifeFalloff+0.45)*u_isEmissive;
    v_diff=(1.-indirectDiffuse.a)*lifeFalloff;
    v_diff*=linearStep(5., 1.5, length(v_worldPosition-vec3(0., 8., 0.)));
    v_ao=1.0-indirectDiffuse.a;

    #define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
}`,Zi=`#define GLSLIFY 1
uniform sampler2D u_lightFieldSlicedTexture;
uniform float u_noiseStableFactor;
uniform float u_emissiveRatio;
uniform float u_contrast;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec3 v_viewNormal;
varying float v_depth;
varying float v_diff;
varying float v_emission;
varying float v_ao;

#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}
#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy);
    vec3 viewNormal=normalize(v_viewNormal);
    vec3 worldNormal=normalize(v_worldNormal);
    vec3 rayGridPos=lightFieldPosToGrid(v_worldPosition);
    vec3 rayGridDir=worldNormal;
    vec3 rayGridSpecDir=reflect(normalize(v_worldPosition-cameraPosition), worldNormal);
    vec4 indirectSpecular=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+normalize(rayGridSpecDir+(noise-.5)*0.25)*(1.+noise.z));
    float specular=indirectSpecular.r;
    vec3 rayGridRefractDir=refract(normalize(v_worldPosition-cameraPosition), worldNormal, 1./1.4);
    vec4 refractionInfo=sampleLightField(u_lightFieldSlicedTexture, rayGridPos+normalize(rayGridRefractDir+(noise-.5)*0.25)*(1.5+noise.z));
    float refraction=refractionInfo.r*(1.-refractionInfo.a*0.75);
    float shade=v_diff*0.45+specular+refraction;
    shade+=getScatter(cameraPosition, v_worldPosition)*1.35;
    float viewShade=linearStep(-1., 1., dot(viewNormal, vec3(.5773)));
    shade=mix(shade, viewShade, v_emission*v_ao)*(.4+v_ao*.6);
    gl_FragColor=vec4(mix(shade, smoothstep(0., 1., shade), 0.5), v_depth, 1., mix(v_diff*v_diff+v_emission, 1., u_emissiveRatio));
}`,ki=`#define GLSLIFY 1
attribute vec2 simUv;
uniform sampler2D u_simPrevPosLifeTexture;
uniform sampler2D u_simCurrPosLifeTexture;
uniform vec2 u_simTextureSize;
uniform float u_strength;
uniform float u_aspect;
varying vec2 v_delta;
varying float v_headTail;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
vec2 rotate(vec2 v, float a){
    float s=sin(a);
    float c=cos(a);
    mat2 m=mat2(c, s, -s, c);
    return m*v;
}
void main(){
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, simUv);
    vec4 prevPositionInfo=texture2D(u_simPrevPosLifeTexture, simUv);
    vec4 rands=hash43(vec3(simUv.xy, 0.));
    float particleSize=(simUv.x<0.005 ? 0.175 : 0.06)*(0.5+rands.x*0.5);
    mat4 mvp=projectionMatrix*modelViewMatrix;
    vec4 currScreenPos=mvp*vec4(currPositionInfo.xyz, 1.0);
    vec4 prevScreenPos=mvp*vec4(prevPositionInfo.xyz, 1.0);
    currScreenPos/=currScreenPos.w;
    prevScreenPos/=prevScreenPos.w;
    vec2 screenPosDelta=currScreenPos.xy-prevScreenPos.xy;
    float screenPosDist=length(screenPosDelta);
    float angle=screenPosDist>0.001 ? atan(screenPosDelta.y, screenPosDelta.x*u_aspect): 0.;
    vec4 screenPos=position.x>-0.0001 ? currScreenPos : prevScreenPos;
    vec4 offsetScreenPos=modelViewMatrix*vec4((position.x>0. ? currPositionInfo.xyz : prevPositionInfo.xyz), 1.0);
    offsetScreenPos.xy+=particleSize;
    offsetScreenPos=projectionMatrix*offsetScreenPos;
    offsetScreenPos/=offsetScreenPos.w;
    offsetScreenPos=offsetScreenPos-screenPos;
    v_delta=screenPosDelta;
    v_headTail=position.x;
    vec4 pos=vec4(position, 0.);
    pos.xy=rotate(pos.xy, angle)*length(offsetScreenPos.xy*vec2(u_aspect, 1.));
    pos.xy*=vec2(1./u_aspect, 1.);
    pos+=screenPos;
    pos.xy+=v_delta*.5;
    v_delta=v_delta*2.+.5;
    gl_Position=pos;
    if (currPositionInfo.w>prevPositionInfo.w){
        gl_Position=vec4(2., 0., 0., 1.);
    }
}`,Ji=`#define GLSLIFY 1
varying vec2 v_delta;
varying float v_headTail;
void main(){
    float ratio=sqrt(abs(v_headTail)*2.);
    float strength=sign(v_headTail)*ratio*-.5;
    gl_FragColor=vec4(v_delta, strength+.5, v_headTail+0.5);
}`,Xi=`#define GLSLIFY 1
attribute vec3 position;
uniform sampler2D u_simCurrPosLifeTexture;
uniform float u_noiseStableFactor;

#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}
varying vec4 v_color;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
void main(){
    vec4 rands=hash43(position);
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, position.xy);
    float scale=linearStep(1.0, 0.9, currPositionInfo.w);
    vec3 pos=currPositionInfo.xyz;
    vec3 lightFieldGrid=clampedLightFieldPosToGrid(pos);
    vec2 lightFieldUv=lightFieldGridToUv(lightFieldGrid);
    gl_Position=vec4(lightFieldUv*2.0-1.0, 0.0, 1.0);
    gl_PointSize=1.0;
    vec3 color=position.x<0.005 ? vec3(1.): vec3(0.1);
    v_color=vec4(color, 1.)*scale;
}`,qi=`#define GLSLIFY 1
varying vec4 v_color;
void main(){
    gl_FragColor=v_color;
}`;class Ki{constructor(e){r(this,"container",new D);r(this,"emissiveMesh",null);r(this,"nonEmissiveMesh",null);r(this,"lightFieldMesh",null);r(this,"lodIds",["l","m","s","xs"]);r(this,"lodRefGeometries",[]);this.base=e,this.math=e.math,this.IS_SMALL_SCREEN=Math.min(e.width,e.height)<=820,this.lodRefGeometries=[this.base.sphere_l,this.base.sphere_m,this.base.sphere_s,this.base.sphere_xs];let t=this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH*this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT,i=new Float32Array(t*3),o=new X,n=new X,a=new Float32Array((this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH-1)*this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT*2),s=new Float32Array(this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT*2);for(let c=0,h=0,_=0,p=0;c<t;c++,h+=3){let g=i[h+0]=(c%this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH+.5)/this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH,A=i[h+1]=(~~(c/this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH)+.5)/this.base.heroParticlesSimulation.SIM_TEXTURE_HEIGHT;c%this.base.heroParticlesSimulation.SIM_TEXTURE_WIDTH==0?(s[_+0]=g,s[_+1]=A,_+=2):(a[p+0]=g,a[p+1]=A,p+=2)}o.setAttribute("simUv",new H(a,2)),this.nonEmissiveMesh=new w(o,new O({uniforms:Object.assign({u_simCurrPosLifeTexture:this.base.heroParticlesSimulation.shaderUniforms.u_simCurrPosLifeTexture,u_simTextureSize:this.base.heroParticlesSimulation.shaderUniforms.u_simTextureSize,u_noiseStableFactor:this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor,u_isEmissive:{value:0},u_emissiveRatio:{value:0}},this.base.heroLightField.shaderUniforms,this.base.heroScatter.shaderUniforms,this.base.shaderUniforms,this.base.blueNoise.shaderUniforms),vertexShader:Vi,fragmentShader:Qi})),this.nonEmissiveMesh.renderOrder=5,this.nonEmissiveMesh.frustumCulled=!1,this.container.add(this.nonEmissiveMesh),n.setAttribute("simUv",new H(s,2)),this.emissiveMesh=new w(n,new O({uniforms:Object.assign({},this.nonEmissiveMesh.material.uniforms,{u_isEmissive:{value:1},u_emissiveRatio:{value:0}}),vertexShader:Wi,fragmentShader:Zi})),this.emissiveMesh.renderOrder=5,this.emissiveMesh.frustumCulled=!1,this.container.add(this.emissiveMesh);let l=new fe(1,1),u=new X;for(let c in l.attributes)u.attributes[c]=l.attributes[c];u.setIndex(l.getIndex()),u.setAttribute("simUv",new H(i,3)),this.motionMesh=new w(u,new O({uniforms:{u_simPrevPosLifeTexture:this.base.heroParticlesSimulation.shaderUniforms.u_simPrevPosLifeTexture,u_simCurrPosLifeTexture:this.base.heroParticlesSimulation.shaderUniforms.u_simCurrPosLifeTexture,u_aspect:this.base.commonUniforms.u_aspect},vertexShader:ki,fragmentShader:Ji})),this.motionMesh.frustumCulled=!1;let v=new W;v.name="lightFieldGeometry",v.setAttribute("position",new C(i,3)),this.lightFieldMesh=new Te(v,this.base.fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_simCurrPosLifeTexture:this.base.heroParticlesSimulation.shaderUniforms.u_simCurrPosLifeTexture,u_noiseStableFactor:this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor},this.base.heroLightField.shaderUniforms),vertexShader:Xi,fragmentShader:qi,blending:oe,blendEquation:de,blendSrc:M,blendDst:M,blendEquationAlpha:de,blendSrcAlpha:M,blendDstAlpha:M})),this.lightFieldMesh.frustumCulled=!1}update(e){this.nonEmissiveMesh.material.uniforms.u_emissiveRatio.value=this.math.fit(this.base.introRatio,0,.2,0,.75),this.emissiveMesh.material.uniforms.u_emissiveRatio.value=this.math.fit(this.base.introRatio,0,.2,0,.75);let t,i=this.base.introRatio<.3,o=!i&&this.base.introRatio<.7,n=0,a=0;this.IS_SMALL_SCREEN?(n=i?2:3,a=i?1:o?2:3):(n=i?1:o?2:3,a=i?0:o?1:3),t=this.lodRefGeometries[n];for(let l in t.attributes)this.nonEmissiveMesh.geometry.attributes[l]=t.attributes[l];this.nonEmissiveMesh.geometry.setIndex(t.getIndex()),t=this.lodRefGeometries[a];for(let l in t.attributes)this.emissiveMesh.geometry.attributes[l]=t.attributes[l];this.emissiveMesh.geometry.setIndex(t.getIndex()),this.base.heroLightField.renderMesh(this.lightFieldMesh);let s=this.math.fit(this.base.introRatio,0,.1,1,1.5);s=this.math.fit(this.base.introRatio,.1,.15,s,0),this.base.heroEfxPrevPass.motionBlurRatio=s,this.base.heroEfxPrevPass.motionBlurRatio>0&&this.base.heroEfxPrevPass.renderMotion(this.motionMesh,this.base.camera,this.base.width>>2,this.base.height>>2)}}var $i=`#define GLSLIFY 1
attribute float piece;
attribute float instanceId;
attribute vec4 instanceRands;
uniform sampler2D u_posRandTexture;
uniform sampler2D u_orientTexture;
uniform vec2 u_animationTextureSize;
uniform float u_time;
uniform float u_globalTime;
uniform float u_scale;
uniform float u_noiseStableFactor;
uniform float u_hudRatio;

#ifdef IS_SHADOW
uniform vec3 u_lightPosition;
uniform float u_lightShadowMaxDistance;
varying float v_distToLight;

#define GLSLIFY 1
uniform vec2 u_lightShadowTextureTexelSize;
vec2 getLightUv(vec3 lightToWorld){
    float flatYScale=1.5;
    vec2 flatUv=normalize(lightToWorld*vec3(1., flatYScale, 1.)).xz;
    vec2 dir=abs(normalize(flatUv));
    flatUv=(flatUv*(dir.y>dir.x ? 1./dir.y : 1./dir.x)*0.5+0.5)*vec2(1., 0.5);
    float isTop=lightToWorld.y>0.0 ? 1.0 : 0.0;
    float halfTexelY=u_lightShadowTextureTexelSize.y*0.5;
    flatUv.y=clamp(0.+isTop*halfTexelY, 0.5-(1.-isTop)*halfTexelY, flatUv.y);
    return flatUv+vec2(0., isTop*.5);
}
#else
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying float v_depth;

#endif
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec3 qrotate(vec4 q, vec3 v){
    return v+2.0*cross(q.xyz, cross(q.xyz, v)+q.w*v);
}
vec4 quaternion(vec3 axis, float halfAngle){
    return vec4(axis*sin(halfAngle), cos(halfAngle));
}
vec4 hash42(vec2 p){
    vec4 p4=fract(vec4(p.xyxy)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
vec2 rotate(vec2 v, float a){
    float s=sin(a);
    float c=cos(a);
    mat2 m=mat2(c, s, -s, c);
    return m*v;
}
void main(){
    float duration=0.25+2.+4.;
    float time=duration*instanceRands.x+u_time;
    float cycle=floor(time/duration);
    time=time-duration*cycle;
    vec4 cycleRands=hash42(vec2(cycle, instanceId));
    float flyUpRatio=pow(linearStep(2.25, 6.25, time), 1.5);
    float appearRatio=linearStep(0., 0.25, time-instanceRands.y)*(1.0-u_hudRatio);
    vec4 selfSpin=quaternion(normalize(instanceRands.xyz-0.5), flyUpRatio*mix(5.0, 30., cycleRands.z));
    float pieceScale=appearRatio;
    vec3 origin=vec3(0.0, 1.9+instanceRands.w*0.4, 0.0);
    float angle=cycleRands.x*6.2832;
    float radius=4.+cycleRands.w*4.;
    float rollRatio=1.0-linearStep(0., 3.25, time+instanceRands.x);
    radius-=(rollRatio*rollRatio)*5.;
    vec2 dir=vec2(cos(angle), sin(angle));
    vec3 instanceOffset=vec3(dir.x*radius, flyUpRatio*mix(30.0, 40., cycleRands.z)+u_noiseStableFactor*(0.5+0.5*sin(u_globalTime+instanceId*0.1))*0.1, dir.y*radius);
    instanceOffset.xz=rotate(instanceOffset.xz, flyUpRatio*flyUpRatio*mix(-1., 1., instanceRands.z))*smoothstep(1.5, 0.35, flyUpRatio);
    float frame=linearStep(0.25, 2.25, time)*119.;
    float frameFloor=floor(frame);
    float frameCeil=min(frameFloor+1., 119.);
    float frameFract=frame-frameFloor;
    vec4 simUvs=(vec3(piece, frameFloor, frameCeil).xyxz+.5)/u_animationTextureSize.xyxy;
    vec4 posRand1=texture2D(u_posRandTexture, simUvs.xy);
    vec4 orient1=texture2D(u_orientTexture, simUvs.xy);
    vec4 posRand2=texture2D(u_posRandTexture, simUvs.zw);
    vec4 orient2=texture2D(u_orientTexture, simUvs.zw);

    #ifdef IS_SHADOW
    pieceScale*=1.5;

    #endif
    vec3 pos1=qrotate(orient1, position)*pieceScale+posRand1.xyz;
    vec3 pos2=qrotate(orient2, position)*pieceScale+posRand2.xyz;
    vec3 pos=u_scale*0.75*mix(0.5, 1.5, instanceRands.z*instanceRands.z)*linearStep(1., 0.9, flyUpRatio)*(qrotate(selfSpin, mix(pos1, pos2, frameFract)-origin)+origin)*mix(0.3, 0.7, cycleRands.w)+instanceOffset;

    #ifdef IS_SHADOW
    pos=(modelMatrix*vec4(pos, 1.0)).xyz;
    vec3 center=instanceOffset+origin-u_lightPosition;
    pos-=u_lightPosition;
    v_distToLight=length(pos)/u_lightShadowMaxDistance;
    if (center.y>0.0){
        pos.y=max(0.001, pos.y);
    }
    else {
        pos.y=min(-0.001, pos.y);
    }
    gl_Position=vec4(getLightUv(pos)*2.0-1.0, 1.-v_distToLight, 1.0);

    #else
    vec3 nor1=qrotate(selfSpin, qrotate(orient1, normal));
    vec3 nor2=qrotate(selfSpin, qrotate(orient2, normal));
    vec3 nor=normalize(mix(nor1, nor2, frameFract));
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_viewNormal=normalMatrix*nor;
    v_uv=uv;
    vec4 viewPosition=modelViewMatrix*vec4(pos, 1.0);

    #define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
    #endif
}`,er=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec4 u_textureChannelMixer;
uniform vec3 u_lightColor;
uniform vec3 u_lightPosition;
uniform float u_noiseStableFactor;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying float v_depth;
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}

#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
void main(){
    float pattern=dot(u_textureChannelMixer, texture2D(u_texture, v_uv));
    vec3 viewNormal=normalize(v_viewNormal);
    vec3 worldNormal=inverseTransformDirection(viewNormal, viewMatrix);
    vec3 worldToLight=u_lightPosition-v_worldPosition;
    float worldToLightDist=length(worldToLight);
    float attenutation=1.0/(0.05+(0.02-0.005*u_noiseStableFactor)*worldToLightDist*worldToLightDist);
    worldToLight/=worldToLightDist;
    vec3 cameraToWorld=normalize(v_worldPosition-cameraPosition);
    float diff=0.25+0.75*dot(worldNormal, worldToLight);
    float spec=0.8*dot(reflect(cameraToWorld, worldNormal), worldToLight);
    vec3 color=vec3(pattern);
    color*=attenutation*(0.05+diff+spec*diff);
    gl_FragColor=vec4(color*0.85+0.15, spec*(0.3+u_noiseStableFactor));
    gl_FragColor.rgb+=getScatter(cameraPosition, v_worldPosition);

    #define GLSLIFY 1
gl_FragColor.r=gl_FragColor.r;
gl_FragColor.g=v_depth;
gl_FragColor.b=1.0;
}`,tr=`#define GLSLIFY 1
varying float v_distToLight;
void main(){
    gl_FragColor=vec4(v_distToLight);
}`;class ir{constructor(e){r(this,"ROCK_PIECE_COUNT",16);r(this,"FRAME_COUNT",120);r(this,"FPS",60);r(this,"COUNT",64);r(this,"container",new D);r(this,"meshList",[]);r(this,"shadowMeshList",[]);r(this,"meshAnimationUniformList",[]);r(this,"meshInstanceUniformsList",[]);r(this,"meshInstanceAttributesList",[]);r(this,"time",0);this.base=e,this.shaderUniforms={u_texture:{value:null},u_animationTextureSize:{value:new S(this.ROCK_PIECE_COUNT,this.FRAME_COUNT)},u_time:{value:0},u_globalTime:{value:0},u_scale:{value:0},u_lightPosition:this.base.heroLight.shaderUniforms.u_lightPosition,u_noiseStableFactor:this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor};let t=this.base.rocksTexture,i=this.base.fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_texture:{value:t}},this.base.heroScatter.shaderUniforms),fragmentShader:`
						uniform sampler2D u_texture;
						varying vec2 v_uv;
						void main () {
							vec2 uv = v_uv * 0.5;
							gl_FragColor = vec4(
								texture2D(u_texture, uv).g,
								texture2D(u_texture, uv + vec2(.5, 0.)).g,
								texture2D(u_texture, uv + vec2(0., .5)).g,
								texture2D(u_texture, uv + vec2(.5, .5)).g
							);
						}`}),o=this.base.fboHelper.createRenderTarget(512,512);o.texture.minFitler=Ze,o.texture.generateMipmaps=!0,this.base.fboHelper.render(i,o),this.shaderUniforms.u_texture.value=o.texture,i.dispose(),t.dispose();for(let n=0;n<4;n++){this.meshAnimationUniformList[n]={u_posRandTexture:{value:null},u_orientTexture:{value:null}},this.meshInstanceUniformsList[n]=Object.assign({u_textureChannelMixer:{value:new Q(+(n==0),+(n==1),+(n==2),+(n==3))}},this.meshAnimationUniformList[n],this.shaderUniforms,this.base.shaderUniforms,this.base.heroLight.shaderUniforms,this.base.heroScatter.shaderUniforms);let a=new Float32Array(this.COUNT),s=new Float32Array(this.COUNT*4);for(let l=0;l<this.COUNT;l++)a[l]=n+l*4,s[l*4+0]=Math.random(),s[l*4+1]=Math.random(),s[l*4+2]=Math.random(),s[l*4+3]=Math.random();this.meshInstanceAttributesList[n]={instanceId:new H(a,1),instanceRands:new H(s,4)},this.onRockLoad(n,!1,this.base[`rock_${n}`]),this.onRockLoad(n,!0,this.base[`rock_${n}_low`]),this.onRockAnimationLoad(n,this.base[`rock_animation_${n}`])}for(let n=0;n<4;n++)this.container.add(this.meshList[n])}onRockLoad(e,t,i){let o=new X;for(let s in i.attributes)o.setAttribute(s,i.attributes[s]);o.index=i.index;let n=this.meshInstanceAttributesList[e];o.setAttribute("instanceId",n.instanceId),o.setAttribute("instanceRands",n.instanceRands);let a=new w(o,new O({uniforms:this.meshInstanceUniformsList[e],vertexShader:$i,fragmentShader:er}));a.frustumCulled=!1,t?(this.shadowMeshList[e]=a,a.material.defines.IS_SHADOW=!0,a.material.fragmentShader=tr,a.material.side=Ce):this.meshList[e]=a}onRockAnimationLoad(e,t){let i=t.attributes.position.array,o=t.attributes.orient.array,n=new Float32Array(i.length/3*4),a=[];for(let s=0,l=0,u=0;l<i.length;s++,l+=3,u+=4)n[u]=i[l],n[u+1]=i[l+1],n[u+2]=i[l+2],s<this.ROCK_PIECE_COUNT&&(a[s]=Math.random()),n[u+3]=a[s%this.ROCK_PIECE_COUNT];this.meshAnimationUniformList[e].u_posRandTexture.value=this.base.fboHelper.createDataTexture(n,this.ROCK_PIECE_COUNT,this.FRAME_COUNT,!0,!0),this.meshAnimationUniformList[e].u_orientTexture.value=this.base.fboHelper.createDataTexture(o,this.ROCK_PIECE_COUNT,this.FRAME_COUNT,!0,!0)}update(e){this.time+=e,this.shaderUniforms.u_time.value=this.time,this.shaderUniforms.u_globalTime.value=this.base.time,this.shaderUniforms.u_scale.value=this.base.math.fit(this.base.introRatio,0,.2,0,1);for(let t=0;t<4;t++)this.base.heroLight.renderMesh(this.shadowMeshList[t])}}var rr=`#define GLSLIFY 1
uniform sampler2D u_prevTexture;
uniform sampler2D u_lightShadowTexture;
uniform vec3 u_lightPosition;
uniform vec2 u_blueNoiseOffset;
uniform float u_lightShadowMaxDistance;
uniform float u_radius;
uniform float u_texelSize;
varying vec2 v_uv;

#define GLSLIFY 1
uniform vec2 u_lightShadowTextureTexelSize;
vec2 getLightUv(vec3 lightToWorld){
    float flatYScale=1.5;
    vec2 flatUv=normalize(lightToWorld*vec3(1., flatYScale, 1.)).xz;
    vec2 dir=abs(normalize(flatUv));
    flatUv=(flatUv*(dir.y>dir.x ? 1./dir.y : 1./dir.x)*0.5+0.5)*vec2(1., 0.5);
    float isTop=lightToWorld.y>0.0 ? 1.0 : 0.0;
    float halfTexelY=u_lightShadowTextureTexelSize.y*0.5;
    flatUv.y=clamp(0.+isTop*halfTexelY, 0.5-(1.-isTop)*halfTexelY, flatUv.y);
    return flatUv+vec2(0., isTop*.5);
}
#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    vec3 blueNoise=getBlueNoise(gl_FragCoord.xy+u_blueNoiseOffset);
    vec2 uvDir=normalize(v_uv-0.5);
    vec2 uv=v_uv-uvDir*u_texelSize;
    vec3 worldPosition=vec3(uv*2.0-1.0, 0.0).xzy*u_radius;
    worldPosition.z*=-1.0;
    vec3 lightToWorld=worldPosition-u_lightPosition;
    float distToLight=length(lightToWorld);
    float expandRatio=linearStep(u_lightPosition.y, 14., distToLight);
    vec3 lightSampleStep=((vec3(lightToWorld.x, 0.0, lightToWorld.z)*(1.0-expandRatio*0.75)+(blueNoise-0.5)*expandRatio*4.)*25.0*expandRatio*expandRatio)/float(LIGHT_SHADOW_SAMPLE_COUNT)*-mix(0.06, 0.1, expandRatio);
    vec3 lightToWorldPos=lightToWorld+lightSampleStep*blueNoise.y;
    float accum=0.0;
    for (int i=0;
    i<LIGHT_SHADOW_SAMPLE_COUNT;
    i++){
        float selfDist=min(1.0, length(lightToWorldPos)/u_lightShadowMaxDistance);
        vec2 lightShadowUv=getLightUv(lightToWorldPos);
        float dist=texture2D(u_lightShadowTexture, lightShadowUv).r;
        float delta=selfDist-dist;
        accum+=delta>0. ? min(delta*delta*20., 1.): 1.0;
        lightToWorldPos+=lightSampleStep;
    }
    float shadowMask=accum/float(LIGHT_SHADOW_SAMPLE_COUNT);
    shadowMask=mix(shadowMask, 1.0, expandRatio);
    shadowMask=pow(shadowMask, 6.);
    float prevShadowMask=texture2D(u_prevTexture, v_uv).r;
    gl_FragColor=vec4(mix(prevShadowMask, shadowMask, shadowMask>prevShadowMask ? 0.5 : 0.2));
}`,nr=`#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
void main(){
    vec3 pos=position;
    vec4 mvPosition=modelViewMatrix*vec4(position, 1.);
    gl_Position=projectionMatrix*mvPosition;
    v_worldPosition=(modelMatrix*vec4(position, 1.)).xyz;
    v_viewNormal=normalMatrix*normal;
    v_viewPosition=-mvPosition.xyz;
    v_uv=uv;
    v_localPosition=position;

    #define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
}`,or=`#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
uniform sampler2D u_texture;
uniform sampler2D u_groundShadowTexture;
uniform vec3 u_color;
uniform vec3 u_bgColor;
uniform vec3 u_lightPosition;
uniform float u_fogA;
uniform float u_fogB;
uniform float u_sceneRatio;
uniform float u_hudRatio;
uniform float u_noiseStableFactor;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define saturate(a) clamp(a, 0.0, 1.0)
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
vec3 applyFog(in vec3 rgb, in float distance, in vec3 rayOri, in vec3 rayDir){
    float a=u_fogA;
    float b=u_fogB;
    float fogAmount=(a/b)*exp(-rayOri.y*b)*(1.0-exp(-distance*rayDir.y*b))/rayDir.y;
    return mix(rgb, u_bgColor, fogAmount);
}
vec2 dHdxy_fwd(){
    vec2 dSTdx=dFdx(v_uv);
    vec2 dSTdy=dFdy(v_uv);
    float scale=0.1;
    float Hll=scale*texture2D(u_texture, v_uv).b;
    float dBx=scale*texture2D(u_texture, v_uv+dSTdx).b-Hll;
    float dBy=scale*texture2D(u_texture, v_uv+dSTdy).b-Hll;
    return vec2(dBx, dBy);
}
vec3 perturbNormalArb(vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection){
    vec3 vSigmaX=dFdx(surf_pos.xyz);
    vec3 vSigmaY=dFdy(surf_pos.xyz);
    vec3 vN=surf_norm;
    vec3 R1=cross(vSigmaY, vN);
    vec3 R2=cross(vN, vSigmaX);
    float fDet=dot(vSigmaX, R1)*faceDirection;
    vec3 vGrad=sign(fDet)*(dHdxy.x*R1+dHdxy.y*R2);
    return normalize(abs(fDet)*surf_norm-vGrad);
}

#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
void main(){
    vec3 blueNoise=getBlueNoise(gl_FragCoord.xy+vec2(48., 31.));
    vec3 mixedTexture=texture2D(u_texture, v_uv).rgb;
    float shadow=mixedTexture.r;
    float light=clamp(mixedTexture.g, 0.1, 1.0);
    float faceDirection=gl_FrontFacing ? 1.0 :-1.0;
    vec3 normal=normalize(v_viewNormal)*faceDirection;
    normal=perturbNormalArb(-v_viewPosition, normal, dHdxy_fwd(), faceDirection);
    vec3 N=inverseTransformDirection(normal, viewMatrix);
    vec3 L=normalize(u_lightPosition-v_worldPosition);
    vec3 V=normalize(cameraPosition-v_worldPosition);
    vec3 reflection=normalize(reflect(-V, N));
    float NdL=clamp(dot(N, L), 0.001, 1.0);
    float NdV=clamp(abs(dot(N, V)), 0.001, 1.0);
    vec3 lightToWorld=v_worldPosition-u_lightPosition;
    float distToLight=length(lightToWorld);
    float attenutation=1.0/(0.05+(0.025-0.005*u_noiseStableFactor)*distToLight*distToLight);
    float dist=1.0-pow(2.0*length(v_uv-0.5), 2.0);
    float rockShadows=texture2D(u_groundShadowTexture, (vec2(v_localPosition.x, -v_localPosition.z)+(blueNoise.xy-.5)*0.1)*0.0425+0.5).r;
    float spec=dot(reflect(V, N), L)*linearStep(0.9, 0.0, N.y)*4.;
    gl_FragColor.rgb=vec3(light+attenutation*spec);
    gl_FragColor.rgb*=shadow*(0.5+rockShadows*0.5)*(1.+spec);
    gl_FragColor.rgb=applyFog(gl_FragColor.rgb, length(cameraPosition-v_worldPosition), cameraPosition, -V);
    gl_FragColor.rgb+=getScatter(cameraPosition, v_worldPosition);

    #define GLSLIFY 1
gl_FragColor.r=gl_FragColor.r;
gl_FragColor.g=v_depth;
gl_FragColor.b=1.0;
    gl_FragColor.r=mix(gl_FragColor.r, shadow*(1.-abs(N.y)), u_hudRatio);
    gl_FragColor.r*=u_sceneRatio;
    gl_FragColor.g-=blueNoise.z*0.004;
    gl_FragColor.b=linearStep(15., 66., v_worldPosition.z);
    gl_FragColor.a=spec*shadow;
}`;class ar{constructor(e){r(this,"container",new D);r(this,"geometry",null);r(this,"mesh",null);r(this,"texture",null);r(this,"RADIUS",12);r(this,"SIZE",768);r(this,"shaderUniforms",{u_groundShadowTexture:{value:null}});r(this,"prevRenderTarget",null);r(this,"currRenderTarget",null);r(this,"blurCacheRenderTarget",null);this.base=e,this.geometry=this.base.terrain,this.texture=this.base.terrainShadowLightHeightTexture,this.texture.flipY=!0,this.texture.minFilter=j,this.prevRenderTarget=this.base.fboHelper.createRenderTarget(this.SIZE,this.SIZE),this.currRenderTarget=this.prevRenderTarget.clone(),this.blurCacheRenderTarget=this.prevRenderTarget.clone(),this.mesh=new w(new ke(1.1,128),this.base.fboHelper.createRawShaderMaterial({uniforms:Object.assign({u_prevTexture:{value:null},u_radius:{value:this.RADIUS},u_texelSize:{value:1/this.SIZE},u_blueNoiseOffset:{value:new S}},this.base.heroLight.shaderUniforms,this.base.blueNoise.shaderUniforms),fragmentShader:rr})),this.mesh.material.defines.LIGHT_SHADOW_SAMPLE_COUNT=8,this.groundMesh=new w(this.geometry,new O({uniforms:Object.assign({u_texture:{value:this.texture},u_groundShadowTexture:{value:this.currRenderTarget.texture},u_color:{value:new P},u_bgColor:{value:new P},u_noiseStableFactor:this.base.heroParticlesSimulation.shaderUniforms.u_noiseStableFactor,u_fogA:{value:.03},u_fogB:{value:.285}},this.base.heroLight.shaderUniforms,this.base.heroScatter.shaderUniforms,this.base.blueNoise.shaderUniforms,this.base.shaderUniforms),vertexShader:nr,fragmentShader:or})),this.groundMesh.material.extensions.derivatives=!0,this.container.add(this.groundMesh),this.base.fboHelper.clearColor(1,1,1,1,this.currRenderTarget)}update(){let e=this.prevRenderTarget;this.prevRenderTarget=this.currRenderTarget,this.currRenderTarget=e;let t=this.base.renderer;this.base.fboHelper.getColorState();let i=t.getRenderTarget();t.setRenderTarget(this.currRenderTarget),t.setClearColor(16777215,1),this.mesh.material.uniforms.u_blueNoiseOffset.value.set(~~(Math.random()*128),~~(Math.random()*128)),this.mesh.material.uniforms.u_prevTexture.value=this.prevRenderTarget.texture,this.base.fboHelper.renderMesh(this.mesh,this.currRenderTarget),t.setRenderTarget(i),this.groundMesh.material.uniforms.u_groundShadowTexture.value=this.currRenderTarget.texture,this.groundMesh.material.uniforms.u_bgColor.value.copy(this.base.base.bgColor),this.groundMesh.material.uniforms.u_color.value.set("#fff")}}var sr=`#define GLSLIFY 1
attribute float t;
attribute float totalLength;
attribute float lineId;
varying float v_t;
varying float v_totalLength;
varying float v_thicknessRatio;
varying vec3 v_viewNormal;
varying vec3 v_worldNormal;
varying vec3 v_worldPosition;
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
void main(){
    v_t=t;
    v_totalLength=totalLength;
    float yIndex=floor(position.y+.5);
    v_thicknessRatio=step(mod(yIndex, 4.), 0.5);
    vec3 pos=position+normal*mix(0.04, 0.1, v_thicknessRatio);
    vec3 nor=normalize(normalMatrix*normal);
    v_viewNormal=nor;
    v_worldNormal=inverseTransformDirection(nor, viewMatrix);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    gl_Position.z-=0.1/gl_Position.w;
}`,lr=`#define GLSLIFY 1
uniform float u_time;
uniform float u_hudRatio;
varying float v_t;
varying float v_totalLength;
varying float v_thicknessRatio;
varying vec3 v_viewNormal;
varying vec3 v_worldNormal;
varying vec3 v_worldPosition;
vec4 mod289(vec4 x){
    return x-floor(x*(1.0/289.0))*289.0;
}
vec4 permute(vec4 x){
    return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r){
    return 1.79284291400159-0.85373472095314*r;
}
vec2 fade(vec2 t){
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}
float pnoise(vec2 P, vec2 rep){
    vec4 Pi=floor(P.xyxy)+vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf=fract(P.xyxy)-vec4(0.0, 0.0, 1.0, 1.0);
    Pi=mod(Pi, rep.xyxy);
    Pi=mod289(Pi);
    vec4 ix=Pi.xzxz;
    vec4 iy=Pi.yyww;
    vec4 fx=Pf.xzxz;
    vec4 fy=Pf.yyww;
    vec4 i=permute(permute(ix)+iy);
    vec4 gx=fract(i*(1.0/41.0))*2.0-1.0;
    vec4 gy=abs(gx)-0.5;
    vec4 tx=floor(gx+0.5);
    gx=gx-tx;
    vec2 g00=vec2(gx.x, gy.x);
    vec2 g10=vec2(gx.y, gy.y);
    vec2 g01=vec2(gx.z, gy.z);
    vec2 g11=vec2(gx.w, gy.w);
    vec4 norm=taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
    g00*=norm.x;
    g01*=norm.y;
    g10*=norm.z;
    g11*=norm.w;
    float n00=dot(g00, vec2(fx.x, fy.x));
    float n10=dot(g10, vec2(fx.y, fy.y));
    float n01=dot(g01, vec2(fx.z, fy.z));
    float n11=dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy=fade(Pf.xy);
    vec2 n_x=mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy=mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3*n_xy;
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    float t=mod(v_t-u_time*2., v_totalLength);
    float noiseScale=0.25;
    float n=pnoise(vec2(t*noiseScale, 0.), vec2(v_totalLength*noiseScale, 100.));
    float shade=mix(0.3+smoothstep(0., 0.-fwidth(n), n)*0.6, 1., v_thicknessRatio);
    shade*=linearStep(50., -20., v_worldPosition.z);
    gl_FragColor=vec4(shade, 0., 0., 1.)*step(v_totalLength-v_t, v_totalLength*u_hudRatio);
    gl_FragColor.b=linearStep(15., 66., v_worldPosition.z);
    gl_FragColor.r*=.85;
}`;let T=3,te=[60,245,806,966,991,1026,1191,1853,2061,3111,4279,4309,4338,5265,5316,5447,5475,6407,6445,7116,7235,7349,7934,8555,8583,8614,9154,9640,9688,10163,10420,10645,10895,11074,11286,11453,11596,11628,11740,11799,11832],ur=new m;class cr{constructor(e){r(this,"container",new D);r(this,"time",0);r(this,"shaderUniforms",{});this.base=e,this.onLineLoad(this.base.terrainLines)}onLineLoad(e){let t=e.attributes.position.array,i=te.length,o=t.length/3,n=new Float32Array(o*T*3),a=new Float32Array(o*T*3),s=new Float32Array(o*T),l=new Float32Array(o*T),u=new Uint8Array(o*T),v=new Uint16Array((o-i)*6*T),c=new m,h=new m,_=new m,p=new m,g=new m,A=new m,L=new Z,y=new m,x=0,I=0,E=0;for(let F=0;F<te.length;F++){let G=F==0?0:te[F-1],N=te[F];_.fromArray(t,G*3),h.copy(_),g.set(0,1,0);let U=0;for(let Y=G;Y<N;Y++){let ye=Y*3;c.copy(h),h.copy(_),Y<N-1&&_.fromArray(t,ye+3),p.subVectors(_,c).normalize(),A.crossVectors(g,p).normalize(),L.setFromAxisAngle(p,Math.PI*2/T),y.copy(g),U+=ur.copy(h).sub(c).length();for(let le=0;le<T;le++){if(y.applyQuaternion(L),n[I+0]=h.x,n[I+1]=h.y,n[I+2]=h.z,a[I+0]=y.x,a[I+1]=y.y,a[I+2]=y.z,s[x]=U,u[x]=F,Y<N-1){let ue=le==T-1?1-T:1;v[E++]=x,v[E++]=x+ue,v[E++]=x+T,v[E++]=x+ue,v[E++]=x+T+ue,v[E++]=x+T}x++,I+=3}}let V=T*(N-G);x-=V;let se=x+V;for(;x<se;x++)l[x]=U}let z=new W;z.setAttribute("position",new C(n,3)),z.setAttribute("normal",new C(a,3)),z.setAttribute("t",new C(s,1)),z.setAttribute("totalLength",new C(l,1)),z.setAttribute("lineId",new C(u,1)),z.setIndex(new C(v,1));let R=new O({uniforms:Object.assign({u_time:this.base.commonUniforms.u_time},this.base.shaderUniforms),vertexShader:sr,fragmentShader:lr,blending:oe,blendEquation:de,blendSrc:M,blendDst:M,blendEquationAlpha:K,blendSrcAlpha:M,blendDstAlpha:M});R.extensions.derivatives=!0,this.mesh=new w(z,R),this.mesh.renderOrder=15,this.container.add(this.mesh)}update(e){}}var hr=`#define GLSLIFY 1
attribute vec2 boneIndices;
attribute vec2 boneWeights;
uniform vec3 u_bonePoses[BONE_COUNT];
uniform vec4 u_boneOrients[BONE_COUNT];
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec2 v_uv;
varying float v_depth;
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix){
    return normalize((vec4(dir, 0.0)*matrix).xyz);
}
vec3 qrotate(vec4 q, vec3 v){
    return v+2.0*cross(q.xyz, cross(q.xyz, v)+q.w*v);
}
void main(){
    vec3 pos=vec3(0.0);
    vec3 nor=vec3(0.0);
    vec3 bonePos;
    vec4 boneOrient;
    bonePos=u_bonePoses[int(boneIndices.x)];
    boneOrient=u_boneOrients[int(boneIndices.x)];
    pos+=(qrotate(boneOrient, position)+bonePos)*boneWeights.x;
    nor+=qrotate(boneOrient, normal)*boneWeights.x;
    bonePos=u_bonePoses[int(boneIndices.y)];
    boneOrient=u_boneOrients[int(boneIndices.y)];
    pos+=(qrotate(boneOrient, position)+bonePos)*boneWeights.y;
    nor+=qrotate(boneOrient, normal)*boneWeights.y;
    vec4 mvPosition=modelViewMatrix*vec4(pos, 1.0);
    gl_Position=projectionMatrix*mvPosition;
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_worldNormal=inverseTransformDirection(nor, viewMatrix);
    v_uv=uv;

    #define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
}`,dr=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec3 u_lightPosition;
uniform vec3 u_lightMixer;
uniform float u_sceneRatio;
uniform float u_hudRatio;
varying vec3 v_worldPosition;
varying vec3 v_worldNormal;
varying vec2 v_uv;
varying float v_depth;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
void main(){
    vec3 worldNormal=normalize(v_worldNormal);
    vec3 worldToLight=u_lightPosition-v_worldPosition;
    float worldToLightDist=length(worldToLight);
    worldToLight/=worldToLightDist;
    vec3 cameraToWorld=normalize(v_worldPosition-cameraPosition);
    vec4 map=texture2D(u_texture, v_uv);
    float light=dot(u_lightMixer, map.rgb);
    light=pow(light, 1.25);
    float baseShade=map.a;
    vec3 color=vec3(baseShade*light);
    gl_FragColor=vec4(color, 0.);
    gl_FragColor.rgb+=getScatter(cameraPosition, v_worldPosition);

    #define GLSLIFY 1
gl_FragColor.r=gl_FragColor.r;
gl_FragColor.g=v_depth;
gl_FragColor.b=1.0;
    gl_FragColor.r*=u_sceneRatio*(1.-u_hudRatio);
}`,vr=`#define GLSLIFY 1
varying vec2 v_uv;
void main(){
    v_uv=uv;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position, 1.0);
}`,fr=`#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec3 u_lightMixer;
varying vec2 v_uv;

#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
void main(){
    vec3 blueNoises=getBlueNoise(gl_FragCoord.xy+vec2(3., 36.));
    vec3 map3=texture2D(u_texture, v_uv).xyz;
    float light1=dot(u_lightMixer, map3);
    float light2=dot(u_lightMixer.gbr, map3);
    float light=mix(light1, light2, blueNoises.x);
    light=light*light*.3+.7;
    gl_FragColor=vec4(light, 1., 1., 0.);
}`;class mr{constructor(e){r(this,"BONE_COUNT",54);r(this,"FPS",60);r(this,"container",new D);r(this,"geometry",null);r(this,"mesh",null);r(this,"texture",null);r(this,"shadowMesh",null);r(this,"shadowTexture",null);r(this,"time",0);r(this,"frameCount",0);r(this,"bonePosAnimationData");r(this,"boneOrientAnimationData");r(this,"bonePoses",new Float32Array(this.BONE_COUNT*3));r(this,"boneOrients",new Float32Array(this.BONE_COUNT*4));r(this,"shaderUniforms",{u_texture:{value:null},u_lightMixer:{value:new m(1,0,0)}});this.base=e,this.lightTexture=this.base.personLightTexutre,this.texture=this.base.personTexutre,this.shadowTexture=this.base.groundPersonShadowTexture,this.onTextureLoad(),this.onModelLoad(this.base.personGeometry),this.onAnimationLoad(this.base.personIdleGeometry),this.shadowMesh=new w(new fe(1.5,1.5),new O({uniforms:Object.assign({u_texture:{value:this.shadowTexture},u_lightMixer:this.shaderUniforms.u_lightMixer},this.base.blueNoise.shaderUniforms),vertexShader:vr,fragmentShader:fr,blending:Je})),this.shadowMesh.renderOrder=10,this.shadowMesh.position.y=.01,this.shadowMesh.rotation.x=-Math.PI/2,this.container.add(this.shadowMesh),this._v1$2=new m,this._v2$1=new m,this._q1$1=new Z,this._q2=new Z}onTextureLoad(){if(this.lightTexture&&this.texture){let e=this.base.fboHelper.createRenderTarget(this.lightTexture.image.width,this.lightTexture.image.height);e.texture.minFilter=Xe,e.texture.generateMipmaps=!1,this.shaderUniforms.u_texture.value=e.texture,this.base.fboHelper.copy(this.base.textureHelper.transparentTexture,e),this.base.textureHelper.mixChannels(this.lightTexture,e,0,1,2,-1),e.texture.generateMipmaps=!0,this.base.textureHelper.mixChannels(this.texture,e,-1,-1,-1,0),this.texture.dispose(),this.lightTexture.dispose(),this.texture=null,this.lightTexture=null}}onModelLoad(e){this.mesh=new w(e,new O({uniforms:Object.assign({u_texture:this.shaderUniforms.u_texture,u_lightMixer:this.shaderUniforms.u_lightMixer,u_bonePoses:{value:this.bonePoses},u_boneOrients:{value:this.boneOrients}},this.base.heroLight.shaderUniforms,this.base.heroScatter.shaderUniforms,this.base.shaderUniforms),vertexShader:hr,fragmentShader:dr})),this.mesh.material.defines.BONE_COUNT=this.BONE_COUNT,this.container.add(this.mesh)}onAnimationLoad(e){this.bonePosAnimationData=e.attributes.position.array,this.boneOrientAnimationData=e.attributes.orient.array,this.frameCount=this.bonePosAnimationData.length/(this.BONE_COUNT*3)}update(e){if(this.mesh&&this.frameCount){this.time+=e*.5;let t=this.time*this.FPS%this.frameCount,i=Math.floor(t),o=Math.ceil(t)%this.frameCount,n=t-i,a=i*this.BONE_COUNT,s=o*this.BONE_COUNT,l=this.frameCount/3;this.shaderUniforms.u_lightMixer.value.set(this.base.math.fit(t,l*2,this.frameCount,0,1)+this.base.math.fit(t,0,l,1,0),this.base.math.fit(t,0,l,0,1)*this.base.math.fit(t,l,l*2,1,0),this.base.math.fit(t,l,l*2,0,1)*this.base.math.fit(t,l*2,this.frameCount,1,0));for(let u=0;u<this.BONE_COUNT;u++)this._v1$2.fromArray(this.bonePosAnimationData,(a+u)*3).lerp(this._v2$1.fromArray(this.bonePosAnimationData,(s+u)*3),n).toArray(this.bonePoses,u*3),this._q1$1.fromArray(this.boneOrientAnimationData,(a+u)*4).slerp(this._q2.fromArray(this.boneOrientAnimationData,(s+u)*4),n).toArray(this.boneOrients,u*4)}}}var gr=`#define GLSLIFY 1
varying vec3 v_worldPosition;
varying vec2 v_uv;
varying float v_depth;
varying float v_instanceId;
varying float v_opacity;
attribute float a_instanceId;
attribute vec3 a_instancePos;
attribute vec3 a_instanceRands;
uniform float u_introTime;
uniform float u_sceneRatio;
uniform float u_hudRatio;
vec4 mod289(vec4 x){
    return x-floor(x*(1.0/289.0))*289.0;
}
float mod289(float x){
    return x-floor(x*(1.0/289.0))*289.0;
}
vec4 permute(vec4 x){
    return mod289(((x*34.0)+1.0)*x);
}
float permute(float x){
    return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r){
    return 1.79284291400159-0.85373472095314*r;
}
float taylorInvSqrt(float r){
    return 1.79284291400159-0.85373472095314*r;
}
vec4 grad4(float j, vec4 ip){
    const vec4 ones=vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p, s;
    p.xyz=floor(fract(vec3(j)*ip.xyz)*7.0)*ip.z-1.0;
    p.w=1.5-dot(abs(p.xyz), ones.xyz);
    s=vec4(lessThan(p, vec4(0.0)));
    p.xyz=p.xyz+(s.xyz*2.0-1.0)*s.www;
    return p;
}

#define F4 0.309016994374947451
vec4 simplexNoiseDerivatives(vec4 v_0){
    const vec4 C=vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
    vec4 i=floor(v_0+dot(v_0, vec4(F4)));
    vec4 x0=v_0-i+dot(i, C.xxxx);
    vec4 i0;
    vec3 isX=step(x0.yzw, x0.xxx);
    vec3 isYZ=step(x0.zww, x0.yyz);
    i0.x=isX.x+isX.y+isX.z;
    i0.yzw=1.0-isX;
    i0.y+=isYZ.x+isYZ.y;
    i0.zw+=1.0-isYZ.xy;
    i0.z+=isYZ.z;
    i0.w+=1.0-isYZ.z;
    vec4 i3=clamp(i0, 0.0, 1.0);
    vec4 i2=clamp(i0-1.0, 0.0, 1.0);
    vec4 i1=clamp(i0-2.0, 0.0, 1.0);
    vec4 x1=x0-i1+C.xxxx;
    vec4 x2=x0-i2+C.yyyy;
    vec4 x3=x0-i3+C.zzzz;
    vec4 x4=x0+C.wwww;
    i=mod289(i);
    float j0=permute(permute(permute(permute(i.w)+i.z)+i.y)+i.x);
    vec4 j1=permute(permute(permute(permute(i.w+vec4(i1.w, i2.w, i3.w, 1.0))+i.z+vec4(i1.z, i2.z, i3.z, 1.0))+i.y+vec4(i1.y, i2.y, i3.y, 1.0))+i.x+vec4(i1.x, i2.x, i3.x, 1.0));
    vec4 ip=vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);
    vec4 p0=grad4(j0, ip);
    vec4 p1=grad4(j1.x, ip);
    vec4 p2=grad4(j1.y, ip);
    vec4 p3=grad4(j1.z, ip);
    vec4 p4=grad4(j1.w, ip);
    vec4 norm=taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0*=norm.x;
    p1*=norm.y;
    p2*=norm.z;
    p3*=norm.w;
    p4*=taylorInvSqrt(dot(p4, p4));
    vec3 values0=vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2));
    vec2 values1=vec2(dot(p3, x3), dot(p4, x4));
    vec3 m0=max(0.5-vec3(dot(x0, x0), dot(x1, x1), dot(x2, x2)), 0.0);
    vec2 m1=max(0.5-vec2(dot(x3, x3), dot(x4, x4)), 0.0);
    vec3 temp0=-6.0*m0*m0*values0;
    vec2 temp1=-6.0*m1*m1*values1;
    vec3 mmm0=m0*m0*m0;
    vec2 mmm1=m1*m1*m1;
    float dx=temp0[0]*x0.x+temp0[1]*x1.x+temp0[2]*x2.x+temp1[0]*x3.x+temp1[1]*x4.x+mmm0[0]*p0.x+mmm0[1]*p1.x+mmm0[2]*p2.x+mmm1[0]*p3.x+mmm1[1]*p4.x;
    float dy=temp0[0]*x0.y+temp0[1]*x1.y+temp0[2]*x2.y+temp1[0]*x3.y+temp1[1]*x4.y+mmm0[0]*p0.y+mmm0[1]*p1.y+mmm0[2]*p2.y+mmm1[0]*p3.y+mmm1[1]*p4.y;
    float dz=temp0[0]*x0.z+temp0[1]*x1.z+temp0[2]*x2.z+temp1[0]*x3.z+temp1[1]*x4.z+mmm0[0]*p0.z+mmm0[1]*p1.z+mmm0[2]*p2.z+mmm1[0]*p3.z+mmm1[1]*p4.z;
    float dw=temp0[0]*x0.w+temp0[1]*x1.w+temp0[2]*x2.w+temp1[0]*x3.w+temp1[1]*x4.w+mmm0[0]*p0.w+mmm0[1]*p1.w+mmm0[2]*p2.w+mmm1[0]*p3.w+mmm1[1]*p4.w;
    return vec4(dx, dy, dz, dw)*49.0;
}
vec2 rotate(vec2 v, float a){
    float s=sin(a);
    float c=cos(a);
    mat2 m=mat2(c, s, -s, c);
    return m*v;
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
void main(){
    vec3 localPos=position;
    localPos.xy=rotate(localPos.xy, a_instanceRands.y*6.28+sign(-a_instancePos.x)*u_introTime*mix(0.03, 0.15, a_instanceRands.z));
    vec3 pos=(9.0+2.0*a_instanceRands.x)*localPos;
    vec3 noise=simplexNoiseDerivatives(vec4((a_instancePos+pos)*0.5, u_introTime*0.075)).yzw;
    float cycle=fract((0.08+0.08*a_instanceRands.x)*u_introTime+a_instanceRands.z);
    vec3 instancePos=a_instancePos+vec3(cycle*(a_instancePos.x*0.75+sign(a_instancePos.x)*0.25), 0.0, 0.0)+noise*vec3(0.35, 0.2, 0.1);
    instancePos.y-=linearStep(4., 1., abs(instancePos.x))*1.+0.5;
    pos+=instancePos;
    vec4 mvPosition=modelViewMatrix*vec4(pos, 1.);
    gl_Position=projectionMatrix*mvPosition;
    v_worldPosition=(modelMatrix*vec4(pos, 1.)).xyz;
    v_uv=uv;
    v_instanceId=a_instanceId;
    float d=(modelViewMatrix*vec4(instancePos, 1.0)).z;
    v_opacity=smoothstep(1., 3., -d)*u_sceneRatio*(1.-u_hudRatio)*linearStep(0., 0.25, cycle)*linearStep(1., 0.75, cycle)*mix(1., 0.75, a_instanceRands.x);
    if (v_opacity<0.004){
        gl_Position.z=2.*gl_Position.w;
    }

    #define GLSLIFY 1
float viewZ=(modelViewMatrix*vec4(pos, 1.0)).z;
float near=1.;
float far=100.0;
v_depth=1.0-(viewZ+near)/(near-far);
}`,_r=`#define GLSLIFY 1
varying vec3 v_worldPosition;
varying vec2 v_uv;
varying float v_depth;
varying float v_instanceId;
varying float v_opacity;
uniform sampler2D u_currSceneTexture;
uniform sampler2D u_fogTexture;
uniform vec2 u_resolution;
uniform vec3 u_lightPosition;
uniform float u_noiseStableFactor;
uniform float u_time;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define saturate(a) clamp(a, 0.0, 1.0)
#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}void main(){
    float faceDirection=gl_FrontFacing ? 1.0 :-1.0;
    vec2 screenPaintUv=gl_FragCoord.xy/u_resolution;
    vec2 fogMap=texture2D(u_fogTexture, v_uv).rg;
    vec4 currScene=texture2D(u_currSceneTexture, screenPaintUv);
    float depth=v_depth-fogMap.y*0.02;
    float depthMask=fogMap.x*1.35-fogMap.y*0.15;
    gl_FragColor.r=depthMask*v_opacity;
    gl_FragColor.gb=currScene.gb;
    gl_FragColor.a=exp(-length(v_worldPosition+vec3(0., 0., -max(0., fogMap.y-0.25)*10.+5.)-vec3(0., 0., 0.))*(0.22-fogMap.x*0.2))*fogMap.y*linearStep(0.0, 0.035, depth-currScene.g)*v_opacity*0.45;
}`;class xr{constructor(e){r(this,"container",new D);r(this,"geometry",null);r(this,"material",null);r(this,"mesh",null);r(this,"texture",null);r(this,"cacheRT",null);r(this,"INSTANCES_COUNT",32);this.base=e,this.texture=this.base.fogTexture;let t=this.base.math.getSeedRandomFn("fog96");this.cacheRT=this.base.fboHelper.createRenderTarget(1,1);const i=new fe(1,1,3,3);this.geometry=new X;for(let s in i.attributes)this.geometry.setAttribute(s,i.attributes[s]);this.geometry.setIndex(i.index);const o=new Float32Array(this.INSTANCES_COUNT),n=new Float32Array(this.INSTANCES_COUNT*3),a=new Float32Array(this.INSTANCES_COUNT*3);for(let s=0,l=0;s<this.INSTANCES_COUNT;s++)o[s]=s,n[l]=12*(t()*2-1),n[l+1]=-.25+.5*t(),n[l+2]=12*(1-s/(this.INSTANCES_COUNT-1)*2),a[l]=t()*2-1,a[l+1]=t()*2-1,a[l+2]=t()*2-1,l+=3;this.geometry.setAttribute("a_instanceId",new H(o,1)),this.geometry.setAttribute("a_instancePos",new H(n,3)),this.geometry.setAttribute("a_instanceRands",new H(a,3)),this.material=new O({uniforms:Object.assign({u_fogTexture:{value:this.texture},u_currSceneTexture:{value:this.cacheRT.texture},u_lightPosition:this.base.heroLight.shaderUniforms.u_lightPosition,u_resolution:this.base.commonUniforms.u_resolution},this.base.blueNoise.shaderUniforms,this.base.heroScatter.shaderUniforms,this.base.shaderUniforms),vertexShader:gr,fragmentShader:_r,side:Ce,depthWrite:!1,blending:oe,blendEquation:K,blendSrc:qe,blendDst:Ke,blendEquationAlpha:K,blendSrcAlpha:$e,blendDstAlpha:M}),this.mesh=new w(this.geometry,this.material),this.mesh.renderOrder=20,this.mesh.frustumCulled=!1,this.mesh.onBeforeRender=this.onBeforeRender.bind(this),this.container.add(this.mesh)}onBeforeRender(){let e=this.base.fboHelper.renderer,t=e.getRenderTarget();this.base.fboHelper.clearMultisampleRenderTargetState(),this.base.fboHelper.copy(t.texture,this.cacheRT),e.setRenderTarget(t)}resize(e,t){this.cacheRT.setSize(e,t)}update(e){}}var pr=`#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
uniform vec3 u_lightPosition;
void main(){
    vec3 pos=position;
    vec4 mvPosition=modelViewMatrix*vec4(pos, 1.);
    gl_Position=projectionMatrix*mvPosition;
    v_worldPosition=(modelMatrix*vec4(pos, 1.)).xyz;
    v_viewNormal=normalMatrix*normal;
    v_viewPosition=-mvPosition.xyz;
    v_uv=uv;
    v_localPosition=position;
    gl_Position.z=1.*(gl_Position.w);
}`,br=`#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
uniform vec3 u_bgColor;
uniform vec3 u_lightPosition;
uniform vec2 u_resolution;
uniform sampler2D u_currSceneTexture;
uniform float u_sceneRatio;
uniform float u_hudRatio;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define saturate(a) clamp(a, 0.0, 1.0)
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}
#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy+vec2(57., 27.));
    gl_FragColor.r=getScatter(cameraPosition, v_worldPosition);
    gl_FragColor.r*=u_sceneRatio*(1.-u_hudRatio);
    gl_FragColor.g=1.;
    gl_FragColor.b=linearStep(15., 66., v_worldPosition.z);
    gl_FragColor.a=0.;
    gl_FragColor.r+=noise.r*0.004;
}`;class Sr{constructor(e){r(this,"container",new D);r(this,"mesh",null);this.base=e,this.onGeometryLoad(this.base.bgBoxGeometry)}onGeometryLoad(e){this.mesh=new w(e,new O({uniforms:Object.assign({u_resolution:this.base.commonUniforms.u_resolution},this.base.heroLight.shaderUniforms,this.base.blueNoise.shaderUniforms,this.base.heroScatter.shaderUniforms,this.base.shaderUniforms),vertexShader:pr,fragmentShader:br})),this.mesh.renderOrder=10,this.container.add(this.mesh)}update(e){}resize(){}}function f(d){return new URL(Object.assign({"../../assets/buf/bg_box.buf":Ct,"../../assets/buf/camera_spline.buf":Pt,"../../assets/buf/edan.buf":yt,"../../assets/buf/ffi.buf":It,"../../assets/buf/letter_placements.buf":Rt,"../../assets/buf/line_capability.buf":Ft,"../../assets/buf/line_office.buf":Mt,"../../assets/buf/lorenzo.buf":Dt,"../../assets/buf/marcolp.buf":Lt,"../../assets/buf/person.buf":zt,"../../assets/buf/person_idle.buf":Et,"../../assets/buf/rock_0.buf":Nt,"../../assets/buf/rock_0_low.buf":Ot,"../../assets/buf/rock_1.buf":Ut,"../../assets/buf/rock_1_low.buf":Gt,"../../assets/buf/rock_2.buf":Bt,"../../assets/buf/rock_2_low.buf":Ht,"../../assets/buf/rock_3.buf":Yt,"../../assets/buf/rock_3_low.buf":jt,"../../assets/buf/rock_animation_0.buf":Vt,"../../assets/buf/rock_animation_1.buf":Qt,"../../assets/buf/rock_animation_2.buf":Wt,"../../assets/buf/rock_animation_3.buf":Zt,"../../assets/buf/sophie.buf":kt,"../../assets/buf/sphere_l.buf":Jt,"../../assets/buf/sphere_m.buf":Xt,"../../assets/buf/sphere_s.buf":qt,"../../assets/buf/sphere_xs.buf":Kt,"../../assets/buf/sunny.buf":$t,"../../assets/buf/terrain.buf":ei,"../../assets/buf/terrain_lines.buf":ti,"../../assets/texture/LDR_RGB1_0.png":ii,"../../assets/texture/award_gradient.png":ri,"../../assets/texture/flip_texture.png":ni,"../../assets/texture/fog.png":oi,"../../assets/texture/font.png":ai,"../../assets/texture/ground_person_shadow.webp":si,"../../assets/texture/person.webp":li,"../../assets/texture/person_light.webp":ui,"../../assets/texture/rocks.webp":ci,"../../assets/texture/terrain_shadow_light_height.webp":hi})[`../../assets/${d}`],import.meta.url).href}class Ar extends ne{constructor(t){super();r(this,"defaultCameraPosition",new m(0,0,5));r(this,"defaultLookAtPosition",new m(0,0,0));r(this,"properties",{defaultCameraPosition:new m(0,5,5),defaultLookAtPosition:new m(0,5,0),cameraDollyZoomFovOffset:0,cameraFov:60,bloomAmount:4,bloomRadius:.25,bloomThreshold:.8,bloomSmoothWidth:.3,bloomSaturation:1,bloomHighPassMultiplier:1,haloWidth:.6,haloRGBShift:.02,haloStrength:0,haloMaskInner:.3,haloMaskOuter:.5,clearAlpha:0,cameraLookStrength:.1,screenPaintOffsetRatio:0,screenPaintDistortionRGBShift:.1});r(this,"container",new D);r(this,"sceneContainer",new D);r(this,"hudContainer",new D);r(this,"cameraSplineGeo",null);r(this,"cameraSplinePositions",null);r(this,"cameraSplineOrientation",null);r(this,"sceneRatio",0);r(this,"sceneHideRatio",0);r(this,"initialSplineRatio",0);r(this,"hudRatio",0);r(this,"introRatio",0);r(this,"outSectionRatio",0);r(this,"freezeRatio",1);r(this,"introTime",0);r(this,"scrollYRatio",0);r(this,"panningSplineRaito",0);r(this,"shaderUniforms",{u_sceneRatio:{value:0},u_sceneHideRatio:{value:0},u_hudRatio:{value:0},u_introRatio:{value:0},u_introTime:{value:0},u_introDeltaTime:{value:0},u_letterTexture:{value:null}});this.base=t,this.width=this.base.width,this.height=this.base.height,this.renderer=this.base.renderer,this.commonUniforms=this.base.commonUniforms,this._v=new m,this._q0=new Z,this._q1=new Z,this.isDown=!1,this.introRatio=.3,this.sceneRatio=1,this.assetsLoad()}async assetsLoad(){this.manager=this.base.manager,this.textureLoader=new et(this.manager),this.fileLoader=new tt(this.manager).setResponseType("arraybuffer"),this.blueNoiseTexture=this.textureLoader.load(f("texture/LDR_RGB1_0.png")),this.fontTexture=this.textureLoader.load(f("texture/font.png")),this.fontTexture.minFilter=j,this.rocksTexture=this.textureLoader.load(f("texture/rocks.webp")),this.terrainShadowLightHeightTexture=this.textureLoader.load(f("texture/terrain_shadow_light_height.webp")),this.personLightTexutre=this.textureLoader.load(f("texture/person_light.webp")),this.personTexutre=this.textureLoader.load(f("texture/person.webp")),this.groundPersonShadowTexture=this.textureLoader.load(f("texture/ground_person_shadow.webp")),this.fogTexture=this.textureLoader.load(f("texture/fog.png")),this.cameraSplineGeometry=b(await this.fileLoader.loadAsync(f("buf/camera_spline.buf"))),this.sphere_l=b(await this.fileLoader.loadAsync(f("buf/sphere_l.buf"))),this.sphere_m=b(await this.fileLoader.loadAsync(f("buf/sphere_m.buf"))),this.sphere_s=b(await this.fileLoader.loadAsync(f("buf/sphere_s.buf"))),this.sphere_xs=b(await this.fileLoader.loadAsync(f("buf/sphere_xs.buf"))),this.rock_0=b(await this.fileLoader.loadAsync(f("buf/rock_0.buf"))),this.rock_1=b(await this.fileLoader.loadAsync(f("buf/rock_1.buf"))),this.rock_2=b(await this.fileLoader.loadAsync(f("buf/rock_2.buf"))),this.rock_3=b(await this.fileLoader.loadAsync(f("buf/rock_3.buf"))),this.rock_0_low=b(await this.fileLoader.loadAsync(f("buf/rock_0_low.buf"))),this.rock_1_low=b(await this.fileLoader.loadAsync(f("buf/rock_1_low.buf"))),this.rock_2_low=b(await this.fileLoader.loadAsync(f("buf/rock_2_low.buf"))),this.rock_3_low=b(await this.fileLoader.loadAsync(f("buf/rock_3_low.buf"))),this.rock_animation_0=b(await this.fileLoader.loadAsync(f("buf/rock_animation_0.buf"))),this.rock_animation_1=b(await this.fileLoader.loadAsync(f("buf/rock_animation_1.buf"))),this.rock_animation_2=b(await this.fileLoader.loadAsync(f("buf/rock_animation_2.buf"))),this.rock_animation_3=b(await this.fileLoader.loadAsync(f("buf/rock_animation_3.buf"))),this.terrain=b(await this.fileLoader.loadAsync(f("buf/terrain.buf"))),this.terrainLines=b(await this.fileLoader.loadAsync(f("buf/terrain_lines.buf"))),this.personGeometry=b(await this.fileLoader.loadAsync(f("buf/person.buf"))),this.personIdleGeometry=b(await this.fileLoader.loadAsync(f("buf/person_idle.buf"))),this.bgBoxGeometry=b(await this.fileLoader.loadAsync(f("buf/bg_box.buf")))}init(){this.cameraSplinePositions=this.cameraSplineGeometry.attributes.position,this.cameraSplineOrientation=this.cameraSplineGeometry.attributes.orient,this.math=new Pe,this.fboHelper=new xi(this),this.textureHelper=new pi(this),this.blur=new bi(this),this.blueNoise=new Si(this),this.finalPass=new Mi(this),this.finalPass.vignetteFrom=2,this.finalPass.vignetteTo=5,this.finalPass.vignetteColor.setStyle("#000000"),this.finalPass.saturation=1,this.finalPass.contrast=0,this.finalPass.brightness=1,this.finalPass.tintColor.setStyle("#000000"),this.finalPass.tintOpacity=0,this.finalPass.bgColor.setStyle(this.base.bgColorHex),this.finalPass.opacity=1,this.bloomPass=new Ri(this),this.heroEfxPrevPass=new Ei(this),this.heroEfxPass=new Oi(this),this.heroLight=new Ui(this),this.heroParticlesSimulation=new Bi(this),this.heroLightField=new Yi(this),this.heroScatter=new ji(this),this.heroParticles=new Ki(this),this.heroRocks=new ir(this),this.heroGround=new ar(this),this.heroPerson=new mr(this),this.heroFog=new xr(this),this.heroHalo=new Sr(this),this.heroLines=new cr(this),this.sceneContainer.add(this.heroRocks.container),this.sceneContainer.add(this.heroPerson.container),this.sceneContainer.add(this.heroFog.container),this.add(this.sceneContainer),this.add(this.heroParticles.container),this.add(this.heroGround.container),this.add(this.heroHalo.container),this.resize(this.width,this.height),this.base.scene.add(this)}resize(t,i){this.width=t,this.height=i,this.heroFog.resize(t,i),this.heroHalo.resize(t,i)}syncProperties(t){this.shaderUniforms.u_introRatio.value=this.introRatio;const i=this.math.saturate(this.initialSplineRatio)*149+this.math.saturate(this.panningSplineRaito)*50,o=Math.floor(i),n=Math.min(this.cameraSplinePositions.count-1,Math.ceil(i)),a=i-o;this.sceneRatio=this.shaderUniforms.u_sceneRatio.value=this.math.fit(this.introRatio,.01,.1,0,1,mt),this.sceneHideRatio=this.shaderUniforms.u_sceneHideRatio.value=this.math.fit(this.introRatio,.85,1,0,1),this.shaderUniforms.u_hudRatio.value=this.hudRatio,this.bloomPass.bloomAmount=3,this.bloomPass.bloomAmount=this.math.fit(this.introRatio,.1,.85,this.bloomPass.bloomAmount,1.5,ce),this.bloomPass.bloomAmount=this.math.fit(this.introRatio,.85,1,this.bloomPass.bloomAmount,10),this.bloomPass.bloomAmount=this.math.fit(this.hudRatio,0,.5,this.bloomPass.bloomAmount,12.5),this.bloomPass.haloStrength=.08,this.bloomPass.haloStrength=this.math.fit(this.introRatio,.1,.4,this.bloomPass.haloStrength,.15),this.bloomPass.haloStrength=this.math.fit(this.hudRatio,0,.5,this.bloomPass.haloStrength,0),this.bloomPass.screenPaintDistortionRGBShift=this.math.mix(0,.5,this.outSectionRatio),this.properties.cameraLookStrength=this.math.fit(this.initialSplineRatio,0,1,.1,.035),this._v.fromArray(this.cameraSplinePositions.array,n*3),this.properties.defaultCameraPosition.fromArray(this.cameraSplinePositions.array,o*3),this.properties.defaultCameraPosition.lerp(this._v,a),this._q0.fromArray(this.cameraSplineOrientation.array,o*4),this._q1.fromArray(this.cameraSplineOrientation.array,n*4),this._q0.slerp(this._q1,a),this._v.set(0,0,1).applyQuaternion(this._q0).add(this.properties.defaultCameraPosition),this.properties.defaultLookAtPosition.copy(this._v),this.properties.cameraDollyZoomFovOffset=this.math.fit(this.initialSplineRatio,.4,.8,0,-10,gt),this.properties.defaultCameraPosition.y+=this.math.fit(this.scrollYRatio,0,1,0,-10,ce),this.properties.defaultLookAtPosition.y+=this.math.fit(this.scrollYRatio,0,1,0,-10.1,ce),this.freezeRatio+=((this.isDown?1-this.hudRatio:0)-this.freezeRatio)*.1}update(t){this.blueNoise.update(t);let i=t*this.math.mix(1,.1,this.freezeRatio);this.introTime+=i,this.shaderUniforms.u_introTime.value=this.introTime,this.shaderUniforms.u_introDeltaTime.value=i,this.heroScatter.update(),this.hudRatio<1?(this.heroParticlesSimulation.update(t),this.heroLightField.update(i),this.heroParticles.update(i),this.heroParticles.container.visible=!0):this.heroParticles.container.visible=!1,this.sceneRatio>0&&this.hudRatio<1?(this.heroLight.update(i),this.heroRocks.update(i),this.heroPerson.update(i),this.heroFog.update(i),this.heroHalo.update(i),this.sceneContainer.visible=!0):this.sceneContainer.visible=!1,this.sceneRatio>0&&this.heroGround.update(i),this.hudRatio<1&&this.heroLightField.postUpdate(t),this.sceneRatio>0&&this.hudRatio<1&&this.heroLight.postUpdate(t)}}class wr{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.resolution=new S(this.width,this.height),this.renderer=new it({antialias:!0,alpha:!1,powerPreference:"high-performance",premultipliedAlpha:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.renderer.autoClear=!0,this.scene=new ne,this.target.appendChild(this.renderer.domElement),this.camera=new rt(75,this.aspect,.01,200),this.camera.position.set(-2,5,-12),this.camera.lookAt(0,0,0),this.controls=new nt(this.camera,this.renderer.domElement),this.clock=new ot,this.commonInit(),this.assetsInit(),this.resize()}debugInit(){const e=new at(16777215,3);e.position.set(1,1,1),this.scene.add(new st(13421772)),this.scene.add(e);const t=new lt(2,2,2),i=new ut({color:"#7455c9"});this.cube=new w(t,i),this.scene.add(this.cube)}commonInit(){this.commonUniforms={u_time:{value:0},u_resolution:{value:new S(this.width,this.height)},u_aspect:{value:1}},this.introRatio=0,this.offWhiteColorHex="#f0f1fa",this.blackColorHex="#000000",this.blueColorHex="#1a2ffb",this.bgColorHex="#f0f1fa",this.bgColor=new P,this.dateTime=performance.now(),this.time=0,this.startTime=0}composerInit(){this.composer=new ct(this.renderer),this.renderPass=new ht(this.scene,this.camera),this.composer.addPass(this.renderPass),this.composer.addPass(this.hero.bloomPass),this.composer.addPass(this.hero.heroEfxPrevPass),this.composer.addPass(this.hero.heroEfxPass),this.composer.addPass(new dt(this.width,this.height)),this.composer.addPass(this.hero.finalPass),this.composer.setSize(this.width,this.height)}async assetsInit(){this.manager=new vt,this.hero=new Ar(this),this.manager.onLoad=()=>{this.callback(),this.hero.init(),this.composerInit(),this.animation()}}animation(){this.renderer.setAnimationLoop(()=>this.animation());let e=performance.now(),t=(e-this.dateTime)/1e3;this.dateTime=e,t=Math.min(t,1/20),this.startTime+=t,this.commonUniforms.u_time.value+=t,this.renderer.setClearColor(this.bgColor,1),this.bgColor.setStyle(this.bgColorHex),this.hero.syncProperties(t),this.hero.update(t),this.composer.render()}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height),this.composer.setSize(this.width,this.height),this.hero.resize(this.width,this.height)})}destroy(){this.scene.traverse(e=>{var t;e instanceof w&&((t=e.geometry)==null||t.dispose(),Object.values(e.material).forEach(i=>{i&&typeof i.dispose=="function"&&i.dispose()}))}),this.renderer.dispose(),this.composer&&this.composer.dispose()}}const Tr={class:"hero"},Cr={class:"load"},Pr={__name:"index",setup(d){const e=_e(!1);_e(0);let t=null;const i=()=>{e.value=!0};return _t(()=>{t=new wr({parent:document.querySelector(".hero"),target:document.querySelector(".canvas"),callback:i})}),xt(()=>{t.destroy(),t=null,console.info("%cHero-销毁😁","color:#fff;background-color:red")}),(o,n)=>(xe(),pe("div",Tr,[ee("div",{class:wt(["loading",{loadOk:e.value}])},[ee("div",Cr,[(xe(),pe(pt,null,bt("LOADING...",(a,s)=>ee("span",{key:s,style:St("--i:"+s)},At(a),5)),64))])],2),n[0]||(n[0]=ee("div",{class:"canvas"},null,-1))]))}},Mr=Tt(Pr,[["__scopeId","data-v-b6788e5e"]]);export{Mr as default};
