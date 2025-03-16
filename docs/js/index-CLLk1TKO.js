import{P as u,e as g,z as x,v as p,x as y,q as w,y as s,V as b,f as _,M as t,s as c,h as C,A as F}from"./threejs-DBMWHTjA.js";import{_ as z}from"../lib/index-ChcEMU0S.js";import{l,b as M,m as S,i as d,c as v,d as r,F as k,n as G,p as q,e as R,q as P}from"./vendor-jP0BXN2k.js";var U=`attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`,B=`#ifdef GL_ES
precision mediump float;
#endif

#define OCTAVES 2
#define RGB(r, g, b) vec3(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0)

uniform vec2 resolution;

uniform float globalTime;

vec2 rand2(vec2 p) {
    p = vec2(dot(p, vec2(12.9898, 78.233)), dot(p, vec2(26.65125, 83.054543)));
    return fract(sin(p) * 43758.5453);
}

float rand(vec2 p) {
    return fract(sin(dot(p.xy, vec2(54.90898, 18.233))) * 4337.5453);
}

vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 
    0.366025403784439, 
    -0.577350269189626, 
    0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0));

    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m*m;
    m = m*m;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float stars(in vec2 x, float numCells, float size, float br) {
    vec2 n = x * numCells;
    vec2 f = floor(n);

    float d = 1.0e10;
    for (int i = -1; i <= 1; ++i)
    {
        for (int j = -1; j <= 1; ++j)
        {
            vec2 g = f + vec2(float(i), float(j));
            g = n - g - rand2(mod(g, numCells)) + rand(g);
            
            g *= 1. / (numCells * size);
            d = min(d, dot(g, g));
        }
    }

    return br * (smoothstep(.95, 1., (1. - sqrt(d))));
}

float fractalNoise(in vec2 coord, in float persistence, in float lacunarity) {
    float n = 0.;
    float frequency = 3.;
    float amplitude = 2.;
    for (int o = 0; o < OCTAVES; ++o)
    {
        n += amplitude * snoise(coord * frequency);
        amplitude *= persistence;
        frequency *= lacunarity;
    }
    return n;
}

void main() {
    
    vec2 coord = gl_FragCoord.xy / resolution.xy;
    vec2 starCoord = gl_FragCoord.xy / resolution.yy - vec2(.5, 0);
    
    vec3 color1 = RGB(10, 70, 50) * 1.5;
    vec3 color2 = RGB(50, 0, 40) * 1.1;
    
    float dist = distance(coord, vec2(0.5, 0.3)) * 1.5;

    float time = -globalTime / 100.;

    mat2 RotationMatrix = mat2(cos(time), sin(time), -sin(time), cos(time));
    vec3 starField = stars(starCoord * RotationMatrix, 16., 0.03, 0.8) * vec3(.9, .9, .95);
    starField += stars(starCoord * RotationMatrix, 40., 0.025, 1.0) * vec3(.9, .9, .95) * max(0.0, fractalNoise(starCoord * RotationMatrix, .5, .2));

    vec3 aurora = RGB(0,255,130) * max(snoise(vec2((coord.x + sin(time)) * 15., coord.x * 40.)) * max((sin(10.0 * (coord.x + 2. * time)) *.1 + 1.26) - 2. * coord.y, 0.), 0.);
    vec3 aurora2 = RGB(0,235,170) * max(snoise(vec2((.09 * coord.x + sin(time * .5)) * 15., coord.x * 1.)) * max((sin(5.0 * (coord.x + 1.5 * time)) *.1 + 1.28) - 2. * coord.y, 0.), 0.);

    vec3 result = starField + aurora * aurora2.g * 3.5 + aurora2;

    gl_FragColor = vec4(mix(color1, color2, dist), 1.0);
    gl_FragColor.rgb += result;
}`,T=`attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`,E=`#ifdef GL_ES
precision mediump float;
#endif

#define RGB(r, g, b) vec3(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0)

uniform float globalTime;

varying vec2 vUv;

float treeFill(in float size, in vec2 offset) {
    vec2 p = vUv;
    vec2 q = p - vec2(0.5,0.5);
    vec2 q1 = 100.0 / size * q - offset;
    float r= mod(-0.8*q1.y,1.-0.06*q1.y) * -0.05*q1.y - .1*q1.y;
    float fill = (1.0 - smoothstep(r, r+0.001, abs(q1.x+0.5*sin(0.9 * globalTime + p.x * 25.0)*(1.0 + q1.y/13.0)))) * smoothstep(0.0, 0.01, q1.y + 13.0);
    return fill;
}

vec4 tree(in float size, in vec2 offset) {
    float glowDist = 0.12;
    vec3 glowColor = RGB(11, 115, 95);
    float tree = treeFill(size, offset);
    float treeGlow = treeFill(size, vec2(offset.x + glowDist, offset.y));
    return max(vec4(glowColor * (treeGlow - tree), treeGlow), vec4(0.0));
}

void main() {
    vec2 c = vUv;
    vec2 p = vUv;
    p *= 0.3;
    p.y = p.y * 30.0 - 4.0;
    p.x = p.x * 30.0;
    vec2 q = (p - vec2(0.5,0.5)) * 5.5;

    vec4 col = tree(1.0, vec2(-30.0, 7.0));
    col += tree(1.2, vec2(-15.0, 8.0));
    col += tree(1.1, vec2(-12.0, 4.0));
    col += tree(1.0, vec2(-9.0, 6.0));
    col += tree(1.1, vec2(-10.0, 3.0));
    col += tree(1.0, vec2(-3.0, 4.0));
    col += tree(1.1, vec2(-1.5, 5.0));
    col += tree(1.0, vec2(5.0, 3.0));
    col += tree(1.3, vec2(12.0, 8.0));
    col += tree(0.9, vec2(15.0, 7.0));
    col += tree(1.0, vec2(18.0, 7.0));
    col += tree(1.1, vec2(26.0, 7.0));

    gl_FragColor = vec4(max(col.rgb * p.y, vec3(0.0)), col.a);
}`,V=`uniform vec3 mvPosition;

varying vec2 vUv;
varying float fogDepth;

void main() {
    fogDepth = -mvPosition.z;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}`,j=`#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

#include <fog_pars_fragment>

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rand2(vec2 p)
{
    p = vec2(dot(p, vec2(12.9898,78.233)), dot(p, vec2(26.65125, 83.054543)));
    return fract(sin(p) * 43758.5453);
}

float rand(vec2 p)
{
    return fract(sin(dot(p.xy ,vec2(54.90898,18.233))) * 4337.5453);
}

void main() {
    float offset = random(vec2(gl_FragCoord.w));
    vec2 c = vUv;
    vec2 p = vUv;
    p *= .3;
    p.y = p.y * 30. - 4.;
    p.x = p.x * (80. * offset) + 14.8 * offset;
    vec2 q = (p - vec2(0.5,0.5)) * 1.;
    
    vec3 col = vec3(0.);

    float h = max(
    .0,
    max(
    max(
    abs(fract(p.x)-.5)-.25,
    3.*(abs(fract(.7*p.x+.4)-.5)-.4)
    ),
    max(
    1.2*(abs(fract(.8*p.x+.6)-.5)-.2),
    .3*(abs(fract(.5*p.x+.2)-.5))
    )
    )
    );
    float fill = 1.0 - smoothstep(h, h+.001, p.y);

    vec3 col2 = col * min(fill, 2.0);

    gl_FragColor = vec4(col2, fill);

    #ifdef USE_FOG
    #ifdef USE_LOGDEPTHBUF_EXT
    float depth = gl_FragDepthEXT / gl_FragCoord.w;
    #else
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    #endif
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
    #endif
}`;class L{constructor(e){this.target=e.target,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.callback=e.callback,this.camera=new u(70,this.aspect,1,5e3),this.camera.position.z=40,this.scene=new g,this.scene.fog=new x(16711935,40,180),this.renderer=new p({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.target.appendChild(this.renderer.domElement),this.clock=new y,window.addEventListener("resize",()=>this.resize()),this.createBackground(),this.createTree(),this.createMountain(),this.callback(),this.animation()}createBackground(){const e=new w(4e3,32,15),n=new s({vertexShader:U,fragmentShader:B,uniforms:{resolution:{value:new b(this.width*window.devicePixelRatio,this.height*window.devicePixelRatio)},globalTime:{value:performance.now()/1e3}},side:_});this.background=new t(e,n),this.scene.add(this.background)}createTree(){const e=new c(200,200,1,1),n=new s({vertexShader:T,fragmentShader:E,uniforms:{globalTime:{value:performance.now()/1e3}},transparent:!0});this.tree=new t(e,n),this.tree.position.z=.1,this.scene.add(this.tree)}createMountain(){const e=new c(600,200,1,1),n=new C({vertexShader:V,fragmentShader:j,fog:!0,transparent:!0,uniforms:{...F.fog,fogColor:{value:this.scene.fog.color},fogNear:{value:this.scene.fog.near},fogFar:{value:this.scene.fog.far}}});this.mountain=new t(e,n),this.mountain1=new t(e,n),this.mountain2=new t(e,n),this.mountain.position.set(0,0,0),this.mountain1.position.set(0,-2,-26),this.mountain2.position.set(0,0,-35),this.scene.add(this.mountain),this.scene.add(this.mountain1),this.scene.add(this.mountain2)}resize(){this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.camera.aspect=this.aspect,this.camera.updateProjectionMatrix(),this.background.material.uniforms.resolution.value.set(this.width*window.devicePixelRatio,this.height*window.devicePixelRatio),this.renderer.setSize(this.width,this.height)}animation(e=0){requestAnimationFrame(n=>this.animation(n)),this.renderer.render(this.scene,this.camera),this.background.material.uniforms.globalTime.value=e/1e3,this.tree.material.uniforms.globalTime.value=e/1e3}destroy(){this.scene.traverse(e=>{var n;e instanceof t&&((n=e.geometry)==null||n.dispose(),Object.values(e.material).forEach(o=>{o&&typeof o.dispose=="function"&&o.dispose()}))}),this.renderer.dispose()}}const D={class:"aurora"},O={class:"load"},N={__name:"index",setup(f){const e=l(!1);l(0);let n=null;const o=m=>{e.value=!0};return M(()=>{n=new L({parent:document.querySelector(".aurora"),target:document.querySelector(".canvas"),callback:o})}),S(()=>{n.destroy(),n=null,console.info("%c极光和树-销毁😁","color:#fff;background-color:red")}),(m,i)=>(d(),v("div",D,[r("div",{class:P(["loading",{loadOk:e.value}])},[r("div",O,[(d(),v(k,null,G("LOADING...",(h,a)=>r("span",{key:a,style:q("--i:"+a)},R(h),5)),64))])],2),i[0]||(i[0]=r("div",{class:"canvas"},null,-1))]))}},W=z(N,[["__scopeId","data-v-e28ffe78"]]);export{W as default};
