var ie=Object.defineProperty;var ne=(d,e,t)=>e in d?ie(d,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):d[e]=t;var x=(d,e,t)=>ne(d,typeof e!="symbol"?e+"":e,t);import{am as ae,n as p,v as se,ad as re,W as z,ak as A,aq as T,e as G,h as y,k as W,l as S,M as I,ap as X,P as J,V as v,w as f,b3 as H,as as w,H as F,z as oe,b4 as B,Y,A as b,L as q,y as M,aG as D,g as le,G as he,aH as L,b5 as U,aF as E,al as P,I as k,s as $,b6 as ce,af as ve,a7 as ee,ar as de,b7 as me,aN as pe,a1 as fe,b8 as ge,b9 as xe,aO as ye,a2 as Ae,S as O,a3 as we,K as be,Q as _e,ax as Te,ba as Ce,X as Pe}from"./threejs-X_Qec1pD.js";import{L as Se,v as Me,N as V,O as De,l as Z,b as Re,m as Ue,i as j,c as K,d as N,F as Ie,n as Ve,p as ze,e as Fe,q as Be}from"./vendor-DXKZwkeo.js";import{_ as Ne}from"../lib/index-C14GzQpN.js";const Le="data:application/octet-stream;base64,RFJBQ08CAgEAAIAAAQRpbmZvVnsidHlwZSI6MCwiYXR0cmlidXRlcyI6W1sicG9zaXRpb24iLDddLFsibm9ybWFsIiw3XSxbIm5vdGNoIiw3XSxbImluc2V0Iiw3XSxbInV2Iiw3XV19AA4PAQMCAAABAwIDBgwCCQUGAwoLDQwHCAQFAQEKBAgODA0ECgMBBQkHDAYJAgEFAAkDAAABCQMAAQQJAwACBAkDAAMDCQIABAIDAgICAAEBAQQDXTCJCB0HCHqKg7gFdkyeAAAAAP8/AAAAAwEACgO9OxtFBAPz/ogA/gMAAAD/AwAA/wEAAAABAQEEA4Ut9QmJCAktDAIyT1S8zYQAAAAA/w8AAAABAQANAyUiiQgjVRUFJx7G34f///8AAOD//x8AhCDG//c/AAD+//8A0P//DwAAAAAA/w8AAAABAQANA80MG4kIRQSJCOEdBpd14uuEkkSLAkNBlACgIwCEA4ABAoAAAkAeE0XhAqD/ADCAQ0GARAMAAAAAAP8PAAAAAIC/AACAvwAAAAAAAABADgoAAIC/AAAAAAAAAAAAAIA/DAAAgL8AAIC/AAAAAAAAAEAMAAAAAJfFwcGXxclBDA==",Ee="data:application/octet-stream;base64,RFJBQ08CAgEBAIAAAQRpbmZvPnsidHlwZSI6MCwiYXR0cmlidXRlcyI6W1sicG9zaXRpb24iLDddLFsibm9ybWFsIiw3XSxbInV2Iiw3XV19AADMAdgCAtgCBABd77qubVVV+0arqqpttapKS9e2lKqqqmq1HlVVrapqtdVWVVVVVVWVKlVVVVVV1fJ1Xduqaq1tqapW26qqammt69u0qqpVVfVotaqqqkoprVZVVVVVValSVVVVVVVV/wEi+wtZOqDfsmyNbbrmhP8DC16AA/8AAQABAAEAAAEACQMAAAIBAQkDAAEDAQMJAgACAgQBAQAPE/DwFQQNClEQ1RK5CYUCA6BD4gfKTeVCQF5nXK5DZku5N7ERx6PaUxt9gcZIZ+NVn3J8hwtxYNnz/eKyJBSiPfnVIifusIzPj2FmfIP7RJYVte8fjUim6iHPd6BuuCgNbhABNGlehgmqvwo47ASwGLMP4M8AmMKkAOCfCgY46BRAoCg7aKIIR/DKHzKQBQoHYNRIAM5SAGIOBZyxhAEFcMsq5oDkI8sICrwAfCED3DSAK8D5BTpsU3pQBIBA+AuZBsTh/G0JbYHoslrVBOBFEIgFAMVCBEWalxhA2YUzR89AaGApKqwBTcUQKIUjMgMA/ALhneebSy4tpQAIUAHWZEPR25aO7AcQ/h0oCCWdjAyJ6piQ1xRAE8yMFAtyJUA8fwIw3QaYAwtqu5SAFxAoCQSgCiXwIxxQhKOncIJfZwDCkgOs4nBwZUo7ZTy44VwmANjpgFOoi2rSSVQNgj0I+XYmhWmOE5R9C7/+0QfraYrwErKuCkTIILQ9xWKZsnSBnQMFMGvTFWtTQgTnYa3kIDYYtIkreAXcAtWwMSCfUi0mfyB7wuM6bxMAB5DArCX3Vy15YM89DBl8JohZC5gc6rwGiktwMkN1CCd2/mHOpuQgizKphTk17gRQAIQC4FFma8gJgHAFoAsZ4KYAYMHNURwGqeii1SfLAgXEioENwLtkBUD1BKgBhQHQ5YEALIQAQDyZIfoLQHFgQs8EIAx22CaJDwiBB7YZxnq6HskPIPw8WjZdAAh2kQAA+BYA3TgwLwsQJwMAWDgDEEMAXg4Az1i+cDsPAKeWAI6HLKtWNQBqRQsAAbEAgAEbIJ8oAVhzHwBJ8AAwKQM4+TWY/wAgGwDqAKAkAJAVFW0SDiboC4CS67GD6F/LAFB1AJiF0cyS5eCHfejBmoFMtM7JQFStkWraKdSM5TcuVtQyg/FWx49+CLuqGQJMrLpa0CF+4N4CEwyLSjRxKjtBgdYB6S8ZAWSKIkCRUgBwdg7wc2AAZG3a4sg8mtC8q5XuBgRRQi0ifhyLouM6bwMABxAw8BuArycD3NkHJE1AAO0vUHOgy6Q+ggQ67gWAxNj3gZACvh4A/9vQ67TU2DwteLPNgu5j2VL+45nxkt64csIuJY4MawRJD82AAAAAAAD/PwAAKYiYvqiWmb2Scf6+KcZ/Pw4GAwEBCP8HXQSZCBUEVQMtA0UC0QF0XQE1AUwodEzAdEwTKChMA5wzdEwHKExHKCj//////////////////wMoKBcoKB9MCygoJygoDygDTEwDdHScKAMoTOg1AakB6OEC0QFFBeUI9AE7v/XRu15KTVktLsxmpkWEGTONptQv7WlEnw7fJ+JitqjTKHphPdtTvZVMUjGkI/kMEjJ2myy3s5TL9TSdVTYLdfI45S7VzVov0BDRzBnT2hQDpIBcda/BlinBCFQElFL7bNCfOqMG0DdyPVpiNNLn2bAqutFsMED+1nyPsh1LehZvyRK9CDgWIeTljSGmVoV40FKjQevDyddwuBgG93K+vwJtphPqF8MUNhoNrLXbY0JkazdQosLDf/sN7VnMMc/pAEk6fw7Th4ACRyQ0/ddM8wEGo3cMwA5k6VcoJryOSClUls0QFwRVFe5sDJMiJDR9PG+n/wMAAP8BAAD/AlNVCgUBAQANB1BQQQH9Ct0cIQ6ZBlCgA6A5MG8M6XNWYidez3nqzFXlTgnOlfwp7W6zRbR8v+eKJW/vXE3SBdOEuzW9e07vHm8BkmpOo97N9++A8qrzqDK6CYvmRgRqDogVrp0KweuomCgrsTNgQyY4+Axkhmurw9k873k6gsfLjPQLk6znigAjgMeEC7z3XYx0N3U7Pl0+llcL9Mo5nP6XtLlGUC4OcC0kf7fw2GkUoosu+QEIgAKQAqKhP/rEWqKs6wCDCQuDK8BhrPugJIq26ngmxu0ddW6xXE9/yPh8KYBrYCZqRGAq+jAmWNM1XQ878DbA9sb65q+6byvpgJwClhAIr5nuZ1imycCGe/gBi5KSlmoAJwYyIeyG5HgGf5e2WzIAAAp8pF8mJZKWupmgOoCk6QFyAz3Rd2epq04X+9GFQR+zcK9KrEYLTi39jOHX8WxJYilIyCIi2y5sspzrcYAXL+CRaHQBGuk0RJ6JAg44ozfcBAycUDICfDLuiskmg5lig2CGr5xaAHJy6sC9/xsVyAAAAAEDWEJTAAAAAP8PAAB4lCA+cP6POtIugD8M",ke="data:application/octet-stream;base64,RFJBQ08CAgEBAIAAAQRpbmZvPnsidHlwZSI6MCwiYXR0cmlidXRlcyI6W1sicG9zaXRpb24iLDddLFsibm9ybWFsIiw3XSxbInV2Iiw3XV19AAAhPgI9AwAQb/VRpfq2qvRRpdaUUkpRAAEBEP8CP0ffCT9oLxAgf/W1gAP/AAEAAAABAQABAAkDAAACAQEJAwABAwEDCQIAAgIEAQEADh+FD8EHKRu1CfEB8QEL3pTLzIPGJdnP/41oOwBYocLtVDNupQzXVZeJAoAIa0JI0OqlIqg+08EBDopkOdvxAgiA/SyCHAYBAKigsY8LNtVAGp9REOUTwQe2yKGznCTl63QKQY484YW76SaTUriMjkOB5hTwwan4+iMCAQH6+QVqCRigSDo10xnlHxUGEcPmACMIwANAmIUekQYdzPbr+oISAQIjQQRAA8CGgAAAAAD/PwAASmDdva17/74/fx+9NsN/Pw4GAwEACw/xAdEFB/EBA1E2BugGj+/ZgZsz8cHa0kjwewv81xA/DHKToD//7GuwPwHlQ5A8CPrjb4H8BujvwP0CbMJPgP0kvA/APPefb8f9BaDBffyvLzF/ALMP6rZOPOGOiP8I/wMAAP8BAAD/AkdCCgUBAQANA20BbQELOQ5FBIESsQWxBfUJ2QISBAva+1RrHwqDBvmNjlssuz+C6B4APeriRtYgmnS8TotpEVHy1POifNZSggWCkcgb2DCN2ZCRz2eCoCKeme7Bg40ICVhOA5VwLbNBe2K6CBORSFanYHLyagC8kdca2KrLmEra4AvhGDHWhg35mAApAAAABgP+sYYAAAAA/w8AAFY+TD5irJE98GNfPww=",Oe="data:application/octet-stream;base64,RFJBQ08CAgEBAIAAAQRpbmZvPnsidHlwZSI6MCwiYXR0cmlidXRlcyI6W1sicG9zaXRpb24iLDddLFsibm9ybWFsIiw3XSxbInV2Iiw3XV19AADDAdICAtICCwBb79f0a6NPtVRbj1Ld2qdaqqrVrX2XKqUtqlUtVaq6tmg9VKnyaHlapUqrtKUeVVVV1UertNVSSqstrbaqqqqqtKq0qqqqqqqq1ZVqVbXQqmrVqqpVVVVVVVUtBf8BEf8DU1yA/wNTXIAD/wABAAAAAQAAAQAJAwAAAgEBCQMAAQMBAwkCAAICBAEBAA8b+QHZCQ0SBRUpC6UBA1Q5sDjdjRrIsza8A5GSVEfabnkTu5D7LjcxytpaxonoeQfXWUu+keHHmOLKAtM2LrLT4AnXynq+8R+BpriSosH/4s4s3jV4BHFn+yhlGGFKpteLSqhjVrWxAB4DacEVBOeS+8UbxsJoIZQwRt9b1/aND8nmNsZ63QwKAnue6TAMDmUPXQYKy06WIeVjzkYkXaZPJ5vOMeoak7B2btZSoIlpvakK4FwfcY7iDipFw5J09r9IXnLFChYZZ/LaEu3lTQm2yXRmYcLzNYljrdIfXPl2GEcja+GVVyrJkYIRXSgt+0gshNFsDAFKF9j6sUnoOWd1VFrSQBQlwRi/Yy1kJJNwKJQ4ZFVfKAEsjimMSuXwP93Eb0IHXRCYZGSxD/Ve+AxCIkVrY5hv2oS+pzhBiowq4JDbkBxloR9AksS3mHWIQ4xhHBAy3O8jQIGcXfg4BtUrojRDkjZ7ggkkPliEgSYZbYDdwAe9u7Zg53GXCaHSgJDk52g5CGGzlreTMxRY2hABGYvfNJApOmfWM3FWmMY3riIVFA7CQMILgio4EUvAxJOiJSh2JBX3FjthcpBEvQ1tooTsNqoTMpKQbDdfTLS3pxQlEViyoBA2wG/zwKfXp/wGD5caqX4Od6YwBmzJaUq/Vg9pHkZjBnxmSjVzUCUIQVl1hfByhcbDpOJJFUQsAKAsEBRLmXAwUltx4Fzgpxsi2J4lDy4/6kR+GsKAZhNWgNQP/ELakCAKCW2pgl9cINmhyUDWvrC1BcAaDUG83//LQsKXjeGmCbPTwYfJSEgQn2YdS7r9BnTgz/Iimwx7qHG3DkAkpCQMpUKVUMoxlVKsZDmIwcI/3kfnOggyXhyqfmQDQfR1XLoZkbfkbapnYAajcwF8G8vCEAGTiuVyqcVVTWKFYcEGL0hIVscDU+EwqBtNMM/nD0qhDAGI7nN6HN62hAELMtVkiY/SDQpeodXLQHpB1NND87J2Ic9bN+Jby5prNhjZZjQWjMgY0c/aYKExpgheBDDLBw9ztrthmoCeAr4gvBSEqX5sSDNRCfjXrBUweoutqlsaSYm/vguDuHj6+oADAQEwAAAAAAD/PwAAALDdvnjtBDr/5tsuAACAPw4GAwEBCf8HkQaVBUEFRQT1AvEDQQVJA/UCSQNNAp0DpQGhAk0CqKUB/KUB+QGlAVT8A/wDVKgL/FQDqFQHVKhUVFQXVB9UC1T//////////////////1NUD1RUVANUA6gHVANUqFSoA6hRAVT8A1EB/FEBTQJRAU0C9QKlAfkBSQP1AkkD8QP1Au0ESQOZBpMCZFzts4Rc4+2SkrixnnmUkfLUG5wdwIDbmr8dtWr/CkPOwvXQdA96obU0t02NJekUgT/7FRquKv2THJ1u4DRu+gr/v2LnXaCF+Vy7hKVU4sxkSS8me/j7S54qgdZskTcSkP7IP2dg7Gs7V+kKkws3hJSlsUsXRCIKd6pNPorBnPLPZEfeZsckGve+p/Fy835yHHgWddx6RjmFLt5asTtFB4Hpo67obcVnlZDqnTrFTv9cyinBuOQl81KL20IicW7ME9w9JtLoh7Ws+TUr4tWht4UUbBzDfjuxEk1XDTK6Hy6PGmGMr8LbgiGkHhacFdqlvOf3jI1V0gAy8BvTqpRMPIMx5LbSL/J6Z0LXy8N+n+WKaIT/AwAA/wEAAP8C4lIKBQEBAA0DqKUBTQKdAzkHfQthE8kNSQNUA1RE/Ep/bWg8EUB5bEO/vMs8FqQB2TsQrHAziuK3cVdy7YlEfSoesy41nTcfGHTPkE4/HP0GwV+icO9A++X68MGTatn+j5n6HPY87ljxR16mTioSJoh5HO+L2umMmWUso5QqOKMfusLm0OrwyDrkXXV1RLxkGOCVB+C5Udyxv+7c2EmD9Aa9AXtZ+j7QVtlZZvj3uA24AJjhRmA+bAmwr4ENmjswhCK+Ce2sbQWnAz7BbqQFHCMuvbvt+ieBmTzmqqzPYmvc9qYtA3N1XeRrGR1+2aOXpNOOTevNCOBLrKLOR489erfeTi15sNipdNU3gbbUTWYn16hI126NnMlk73xVGQXXpxWuP62z3dRG9hLF9P8SseNrlk7QCKqZOCGkMqAJAKPYrzJfrfKT9Jqatb1D+IKigo6AaMwZix+uR02iaLYS1hzO0wIsZ+jUxKZlnu0bhX7JRKdlkVG2RpJykXMH2Vv3djJsTbcVGymh+mjvAROCcBtW0RjBLJgoTJmnoQLBAAAAAQNf/1EAAAAA/w8AAEDXqz0zX1I815Z4Pww=",Qe=""+new URL("../ktx2/email-C08JwW2m.ktx2",import.meta.url).href,Ge=""+new URL("../ktx2/headline-sVnFdBpn.ktx2",import.meta.url).href,We=""+new URL("../ktx2/leaf-BuS2QNRk.ktx2",import.meta.url).href,He=""+new URL("../ktx2/noise-simplex-layered-Bhb_a_In.ktx2",import.meta.url).href,qe=""+new URL("../ktx2/petal-Bq8WLeBB.ktx2",import.meta.url).href,Ze=""+new URL("../jpg/transition-nomipmaps-oWShjGwJ.jpg",import.meta.url).href,je=""+new URL("../ktx2/uvchecker-srgb-CjV9WT7L.ktx2",import.meta.url).href,Ke=""+new URL("../png/uvchecker-srgb-DLXNSh1u.png",import.meta.url).href;var Xe=`uniform Global{vec2 resolution;float time;float dtRatio;};

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`,Je=`uniform Global{ vec2 resolution;float time;float dtRatio; };

uniform sampler2D tLogo;
uniform sampler2D tDiffuse;
uniform sampler2D tInfo;
uniform sampler2D tSim;

uniform float uCameraNear;
uniform float uCameraFar;

uniform vec2 uOutlineFade;
uniform float uOutlineThickness;
uniform vec3 uOutlineColor;
uniform float uOutlineScale;

uniform vec3 uInfoRange;
uniform vec3 uDepthRange;
uniform vec3 uNormalRange;
uniform float uSmoothMargin;
uniform float uInfoMinScale;

varying vec2 vUv;

float efit(float x, float a1, float a2, float b1, float b2){ return b1+((x-a1)*(b2-b1))/(a2-a1); }
float fit(float x, float a1, float a2, float b1, float b2){ return clamp(efit(x, a1, a2, b1, b2), min(b1, b2), max(b1, b2)); }
float fit01(float x, float a1, float a2){ return fit(x, 0.0, 1.0, a1, a2); }
float fit10(float x, float a1, float a2){ return fit(x, 1.0, 0.0, a1, a2); }
float fit11(float x, float a1, float a2){ return fit(x, -1.0, 1.0, a1, a2); }
vec3 efit(vec3 x, vec3 a1, vec3 a2, vec3 b1, vec3 b2){ return b1+((x-a1)*(b2-b1))/(a2-a1); }
vec3 fit(vec3 x, vec3 a1, vec3 a2, vec3 b1, vec3 b2){ return clamp(efit(x, a1, a2, b1, b2), min(b1, b2), max(b1, b2)); }
vec3 fit01(vec3 x, vec3 a1, vec3 a2){ return fit(x, vec3(0.0), vec3(1.0), a1, a2); }
vec3 fit10(vec3 x, vec3 a1, vec3 a2){ return fit(x, vec3(1.0), vec3(0.0), a1, a2); }
vec3 fit11(vec3 x, vec3 a1, vec3 a2){ return fit(x, vec3(-1.0), vec3(1.0), a1, a2); }
float getDepth(sampler2D depth, vec2 uv){ return texture(depth, uv).x; }
highp float linearizeDepthLog(highp float depth, highp float near, highp float far){ float d=pow(2.0, depth*log2(far+1.0))-1.0;float a=far/(far-near);float b=far*near/(near-far);return a+b/d; }
highp float perspectiveDepthToViewZ(highp float depth, highp float near, highp float far){ return (near*far)/((far-near)*depth-far); }
highp float orthographicDepthToViewZ(highp float depth, highp float near, highp float far){ return depth*(near-far)-near; }
float viewZToPerspectiveDepth(float viewZ, float near, float far){ return ((near+viewZ)*far)/((far-near)*viewZ); }
float viewZToOrthographicDepth(float viewZ, float near, float far){ return (viewZ+near)/(near-far); }
float getViewZ(float depth, float near, float far){
    float fragCoordZ=depth;
    #ifdef ORTHOGRAPHIC_CAMERA
    return orthographicDepthToViewZ(fragCoordZ, near, far);
    #else
    #ifdef LOGDEPTH
    fragCoordZ=linearizeDepthLog(fragCoordZ, near, far);
    #endif
    return perspectiveDepthToViewZ(fragCoordZ, near, far);
    #endif
}
float getViewZ(sampler2D depth, vec2 uv, float near, float far){ return getViewZ(getDepth(depth, uv), near, far); }
float getLinearDepth(float depth, float near, float far){
    float fragCoordZ=depth;
    #ifdef ORTHOGRAPHIC_CAMERA
    return fragCoordZ;
    #else
    #ifdef LOGDEPTH
    fragCoordZ=linearizeDepthLog(fragCoordZ, near, far);
    #endif
    float viewZ=perspectiveDepthToViewZ(fragCoordZ, near, far);return viewZToOrthographicDepth(viewZ, near, far);
    #endif
}
float getLinearDepth(sampler2D depth, vec2 uv, float near, float far){ return getLinearDepth(getDepth(depth, uv), near, far); }
vec3 getViewPosition(float depth, vec2 uv, float near, float far, mat4 projMat){
    float viewZ=getViewZ(depth, near, far);
    #ifdef LOGDEPTH
    float d=linearizeDepthLog(depth, near, far);
    #else
    float d=depth;
    #endif
    float clipW=projMat[2][3]*viewZ+projMat[3][3];vec4 clipPosition=vec4((vec3(uv, d)-0.5)*2.0, 1.0);clipPosition*=clipW;return (inverse(projMat)*clipPosition).xyz;
}
vec3 getViewPosition(sampler2D depth, vec2 uv, float near, float far, mat4 projMat){ return getViewPosition(getDepth(depth, uv), uv, near, far, projMat); }
vec3 getWorldPosition(float depth, vec2 uv, float near, float far, mat4 projMat, mat4 worldMat){ return (worldMat*vec4(getViewPosition(depth, uv, near, far, projMat), 1.0)).xyz; }
vec3 getWorldPosition(sampler2D depth, vec2 uv, float near, float far, mat4 projMat, mat4 worldMat){ return (worldMat*vec4(getViewPosition(getDepth(depth, uv), uv, near, far, projMat), 1.0)).xyz; }
vec3 getViewNormal(sampler2D depth, vec2 uv, float near, float far, mat4 projMat){ vec2 depthres=vec2(textureSize(depth, 0));ivec2 p=ivec2(uv*depthres);float c0=texelFetch(depth, p, 0).x;float l2=texelFetch(depth, p-ivec2(2, 0), 0).x;float l1=texelFetch(depth, p-ivec2(1, 0), 0).x;float r1=texelFetch(depth, p+ivec2(1, 0), 0).x;float r2=texelFetch(depth, p+ivec2(2, 0), 0).x;float b2=texelFetch(depth, p-ivec2(0, 2), 0).x;float b1=texelFetch(depth, p-ivec2(0, 1), 0).x;float t1=texelFetch(depth, p+ivec2(0, 1), 0).x;float t2=texelFetch(depth, p+ivec2(0, 2), 0).x;float dl=abs((2.0*l1-l2)-c0);float dr=abs((2.0*r1-r2)-c0);float db=abs((2.0*b1-b2)-c0);float dt=abs((2.0*t1-t2)-c0);vec3 ce=getViewPosition(c0, uv, near, far, projMat).xyz;vec3 dpdx=(dl<dr)? ce-getViewPosition(l1, (uv-vec2(1.0/depthres.x, 0.0)), near, far, projMat).xyz:-ce+getViewPosition(r1, (uv+vec2(1.0/depthres.x, 0.0)), near, far, projMat).xyz;vec3 dpdy=(db<dt)? ce-getViewPosition(b1, (uv-vec2(0.0, 1.0/depthres.y)), near, far, projMat).xyz:-ce+getViewPosition(t1, (uv+vec2(0.0, 1.0/depthres.y)), near, far, projMat).xyz;return normalize(cross(dpdx, dpdy)); }
vec3 getWorldNormal(sampler2D depth, vec2 uv, float near, float far, mat4 projMat, mat4 worldMat){ vec2 depthres=vec2(textureSize(depth, 0));ivec2 p=ivec2(uv*depthres);float c0=texelFetch(depth, p, 0).x;float l2=texelFetch(depth, p-ivec2(2, 0), 0).x;float l1=texelFetch(depth, p-ivec2(1, 0), 0).x;float r1=texelFetch(depth, p+ivec2(1, 0), 0).x;float r2=texelFetch(depth, p+ivec2(2, 0), 0).x;float b2=texelFetch(depth, p-ivec2(0, 2), 0).x;float b1=texelFetch(depth, p-ivec2(0, 1), 0).x;float t1=texelFetch(depth, p+ivec2(0, 1), 0).x;float t2=texelFetch(depth, p+ivec2(0, 2), 0).x;float dl=abs((2.0*l1-l2)-c0);float dr=abs((2.0*r1-r2)-c0);float db=abs((2.0*b1-b2)-c0);float dt=abs((2.0*t1-t2)-c0);vec3 ce=getWorldPosition(c0, uv, near, far, projMat, worldMat).xyz;vec3 dpdx=(dl<dr)? ce-getWorldPosition(l1, (uv-vec2(1.0/depthres.x, 0.0)), near, far, projMat, worldMat).xyz:-ce+getWorldPosition(r1, (uv+vec2(1.0/depthres.x, 0.0)), near, far, projMat, worldMat).xyz;vec3 dpdy=(db<dt)? ce-getWorldPosition(b1, (uv-vec2(0.0, 1.0/depthres.y)), near, far, projMat, worldMat).xyz:-ce+getWorldPosition(t1, (uv+vec2(0.0, 1.0/depthres.y)), near, far, projMat, worldMat).xyz;return normalize(cross(dpdx, dpdy)); }
vec2 encodeNormal(vec3 n){ n/=(abs(n.x)+abs(n.y)+abs(n.z));return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy); }
vec3 decodeNormal(vec2 f){ vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));float t=max(-n.z, 0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n); }
vec2 encodeNormalUint8(vec3 n){ return encodeNormal(n)*0.5+0.5; }
vec3 deodeNormalUint8(vec2 n){ return decodeNormal(n*2.0-1.0); }
vec2 encodeNormalSpheremap(vec3 n){ float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0; }
vec3 decodeNormalSpheremap(vec2 n){ vec4 nn=vec4(n.xy, 1.0, -1.0);float l=dot(nn.xyz, -nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0, 0.0, -1.0); }
vec2 encodeNormalSpheremapUint8(vec3 n){ return encodeNormalSpheremap(n)*0.5+0.5; }
vec3 deodeNormalSimpleUint8(vec2 n){ return decodeNormalSpheremap(n*2.0-1.0); }
float outline(sampler2D tColor, sampler2D tInfo, vec2 uv, float outlineWidth, float scale, vec3 idRange, vec3 depthRange, vec3 normalRange, float rangeSmoothMargin, float idMinScale, vec2 distanceFadeRange){ vec2 offset=1.0/vec2(textureSize(tInfo, 0))*outlineWidth*scale;float contributions[5];float faceIds[5];float distances[5];vec3 normals[5];vec4 n=texture(tInfo, uv+offset*vec2(0, 0));contributions[0]=n.a;distances[0]=1.0-n.r;normals[0]=decodeNormalSpheremap(n.gb);faceIds[0]=texture(tColor, uv+offset*vec2(0, 0)).a;n=texture(tInfo, uv+offset*vec2(-1, 0));contributions[1]=n.a;distances[1]=1.0-n.r;normals[1]=decodeNormalSpheremap(n.gb);faceIds[1]=texture(tColor, uv+offset*vec2(-1, 0)).a;n=texture(tInfo, uv+offset*vec2(1, 0));contributions[2]=n.a;distances[2]=1.0-n.r;normals[2]=decodeNormalSpheremap(n.gb);faceIds[2]=texture(tColor, uv+offset*vec2(1, 0)).a;n=texture(tInfo, uv+offset*vec2(0, -1));contributions[3]=n.a;distances[3]=1.0-n.r;normals[3]=decodeNormalSpheremap(n.gb);faceIds[3]=texture(tColor, uv+offset*vec2(0, -1)).a;n=texture(tInfo, uv+offset*vec2(0, 1));contributions[4]=n.a;distances[4]=1.0-n.r;normals[4]=decodeNormalSpheremap(n.gb);faceIds[4]=texture(tColor, uv+offset*vec2(0, 1)).a;float centerId=faceIds[0];float centerDistance=distances[0];float centerContribution=contributions[0];vec3 centerNormal=normals[0];vec2 idVariation=vec2((faceIds[1]-centerId)-(faceIds[2]-centerId), (faceIds[3]-centerId)-(faceIds[4]-centerId));vec2 distanceVariation=vec2((distances[1]-centerDistance)-(distances[2]-centerDistance), (distances[3]-centerDistance)-(distances[4]-centerDistance));vec2 normalVariation=vec2(distance(normals[1], centerNormal)-distance(normals[2], centerNormal), distance(normals[3], centerNormal)-distance(normals[4], centerNormal));float idVariationTotal=sqrt((idVariation.x*idVariation.x)+(idVariation.y*idVariation.y));float distanceVariationTotal=sqrt((distanceVariation.x*distanceVariation.x)+(distanceVariation.y*distanceVariation.y));float normalVariationTotal=sqrt((normalVariation.x*normalVariation.x)+(normalVariation.y*normalVariation.y));float idContribution=fit(fit(idVariationTotal, idRange.x, idRange.y, 0.0, 1.0), idRange.z, idRange.z+rangeSmoothMargin, 0.0, 1.0);idContribution=mix(idContribution*idMinScale, idContribution, clamp(scale, 0.0, 1.0));float normalContribution=fit(fit(normalVariationTotal, normalRange.x, normalRange.y, 0.0, 1.0), normalRange.z, normalRange.z+rangeSmoothMargin, 0.0, 1.0);float depthLimit=depthRange.z+1.0-centerNormal.z;float depthContribution=fit(fit(distanceVariationTotal, depthRange.x, depthRange.y, 0.0, 1.0), depthLimit, depthLimit+rangeSmoothMargin, 0.0, 1.0);float minDistance=centerDistance;float minContrib=centerContribution;
    #pragma unroll_loop_start
    for (int i=1;i<5;i++){ if (distances[i]<minDistance){ minDistance=distances[i];minContrib=contributions[i]; } }
    #pragma unroll_loop_end
    if (minDistance<centerDistance){ if (minContrib>centerContribution)centerContribution=max(centerContribution, ceil(minContrib)); else centerContribution=min(centerContribution, floor(minContrib)); }centerContribution*=fit(-getViewZ(minDistance, uCameraNear, uCameraFar), distanceFadeRange.x, distanceFadeRange.y, 1.0, 0.0);return clamp(idContribution+normalContribution+depthContribution, 0.0, 1.0)*centerContribution;
}
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;

uniform sampler2D tTransition;
uniform vec3 uBgColor;
uniform float uProgress1;
uniform float uProgress2;
uniform float uProgress3;
uniform float uProgress4;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

vec3 hash32(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

void main() {
    vec2 uv = vUv;
    float aspect = resolution.x / resolution.y;

    
    vec4 scene = texture2D(tDiffuse, uv);
    vec3 sceneColor = scene.rgb;

    
    float resScale = min(1.0, resolution.y / 1300.0) * uOutlineScale;

    float outlineValue = outline(tDiffuse, tInfo, vUv, uOutlineThickness, resScale, uInfoRange, uDepthRange, uNormalRange, uSmoothMargin, uInfoMinScale, uOutlineFade);
    sceneColor = mix(sceneColor, uOutlineColor, outlineValue);

    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
    screenUv.x *= aspect;
    uv -= 0.5;
    uv.x *= aspect;
    uv *= 2.2;
    uv += 0.5;

    
    vec2 noiseUv = screenUv * 3.5;
    float steppedTime = floor(time * 6.0) * 3.14159 * 0.2;
    noiseUv = rotateAngle(steppedTime) * noiseUv;
    vec2 n0 = texture2D(tNoise, noiseUv).rg;
    uv += n0 * 0.0035;

    
    float logo = texture2D(tLogo, uv).r;
    logo = aastep(0.5, logo);

    
    vec2 transitionUv = vUv;

    
    if (resolution.y > resolution.x) {
        transitionUv -= 0.5;
        transitionUv *= resolution / max(resolution.x, resolution.y);
        transitionUv += 0.5;
    }

    float transitionNoise = texture2D(tTransition, transitionUv).r;
    vec3 sceneSansText = sceneColor;
    vec3 outlineColor = mix(uBgColor, uOutlineColor, outlineValue);

    
    vec3 finalColor = mix(sceneColor, vec3(1.0), logo);

    
    sceneColor = finalColor;

    
    if (uProgress4 < 1.0) {
        
        float progress1 = uProgress1;
        sceneColor = mix(uBgColor, vec3(1.0), step(progress1, transitionNoise));

        
        float progress2 = uProgress2;
        sceneColor = mix(outlineColor, sceneColor, step(progress2, transitionNoise));

        
        float progress3 = uProgress3;
        sceneColor = mix(sceneSansText, sceneColor, step(progress3, transitionNoise));

        
        float progress4 = uProgress4;
        sceneColor = mix(finalColor, sceneColor, step(progress4, transitionNoise));
    }

    
    vec3 noise = hash32(uv * 100.0 + steppedTime);
    noise *= 2.0;
    noise -= 1.0;
    sceneColor += noise * 0.075;

    
    

    
    

    gl_FragColor = vec4(sceneColor, 1.0);
}`;class Ye{constructor(e){this.target=e,this.startDelay=2,this.lowFPSThreshold=30,this.highFPSThreshold=60,this.minDPR=.6,this.maxDPR=1,this.dprStep=.1,this.fpsSampleInterval=4,this.requiredSampleCount=5,this.maxAdjustments=4,this.samples=[],this.lastSampleTime=0,this.currentDPR=1,this.adjustmentCount=0,this.lastAdjustmentDirection=0,this.startTime=0,this._onFPSUpdate=this._onFPSUpdate.bind(this)}get hasRun(){return this.lastSampleTime!==0}start(){this.stop(),this.startTime=this.target.timeStats.time+this.startDelay,this.lastSampleTime=this.startTime,this.target.eventManage.on("webgl_average_fps_update",this._onFPSUpdate)}stop(){this.samples.length=0,this.target.eventManage.off("webgl_average_fps_update",this._onFPSUpdate)}_onFPSUpdate(e){if(this.target.timeStats.time<this.startTime)return;if(this.samples.push(e),this.target.timeStats.time-this.lastSampleTime>=this.fpsSampleInterval&&this.samples.length>=this.requiredSampleCount){const i=this.samples.reduce((n,a)=>n+a,0)/this.samples.length;i<this.lowFPSThreshold&&this.currentDPR>this.minDPR?(this.currentDPR=Math.max(this.minDPR,this.currentDPR-this.dprStep),this.target.initDPRMultiplier(this.currentDPR),this.lastAdjustmentDirection===1&&this.adjustmentCount++,this.lastAdjustmentDirection=-1):i>=this.highFPSThreshold&&this.currentDPR<this.maxDPR&&(this.currentDPR=Math.min(this.maxDPR,this.currentDPR+this.dprStep),this.target.initDPRMultiplier(this.currentDPR),this.lastAdjustmentDirection===-1&&this.adjustmentCount++,this.lastAdjustmentDirection=1),this.samples.length=0,this.lastSampleTime=this.target.timeStats.time,this.adjustmentCount>=this.maxAdjustments&&(console.warn("Adaptive DPR stopped."),this.stop())}}}class $e{constructor(){this.TARGET_FPS=60,this.BLEND_DURATION_SECONDS=.2,this.BLEND_FRAME_COUNT=this.TARGET_FPS*this.BLEND_DURATION_SECONDS,this.fpsSmoothingRatio=this.TARGET_FPS/this.BLEND_FRAME_COUNT,this.internalTime=0,this.frameDelta=16,this.frameCount=0,this.smoothedFPS=60,this.recordedMaxFPS=0}get time(){return this.internalTime}get delta(){return this.frameDelta}get frame(){return this.frameCount}get averageFPS(){return this.smoothedFPS}get maxFPS(){return this.recordedMaxFPS}get ratio(){return Math.min(this.fpsSmoothingRatio,this.frameDelta/(1e3/this.TARGET_FPS))}}class et{constructor(e){x(this,"TWO_PI",Math.PI*2);x(this,"HALF_PI",Math.PI*.5);this.base=e,this.timeStats=this.base.timeStats,this.math=ae,this.DEG2RAD=this.math.DEG2RAD,this.RAD2DEG=this.math.RAD2DEG,this.xm=this.base.gsap.parseEase()}degrees(e){return this.math.radToDeg(e)}radians(e){return this.math.degToRad(e)}clamp(e,t=0,i=1){return this.math.clamp(e,t,i)}lerp(e,t,i){return this.math.lerp(e,t,i)}mix(e,t,i){return this.lerp(e,t,i)}deltaRatio(){return this.timeStats.ratio}lerpCoefFPS(e){return this.damp(e,this.timeStats.ratio)}lerpFPS(e,t,i){return this.lerp(e,t,this.lerpCoefFPS(i))}lerpFPSLimited(e,t,i,n=1/0){const a=this.lerpFPS(e,t,i),s=n*this.timeStats.ratio,o=this.clamp(a-e,-s,s);return e+o}damp(e,t){return 1-Math.exp(Math.log(1-e)*t)}frictionFPS(e){return this.friction(e,this.timeStats.ratio)}friction(e,t){return Math.exp(Math.log(e)*t)}efit(e,t,i,n,a){return this.math.mapLinear(e,t,i,n,a)}fit(e,t,i,n,a){return this.efit(this.clamp(e,Math.min(t,i),Math.max(t,i)),t,i,n,a)}fit01(e,t,i){return this.fit(e,0,1,t,i)}fit10(e,t,i){return this.fit(e,1,0,t,i)}fit11(e,t,i){return this.fit(e,-1,1,t,i)}step(e,t){return t<e?0:1}linearstep(e,t,i){return this.clamp((i-e)/(t-e),0,1)}smoothstep(e,t,i){return this.math.smoothstep(i,e,t)}smootherstep(e,t,i){return this.math.smootherstep(i,e,t)}parabola(e,t){return Math.pow(4*e*(1-e),t)}pcurve(e,t,i){return Math.pow(t+i,t+i)/(Math.pow(t,t)*Math.pow(i,i))*Math.pow(e,t)*Math.pow(1-e,i)}ease(e,t="linear"){return(this.xm[t]||this.xm.none)(e)}round(e,t=0){const i=Math.pow(10,t);return Math.round(e*i)/i}isPowerOfTwo(e){return this.math.isPowerOfTwo(e)}ceilPowerOfTwo(e){return this.math.ceilPowerOfTwo(e)}floorPowerOfTwo(e){return this.math.floorPowerOfTwo(e)}makeAnglePositive(e){const t=e%this.TWO_PI;return t<0?this.TWO_PI+t:t}getShortestRotationAngle(e,t){const i=this.makeAnglePositive(e);let n=this.makeAnglePositive(t);return Math.abs(n-i)>Math.PI&&(n>i?n-=this.TWO_PI:n+=this.TWO_PI),e+n-i}latLonTo3D(e,t,i){const n=this.HALF_PI-this.radians(e),a=this.radians(t);return{x:i*Math.sin(n)*Math.sin(a),y:i*Math.cos(n),z:i*Math.sin(n)*Math.cos(a)}}uid(){return this.math.generateUUID()}}class tt{constructor(e,t=0){this.base=e.base,this.finger=t,this.touchID=!1,this.eventID=this.finger===0?"touch":`touch${t+1}`,this.currentInput=this.finger===0?"mouse":"touch",this.button=0,this.touching=!1,this.position=new v(this.base.screen.w*.5,this.base.screen.h*.5),this.position01=new v(.5,.5),this.position11=new v,this.delta=new v,this.delta11=new v,this.dragged=new v,this.dragged11=new v,this.velocity=new v,this.swipeVelocity=new v,this.prevPixel=new v,this.prev01=new v,this.dragOriginPixel=new v,this.dragOrigin01=new v,this.lastTouchTime=0,this._updateVelocity.bind(this),this.base.eventManage.on("webgl_prerender",this._updateVelocity.bind(this))}onTouchStart(e){this.touching=!0,this.lastTouchTime=this.base.timeStats.time,this._updatePosition(e),this._storeLastPosition(),this._storeDragOrigin(),this._updateDrag(),this.base.eventManage.emit(`${this.eventID}_start`,this)}onTouchMove(e){this._updatePosition(e),this._updateDelta(),this.base.eventManage.emit(`${this.eventID}_move`,this),this.touching&&(this._updateDrag(),this.base.eventManage.emit(`${this.eventID}_drag`,this))}onTouchEnd(e){this._updatePosition(e),this._updateDelta(),this._updateDrag();const t=this.touching;if(this.touching=!1,!t)return;const i=Math.max(.001,this.base.timeStats.time-this.lastTouchTime);this.swipeVelocity.copy(this.dragged).divideScalar(i),this.base.eventManage.emit(`${this.eventID}_end`,this),this.dragged.length()<15&&i<.5&&e.type!=="pointerout"&&this.base.eventManage.emit(`${this.eventID}_click`,this)}dispose(){this.base.eventManage.off("webgl_prerender",this._updateVelocity,this)}_updatePosition(e){const t=e.offsetX,i=e.offsetY;this.position.set(t,i),this.position01.set(t/this.base.screen.w,1-i/this.base.screen.h),this.position11.copy(this.position01).multiplyScalar(2).subScalar(1),this.currentInput=e.pointerType==="mouse"?"mouse":"touch",this.button=e.button}_storeLastPosition(){this.prevPixel.copy(this.position),this.prev01.copy(this.position01)}_updateDelta(){this.delta.copy(this.position).sub(this.prevPixel),this.delta11.copy(this.position01).sub(this.prev01),this._storeLastPosition();const e=this.delta11.clone().multiplyScalar(2);this.velocity.add(e)}_storeDragOrigin(){this.dragOriginPixel.copy(this.position),this.dragOrigin01.copy(this.position01)}_updateDrag(){this.dragged.copy(this.position).sub(this.dragOriginPixel),this.dragged11.copy(this.position01).sub(this.dragOrigin01)}_updateVelocity(){const e=this.base.utils.frictionFPS(.95);this.velocity.multiplyScalar(e),this.velocity.clampScalar(-1,1),this.velocity.length()<.001&&this.velocity.setScalar(0)}}class it{constructor(e){this.base=e,this.trackers=[],this.targetElement=null,this.isCanvas=!0,this.allowTouchStart=!1,this.handleTouchStart=this._onPointerDown.bind(this),this.handleTouchMove=this._onPointerMove.bind(this),this.handleTouchEnd=this._onPointerUp.bind(this),this.handlePreventTouchStart=this._preventTouchStart.bind(this),this.handlePreventDefault=this._preventDefault.bind(this),this.init({element:this.base.target,fingers:1})}get(e){return this.trackers[e]}getActive(){return this.trackers.filter(e=>e.touching)}init({element:e=window,fingers:t=2,contextMenu:i=!1}={}){this.targetElement=e,this.isCanvas=e instanceof HTMLCanvasElement;for(let n=0;n<t;n++)this.trackers.push(new tt(this,n));e.style.touchAction="none",this.isCanvas&&(e.style.userSelect="none"),e.addEventListener("pointerdown",this.handleTouchStart),e.addEventListener("pointermove",this.handleTouchMove),e.addEventListener("pointerup",this.handleTouchEnd),e.addEventListener("pointerout",this.handleTouchEnd),e.addEventListener("pointercancel",this.handleTouchEnd),i||e.addEventListener("contextmenu",this.handlePreventDefault),e.addEventListener("touchstart",this.handlePreventTouchStart,{passive:!1}),document.addEventListener("dblclick",this.handlePreventDefault)}dispose(){const e=this.targetElement;e.removeEventListener("pointerdown",this.handleTouchStart),e.removeEventListener("pointermove",this.handleTouchMove),e.removeEventListener("pointerup",this.handleTouchEnd),e.removeEventListener("pointerout",this.handleTouchEnd),e.removeEventListener("pointercancel",this.handleTouchEnd),e.removeEventListener("contextmenu",this.handlePreventDefault),e.removeEventListener("touchstart",this.handlePreventTouchStart),document.removeEventListener("dblclick",this.handlePreventDefault),this.trackers.forEach(t=>t.dispose()),this.trackers.length=0,this.targetElement=null,this.isCanvas=!0}_findUnusedTracker(){return this.trackers.find(e=>e.touchID===!1)}_findTrackerByID(e){return this.trackers.find(t=>t.touchID===e)}_onPointerDown(e){const t=this._findUnusedTracker();t&&(this.isCanvas&&this.getActive().length===0&&this.targetElement.setPointerCapture(e.pointerId),t.touchID=e.pointerId,t.onTouchStart(e))}_onPointerMove(e){const t=this._findTrackerByID(e.pointerId);t?t.onTouchMove(e):e.pointerType==="mouse"&&this.getActive().length===0&&this.trackers[0].onTouchMove(e)}_onPointerUp(e){const t=this._findTrackerByID(e.pointerId);t&&(t.onTouchEnd(e),t.touchID=!1,this.isCanvas&&this.getActive().length===0&&this.targetElement.releasePointerCapture(e.pointerId))}_preventTouchStart(e){this.allowTouchStart||e.preventDefault()}_preventDefault(e){e.preventDefault()}}class nt{constructor({shadowMap:e=!0,shadowMapType:t=re}={}){x(this,"webgl");x(this,"domElement");x(this,"info");x(this,"clearColor",new p("#000000"));x(this,"clearAlpha",1);this.webgl=new se({alpha:!1,antialias:!1,stencil:!1,depth:!1}),this.webgl.setClearColor(this.clearColor,this.clearAlpha),e&&(this.webgl.shadowMap.enabled=!0,t&&(this.webgl.shadowMap.type=t)),this.info=this.webgl.info,this.webgl.debug.checkShaderErrors=!1,this.webgl.capabilities.floatLinearFiltering=this.webgl.extensions.has("OES_texture_float_linear"),this.webgl.capabilities.floatRenderTarget=this.checkFloatRenderTarget()}checkFloatRenderTarget(){const e=new z(1,1,{minFilter:A,magFilter:A,type:T}),t=new G,i=new y({vertexShader:" void main() { gl_Position = vec4(position, 1.0); } ",fragmentShader:" void main() { gl_FragColor.rgb = vec3(0.0, 1.0 / 10.0, 1.0 / 20.0); gl_FragColor.a = 1.0; } "}),n=new W;n.setAttribute("position",new S(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),n.setAttribute("uv",new S(new Float32Array([0,0,2,0,0,2]),2)),t.add(new I(n,i));const a=this.webgl.getRenderTarget();this.webgl.setRenderTarget(e),this.webgl.render(t,new X(-1,1,1,-1,0,1));const s=new Float32Array(4);return this.webgl.readRenderTargetPixels(e,0,0,1,1,s),this.webgl.setRenderTarget(a),e.dispose(),i.dispose(),!(s[0]!==0||s[1]<.1||s[2]<.05||s[3]<1)}dispose(){this.webgl.dispose(),this.webgl=null,this.domElement=null,this.info=null}}class te extends J{constructor(e){super(45,e.screen.w/e.screen.h,.1,1e3),this.base=e,this.isBaseCamera=!0,this._sizing=1,this._size=new v(e.screen.w,e.screen.h),this._firstUpdate=!0,this._prevSize=this._size.clone(),this._prevPosition=new f,this._prevTarget=new f,this._prevUp=new f,this._additionalSphericalPosition=new H,this._additionalSphericalTarget=new H,this._additionalRotationUp=0,this.target=new f,this.basePosition=new f(0,0,6),this.baseTarget=new f,this.baseUp=new f(0,1,0),this.displacement={position:new v,target:new v,rotation:0},this.lerpPosition=.035,this.lerpTarget=.035,this.lerpRotation=.035,this.shake=new f,this.shakeSpeed=new f(1,1,1),this.touchAmount=1,this.resetOnTouch=!0,this.Tn=new f,this.er=new f,this.Gu=new f,this.As=new f,this.Em=new v,this.XI=new w;const t=Se(Math.random);this.Du={sineNoise1:t}}_update(){this._firstUpdate&&(this._firstUpdate=!1);const e=this.resetOnTouch&&this.base.inputManager.get(0).currentInput==="touch"&&!this.base.inputManager.get(0).touching,t=e?.5:1,i=this.base.utils.fit(e?0:this.base.inputManager.get(0).position11.x,-1,1,-Math.PI*.5,Math.PI*.5)*this.touchAmount,n=this.base.utils.fit(e?0:this.base.inputManager.get(0).position11.y,1,-1,-Math.PI*.5,Math.PI*.5)*this.touchAmount;if(this.Tn.subVectors(this.basePosition,this.baseTarget),this.Tn.lengthSq()===0&&(this.Tn.z=1),this.Tn.normalize(),this.er.crossVectors(this.baseUp,this.Tn),this.er.lengthSq()===0&&(Math.abs(this.baseUp.z)===1?this.Tn.x+=1e-4:this.Tn.z+=1e-4,this.Tn.normalize(),this.er.crossVectors(this.baseUp,this.Tn)),this.er.normalize(),this.Gu.crossVectors(this.Tn,this.er),this.displacement.position.equals(this.Em)?(this.position.copy(this.basePosition),this._additionalSphericalPosition.set(1,0,0)):(this._additionalSphericalPosition.theta=this.base.utils.lerpFPS(this._additionalSphericalPosition.theta,i*this.displacement.position.x,this.lerpPosition*t),this._additionalSphericalPosition.phi=this.base.utils.lerpFPS(this._additionalSphericalPosition.phi,n*this.displacement.position.y,this.lerpPosition*t),this.As.subVectors(this.basePosition,this.baseTarget),this.As.applyAxisAngle(this.er,this._additionalSphericalPosition.phi).applyAxisAngle(this.Gu,this._additionalSphericalPosition.theta),this.position.copy(this.baseTarget).add(this.As)),this.displacement.target.equals(this.Em)&&this.shake.x===0&&this.shake.y===0)this.target.copy(this.baseTarget),this._additionalSphericalTarget.set(1,0,0);else{this._additionalSphericalTarget.theta=this.base.utils.lerpFPS(this._additionalSphericalTarget.theta,i*this.displacement.target.x,this.lerpTarget*t),this._additionalSphericalTarget.phi=this.base.utils.lerpFPS(this._additionalSphericalTarget.phi,n*this.displacement.target.y,this.lerpTarget*t);const a=this.shake.x===0?0:this.Du.sineNoise1(12.23,3.44,-3.234+this.base.timeStats.time*this.shakeSpeed.x)*this.shake.x*this.touchAmount,s=this.shake.y===0?0:this.Du.sineNoise1(-2.45,4.789,7.343+this.base.timeStats.time*this.shakeSpeed.y)*this.shake.y*this.touchAmount;this.As.subVectors(this.baseTarget,this.basePosition),this.As.applyAxisAngle(this.er,this._additionalSphericalTarget.phi+s).applyAxisAngle(this.Gu,this._additionalSphericalTarget.theta+a),this.target.copy(this.basePosition).add(this.As)}if(this.displacement.rotation===0&&this.shake.z===0)this.up.copy(this.baseUp),this._additionalRotationUp=0;else{this._additionalRotationUp=this.base.utils.lerpFPS(this._additionalRotationUp,this.base.inputManager.get(0).velocity.x*this.displacement.rotation*this.touchAmount,this.lerpRotation*t);const a=this.shake.z===0?0:this.Du.sineNoise1(23.434,-1.565,8.454+this.base.timeStats.time*this.shakeSpeed.z)*this.shake.z*this.touchAmount;this.As.subVectors(this.position,this.target).normalize(),this.up.copy(this.baseUp).applyAxisAngle(this.As,this._additionalRotationUp+a)}(!this.position.equals(this._prevPosition)||!this.target.equals(this._prevTarget)||!this.up.equals(this._prevUp))&&(this._prevPosition.copy(this.position),this._prevTarget.copy(this.target),this._prevUp.copy(this.up),this.quaternion.setFromRotationMatrix(this.XI.lookAt(this.position,this.target,this.up)))}_resize(){if(this._sizing===1&&this._size.set(this.base.screen.w,this.base.screen.h),!this._prevSize.equals(this._size)){if(this._prevSize.copy(this._size),this.isPerspectiveCamera)this.aspect=this._size.x/this._size.y;else{const e=this._size.x*.5,t=this._size.y*.5;this.left=-e,this.right=e,this.top=t,this.bottom=-t}this.updateProjectionMatrix()}}setCustomSize(e,t){this._sizing=2,this._size.set(e,t)}}class at extends G{constructor(e){super(),this.base=e,this.camera=this.base.camera||new te(this.base),this.camera.matrixWorldAutoUpdate=!1,this.matrixAutoUpdate=!1,this.matrixWorldAutoUpdate=!0,this.beforeRenderCbs=[],this._textures=new Set,this.customUploadRT=null}updateMatrixWorld(e){var t,i,n,a;super.updateMatrixWorld(e),(i=(t=this.camera)._resize)==null||i.call(t),(a=(n=this.camera)._update)==null||a.call(n),this.camera.updateMatrixWorld(),this.beforeRenderCbs.forEach(s=>s())}async _upload(){this.traverse(i=>{var n,a,s,o;(n=i.material)!=null&&n.isMaterial?(i.frustumCulled&&i.boundingSphere==null&&((a=i.computeBoundingSphere)==null||a.call(i)),i.material.uniforms?Object.entries(i.material.uniforms).forEach(([h,u])=>{const r=u.value;r!=null&&r.isTexture&&r._loaded&&this._textures.add(r)}):Object.entries(i.material).forEach(([h,u])=>{u!=null&&u.isTexture&&u._loaded&&this._textures.add(u)}),i.__uploadVars={cull:i.frustumCulled,visible:i.visible,materialVisible:i.material.visible,customDepthMaterialVisible:(s=i.customDepthMaterial)==null?void 0:s.visible,customDistanceMaterialVisible:(o=i.customDistanceMaterial)==null?void 0:o.visible},i.frustumCulled=!1,i.visible=!0,i.material.visible=!0,i.customDepthMaterial&&(i.customDepthMaterial.visible=!0),i.customDistanceMaterial&&(i.customDistanceMaterial.visible=!0)):i.isLOD&&(i.__uploadVars={autoUpdate:i.autoUpdate},i.autoUpdate=!1)});const e=[],t=new z(2,2,{type:F});t.setSize=()=>{},t.dispose=()=>{},this.base.renderer.webgl.setRenderTarget(this.customUploadRT||t),e.push(this.base.renderer.webgl.compileAsync(this,this.camera));for(const i of this._textures)e.push(i._loaded.then(()=>this.base.renderer.webgl.initTexture(i)));await Promise.all(e),this.base.renderer.webgl.setRenderTarget(this.customUploadRT||t),this.base.renderer.webgl.render(this,this.camera),this.traverse(i=>{var n;i.__uploadVars&&((n=i.material)!=null&&n.isMaterial?(i.frustumCulled=i.__uploadVars.cull,i.visible=i.__uploadVars.visible,i.material.visible=i.__uploadVars.materialVisible,i.customDepthMaterial&&(i.customDepthMaterial.visible=i.__uploadVars.customDepthMaterialVisible),i.customDistanceMaterial&&(i.customDistanceMaterial.visible=i.__uploadVars.customDistanceMaterialVisible)):i.isLOD&&(i.autoUpdate=i.__uploadVars.autoUpdate),delete i.__uploadVars)}),this._isUploaded()}dispose(){var e,t,i,n;(t=(e=this.camera).dispose)==null||t.call(e),this.beforeRenderCbs=[],(n=(i=this.customUploadRT)==null?void 0:i.dispose)==null||n.call(i),this._textures.forEach(a=>{var s;return(s=a.dispose)==null?void 0:s.call(a)}),this._textures.clear(),this.traverse(a=>{var s,o,h,u,r,m;(o=(s=a.geometry)==null?void 0:s.dispose)==null||o.call(s),(h=a.material)!=null&&h.isMaterial&&(a.material.uniforms?Object.values(a.material.uniforms).forEach(l=>{var c,g,R;(c=l.value)!=null&&c.isTexture&&((R=(g=l.value).dispose)==null||R.call(g))}):Object.values(a.material).forEach(l=>{var c;l!=null&&l.isTexture&&((c=l.dispose)==null||c.call(l))}),(r=(u=a.material).dispose)==null||r.call(u)),a!==this&&((m=a.dispose)==null||m.call(a))}),this.clear()}}class st extends oe{constructor(e){if(!e.scene)throw new Error("MultipleRenderPass requires a scene.");super(),this.base=e,this.scene=this.base.scene,this.camera=this.base.scene.camera||this.base.camera,this.clearColor=new p("#ffffff"),this.clearAlpha=this.base.renderer.webgl.clearAlpha,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this._oldClearColor=new p,this.multipleRenderTarget=new B(this.base.uniforms.resolution.x,this.base.uniforms.resolution.y,2,{type:F})}render(e,t,i){const n=e.autoClear;e.autoClear=!1;let a=null;this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,this.clearAlpha)),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth&&e.clearDepth(),e.setRenderTarget(this.multipleRenderTarget),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor,1),this.clearAlpha!==null&&e.setClearAlpha(a),e.autoClear=n}setSize(e,t){this.multipleRenderTarget.setSize(e,t)}dispose(){this.multipleRenderTarget.dispose()}}class rt{constructor(e){this.base=e,this.pass=new Y(new y({uniformsGroups:[this.base.UBO],uniforms:{tLogo:{value:this.base.headLineTexture},tNoise:{value:this.base.noiseSimplexLayeredTexture},tDiffuse:{value:null},tInfo:{value:null},tSim:this.base.fluidSim.dyeUniform,uBgColor:{value:new p("#ffec95")},tTransition:{value:this.base.transitionNomipmapsTexture},uProgress1:{value:0},uProgress2:{value:0},uProgress3:{value:0},uProgress4:{value:0},uCameraNear:{value:this.base.camera.near,ignore:!0},uCameraFar:{value:this.base.camera.far,ignore:!0},uOutlineFade:{value:new v(10,80)},uOutlineThickness:{value:1},uOutlineColor:{value:new p("#9f4a16")},uInfoRange:{value:new f(1e-4,2e-4,.1)},uInfoMinScale:{value:.6},uDepthRange:{value:new f(1e-4,.001,.5)},uNormalRange:{value:new f(.4,.5,.3)},uOutlineScale:{value:1},uSmoothMargin:{value:.2}},vertexShader:Xe,fragmentShader:Je}))}}class ot{constructor(e){this.base=e,this.isFluid=!0,this._linearFilteringSupported=this.base.renderer.webgl.capabilities.floatLinearFiltering,this._simRes=128,this._dyeRes=256,this._simTexelSize=1/this._simRes,this._dyeTexelSize=1/this._dyeRes,this._pressureIterations=2,this._densityDissipation=.88,this._velocityDissipation=.98,this._pressureDissipation=.86,this._curlStrength=0,this._splatRadius=.2,this._splatRadiusVelocity=!1,this._splatForce=35,this._splatMode=2,this._borders=!1,this._mode=1,this._aspect=1,this._fingers=this.base.inputManager.fingers,this._enabled=!1,this.points=Array.from(Array(this._fingers),()=>({position:new v(.5,.5),prevPosition:new v(.5,.5),lastUpdate:0,lastSplat:0,velocity:0})),this.rc=new v,this._createRTs(),this._createMaterials(),this._createScene(),this.dyeUniform={value:null},this.velUniform={value:null},this.enable()}swapBuffer(e,t,i){const n=new z(e,e,{format:t,type:F,magFilter:i,minFilter:i,depthBuffer:!1}),a=n.clone(),s={read:n,write:a,swap:()=>{const o=s.read;s.read=s.write,s.write=o}};return s}_createRTs(){this._density=this.swapBuffer(this._dyeRes,b,this._linearFilteringSupported?q:A),this._velocity=this.swapBuffer(this._simRes,b,this._linearFilteringSupported?q:A),this._pressure=this.swapBuffer(this._simRes,b,A);const e={type:F,magFilter:A,minFilter:A,depthBuffer:!1};this._divergence=new z(this._simRes,this._simRes,e),this._curl=new z(this._simRes,this._simRes,e)}_createMaterials(){const e=this.base.renderer.webgl.capabilities,t=e.getMaxPrecision("highp"),i=e.getMaxPrecision("mediump");this._materialClear=new M({name:"FLUID_CLEAR",uniforms:{texelSize:{value:new v},uTexture:{value:null},value:{value:this._pressureDissipation}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                varying vec2 vUv;

                void main () {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${i} float;
                precision ${i} sampler2D;

                uniform sampler2D uTexture;
                uniform float value;

                varying highp vec2 vUv;

                void main () {
                    gl_FragColor.rgb = value * texture2D(uTexture, vUv).rgb;
                    gl_FragColor.a = 1.0;
                }
            `,depthTest:!1,depthWrite:!1}),this._materialSplat=new M({name:"FLUID_SPLAT",uniforms:{texelSize:{value:new v},uTarget:{value:null},aspectRatio:{value:1},color:{value:new f},point:{value:new v},prevPoint:{value:new v},radius:{value:1},isDye:{value:!1}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                varying vec2 vUv;

                void main () {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${t} float;
                precision ${t} sampler2D;

                ${this._splatMode===1?"#define SPLAT_DOT":""}

                uniform sampler2D uTarget;
                uniform float aspectRatio;
                uniform vec3 color;
                uniform vec2 point;
                uniform vec2 prevPoint;
                uniform float radius;
                uniform bool isDye;

                varying vec2 vUv;

                float line(vec2 uv, vec2 point1, vec2 point2) {
                    vec2 pa = uv - point1, ba = point2 - point1;
                    pa.x *= aspectRatio;
                    ba.x *= aspectRatio;
                    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
                    return length(pa - ba * h);
                }

                float cubicIn(float t) {
                    return t * t * t;
                }

                void main () {
                    #ifdef SPLAT_DOT
                        vec2 p = vUv - point.xy;
                        p.x *= aspectRatio;
                        vec3 splat = exp(-dot(p, p) / (radius / 50.0)) * color; // vec3 splat = exp(-dot(p, p) / radius) * color;
                    #else
                        vec3 splat =  cubicIn(clamp(1.0 - line(vUv, prevPoint.xy, point.xy) / radius, 0.0, 1.0)) * color;
                    #endif

                    vec3 base = texture2D(uTarget, vUv).xyz;
                    vec3 result = base + splat;
                    if (isDye) result = clamp(result, vec3(0.0), vec3(1.0));

                    gl_FragColor = vec4(result, 1.0);
                }
            `,depthTest:!1,depthWrite:!1}),this._materialCurl=new M({name:"FLUID_CURL",uniforms:{texelSize:{value:new v},uVelocity:{value:null}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vL = uv - vec2(texelSize.x, 0.0);
                    vR = uv + vec2(texelSize.x, 0.0);
                    vT = uv + vec2(0.0, texelSize.y);
                    vB = uv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${i} float;
                precision ${i} sampler2D;

                uniform sampler2D uVelocity;

                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uVelocity, vL).y;
                    float R = texture2D(uVelocity, vR).y;
                    float T = texture2D(uVelocity, vT).x;
                    float B = texture2D(uVelocity, vB).x;
                    float vorticity = R - L - T + B;
                    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
                }
            `,depthTest:!1,depthWrite:!1}),this._materialVorticity=new M({name:"FLUID_VORTICITY",uniforms:{texelSize:{value:new v},uVelocity:{value:null},uCurl:{value:null},curl:{value:this._curlStrength},dt:{value:1/60}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${t} float;
                precision ${t} sampler2D;

                uniform sampler2D uVelocity;
                uniform sampler2D uCurl;
                uniform float curl;
                uniform float dt;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    float L = texture2D(uCurl, vL).x;
                    float R = texture2D(uCurl, vR).x;
                    float T = texture2D(uCurl, vT).x;
                    float B = texture2D(uCurl, vB).x;
                    float C = texture2D(uCurl, vUv).x;
                    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
                    force /= length(force) + 0.0001;
                    force *= curl * C;
                    force.y *= -1.0;
                    vec2 vel = texture2D(uVelocity, vUv).xy;
                    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
                }
            `,depthTest:!1,depthWrite:!1}),this._materialDivergence=new M({name:"FLUID_DIVERGENCE",uniforms:{texelSize:{value:new v},uVelocity:{value:null}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${i} float;
                precision ${i} sampler2D;
                ${this._borders?"#define LIMIT_BORDERS":""}

                uniform sampler2D uVelocity;

                varying highp vec2 vUv;
                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uVelocity, vL).x;
                    float R = texture2D(uVelocity, vR).x;
                    float T = texture2D(uVelocity, vT).y;
                    float B = texture2D(uVelocity, vB).y;
                    vec2 C = texture2D(uVelocity, vUv).xy;

                    #ifdef LIMIT_BORDERS
                        if (vL.x < 0.0) { L = -C.x; }
                        if (vR.x > 1.0) { R = -C.x; }
                        if (vT.y > 1.0) { T = -C.y; }
                        if (vB.y < 0.0) { B = -C.y; }
                    #endif

                    float div = 0.5 * (R - L + T - B);
                    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
                }
            `,depthTest:!1,depthWrite:!1}),this._materialPressure=new M({name:"FLUID_PRESSURE",uniforms:{texelSize:{value:new v},uPressure:{value:null},uDivergence:{value:null}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${i} float;
                precision ${i} sampler2D;

                uniform sampler2D uPressure;
                uniform sampler2D uDivergence;

                varying highp vec2 vUv;
                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uPressure, vL).x;
                    float R = texture2D(uPressure, vR).x;
                    float T = texture2D(uPressure, vT).x;
                    float B = texture2D(uPressure, vB).x;
                    float C = texture2D(uPressure, vUv).x;
                    float divergence = texture2D(uDivergence, vUv).x;
                    float pressure = (L + R + B + T - divergence) * 0.25;
                    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
                }
            `,depthTest:!1,depthWrite:!1}),this._materialGradientSubstract=new M({name:"FLUID_GRADIENT_SUBSTRACT",uniforms:{texelSize:{value:new v},uPressure:{value:null},uVelocity:{value:null}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                uniform vec2 texelSize;

                varying vec2 vUv;
                varying vec2 vL;
                varying vec2 vR;
                varying vec2 vT;
                varying vec2 vB;

                void main () {
                    vUv = uv;
                    vL = vUv - vec2(texelSize.x, 0.0);
                    vR = vUv + vec2(texelSize.x, 0.0);
                    vT = vUv + vec2(0.0, texelSize.y);
                    vB = vUv - vec2(0.0, texelSize.y);
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${i} float;
                precision ${i} sampler2D;

                uniform sampler2D uPressure;
                uniform sampler2D uVelocity;

                varying highp vec2 vUv;
                varying highp vec2 vL;
                varying highp vec2 vR;
                varying highp vec2 vT;
                varying highp vec2 vB;

                void main () {
                    float L = texture2D(uPressure, vL).x;
                    float R = texture2D(uPressure, vR).x;
                    float T = texture2D(uPressure, vT).x;
                    float B = texture2D(uPressure, vB).x;
                    vec2 velocity = texture2D(uVelocity, vUv).xy;
                    velocity.xy -= vec2(R - L, T - B);
                    gl_FragColor = vec4(velocity, 0.0, 1.0);
                }
            `,depthTest:!1,depthWrite:!1}),this._materialAdvection=new M({name:"FLUID_ADVECTION",uniforms:{texelSize:{value:new v},dyeTexelSize:{value:new v().setScalar(1/this._dyeRes)},uVelocity:{value:null},uSource:{value:null},dt:{value:1/60},dissipation:{value:1}},vertexShader:`
                precision ${t} float;

                attribute vec3 position;
                attribute vec2 uv;

                varying vec2 vUv;

                void main () {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
            `,fragmentShader:`
                precision ${t} float;
                precision ${t} sampler2D;
                ${this._linearFilteringSupported?"":"#define MANUAL_FILTERING"}

                uniform sampler2D uVelocity;
                uniform sampler2D uSource;
                uniform vec2 texelSize;
                uniform vec2 dyeTexelSize;
                uniform float dt;
                uniform float dissipation;

                varying vec2 vUv;

                vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
                    vec2 st = uv / tsize - 0.5;
                    vec2 iuv = floor(st);
                    vec2 fuv = fract(st);
                    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
                    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
                    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
                    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
                    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
                }

                void main () {
                    vec4 result;

                    #ifdef MANUAL_FILTERING
                        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
                        result = bilerp(uSource, coord, dyeTexelSize);
                    #else
                        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
                        result = texture2D(uSource, coord);
                    #endif

                    gl_FragColor.rgb = result.rgb * dissipation;
                    gl_FragColor.a = 1.0;
                }
            `,depthTest:!1,depthWrite:!1})}_createScene(){this._scene=new G,this._camera=new X(-1,1,1,-1,0,1);const e=new W;e.setAttribute("position",new S(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),e.setAttribute("uv",new S(new Float32Array([0,0,2,0,0,2]),2)),this._mesh=new I(e,this._materialClear),this._mesh.frustumCulled=!1,this._scene.add(this._mesh)}_update(e){const t=e.data;this._mode===1&&(this._aspect=this.base.uniforms.resolution.value.x/this.base.uniforms.resolution.value.y);const i=this.base.renderer.webgl.autoClear;this.base.renderer.webgl.autoClear=!1,this.points.forEach(a=>{if(t-a.lastUpdate<.016)return;this.rc.subVectors(a.position,a.prevPosition);const s=this.rc.length();if(a.velocity+=s*2,s>0){const o=t-a.lastSplat>.15;this._mesh.material=this._materialSplat,this._materialSplat.uniforms.isDye.value=!1,this._materialSplat.uniforms.uTarget.value=this._velocity.read.texture,this._materialSplat.uniforms.aspectRatio.value=this._aspect,this._materialSplat.uniforms.point.value.copy(a.position),this._materialSplat.uniforms.prevPoint.value.copy(o?a.position:a.prevPosition),this._materialSplat.uniforms.color.value.set(this.rc.x,this.rc.y,0).multiplyScalar(this._splatForce).multiplyScalar(o?0:1),this._materialSplat.uniforms.radius.value=this._splatRadius*(this._splatRadiusVelocity?a.velocity:1),this.base.renderer.webgl.setRenderTarget(this._velocity.write),this.base.renderer.webgl.render(this._scene,this._camera),this._velocity.swap(),this._materialSplat.uniforms.isDye.value=!0,this._materialSplat.uniforms.uTarget.value=this._density.read.texture,this._materialSplat.uniforms.color.value.setScalar(1),this.base.renderer.webgl.setRenderTarget(this._density.write),this.base.renderer.webgl.render(this._scene,this._camera),this._density.swap(),a.lastSplat=e}a.lastUpdate=e,a.prevPosition.copy(a.position),a.velocity*=.9,a.velocity=Math.min(1,a.velocity)});const n=this.base.ratio;this._mesh.material=this._materialCurl,this._materialCurl.uniforms.texelSize.value.setScalar(this._simTexelSize),this._materialCurl.uniforms.uVelocity.value=this._velocity.read.texture,this.base.renderer.webgl.setRenderTarget(this._curl),this.base.renderer.webgl.render(this._scene,this._camera),this._mesh.material=this._materialVorticity,this._materialVorticity.uniforms.texelSize.value.setScalar(this._simTexelSize),this._materialVorticity.uniforms.uVelocity.value=this._velocity.read.texture,this._materialVorticity.uniforms.uCurl.value=this._curl.texture,this._materialVorticity.uniforms.curl.value=this._curlStrength,this._materialVorticity.uniforms.dt.value=n,this.base.renderer.webgl.setRenderTarget(this._velocity.write),this.base.renderer.webgl.render(this._scene,this._camera),this._velocity.swap(),this._mesh.material=this._materialDivergence,this._materialDivergence.uniforms.texelSize.value.setScalar(this._simTexelSize),this._materialDivergence.uniforms.uVelocity.value=this._velocity.read.texture,this.base.renderer.webgl.setRenderTarget(this._divergence),this.base.renderer.webgl.render(this._scene,this._camera),this._mesh.material=this._materialClear,this._materialClear.uniforms.uTexture.value=this._pressure.read.texture,this._materialClear.uniforms.value.value=this.base.utils.frictionFPS(this._pressureDissipation),this.base.renderer.webgl.setRenderTarget(this._pressure.write),this.base.renderer.webgl.render(this._scene,this._camera),this._pressure.swap(),this._mesh.material=this._materialPressure,this._materialPressure.uniforms.texelSize.value.setScalar(this._simTexelSize),this._materialPressure.uniforms.uDivergence.value=this._divergence.texture;for(let a=0;a<this._pressureIterations;a++)this._materialPressure.uniforms.uPressure.value=this._pressure.read.texture,this.base.renderer.webgl.setRenderTarget(this._pressure.write),this.base.renderer.webgl.render(this._scene,this._camera),this._pressure.swap();this._mesh.material=this._materialGradientSubstract,this._materialGradientSubstract.uniforms.texelSize.value.setScalar(this._simTexelSize),this._materialGradientSubstract.uniforms.uPressure.value=this._pressure.read.texture,this._materialGradientSubstract.uniforms.uVelocity.value=this._velocity.read.texture,this.base.renderer.webgl.setRenderTarget(this._velocity.write),this.base.renderer.webgl.render(this._scene,this._camera),this._velocity.swap(),this._mesh.material=this._materialAdvection,this._materialAdvection.uniforms.texelSize.value.setScalar(this._simTexelSize),this._materialAdvection.uniforms.dyeTexelSize.value.setScalar(this._simTexelSize),this._materialAdvection.uniforms.uVelocity.value=this._velocity.read.texture,this._materialAdvection.uniforms.uSource.value=this._velocity.read.texture,this._materialAdvection.uniforms.dt.value=n,this._materialAdvection.uniforms.dissipation.value=this.base.utils.frictionFPS(this._velocityDissipation),this.base.renderer.webgl.setRenderTarget(this._velocity.write),this.base.renderer.webgl.render(this._scene,this._camera),this._velocity.swap(),this._materialAdvection.uniforms.dyeTexelSize.value.setScalar(this._dyeTexelSize),this._materialAdvection.uniforms.uVelocity.value=this._velocity.read.texture,this._materialAdvection.uniforms.uSource.value=this._density.read.texture,this._materialAdvection.uniforms.dissipation.value=this.base.utils.frictionFPS(this._densityDissipation),this.base.renderer.webgl.setRenderTarget(this._density.write),this.base.renderer.webgl.render(this._scene,this._camera),this._density.swap(),this.base.renderer.webgl.autoClear=i,this.dyeUniform.value=this._density.read.texture,this.velUniform.value=this._velocity.read.texture}_moveFinger(e){this.points[e.data.finger].position.copy(e.data.prevPosition)}enable(){if(!this._enabled&&(this._enabled=!0,this.base.eventManage.on("webgl_prerender",this._update.bind(this)),this._mode===1))for(let e=0;e<this._fingers;e++)this.base.eventManage.on(`touch${e===0?"":e+1}_start`,this._moveFinger.bind(this)),this.base.eventManage.on(`touch${e===0?"":e+1}_move`,this._moveFinger.bind(this))}disable(){if(this._enabled&&(this._enabled=!1,this.base.eventManage.on("webgl_prerender",this._update.bind(this)),this._mode===1))for(let e=0;e<this._fingers;e++)this.base.eventManage.on(`touch${e===0?"":e+1}_start`,this._moveFinger.bind(this)),this.base.eventManage.on(`touch${e===0?"":e+1}_move`,this._moveFinger.bind(this))}dispose(){this.disable(),this._materialClear.dispose(),this._materialSplat.dispose(),this._materialCurl.dispose(),this._materialVorticity.dispose(),this._materialDivergence.dispose(),this._materialPressure.dispose(),this._materialGradientSubstract.dispose(),this._materialAdvection.dispose(),[this._density,this._velocity,this._pressure].forEach(e=>e.read.dispose()&&e.write.dispose()),this._divergence.dispose(),this._curl.dipose()}}var lt=`uniform Global{
    vec2 resolution;
    float time;
    float dtRatio;
};

uniform float uCount;
uniform sampler2D tNoise;
uniform float uFlowerTime;

attribute float random;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying float vRandom;
varying float vProgress;
varying vec3 vNormal;
flat varying float vIndex;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

const float PI = 3.14159;
const float HALF_PI = PI * 0.5;
const float TWO_PI = PI * 2.0;

void main() {
    float index = float(gl_InstanceID);
    vIndex = index;

    vUv = uv;
    vRandom = random;
    vNormal = normalize(normalMatrix * normal);

    float idx = index / uCount;

    vec3 pos = position;
    float t = uFlowerTime * 0.075;

    
    float progress01 = fract(idx + t + 0.5);
    vProgress = progress01;

    
    pos.x += cos(vUv.y * 8.0 - progress01 * 24.0 + random) * 0.02;

    
    pos.z += 0.15;

    
    pos.x *= 1.2;

    
    float scale = 1.0;
    scale *= abs(progress01 - 0.5) * 2.0;
    scale = 1.0 - pow(scale, 3.0);
    pos *= scale;

    
    mat2 rot0 = rotateAngle(-(vUv.x - 0.5) * (1.0 - progress01) * 1.5);
    pos.xy = rot0 * pos.xy;

    
    mat2 rot1 = rotateAngle(progress01 * PI - HALF_PI - vUv.y * 2.0 + 1.7 + sin(progress01 * 16.0 - vUv.y * 3.0 + 0.5) * 0.35 * pow(1.0 - progress01, 2.0));
    pos.yz = rot1 * pos.yz;

    
    mat2 rot2 = rotateAngle(index * 4.854 + random * 0.05);
    pos.xz = rot2 * pos.xz;

    
    pos.y -= pow(progress01, 2.0) * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vHighPrecisionZW = gl_Position.zw;
}`,ht=`layout(location = 1) out highp vec4 gInfo;

uniform Global{
    vec2 resolution;
    float time;
    float dtRatio;
};

float aastep(float threshold, float value){
    float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
}

vec2 encodeNormal(vec3 n){
    n/=(abs(n.x)+abs(n.y)+abs(n.z));
    return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy);
}
vec3 decodeNormal(vec2 f){
    vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));
    float t=max(-n.z, 0.0);
    n.x+=(n.x>0.0)?-t : t;
    n.y+=(n.y>0.0)?-t : t;
    return normalize(n);
}
vec2 encodeNormalUint8(vec3 n){
    return encodeNormal(n)*0.5+0.5;
}vec3 deodeNormalUint8(vec2 n){
    return decodeNormal(n*2.0-1.0);
}
vec2 encodeNormalSpheremap(vec3 n){
    float f=sqrt(8.0*n.z+8.0);
    return n.xy/f*2.0;
}
vec3 decodeNormalSpheremap(vec2 n){
    vec4 nn=vec4(n.xy, 1.0, -1.0);
    float l=dot(nn.xyz, -nn.xyw);
    nn.z=l;
    nn.xy*=sqrt(l);
    return nn.xyz*2.0+vec3(0.0, 0.0, -1.0);
}
vec2 encodeNormalSpheremapUint8(vec3 n){
    return encodeNormalSpheremap(n)*0.5+0.5;
}
vec3 deodeNormalSimpleUint8(vec2 n){
    return decodeNormalSpheremap(n*2.0-1.0);
}

uniform sampler2D tPetal;
uniform sampler2D tNoise;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uOutlineColor;

varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying float vRandom;
varying float vProgress;
flat varying float vIndex;

void main() {
    vec2 uv = vUv;
    float steppedTime = floor(time * 6.0);

    
    uv.x += sin(uv.y * 55.0 + steppedTime * 2.0) * 0.0015;

    
    float noise = texture2D(tNoise, vUv * 0.75 + vRandom + steppedTime * 0.02).r;
    noise = smoothstep(0.0, 0.1, noise);
    float outlineContribution = noise;

    
    vec3 color = mix(uColor1, uColor2, uv.y);
    float lines = texture2D(tPetal, uv).r;
    lines = aastep(0.5, lines);
    color *= mix(vec3(1.0, 0.0, 0.0), vec3(1.0), 1.0 - vProgress);
    color = mix(uOutlineColor, color, lines);

    gl_FragColor = vec4(color, fract(vIndex * 21.33424));

    vec3 infoNormal = normalize(vNormal) * vec3(gl_FrontFacing ? 1.0 : -1.0);
    gInfo = vec4(1.0 - (0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5), vec3(encodeNormalSpheremap(infoNormal), noise));
}`;class ut{constructor(e,t={}){this.base=e,this.scene=this.base.scene,this.baseTime=0,this.additionalTime=0,this.additionalTimeTarget=0,this.additionalHold=0,this.additionalHoldTarget=0,this.touching=!1,this.options={petalCount:38,...t},this.init()}init(){this.geometry=this.base.petal,this.count=this.options.petalCount;const e=new Float32Array(this.count);for(let i=0;i<this.count;i++)e[i]=Math.random();const t=new D(e,1,!1,1);this.geometry.setAttribute("random",t),this.material=new y({uniformsGroups:[this.base.UBO],uniforms:{uCount:{value:this.count},uColor1:{value:new p("#d88b3e")},uColor2:{value:new p("#ddb94c")},uOutlineColor:{value:new p("#b84a08")},tPetal:{value:this.base.petalTexture},tNoise:{value:this.base.noiseSimplexLayeredTexture},uFlowerTime:{value:0}},side:le,vertexShader:lt,fragmentShader:ht}),this.mesh=new he,this.mesh.name="flower",this.instancedMesh=new L(this.geometry,this.material,this.count),this.instancedMesh.rotation.x=3.14159*.5-.5,this.instancedMesh.rotation.z=3.14159*.05,this.instancedMesh.position.y+=.03,this.instancedMesh.renderOrder=3,this.mesh.add(this.instancedMesh),this.instancedMesh.updateMatrixWorld(),this.instancedMesh.matrixAutoUpdate=!1,this.instancedMesh.onBeforeRender=()=>{this.additionalTime=this.base.utils.lerpFPS(this.additionalTime,this.additionalTimeTarget,.035),this.baseTime+=this.base.timeStats.delta*.001,this.additionalHoldTarget+=this.touching?this.base.timeStats.delta*.0025:0,this.additionalHold=this.base.utils.lerpFPS(this.additionalHold,this.additionalHoldTarget,.035),this.material.uniforms.uFlowerTime.value=this.baseTime+this.additionalTime+this.additionalHold,this.mesh.rotation.y=-this.scene.camera._additionalSphericalPosition.theta*7,this.mesh.rotation.x=this.scene.camera._additionalSphericalPosition.phi*7},this.base.eventManage.on("wheel",this.onWheel.bind(this)),this.base.eventManage.on("touch_drag",this.onTouchDrag.bind(this)),this.base.eventManage.on("touch_start",this.onTouchStart.bind(this)),this.base.eventManage.on("touch_end",this.onTouchEnd.bind(this)),this.scene.add(this.mesh)}onWheel(e){const t=Math.abs(e.delta.y)>Math.abs(e.delta.x)?e.delta.y:e.delta.x;this.additionalTimeTarget+=t*65e-5*(t<0?2:1)}onTouchDrag(e){const t=Math.abs(e.delta11.y)>Math.abs(e.delta11.x)?-e.delta11.y:e.delta11.x;this.additionalTimeTarget-=t*2.5*(t>0?1.5:1),Math.abs(e.dragged.x)+Math.abs(e.dragged.y)>20&&(this.touching=!1)}onTouchStart(){this.touching=!0}onTouchEnd(){this.touching=!1}}var ct=`uniform Global{ vec2 resolution;float time;float dtRatio; };

uniform float uCount;

attribute vec4 rand;
attribute vec2 texuv;
uniform sampler2D tTexture1;
uniform sampler2D tTexture2;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec3 vNormal;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

const float PI = 3.14159;
const float HALF_PI = PI * 0.5;
const float TWO_PI = PI * 2.0;

void main() {
    float index = float(gl_InstanceID);
    vIndex = index;

    vUv = uv;
    vRandom = rand;

    vec3 pos = position;
    pos *= mix(1.2, 1.6, step(rand.x, 0.5));

    
    float interactionRotation = texture2D(tTexture2, texuv).a * 5.0;

    
    mat2 rot = rotateAngle(0.25 * sin(uv.y * 3.5 + time + rand.z * 12.0 + rand.y + rand.x + interactionRotation * 3.0) + 0.2 * (1.0 - pow(1.0 - position.z, 2.0)));
    pos.yz = rot * pos.yz;

    
    mat2 rot0 = rotateAngle(time * mix(0.25, 0.75, rand.z) + rand.z * 3.14 * 2.0);
    mat2 rot1 = rotateAngle((rand.y + rand.z + rand.x) * 3.14 * 2.0 + interactionRotation);
    mat2 rot2 = rotateAngle(rand.x * 3.14 * 2.0);
    pos.xy = rot0 * pos.xy;
    pos.zx = rot1 * pos.zx;
    pos.yz = rot2 * pos.yz;

    vec3 norm = normal;
    norm.xy = rot0 * norm.xy;
    norm.zx = rot1 * norm.zx;
    norm.yz = rot2 * norm.yz;
    vNormal = normalize(normalMatrix * norm);

    vec3 offset = texture2D(tTexture1, texuv).xyz;

    pos += offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vHighPrecisionZW = gl_Position.zw;
}`,vt=`layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){
    float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;
    return smoothstep(threshold-afwidth, threshold+afwidth, value);
}
vec2 encodeNormal(vec3 n){ n/=(abs(n.x)+abs(n.y)+abs(n.z));return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy); }
vec3 decodeNormal(vec2 f){ vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));float t=max(-n.z, 0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n); }
vec2 encodeNormalUint8(vec3 n){ return encodeNormal(n)*0.5+0.5; }
vec3 deodeNormalUint8(vec2 n){ return decodeNormal(n*2.0-1.0); }
vec2 encodeNormalSpheremap(vec3 n){ float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0; }
vec3 decodeNormalSpheremap(vec2 n){ vec4 nn=vec4(n.xy, 1.0, -1.0);float l=dot(nn.xyz, -nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0, 0.0, -1.0); }
vec2 encodeNormalSpheremapUint8(vec3 n){ return encodeNormalSpheremap(n)*0.5+0.5; }
vec3 deodeNormalSimpleUint8(vec2 n){ return decodeNormalSpheremap(n*2.0-1.0); }

uniform sampler2D tPetal;
uniform sampler2D tNoise;

uniform vec3 uColor1;
uniform vec3 uOutlineColor;

varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

void main() {
    vec2 uv = vUv;
    float steppedTime = floor(time * 6.0);

    
    uv.x += sin(uv.y * 25.0 + steppedTime * 2.0) * 0.004;

    
    float noise = texture2D(tNoise, vUv * 0.5 + vRandom.x + steppedTime * 0.02).r;
    noise = smoothstep(0.1, 0.3, noise);
    float outlineContribution = noise;

    
    vec3 color = uColor1 * mix(1.65, 2.5, step(0.75, vRandom.z));

    
    float lines = texture2D(tPetal, uv).r;
    lines = aastep(0.5, lines);
    color = mix(uOutlineColor, color, lines);

    gl_FragColor = vec4(color, fract(vIndex * 4.975645));
    gInfo = vec4(1.0 - (0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5), vec3(encodeNormalSpheremap(normalize(vNormal)), noise));
}`,dt=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`,mt=`#define outPos pc_fragColor
uniform sampler2D tTexture1;

layout(location = 1) out highp vec4 outVel;
uniform sampler2D tTexture2;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform sampler2D tVel;

varying vec2 vUv;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float treadmill(float p, float margin){ float n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec2 treadmill(vec2 p, vec2 margin){ vec2 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec3 treadmill(vec3 p, vec3 margin){ vec3 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec4 treadmill(vec4 p, vec4 margin){ vec4 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }

void main() {
    ivec2 uv = ivec2(gl_FragCoord.xy);
    vec4 currentPos = texelFetch(tTexture1, uv, 0);
    vec4 currentVel = texelFetch(tTexture2, uv, 0);

    
    currentVel.x += (sin(time * 0.2 + currentPos.w * 15.6547) + sign(currentPos.w - 0.5) * 2.0) * 0.0005 * dtRatio;
    currentVel.y -= 0.0015 * max(0.2, fract(currentPos.w * 31.342)) * dtRatio;
    currentVel.z = 0.0;

    
    const float pushForce = 0.0035;
    vec4 wPos = uModelMatrix * vec4(currentPos.xyz, 1.0);
    vec4 vPos = uViewMatrix * wPos;
    vec4 posProjected = uProjMatrix * vPos;
    vec2 uvScreen = (posProjected.xy / posProjected.w + 1.0) * 0.5;
    vec2 vel = texture2D(tVel, uvScreen).xy;

    
    currentVel.xy += vel * pushForce * dtRatio;

    
    currentVel.a += length(vel) * pushForce * dtRatio;

    
    currentVel.xyz *= exp2(log2(0.9) * dtRatio);

    
    currentPos.xyz += currentVel.xyz * dtRatio;

    
    currentPos.xy = treadmill(currentPos.xy, vec2(16.0, 6.0));

    outVel = currentVel;
    outPos = currentPos;
}`;let pt=class extends L{constructor(e){super(e.geometry,e.material,e.options.count),this.base=e,this.renderer=this.base.base.renderer.webgl,this.isParticlesGPU=!0,this.name="GPU Particles",this.particlesCount=e.options.count,this.frustumCulled=!1;const t=T,i=Math.max(2,this.base.base.utils.ceilPowerOfTwo(Math.sqrt(this.particlesCount)));if(this.rt1=new B(i,i,this.base.data.textures||1,{wrapS:P,wrapT:P,minFilter:A,magFilter:A,format:b,type:t,depthBuffer:!1}),this.rt2=this.rt1.clone(),this.rtCurrent=0,this.fsQuad=new k(null),this.base.data.initialTextures&&this.base.data.initialTextures.length>0){const n={};this.base.data.initialTextures.forEach((h,u)=>{n[`tTexture${u+1}`]={value:h}});const a=new y({uniforms:n,vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
                `,fragmentShader:`
                varying vec2 vUv;
                #define outTex1 pc_fragColor
                uniform sampler2D tTexture1;
                layout(location = 1) out highp vec4 outTex2;
                uniform sampler2D tTexture2;
                void main() {
                    outTex1 = texture2D(tTexture1, vUv);
                    outTex2 = texture2D(tTexture2, vUv);
                }
                `});this.fsQuad.material=a;const s=this.renderer.autoClear,o=this.renderer.getRenderTarget();this.renderer.autoClear=!1,this.renderer.setRenderTarget(this.rt1),this.fsQuad.render(this.renderer),this.renderer.setRenderTarget(this.rt2),this.fsQuad.render(this.renderer),this.renderer.autoClear=s,this.renderer.setRenderTarget(o),a.dispose()}this.computationMaterial=this.base.data.material,this.fsQuad.material=this.computationMaterial,this.base.data.afterCompute&&(this.afterCompute=this.base.data.afterCompute),this.base.data.autoCompute!==!1&&(this.onBeforeRender=this.compute.bind(this))}compute(e,t,i){const n=this.computationMaterial.uniforms.uModelMatrix,a=this.computationMaterial.uniforms.uViewMatrix,s=this.computationMaterial.uniforms.uProjMatrix;n&&n.value.copy(this.matrixWorld),a&&a.value.copy(i.matrixWorldInverse),s&&s.value.copy(i.projectionMatrix);const o=this.rtCurrent===0?this.rt1:this.rt2,h=this.rtCurrent===0?this.rt2:this.rt1;this.rtCurrent=(this.rtCurrent+1)%2;for(let l=0;l<h.texture.length;l++){const c=this.computationMaterial.uniforms[`tTexture${l+1}`];c&&(c.value=h.texture[l])}const u=e.autoClear;e.autoClear=!1;const r=e.getRenderTarget();e.setRenderTarget(o),e.getClearColor(new p);const m=e.getClearAlpha();e.setClearColor(new p("#000000"),0),e.clear(!0,!1,!1),this.fsQuad.render(e),e.autoClear=u,e.setRenderTarget(r),e.setClearColor(new p,m);for(let l=0;l<o.texture.length;l++){const c=this.material.uniforms[`tTexture${l+1}`];c&&(c.value=o.texture[l]);const g=this.material.uniforms[`tTexture${l+1}Prev`];g&&(g.value=h.texture[l])}this.afterCompute&&this.afterCompute(e,t,i)}dispose(){let e;this.fsQuad.dispose(),this.computationMaterial.dispose(),this.rt1.dispose(),this.rt2.dispose(),(e=super.dispose)==null||e.call(this)}};class ft{constructor(e,t={}){this.base=e,this.options={count:140,...t},this.init()}init(){const e=this.options.count,t=Math.max(2,this.base.utils.ceilPowerOfTwo(Math.sqrt(e))),i=new Float32Array(t*t*4);for(let n=0;n<e;n++)i[n*4+0]=Math.random()*32-16,i[n*4+1]=Math.random()*12-6,i[n*4+2]=-2-Math.random()*6,i[n*4+3]=Math.random();this.dataTextureR=new U(i,t,t,b,T),this.dataTextureR.needsUpdate=!0,this.dataTextureA=new U(new Float32Array(t*t*4),t,t,b,T),this.dataTextureA.needsUpdate=!0,this.data={textures:2,initialTextures:[this.dataTextureR,this.dataTextureA],material:new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},tTexture2:{value:null},tVel:this.base.fluidSim.velUniform,uViewMatrix:{value:new w},uModelMatrix:{value:new w},uProjMatrix:{value:new w}},vertexShader:dt,fragmentShader:mt})},this.createGeometry(),this.createMaterial(),this.createMesh()}createGeometry(){const e=this.base.leaf.clone();this.geometry=new E,this.geometry.instanceCount=this.options.count,e.index&&this.geometry.setIndex(e.index);for(const s in e.attributes)this.geometry.setAttribute(s,e.attributes[s]);const t=[],i=[],n=Math.max(2,this.base.utils.ceilPowerOfTwo(Math.sqrt(this.options.count))),a=1/n*.5;for(let s=0;s<this.options.count;s++){t.push(Math.random(),Math.random(),Math.random(),Math.random());const o=s%n/n+a,h=Math.floor(s/n)/n+a;i.push(o,h)}this.geometry.setAttribute("rand",new D(new Float32Array(t),4)),this.geometry.setAttribute("texuv",new D(new Float32Array(i),2))}createMaterial(){this.material=new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},tTexture2:{value:this.dataTextureA},uCount:{value:this.options.count},uColor1:{value:new p("#886a3d")},uOutlineColor:{value:new p("#904619")},tPetal:{value:this.base.leafTexture},tNoise:{value:this.base.noiseSimplexLayeredTexture}},vertexShader:ct,fragmentShader:vt,depthTest:!1})}createMesh(){this.mesh=new pt(this),this.mesh.name="leaves",this.mesh.renderOrder=1,this.mesh.updateMatrixWorld(),this.mesh.matrixAutoUpdate=!1,this.base.scene.add(this.mesh)}}var gt=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`,xt=`#define outPos pc_fragColor
uniform sampler2D tTexture1;

layout(location = 1) out highp vec4 outVel;
uniform sampler2D tTexture2;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform sampler2D tVel;

varying vec2 vUv;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float treadmill(float p, float margin){ float n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec2 treadmill(vec2 p, vec2 margin){ vec2 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec3 treadmill(vec3 p, vec3 margin){ vec3 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec4 treadmill(vec4 p, vec4 margin){ vec4 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }

void main() {
    ivec2 uv = ivec2(gl_FragCoord.xy);
    vec4 currentPos = texelFetch(tTexture1, uv, 0);
    vec4 currentVel = texelFetch(tTexture2, uv, 0);

    
    currentVel.x += (sin(time * 0.2 + currentPos.w * 15.6547) + sign(currentPos.w - 0.5) * 2.0) * 0.00075 * dtRatio;
    currentVel.y -= 0.004 * mix(0.5, 0.8, fract(currentPos.w * 31.342)) * dtRatio;
    currentVel.z = 0.0;

    
    const float pushForce = 0.0035;
    vec4 wPos = uModelMatrix * vec4(currentPos.xyz, 1.0);
    vec4 vPos = uViewMatrix * wPos;
    vec4 posProjected = uProjMatrix * vPos;
    vec2 uvScreen = (posProjected.xy / posProjected.w + 1.0) * 0.5;
    vec2 vel = texture2D(tVel, uvScreen).xy;

    
    currentVel.xy += vel * pushForce * dtRatio;

    
    currentVel.a += length(vel) * pushForce * 1.75 * dtRatio;

    
    currentVel.xyz *= exp2(log2(0.9) * dtRatio);

    
    currentPos.xyz += currentVel.xyz * dtRatio;

    
    currentPos.xy = treadmill(currentPos.xy, vec2(16.0, 6.0));

    outVel = currentVel;
    outPos = currentPos;
}`,yt=`uniform Global{vec2 resolution;float time;float dtRatio;};

uniform float uCount;

attribute vec4 rand;
attribute vec2 texuv;
uniform sampler2D tTexture1;
uniform sampler2D tTexture2;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec3 vNormal;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

const float PI = 3.14159;
const float HALF_PI = PI * 0.5;
const float TWO_PI = PI * 2.0;

void main() {
    float index = float(gl_InstanceID);
    vIndex = index;

    vUv = uv;
    vRandom = rand;

    vec3 pos = position;
    pos *= mix(0.85, 1.15, step(rand.x, 0.5));

    
    float interactionRotation = texture2D(tTexture2, texuv).a * 5.0;

    
    
    

    
    mat2 rot0 = rotateAngle(time * mix(0.5, 1.25, rand.z) + rand.z * 3.14 * 2.0);
    mat2 rot1 = rotateAngle((rand.y + rand.z + rand.x) * 3.14 * 2.0 + interactionRotation);
    mat2 rot2 = rotateAngle(rand.x * 3.14 * 2.0);
    pos.xy = rot0 * pos.xy;
    pos.zx = rot1 * pos.zx;
    pos.yz = rot2 * pos.yz;

    vec3 norm = normal;
    norm.xy = rot0 * norm.xy;
    norm.zx = rot1 * norm.zx;
    norm.yz = rot2 * norm.yz;
    vNormal = normalize(normalMatrix * norm);

    vec3 offset = texture2D(tTexture1, texuv).xyz;

    pos += offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vHighPrecisionZW = gl_Position.zw;
}`,At=`layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }
vec2 encodeNormal(vec3 n){ n/=(abs(n.x)+abs(n.y)+abs(n.z));return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy); }
vec3 decodeNormal(vec2 f){ vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));float t=max(-n.z, 0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n); }
vec2 encodeNormalUint8(vec3 n){ return encodeNormal(n)*0.5+0.5; }
vec3 deodeNormalUint8(vec2 n){ return decodeNormal(n*2.0-1.0); }
vec2 encodeNormalSpheremap(vec3 n){ float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0; }
vec3 decodeNormalSpheremap(vec2 n){ vec4 nn=vec4(n.xy, 1.0, -1.0);float l=dot(nn.xyz, -nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0, 0.0, -1.0); }
vec2 encodeNormalSpheremapUint8(vec3 n){ return encodeNormalSpheremap(n)*0.5+0.5; }
vec3 deodeNormalSimpleUint8(vec2 n){ return decodeNormalSpheremap(n*2.0-1.0); }

uniform sampler2D tPetal;
uniform sampler2D tNoise;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uOutlineColor;

varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

void main() {
    vec2 uv = vUv;
    float steppedTime = floor(time * 6.0);

    
    uv.x += sin(uv.y * 25.0 + steppedTime * 2.0) * 0.004;

    
    float noise = texture2D(tNoise, vUv * 0.5 + vRandom.x + steppedTime * 0.02).r;
    noise = smoothstep(0.1, 0.2, noise);
    float outlineContribution = noise;

    
    vec3 color = mix(uColor1, uColor2, step(0.75, vRandom.z));

    
    float lines = texture2D(tPetal, uv).r;
    lines = aastep(0.5, lines);
    color = mix(uOutlineColor, color, lines);

    gl_FragColor = vec4(color, fract(vIndex * 4.975645));
    gInfo = vec4(1.0 - (0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5), vec3(encodeNormalSpheremap(normalize(vNormal)), noise));
}`;let wt=class extends L{constructor(e){super(e.geometry,e.material,e.options.count),this.base=e,this.renderer=this.base.base.renderer.webgl,this.isParticlesGPU=!0,this.name="GPU Particles",this.particlesCount=e.options.count,this.frustumCulled=!1;const t=T,i=Math.max(2,this.base.base.utils.ceilPowerOfTwo(Math.sqrt(this.particlesCount)));if(this.rt1=new B(i,i,this.base.data.textures||1,{wrapS:P,wrapT:P,minFilter:A,magFilter:A,format:b,type:t,depthBuffer:!1}),this.rt2=this.rt1.clone(),this.rtCurrent=0,this.fsQuad=new k(null),this.base.data.initialTextures&&this.base.data.initialTextures.length>0){const n={};this.base.data.initialTextures.forEach((h,u)=>{n[`tTexture${u+1}`]={value:h}});const a=new y({uniforms:n,vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
                `,fragmentShader:`
                varying vec2 vUv;
                #define outTex1 pc_fragColor
                uniform sampler2D tTexture1;
                layout(location = 1) out highp vec4 outTex2;
                uniform sampler2D tTexture2;
                void main() {
                    outTex1 = texture2D(tTexture1, vUv);
                    outTex2 = texture2D(tTexture2, vUv);
                }
                `});this.fsQuad.material=a;const s=this.renderer.autoClear,o=this.renderer.getRenderTarget();this.renderer.autoClear=!1,this.renderer.setRenderTarget(this.rt1),this.fsQuad.render(this.renderer),this.renderer.setRenderTarget(this.rt2),this.fsQuad.render(this.renderer),this.renderer.autoClear=s,this.renderer.setRenderTarget(o),a.dispose()}this.computationMaterial=this.base.data.material,this.fsQuad.material=this.computationMaterial,this.base.data.afterCompute&&(this.afterCompute=this.base.data.afterCompute),this.base.data.autoCompute!==!1&&(this.onBeforeRender=this.compute.bind(this))}compute(e,t,i){const n=this.computationMaterial.uniforms.uModelMatrix,a=this.computationMaterial.uniforms.uViewMatrix,s=this.computationMaterial.uniforms.uProjMatrix;n&&n.value.copy(this.matrixWorld),a&&a.value.copy(i.matrixWorldInverse),s&&s.value.copy(i.projectionMatrix);const o=this.rtCurrent===0?this.rt1:this.rt2,h=this.rtCurrent===0?this.rt2:this.rt1;this.rtCurrent=(this.rtCurrent+1)%2;for(let l=0;l<h.texture.length;l++){const c=this.computationMaterial.uniforms[`tTexture${l+1}`];c&&(c.value=h.texture[l])}const u=e.autoClear;e.autoClear=!1;const r=e.getRenderTarget();e.setRenderTarget(o),e.getClearColor(new p);const m=e.getClearAlpha();e.setClearColor(new p("#000000"),0),e.clear(!0,!1,!1),this.fsQuad.render(e),e.autoClear=u,e.setRenderTarget(r),e.setClearColor(new p,m);for(let l=0;l<o.texture.length;l++){const c=this.material.uniforms[`tTexture${l+1}`];c&&(c.value=o.texture[l]);const g=this.material.uniforms[`tTexture${l+1}Prev`];g&&(g.value=h.texture[l])}this.afterCompute&&this.afterCompute(e,t,i)}dispose(){let e;this.fsQuad.dispose(),this.computationMaterial.dispose(),this.rt1.dispose(),this.rt2.dispose(),(e=super.dispose)==null||e.call(this)}};class bt{constructor(e,t={}){this.base=e,this.options={count:20,...t},this.init()}init(){const e=this.options.count,t=Math.max(2,this.base.utils.ceilPowerOfTwo(Math.sqrt(e))),i=new Float32Array(t*t*4);for(let n=0;n<e;n++)i[n*4+0]=Math.random()*32-16,i[n*4+1]=Math.random()*12-6,i[n*4+2]=-4-Math.random()*4,i[n*4+3]=Math.random();this.dataTextureR=new U(i,t,t,b,T),this.dataTextureR.needsUpdate=!0,this.dataTextureA=new U(new Float32Array(t*t*4),t,t,b,T),this.dataTextureA.needsUpdate=!0,this.data={textures:2,initialTextures:[this.dataTextureR,this.dataTextureA],material:new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},tTexture2:{value:null},tVel:this.base.fluidSim.velUniform,uViewMatrix:{value:new w},uModelMatrix:{value:new w},uProjMatrix:{value:new w}},vertexShader:gt,fragmentShader:xt})},this.createGeometry(),this.createMaterial(),this.createMesh()}createGeometry(){const e=this.base.needle.clone();this.geometry=new E,this.geometry.instanceCount=this.options.count,e.index&&this.geometry.setIndex(e.index);for(const s in e.attributes)this.geometry.setAttribute(s,e.attributes[s]);const t=[],i=[],n=Math.max(2,this.base.utils.ceilPowerOfTwo(Math.sqrt(this.options.count))),a=1/n*.5;for(let s=0;s<this.options.count;s++){t.push(Math.random(),Math.random(),Math.random(),Math.random());const o=s%n/n+a,h=Math.floor(s/n)/n+a;i.push(o,h)}this.geometry.setAttribute("rand",new D(new Float32Array(t),4)),this.geometry.setAttribute("texuv",new D(new Float32Array(i),2))}createMaterial(){this.material=new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},tTexture2:{value:this.dataTextureA},uCount:{value:this.options.count},uColor1:{value:new p("#cda05e")},uColor2:{value:new p("#ab8349")},uOutlineColor:{value:new p("#904619")},tPetal:{value:this.base.petalTexture},tNoise:{value:this.base.noiseSimplexLayeredTexture}},vertexShader:yt,fragmentShader:At,depthTest:!1})}createMesh(){this.mesh=new wt(this),this.mesh.name="needles",this.mesh.renderOrder=1,this.mesh.updateMatrixWorld(),this.mesh.matrixAutoUpdate=!1,this.mesh.frustumCulled=!1,this.base.scene.add(this.mesh)}}var _t=`uniform Global{ vec2 resolution;float time;float dtRatio; };

uniform float uCount;

attribute vec4 rand;
attribute vec2 texuv;
uniform sampler2D tTexture1;
uniform sampler2D tTexture2;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec3 vNormal;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

const float PI = 3.14159;
const float HALF_PI = PI * 0.5;
const float TWO_PI = PI * 2.0;

void main() {
    float index = float(gl_InstanceID);
    vIndex = index;

    vUv = uv;
    vRandom = rand;

    vec3 pos = position;
    pos *= mix(0.3, 0.6, step(rand.x, 0.5));

    
    float interactionRotation = texture2D(tTexture2, texuv).a * 5.0;

    
    mat2 rot = rotateAngle(0.25 * sin(uv.y * 3.5 + time + rand.z * 12.0 + rand.y + rand.x + interactionRotation * 3.0) + 0.2 * (1.0 - pow(1.0 - position.z, 2.0)));
    pos.yz = rot * pos.yz;

    
    mat2 rot0 = rotateAngle(time * mix(0.25, 0.75, rand.z) + rand.z * 3.14 * 2.0);
    mat2 rot1 = rotateAngle((rand.y + rand.z + rand.x) * 3.14 * 2.0 + interactionRotation);
    mat2 rot2 = rotateAngle(rand.x * 3.14 * 2.0);
    pos.xy = rot0 * pos.xy;
    pos.zx = rot1 * pos.zx;
    pos.yz = rot2 * pos.yz;

    vec3 norm = normal;
    norm.xy = rot0 * norm.xy;
    norm.zx = rot1 * norm.zx;
    norm.yz = rot2 * norm.yz;
    vNormal = normalize(normalMatrix * norm);

    vec3 offset = texture2D(tTexture1, texuv).xyz;

    pos += offset;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vHighPrecisionZW = gl_Position.zw;
}`,Tt=`layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }
vec2 encodeNormal(vec3 n){ n/=(abs(n.x)+abs(n.y)+abs(n.z));return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy); }vec3 decodeNormal(vec2 f){ vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));float t=max(-n.z, 0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n); }vec2 encodeNormalUint8(vec3 n){ return encodeNormal(n)*0.5+0.5; }vec3 deodeNormalUint8(vec2 n){ return decodeNormal(n*2.0-1.0); }vec2 encodeNormalSpheremap(vec3 n){ float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0; }vec3 decodeNormalSpheremap(vec2 n){ vec4 nn=vec4(n.xy, 1.0, -1.0);float l=dot(nn.xyz, -nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0, 0.0, -1.0); }vec2 encodeNormalSpheremapUint8(vec3 n){ return encodeNormalSpheremap(n)*0.5+0.5; }vec3 deodeNormalSimpleUint8(vec2 n){ return decodeNormalSpheremap(n*2.0-1.0); }

uniform sampler2D tPetal;
uniform sampler2D tNoise;

uniform vec3 uColor1;
uniform vec3 uOutlineColor;

varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

void main() {
    vec2 uv = vUv;
    float steppedTime = floor(time * 6.0);

    
    uv.x += sin(uv.y * 25.0 + steppedTime * 2.0) * 0.004;

    
    float noise = texture2D(tNoise, vUv * 0.25 + vRandom.x + steppedTime * 0.02).r;
    noise = smoothstep(0.0, 0.1, noise);
    float outlineContribution = noise;

    
    vec3 color = uColor1 * mix(1.65, 2.5, step(0.75, vRandom.z));

    
    float lines = texture2D(tPetal, uv).r;
    lines = aastep(0.5, lines);
    color = mix(uOutlineColor, color, lines);

    gl_FragColor = vec4(color, fract(vIndex * 2.865454));

    gInfo = vec4(1.0 - (0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5), vec3(encodeNormalSpheremap(normalize(vNormal)), noise));
}`,Ct=`varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`,Pt=`#define outPos pc_fragColor
uniform sampler2D tTexture1;

layout(location = 1) out highp vec4 outVel;
uniform sampler2D tTexture2;

uniform mat4 uProjMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uModelMatrix;
uniform sampler2D tVel;

varying vec2 vUv;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float treadmill(float p, float margin){ float n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec2 treadmill(vec2 p, vec2 margin){ vec2 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec3 treadmill(vec3 p, vec3 margin){ vec3 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }
vec4 treadmill(vec4 p, vec4 margin){ vec4 n=fract((p+margin)/(2.0*margin));return n*2.0*margin-margin; }

void main() {
    ivec2 uv = ivec2(gl_FragCoord.xy);
    vec4 currentPos = texelFetch(tTexture1, uv, 0);
    vec4 currentVel = texelFetch(tTexture2, uv, 0);

    
    currentVel.x += (sin(time * 0.2 + currentPos.w * 12.8947) + sign(currentPos.w - 0.5)) * 0.00025 * dtRatio;
    currentVel.y -= 0.0005 * max(0.2, fract(currentPos.w * 31.342)) * dtRatio;
    currentVel.z = 0.0;

    
    const float pushForce = 0.001;
    vec4 wPos = uModelMatrix * vec4(currentPos.xyz, 1.0);
    vec4 vPos = uViewMatrix * wPos;
    vec4 posProjected = uProjMatrix * vPos;
    vec2 uvScreen = (posProjected.xy / posProjected.w + 1.0) * 0.5;
    vec2 vel = texture2D(tVel, uvScreen).xy;

    
    currentVel.xy += vel * pushForce * dtRatio;

    
    currentVel.a += length(vel) * pushForce * 3.5 * dtRatio;

    
    currentVel.xyz *= exp2(log2(0.9) * dtRatio);

    
    currentPos.xyz += currentVel.xyz * dtRatio;

    
    currentPos.xy = treadmill(currentPos.xy, vec2(5.0, 6.0));

    outVel = currentVel;
    outPos = currentPos;
}`;class St extends L{constructor(e){super(e.geometry,e.material,e.options.count),this.base=e,this.renderer=this.base.base.renderer.webgl,this.isParticlesGPU=!0,this.name="GPU Particles",this.particlesCount=e.options.count,this.frustumCulled=!1;const t=T,i=Math.max(2,this.base.base.utils.ceilPowerOfTwo(Math.sqrt(this.particlesCount)));if(this.rt1=new B(i,i,this.base.data.textures||1,{wrapS:P,wrapT:P,minFilter:A,magFilter:A,format:b,type:t,depthBuffer:!1}),this.rt2=this.rt1.clone(),this.rtCurrent=0,this.fsQuad=new k(null),this.base.data.initialTextures&&this.base.data.initialTextures.length>0){const n={};this.base.data.initialTextures.forEach((h,u)=>{n[`tTexture${u+1}`]={value:h}});const a=new y({uniforms:n,vertexShader:`
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = vec4(position, 1.0);
                }
                `,fragmentShader:`
                varying vec2 vUv;
                #define outTex1 pc_fragColor
                uniform sampler2D tTexture1;
                layout(location = 1) out highp vec4 outTex2;
                uniform sampler2D tTexture2;
                void main() {
                    outTex1 = texture2D(tTexture1, vUv);
                    outTex2 = texture2D(tTexture2, vUv);
                }
                `});this.fsQuad.material=a;const s=this.renderer.autoClear,o=this.renderer.getRenderTarget();this.renderer.autoClear=!1,this.renderer.setRenderTarget(this.rt1),this.fsQuad.render(this.renderer),this.renderer.setRenderTarget(this.rt2),this.fsQuad.render(this.renderer),this.renderer.autoClear=s,this.renderer.setRenderTarget(o),a.dispose()}this.computationMaterial=this.base.data.material,this.fsQuad.material=this.computationMaterial,this.base.data.afterCompute&&(this.afterCompute=this.base.data.afterCompute),this.base.data.autoCompute!==!1&&(this.onBeforeRender=this.compute.bind(this))}compute(e,t,i){const n=this.computationMaterial.uniforms.uModelMatrix,a=this.computationMaterial.uniforms.uViewMatrix,s=this.computationMaterial.uniforms.uProjMatrix;n&&n.value.copy(this.matrixWorld),a&&a.value.copy(i.matrixWorldInverse),s&&s.value.copy(i.projectionMatrix);const o=this.rtCurrent===0?this.rt1:this.rt2,h=this.rtCurrent===0?this.rt2:this.rt1;this.rtCurrent=(this.rtCurrent+1)%2;for(let l=0;l<h.texture.length;l++){const c=this.computationMaterial.uniforms[`tTexture${l+1}`];c&&(c.value=h.texture[l])}const u=e.autoClear;e.autoClear=!1;const r=e.getRenderTarget();e.setRenderTarget(o),e.getClearColor(new p);const m=e.getClearAlpha();e.setClearColor(new p("#000000"),0),e.clear(!0,!1,!1),this.fsQuad.render(e),e.autoClear=u,e.setRenderTarget(r),e.setClearColor(new p,m);for(let l=0;l<o.texture.length;l++){const c=this.material.uniforms[`tTexture${l+1}`];c&&(c.value=o.texture[l]);const g=this.material.uniforms[`tTexture${l+1}Prev`];g&&(g.value=h.texture[l])}this.afterCompute&&this.afterCompute(e,t,i)}dispose(){let e;this.fsQuad.dispose(),this.computationMaterial.dispose(),this.rt1.dispose(),this.rt2.dispose(),(e=super.dispose)==null||e.call(this)}}class Mt{constructor(e,t={}){this.base=e,this.options={count:140,...t},this.init()}init(){const e=this.options.count,t=Math.max(2,this.base.utils.ceilPowerOfTwo(Math.sqrt(e))),i=new Float32Array(t*t*4);for(let n=0;n<e;n++)i[n*4+0]=Math.random()*10-5,i[n*4+1]=Math.random()*12-6,i[n*4+2]=.75+Math.random(),i[n*4+3]=Math.random();this.dataTextureR=new U(i,t,t,b,T),this.dataTextureR.needsUpdate=!0,this.dataTextureA=new U(new Float32Array(t*t*4),t,t,b,T),this.dataTextureA.needsUpdate=!0,this.data={textures:2,initialTextures:[this.dataTextureR,this.dataTextureA],material:new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},tTexture2:{value:null},tVel:this.base.fluidSim.velUniform,uViewMatrix:{value:new w},uModelMatrix:{value:new w},uProjMatrix:{value:new w}},vertexShader:Ct,fragmentShader:Pt})},this.createGeometry(),this.createMaterial(),this.createMesh()}createGeometry(){const e=this.base.leaf.clone();this.geometry=new E,this.geometry.instanceCount=this.options.count,e.index&&this.geometry.setIndex(e.index);for(const s in e.attributes)this.geometry.setAttribute(s,e.attributes[s]);const t=[],i=[],n=Math.max(2,this.base.utils.ceilPowerOfTwo(Math.sqrt(this.options.count))),a=1/n*.5;for(let s=0;s<this.options.count;s++){t.push(Math.random(),Math.random(),Math.random(),Math.random());const o=s%n/n+a,h=Math.floor(s/n)/n+a;i.push(o,h)}this.geometry.setAttribute("rand",new D(new Float32Array(t),4)),this.geometry.setAttribute("texuv",new D(new Float32Array(i),2))}createMaterial(){this.material=new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},tTexture2:{value:this.dataTextureA},uCount:{value:this.options.count},uColor1:{value:new p("#886a3d")},uOutlineColor:{value:new p("#904619")},tPetal:{value:this.base.leafTexture},tNoise:{value:this.base.noiseSimplexLayeredTexture}},vertexShader:_t,fragmentShader:Tt,depthTest:!1})}createMesh(){this.mesh=new St(this),this.mesh.name="foreground leaves",this.mesh.renderOrder=4,this.mesh.updateMatrixWorld(),this.mesh.matrixAutoUpdate=!1,this.mesh.frustumCulled=!1,this.base.scene.add(this.mesh)}}var Dt=`uniform Global{ vec2 resolution;float time;float dtRatio; };
varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;

    gl_Position = vec4(pos, 1.0);
}`,Rt=`layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

void main() {
    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    screenUv.x *= aspect;

    
    float steppedTime = floor(time * 3.0) * 3.14159 * 1.53;
    screenUv = rotateAngle(steppedTime) * screenUv;
    float n1 = texture2D(tNoise, screenUv * 4.31).r;
    float n2 = texture2D(tNoise, -screenUv * 1.814).r;
    float n3 = texture2D(tNoise, screenUv * 5.714).r;
    float noise = n1 * n2 * n3;
    noise = aastep(0.00015, noise);
    vec3 color = mix(uColor2, uColor1, noise);

    

    gl_FragColor = vec4(color, 0.0);
    gInfo = vec4(0.0);
}`;class Ut{constructor(e,t={}){this.base=e,this.option={...t},this.init()}init(){const e=new $(20,20,2,2),t=new y({uniformsGroups:[this.base.UBO],uniforms:{uColor1:{value:new p("#ffec95")},uColor2:{value:new p("#ecc168")},tNoise:{value:this.base.noiseSimplexLayeredTexture}},vertexShader:Dt,fragmentShader:Rt,depthTest:!1});this.mesh=new I(e,t),this.mesh.name="background",this.mesh.renderOrder=0,this.mesh.updateMatrixWorld(),this.mesh.matrixAutoUpdate=!1,this.base.scene.add(this.mesh)}}var It=`uniform Global{ vec2 resolution;float time;float dtRatio; };

attribute vec3 inset;
attribute vec3 notch;

uniform float uBorderSizePixels;
uniform vec2 uNotchSizePixels;
uniform vec2 uRes;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;

    float aspect = uRes.x / uRes.y;
    vec2 borderDir = inset.xy;
    vec2 notchDir = notch.xy;
    borderDir /= uRes;
    notchDir /= uRes;

    
    pos.xy += borderDir * uBorderSizePixels;

    
    pos.xy += notchDir * uNotchSizePixels;

    gl_Position = vec4(pos, 1.0);

}`,Vt=`layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uThickness;

varying vec2 vUv;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

void main() {
    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
    float aspect = resolution.x / resolution.y;
    screenUv.x *= aspect;

    vec2 uv = screenUv;
    vec2 noiseUv = screenUv;

    float steppedTime = floor(time * 3.0) * 3.14159 * 0.2;
    noiseUv = rotateAngle(steppedTime) * noiseUv;

    
    float n0 = texture2D(tNoise, noiseUv).r;
    float gradient = smoothstep(0.0, 0.2, vUv.x + n0 * 0.1);
    if (gradient < 0.5) {
        discard;
    }

    vec3 color = uColor1;
    gl_FragColor = vec4(color, 0.87946);

    gInfo = vec4(1.0, vec3(0.0, 0.0, 1.0));
}`;class zt{constructor(e,t={}){this.base=e,this.options={...t},this.init()}init(){const e=this.base.border,t=this.base.border.attributes.position.array;for(let n=0;n<t.length;n++)t[n]=Math.round(t[n]);const i=new y({uniformsGroups:[this.base.UBO],uniforms:{uBorderSizePixels:{value:64},uNotchSizePixels:{value:new v(384,103)},uColor1:{value:new p("#ecc168")},uColor2:{value:new p("#ffec95")},tNoise:{value:this.base.noiseSimplexLayeredTexture},uRes:{value:new v(this.base.screen.width,this.base.screen.height)}},vertexShader:It,fragmentShader:Vt,depthTest:!1});this.mesh=new I(e,i),this.mesh.name="border",this.mesh.renderOrder=2,this.mesh.updateMatrixWorld(),this.mesh.matrixAutoUpdate=!1,this.resize({w:this.base.screen.width,h:this.base.screen.height}),this.base.eventManage.on("resize",this.resize.bind(this)),this.base.scene.add(this.mesh)}resize({w:e,h:t}){this.mesh.material.uniforms.uRes.value.set(e,t)}}var Ft=`uniform Global{ vec2 resolution;float time;float dtRatio; };

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,Bt=`layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;
uniform sampler2D tMap;
uniform vec3 uColor1;
uniform vec3 uColor2;

varying vec2 vUv;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

void main() {
    
    vec2 uv = vUv;
    vec2 noiseUv = vUv * 0.5;
    float steppedTime = floor(time * 3.0) * 3.14159 * 0.2;
    noiseUv = rotateAngle(steppedTime) * noiseUv;
    float n0 = texture2D(tNoise, noiseUv).r;
    uv += n0 * 0.006;

    
    uv -= 0.5;
    uv *= 1.2;
    uv += 0.5;

    
    float text = texture2D(tMap, uv).r;

    
    

    text = aastep(0.7, text);
    vec3 color = mix(uColor1, uColor2, text);

    gl_FragColor = vec4(color, 0.87946);
    gInfo = vec4(1.0, vec3(0.0, 0.0, 1.0));
}`;J.prototype.getViewSize=function(d,e=new v){const t=this.fov*Math.PI/180,i=2*Math.tan(t/2)*d,n=i*this.aspect;return e.set(n,i),e};const Nt=new ce,Lt=new ve;let _,Q;_={TOUCH_START:1,TOUCH_MOVE:2,TOUCH_END:3,CLICK:4};Q={BOUNDING_SPHERE:1,BOUNDING_BOX:2};class Et{constructor(e,{meshes:t=[],camera:i=null,onHover:n=null,onTouch:a=null,onMove:s=null,onDrag:o=null,onClick:h=null,ctx:u=null,performant:r=!1,performantMode:m="bounding_sphere",finger:l=0,interactWhileTouching:c=!1,hoverCursor:g=!1,grabCursor:R=!1}={}){if(!i)throw new Error("mesh interaction needs a camera");this.base=e,this._meshes=Array.isArray(t)?t:[t],this._camera=i,this._onHover=n,this._onTouch=a,this._onMove=s,this._onDrag=o,this._onClick=h,this._ctx=u,this._performant=r,this._performantMode=Q[m.toUpperCase()],this._finger=l,this._eventsID=this._finger===0?"touch":`touch${this._finger+1}`,this._interactWhileTouching=c,this._touchPressed=!1,this._hoverCursor=g,this._grabCursor=R&&!g,this._raycaster=new ee,this._enabled=!1,this.hovering=!1,this.hoveringElement=-1,this.hoveringInstance=-1,this.touching=!1,this.touchingElement=-1,this.touchingInstance=-1,this.dragging=!1}_castRay(e,t){if(this._raycaster.setFromCamera(e.position11,this._camera),!this._performant){const r=this._raycaster.intersectObjects(this._meshes,!1);this._checkIntersections(t,r);return}const i=[],n=this._performantMode===Q.BOUNDING_SPHERE,a=n?Nt:Lt,s=n?"Sphere":"Box",o=`bounding${s}`,h=`computeBounding${s}`,u=`intersects${s}`;for(const r of this._meshes){if(!r.isMesh&&!r.isSpecialCaseemptyMesh||!r.layers.test(this._raycaster.layers))continue;const m=r[o]!==void 0?r:r.geometry;m[o]==null&&m[h](),this._raycaster.ray[u](a.copy(m[o]).applyMatrix4(r.matrixWorld))&&i.push({object:r})}this._checkIntersections(t,i)}_performHover(e=[],t="hover_out",i=null,n=-1){this.hovering=t==="hover_in",this.hoveringElement=i,this.hoveringInstance=n,this._callBack(this._onHover,t,e),this._hoverCursor&&(this.base.base.target.style.cursor=this.hovering?"pointer":""),this._grabCursor&&!this.dragging&&(this.base.base.target.style.cursor=this.hovering?"grab":"")}_performTouch(e=[],t="touch_end",i=null,n=-1){if(this.touching=t==="touch_start",this.touchingElement=i,this.touchingInstance=n,this._callBack(this._onTouch,t,e),this._grabCursor){const a=this.hovering?"grab":"";this.base.base.target.style.cursor=this.touching?"grabbing":a}}_checkIntersections(e,t){const i=e===_.TOUCH_START||e===_.TOUCH_MOVE,n=e===_.CLICK;if(t.length>0){const a=t[0].object,s=this._meshes.indexOf(a),o=typeof t[0].instanceId=="number"?t[0].instanceId:-1;i?(this.hovering&&(this.hoveringElement!==s||this.hoveringInstance!==o)&&this._performHover(),!this.hovering&&(this._interactWhileTouching||!this._touchPressed)&&this._performHover(t,"hover_in",s,o),e===_.TOUCH_START?(this.touching&&(this.touchingElement!==s||this.touchingInstance!==o)&&this._performTouch(),!this.touching&&(this._interactWhileTouching||!this._touchPressed)&&(this._performTouch(t,"touch_start",s,o),this.dragging=!0)):this._callBack(this._onMove,"move",t)):n&&this._callBack(this._onClick,"click",t)}else this.hovering&&this._performHover();e===_.TOUCH_END&&(this.hovering&&this.base.base.inputManager.get(this._finger).currentInput==="touch"&&this._performHover(),this.touching&&this._performTouch(),this.dragging=!1),e===_.TOUCH_MOVE&&this.dragging&&this._callBack(this._onDrag,"drag",t)}_callBack(e,t,i){e&&e.call(this._ctx,{action:t,finger:this._finger,interactions:i,event:this.base.base.inputManager.get(this._finger)})}_onTouchStart(e){this._castRay(e,_.TOUCH_START),this._touchPressed=!0}_onTouchMove(e){this._castRay(e,_.TOUCH_MOVE)}_onTouchEnd(e){this._touchPressed=!1,this._castRay(e,_.TOUCH_END)}_onTouchClick(e){this._castRay(e,_.CLICK)}enable(){this._enabled||(this._enabled=!0,(this._onTouch||this._onHover||this._onDrag)&&(this.base.base.eventManage.on(`${this._eventsID}_start`,this._onTouchStart.bind(this)),this.base.base.eventManage.on(`${this._eventsID}_end`,this._onTouchEnd.bind(this))),(this._onHover||this._onMove||this._onDrag)&&this.base.base.eventManage.on(`${this._eventsID}_move`,this._onTouchMove.bind(this)),this._onClick&&this.base.base.eventManage.on(`${this._eventsID}_click`,this._onTouchClick.bind(this)),this._onTouchMove(this.base.base.inputManager.get(this._finger)))}disable(){this._enabled&&(this._enabled=!1,this._touchPressed=!1,ue.off(`${this._eventsID}_start`,this._onTouchStart,this),ue.off(`${this._eventsID}_move`,this._onTouchMove,this),ue.off(`${this._eventsID}_end`,this._onTouchEnd,this),ue.off(`${this._eventsID}_click`,this._onTouchClick,this),this._checkIntersections(_.TOUCH_END,[]))}dispose(){this.disable()}}class kt{constructor(e,t={}){this.base=e,this.imageAspect=1,this.options={...t},this.init()}init(){const e=new $;e.translate(-.5,.5,0);const t=new y({uniformsGroups:[this.base.UBO],uniforms:{uColor1:{value:new p("#ecc168")},uColor2:{value:new p("#9f4a16")},tNoise:{value:this.base.noiseSimplexLayeredTexture},tMap:{value:this.base.emailTexture}},depthTest:!1,vertexShader:Ft,fragmentShader:Bt});this.mesh=new I(e,t),this.mesh.renderOrder=3,this.base.scene.add(this.mesh),this.interaction=new Et(this,{camera:this.base.scene.camera,meshes:[this.mesh],hoverCursor:!0,onHover:i=>{},onClick:i=>{window.location.href="mailto:hi@abeto.co"}}),this.imageAspect=t.uniforms.tMap.value.image.width/t.uniforms.tMap.value.image.height,this.base.scene.beforeRenderCbs.push(this.positionMesh.bind(this)),this.interaction.enable()}positionUI({camera:e=null,mesh:t=null,x:i=0,y:n=0,width:a=1,height:s=1,distance:o=null,billboardCamera:h=!0}={}){const u=new f,r=new v,m=o||u.subVectors(e.position,e.target).length();e.getViewSize(m,r);const l=r.y/this.base.screen.height;t.scale.set(a*l,s*l,1);const c=i/this.base.screen.width,g=n/this.base.screen.height;t.position.copy(e.position).add(u.set(r.x*-.5+r.x*c,r.y*.5-r.y*g,-m).applyQuaternion(e.quaternion)),h&&t.quaternion.copy(e.quaternion),t.updateMatrixWorld()}positionMesh(){const e=200/this.imageAspect;this.positionUI({camera:this.base.scene.camera,mesh:this.mesh,x:this.base.screen.width-11,y:this.base.screen.height-15,width:200,height:e})}}var Ot=`attribute float uvy;

uniform Global{vec2 resolution;float time;float dtRatio;};

uniform sampler2D tTexture1;
uniform float lineWidth;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;

float parabola(float x,float k){return pow(4.0*x*(1.0-x),k);}float pcurve(float x,float a,float b){float k=pow(a+b,a+b)/(pow(a,a)*pow(b,b));return k*pow(x,a)*pow(1.0-x,b);}

float when_eq(float x, float y) {
    return 1.0 - abs(sign(x - y));
}

void main() {
    vUv = uv;

    vec3 current = texelFetch(tTexture1, ivec2(position.x, uvy), 0).xyz;
    vec3 previous = texelFetch(tTexture1, ivec2(position.y, uvy), 0).xyz;
    vec3 next = texelFetch(tTexture1, ivec2(position.z, uvy), 0).xyz;

    mat4 projViewModel = projectionMatrix * modelViewMatrix;
    vec4 currentProjected = projViewModel * vec4(current, 1.0);
    vec4 previousProjected = projViewModel * vec4(previous, 1.0);
    vec4 nextProjected = projViewModel * vec4(next, 1.0);

    vec2 aspectVec = vec2(resolution.x / resolution.y, 1.0);

    vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;
    vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;
    vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

    vec2 dir1 = normalize(currentScreen - previousScreen);
    vec2 dir2 = normalize(nextScreen - currentScreen);
    vec2 dir = normalize(dir1 + dir2);

    dir = mix(dir, dir1, when_eq(position.x, position.z));
    dir = mix(dir, dir2, when_eq(position.x, position.y));

    vec2 normal = vec2(-dir.y, dir.x);
    normal.x /= aspectVec.x;
    float w = lineWidth;

    #if SHAPE == 1
    w *= uv.x;
    #elif SHAPE == 2
    w *= 1.0 - uv.x;
    #elif SHAPE == 3
    w *= parabola(uv.x, 1.0);
    #endif

    normal *= w;
    currentProjected.xy += normal * mix(1.0, -1.0, step(0.5, uv.y));

    gl_Position = currentProjected;
    vHighPrecisionZW = gl_Position.zw;
}`,Qt=`layout(location = 1) out highp vec4 gInfo;

uniform Global{vec2 resolution;float time;float dtRatio;};
uniform vec3 uColor;
uniform sampler2D tNoise;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;

void main() {
    vec3 color = uColor;

    float steppedTime = floor(time * 2.0);
    vec2 screenUV = gl_FragCoord.xy / resolution.xy;
    float noise = texture2D(tNoise, screenUV * 2.0 + steppedTime * 0.02).r * (1.0 - vUv.x);
    if (noise < 0.125) discard;

    gl_FragColor = vec4(color, 0.87946);
    gInfo = vec4(1.0, vec2(0.0), 0.0);
}`;class Gt extends I{constructor(e){super(e.geometry,e.material),this.base=e,this.isMeshLine=!0,this.linesCount=this.base.count,this.name=this.linesCount>1?"Meshlines":"Meshline",this.frustumCulled=!1;const t=this.base.base.renderer.webgl.capabilities.floatRenderTarget?T:F,i=this.base.base.utils.ceilPowerOfTwo(Math.max(2,this.base.points));this.rt1=new B(i,i,this.base.textureData.textures||1,{wrapS:P,wrapT:P,minFilter:A,magFilter:A,format:b,type:t,depthBuffer:!1}),this.rt2=this.rt1.clone(),this.rtCurrent=0,this.fsQuad=new k(null),this.computationMaterial=this.base.textureData.material,this.fsQuad.material=this.computationMaterial,this.base.textureData.afterCompute&&(this.afterCompute=this.base.textureData.afterCompute),this.base.textureData.autoCompute!==!1&&(this.onBeforeRender=this.compute.bind(this))}compute(e,t,i){const n=this.base.base.renderer.webgl,a=this.computationMaterial.uniforms.uModelMatrix,s=this.computationMaterial.uniforms.uViewMatrix,o=this.computationMaterial.uniforms.uProjMatrix;a&&a.value.copy(this.matrixWorld),s&&s.value.copy(i.matrixWorldInverse),o&&o.value.copy(i.projectionMatrix);const h=this.rtCurrent===0?this.rt1:this.rt2,u=this.rtCurrent===0?this.rt2:this.rt1;this.rtCurrent=(this.rtCurrent+1)%2;for(let c=0;c<u.texture.length;c++){const g=this.computationMaterial.uniforms[`tTexture${c+1}`];g&&(g.value=u.texture[c])}const r=n.autoClear;n.autoClear=!1;const m=n.getRenderTarget();n.setRenderTarget(h),n.getClearColor(new p);const l=n.getClearAlpha();n.setClearColor(new p("#000000"),0),n.clear(!0,!1,!1),this.fsQuad.render(n),n.autoClear=r,n.setRenderTarget(m),n.setClearColor(new p,l);for(let c=0;c<h.texture.length;c++){const g=this.material.uniforms[`tTexture${c+1}`];g&&(g.value=h.texture[c]);const R=this.material.uniforms[`tTexture${c+1}Prev`];R&&(R.value=u.texture[c])}this.afterCompute&&this.afterCompute(e,t,i)}dispose(){var e;this.fsQuad.dispose(),this.computationMaterial.dispose(),this.rt1.dispose(),this.rt2.dispose()(e=super.dispose)==null||e.call(this)}}class Wt{constructor(e,{camera:t=null,normal:i=new f(0,0,-1),constant:n=0}={}){this.base=e,this.raycaster=new ee,this._camera=t,this._plane=new de(i,n),this.Ai=new f,this.Im=new f}_unproject(e){return this.raycaster.setFromCamera(e,this._camera),this.raycaster.ray.intersectPlane(this._plane,this.Ai),this.Ai}getTouchPositionOnPlane(e=0){return this._unproject(this.base.base.inputManager.get(e).position11)}getPointPositionOnPlane(e){return this._unproject(e)}getPointPositionOnScreen(e){return this.Ai.copy(e),this.Ai.project(this._camera),this.Ai.set((this.Ai.x+1)/2*this.base.base.screen.w,-(this.Ai.y-1)/2*this.base.base.screen.h,this.Ai.z),this.Ai}setPlaneFromPoint(e){return this.Ai.copy(this._camera.position).sub(e).normalize(),this._plane.setFromNormalAndCoplanarPoint(this.Ai,e),this}setPlaneFromCameraTarget(){return this.setPlaneFromPoint(this._camera.target)}setPlaneFromCameraTargetAndDistance(e){return this.Ai.copy(this._camera.position).sub(this._camera.target).normalize(),this.Im.copy(this.Ai).negate().multiplyScalar(e).add(this._camera.position),this._plane.setFromNormalAndCoplanarPoint(this.Ai,this.Im),this}setPlaneFromDirectionAndPoint(e,t){return this.Ai.copy(e).normalize(),this._plane.setFromNormalAndCoplanarPoint(this.Ai,t),this}setDefaultPlane(){return this._plane.normal.set(0,0,-1),this._plane.constant=0,this}setCamera(e){return this._camera=e,this}unprojectFinger(e=0){return this.setPlaneFromCameraTarget().getTouchPositionOnPlane(e)}unprojectPoint(e){return this.setPlaneFromCameraTarget().getPointPositionOnPlane(e)}unprojectDistance(e,t=0){return this.setPlaneFromCameraTargetAndDistance(e).getTouchPositionOnPlane(t)}project(e){return this.getPointPositionOnScreen(e)}}class Ht{constructor(e,t={}){this.base=e,this.options={length:.5,...t},this.count=1,this.points=16,this.init()}init(){this.geometry=this.createPolylineGeometry({count:this.count,points:this.points,closed:!1}),this.material=new y({defines:{SHAPE:0},uniformsGroups:[this.base.UBO],uniforms:{lineWidth:{value:.1},uColor:{value:new p("#ac5c36")},tTexture1:{value:null},tNoise:{value:this.base.noiseSimplexLayeredTexture}},vertexShader:Ot,fragmentShader:Qt,depthTest:!1}),this.textureData={textures:1,material:new y({uniformsGroups:[this.base.UBO],uniforms:{tTexture1:{value:null},uMousePos:{value:new f},uSnap:{value:0},uViewMatrix:{value:new w},uModelMatrix:{value:new w},uProjMatrix:{value:new w}},vertexShader:`
                    void main() {
                        gl_Position = vec4(position, 1.0);
                    }
                `,fragmentShader:`
                    #define outPos pc_fragColor

                    uniform sampler2D tTexture1;

                    uniform mat4 uProjMatrix;
                    uniform mat4 uViewMatrix;
                    uniform mat4 uModelMatrix;

                    uniform vec3 uMousePos;
                    uniform int uSnap;

                    uniform Global{vec2 resolution;float time;float dtRatio;};

                    void main() {
                        ivec2 uv = ivec2(gl_FragCoord.xy);
                        vec3 pos = texelFetch(tTexture1, uv, 0).xyz;

                        if (uv.x == 0) {
                            pos = uMousePos;
                        } else {
                            vec3 nextPos = texelFetch(tTexture1, uv - ivec2(1, 0), 0).xyz;
                            pos = mix(pos, nextPos, clamp(dtRatio, 0.0, 1.0));

                            if (uSnap == 1) pos = uMousePos;
                        }

                        outPos = vec4(pos, 1.0);
                    }
                `})},this.mesh=new Gt(this),this.mesh.name="line",this.mesh.renderOrder=5,this.mesh.updateMatrixWorld(),this.mesh.matrixAutoUpdate=!1;const e=new f,t=new f;let i=0,n=!1;this.base.eventManage.once("touch_move",()=>{n=!0}),this.planeInteraction=new Wt(this),this.base.scene.beforeRenderCbs.push(()=>{const a=this.mesh.computationMaterial.uniforms.uMousePos.value,s=this.planeInteraction.setCamera(this.base.scene.camera).unprojectFinger(0);a.lerp(s,this.base.utils.lerpCoefFPS(.3)),i+=t.subVectors(a,e).length(),i*=this.base.utils.frictionFPS(.8),i=this.base.utils.clamp(i,0,1),e.copy(a),this.mesh.material.uniforms.lineWidth.value=9/this.base.screen.h*this.base.utils.fit(i,.01,.001,1,0),n?(this.mesh.computationMaterial.uniforms.uSnap.value=1,a.copy(s),n=!1):this.mesh.computationMaterial.uniforms.uSnap.value=0}),this.base.scene.add(this.mesh)}createPolylineGeometry({points:e,count:t,closed:i}){const n=t>1,a=[];for(let r=0;r<e;r++){let m,l;i?(m=r===0?e-2:r-1,l=r===e-1?1:r+1):(m=r===0?0:r-1,l=r===e-1?e-1:r+1),a.push(r,m,l),a.push(r,m,l)}const s=[];for(let r=0;r<e-1;r++){const m=r*2;s.push(m,m+1,m+2),s.push(m+2,m+1,m+3)}const o=[];for(let r=0;r<e;r++){const m=r/(e-1);o.push(m,0),o.push(m,1)}const h=[];if(n)for(let r=0;r<t;r++)h.push(r);else for(let r=0;r<e*2;r++)h.push(0);const u=new(n?E:W);return n&&(u.instanceCount=t),u.setAttribute("position",new S(new Float32Array(a),3)),u.setAttribute("uv",new S(new Float32Array(o),2)),u.setAttribute("uvy",new(n?D:S)(new Float32Array(h),1)),u.setIndex(s),u}}function C(d){return new URL(Object.assign({"../../assets/drc/border.drc":Le,"../../assets/drc/leaf.drc":Ee,"../../assets/drc/needle.drc":ke,"../../assets/drc/petal.drc":Oe,"../../assets/ktx/email.ktx2":Qe,"../../assets/ktx/headline.ktx2":Ge,"../../assets/ktx/leaf.ktx2":We,"../../assets/ktx/noise-simplex-layered.ktx2":He,"../../assets/ktx/petal.ktx2":qe,"../../assets/ktx/transition-nomipmaps.jpg":Ze,"../../assets/ktx/uvchecker-srgb.ktx2":je,"../../assets/ktx/uvchecker-srgb.png":Ke})[`../../assets/${d}`],import.meta.url).href}class qt{constructor(e){x(this,"fingers",1);x(this,"active",!1);x(this,"audio",null);x(this,"initialDPR",1);x(this,"currentDPR",1);x(this,"adaptiveDPR",null);x(this,"uniforms",{resolution:{value:new v(2,2),global:!0},time:{value:0,global:!0},dtRatio:{value:1,global:!0}});x(this,"composer",null);x(this,"renderPass",null);x(this,"DPR",window.devicePixelRatio<=2?Math.min(window.devicePixelRatio,1.25):Math.min(window.devicePixelRatio,1.5)||1);x(this,"screen",{dpr:window.devicePixelRatio||1,aspectRatio:1,width:0,height:0,w:0,h:0});x(this,"start",!1);this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.screen.width=this.target.offsetWidth,this.screen.height=this.target.offsetHeight,this.screen.w=this.screen.width,this.screen.h=this.screen.height,this.screen.aspectRatio=this.screen.w/this.screen.h,this.initUBO(),this.initDPR(),this.initUtils(),this.initRenderer(),this.initCamera(),this.initScene(),this.initDPRMultiplier(),this.initLoader(),window.addEventListener("resize",this.resize.bind(this))}initUBO(){this.UBO=new me,this.UBO.setName("Global"),this.UBO.add(this.uniforms.resolution),this.UBO.add(this.uniforms.time),this.UBO.add(this.uniforms.dtRatio)}initDPR(){this.initialDPR=this.DPR,this.adaptiveDPR=new Ye(this)}initUtils(){this.gsap=Me,this.gsap.registerPlugin(V),this.gsap.config({force3D:!0}),this.gsap.defaults({ease:"power2.inOut",duration:.6,overwrite:"auto"}),V.create("inOut1","M0,0 C0.5,0 0.1,1 1,1"),V.create("inOut2","M0,0 C0.56,0 0,1 1,1"),V.create("inOut3","M0,0 C0.6,0 0,1 1,1"),V.create("inOut4","M0,0 C0.4,0 -0.06,1 1,1"),this.eventManage=new De,this.timeStats=new $e,this.utils=new et(this),this.inputManager=new it(this)}initRenderer(){this.renderer=new nt,this.renderer.info.autoReset=!1,this.renderer.webgl.setSize(this.screen.width,this.screen.height),this.renderer.webgl.toneMapping=pe,this.target.appendChild(this.renderer.webgl.domElement)}async initLoader(){this.manager=new fe,this.fileLoader=new ge(this.manager).setResponseType("arraybuffer"),this.dracoLoader=new xe(this.manager).setDecoderPath("/draco/gltf/").setWorkerLimit(1).preload(),this.ktx2Loader=new ye(this.manager).setTranscoderPath("/basis/").detectSupport(this.renderer.webgl),this.emailTexture=await this.ktx2Loader.loadAsync(C("ktx/email.ktx2")),this.headLineTexture=await this.ktx2Loader.loadAsync(C("ktx/headline.ktx2")),this.leafTexture=await this.ktx2Loader.loadAsync(C("ktx/leaf.ktx2")),this.noiseSimplexLayeredTexture=await this.ktx2Loader.loadAsync(C("ktx/noise-simplex-layered.ktx2")),this.petalTexture=await this.ktx2Loader.loadAsync(C("ktx/petal.ktx2")),this.transitionNomipmapsTexture=await new Ae(this.manager).load(C("ktx/transition-nomipmaps.jpg")),this.noiseSimplexLayeredTexture.colorSpace=O,this.noiseSimplexLayeredTexture.wrapS=this.noiseSimplexLayeredTexture.wrapT=we,this.petalTexture.colorSpace=O,this.petalTexture.wrapS=this.petalTexture.wrapT=P,this.leafTexture.colorSpace=O,this.leafTexture.wrapS=this.leafTexture.wrapT=P;let e=0;const t=[{path:C("drc/needle.drc"),key:"needle"},{path:C("drc/border.drc"),key:"border"},{path:C("drc/leaf.drc"),key:"leaf"},{path:C("drc/petal.drc"),key:"petal"}];for(let i=0;i<t.length;i++)this[t[i].key]=await this.dracoLoader.loadAsync(t[i].path),this[t[i].key].name=t[i].key,t[i].key==="border"&&(this[t[i].key].setAttribute("inset",new S(new Float32Array([.0002442598342895508,.0002442598342895508,0,.0002442598342895508,.0002442598342895508,0,.0002442598342895508,.0002442598342895508,0,.0002442598342895508,.0002442598342895508,0,-1,-1,0,-1,1,0,-1,1,0,1,1,0,1,-1,0,-1,1,0,.0002442598342895508,.0002442598342895508,0,.0002442598342895508,.0002442598342895508,0,.0002442598342895508,.0002442598342895508,0,1,-1,0,.0002442598342895508,.0002442598342895508,0]),3)),this[t[i].key].setAttribute("notch",new S(new Float32Array([0,0,0,0,1,0,-1,0,0,-1,1,0,0,0,0,0,1,0,-1,1,0,0,0,0,0,0,0,-1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),3))),e+=1,e===t.length&&(this.initComposer(),this.initEvents(),this.initWorld(),this.resize(),this.initAnimation())}initCamera(){this.camera=new te(this),this.camera.basePosition.set(0,0,4),this.camera.baseTarget.set(0,0,0),this.camera.displacement.position.set(.03,.015),this.camera.lerpPosition=.035}initScene(){this.scene=new at(this),this.fluidSim=new ot(this)}initComposer(){this.composer=new be(this.renderer.webgl),this.renderPass=new _e(this.scene,this.camera),this.SMAAPass=new Te(this.screen.width,this.screen.height),this.multipleRenderPass=new st(this),this.finalPass=new rt(this).pass;const e=this.multipleRenderPass.multipleRenderTarget.texture;e[0].name="color",e[1].name="info",this.finalPass.uniforms.tInfo.value=e[1],this.finalPass.uniforms.uCameraNear.value=this.camera.near,this.finalPass.uniforms.uCameraFar.value=this.camera.far,this.gammaCorrectionPass=new Y(Ce),this.outPass=new Pe,this.composer.addPass(this.renderPass),this.composer.addPass(this.SMAAPass),this.composer.addPass(this.multipleRenderPass),this.composer.addPass(this.finalPass),this.composer.addPass(this.gammaCorrectionPass)}initWorld(){this.callback(),this.flower=new ut(this),this.leaves=new ft(this),this.needles=new bt(this),this.foregroundLeavesCreate=new Mt(this),this.bckgroundCreate=new Ut(this),this.borderCreate=new zt(this),this.notchCreate=new kt(this),this.lineCreate=new Ht(this),this.eventManage.emit("webgl_render_active",!0);const e=this.finalPass.material;this.gsap.fromTo(e.uniforms.uProgress1,{value:0},{value:1,duration:5,ease:"power2.out",delay:.25}),this.gsap.fromTo(e.uniforms.uProgress2,{value:0},{value:1,duration:5,ease:"power2.out",delay:.25+.2}),this.gsap.fromTo(e.uniforms.uProgress3,{value:0},{value:1,duration:5,ease:"power2.out",delay:.25+.6}),this.gsap.fromTo(e.uniforms.uProgress4,{value:0},{value:1,duration:5,ease:"power2.out",delay:.25+.9})}initAnimation(){let e=[],t=0,i=.5,n=5;this.gsap.ticker.add((a,s,o)=>{const h=Math.round((a-this.timeStats.internalTime)*1e3);if(e.push(h),a-t>=i&&e.length>=n){const u=Math.round(1e3/(e.reduce((r,m)=>r+m,0)/e.length));this.timeStats.recordedMaxFPS=Math.max(this.timeStats.recordedMaxFPS,u),this.timeStats.smoothedFPS=u,e.length=0,t=a,this.eventManage.emit("webgl_average_fps_update",this.timeStats.smoothedFPS)}this.timeStats.internalTime=a,this.timeStats.frameDelta=h,this.timeStats.frameCount++,["webgl_prerender","webgl_render","webgl_postrender"].forEach(u=>{this.eventManage.emit(u,a,h)})})}initEvents(){this.eventManage.on("resize",({w:e,h:t})=>{this.uniforms.resolution.value.set(e,t).multiplyScalar(this.currentDPR).floor(),this.renderer.webgl.setSize(this.uniforms.resolution.value.x,this.uniforms.resolution.value.y),this.renderer.webgl.domElement.style.width=`${e}px`,this.renderer.webgl.domElement.style.height=`${t}px`,this.composer.setSize(this.uniforms.resolution.value.x,this.uniforms.resolution.value.y)}),this.eventManage.on("webgl_prerender",e=>{this.uniforms.time.value=e,this.uniforms.dtRatio.value=this.utils.deltaRatio()}),this.eventManage.on("webgl_render",e=>{var t,i;this.active&&((t=this.renderer.info)==null||t.reset(),(i=this.composer)==null||i.render(e))}),this.eventManage.on("webgl_render_active",e=>{var t;e&&!((t=this.adaptiveDPR)!=null&&t.hasRun)&&this.adaptiveDPR.start(),this.active=e})}initDPRMultiplier(e=1){this.currentDPR=this.initialDPR*e,this.eventManage.emit("resize",{w:this.screen.w,h:this.screen.h})}resize(){this.screen.width=this.screen.w=this.target.offsetWidth,this.screen.height=this.screen.h=this.target.offsetHeight,this.screen.aspectRatio=this.screen.w/this.screen.h,this.eventManage.emit("resize",{w:this.screen.w,h:this.screen.h})}destroy(){}}const Zt={class:"abeto"},jt={class:"load"},Kt={__name:"index",setup(d){const e=Z(!1);Z(0);let t=null;const i=()=>{e.value=!0};return Re(()=>{t=new qt({parent:document.querySelector(".abeto"),target:document.querySelector(".canvas"),callback:i})}),Ue(()=>{t.destroy(),t=null,console.info("%c霓虹灯-销毁😁","color:#fff;background-color:red")}),(n,a)=>(j(),K("div",Zt,[N("div",{class:Be(["loading",{loadOk:e.value}])},[N("div",jt,[(j(),K(Ie,null,Ve("LOADING...",(s,o)=>N("span",{key:o,style:ze("--i:"+o)},Fe(s),5)),64))])],2),a[0]||(a[0]=N("div",{class:"canvas"},null,-1))]))}},ii=Ne(Kt,[["__scopeId","data-v-3ca65534"]]);export{ii as default};
