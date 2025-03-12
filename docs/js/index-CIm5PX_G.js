import{V as A,v as T,e as N,P as B,w as C,O as K,x as L,G as I,r as E,y as p,M as h,s as G}from"./threejs-R2oN4ICD.js";import{k as D,l as u,b as O,m as U,i as f,c as x,d as l,F as j,n as F,p as Y,e as V,q}from"./vendor-D10xMT_S.js";import{_ as W}from"../lib/index-xycz1Eof.js";const y=(e,t,n)=>Math.min(Math.max(e,t),n),$=e=>e/Math.PI*180,X=(e,t,n)=>e*(1-n)+t*n,Z=e=>e*Math.PI/180,J=(e,t)=>Math.random()*(t-e)+e,Q=(e,t)=>Math.floor(Math.random()*(t-e+1))+e,tt=(e,t,n)=>{if(e>=t)return 0;const o=y((n-e)/(t-e),0,1);return o*o*(3-2*o)},et=(e,t,n)=>[Math.sin(e)*Math.cos(t)*n,Math.cos(e)*n,Math.sin(e)*Math.sin(t)*n],nt=(e,t)=>t>=e?1:0,w={clamp:y,degrees:$,mix:X,radians:Z,randomArbitrary:J,randomInt:Q,smoothstep:tt,spherical:et,step:nt};var ot=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vMPosition;
varying vec2 vUv;

void main(void) {
    
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    vPosition = position;
    vMPosition = mPosition.xyz;
    vUv = uv;
    vNormal = normal;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,it=`#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float addH1;
uniform float addH2;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 vMPosition;
varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

const float edge1 = 48.0;
const float edge2 = 24.0;
const float edge3 = 8.0;
const float range = 14.0;

void main() {
    
    vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
    vec3 normal = vNormal;
    float diff = (dot(normal, light) + 1.0) / 2.0;

    float stepTop     = smoothstep(edge1, edge1 + range, vPosition.y);
    float stepMiddle1 = smoothstep(edge2, edge2 + range, vPosition.y) * (1.0 - smoothstep(edge1, edge1 + range, vPosition.y));
    float stepMiddle2 = smoothstep(edge3, edge3 + range, vPosition.y) * (1.0 - smoothstep(edge2, edge2 + range, vPosition.y));
    float stepBottom  = 1.0 - smoothstep(edge3, edge3 + range, vPosition.y);

    vec4 colorTop     = vec4(convertHsvToRgb(vec3( 0.1 + addH1, 0.1, 0.8)), 1.0) * stepTop;
    vec4 colorMiddle1 = vec4(convertHsvToRgb(vec3(0.25 + addH2, 0.4, 0.6)), 1.0) * stepMiddle1;
    vec4 colorMiddle2 = vec4(convertHsvToRgb(vec3(0.25 + addH2, 0.25, 0.8)), 1.0) * stepMiddle2;
    vec4 colorBottom  = vec4(convertHsvToRgb(vec3( 0.1 + addH1, 0.4, 0.3)), 1.0) * stepBottom;

    vec4 colorAll = (colorTop + colorMiddle1 + colorMiddle2 + colorBottom) * diff;

    gl_FragColor = colorAll;
}`,at=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform mat4 normalMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSinAll;
varying vec3 vNormal;

mat4 calcTranslateMat4(vec3 v) {
    return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    v.x, v.y, v.z, 1.0
    );
}

void main(void) {
    vNormal = normal; 
    float sin1 = sin(time + position.x / 16.0);
    float sin2 = sin(time + position.y / 8.0);
    float sin3 = sin(time - length(position.xy + 50.0) / 4.0);
    float sinAll = (sin1 + sin2 * 0.5 + sin3 * 0.2) / 1.7;
    mat4 waveMat = calcTranslateMat4(vec3(0.0, 0.0, sinAll * 1.5));

    
    vec4 mPosition = modelMatrix * waveMat * vec4(position, 1.0);

    vPosition = mPosition.xyz;
    vUv = uv;
    vSinAll = sinAll;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,st=`#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform float addH;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying float vSinAll;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    
    vec3 light = normalize(vec3(-1.0, 1.0, 1.0));
    vec3 normal = vNormal;
    float diff = dot(normal, light);

    vec4 color = vec4(convertHsvToRgb(vec3(0.2 + vSinAll * 0.15 + addH, 0.2, 1.0)), 0.4);

    gl_FragColor = color * vec4(vec3(diff), 1.0);
}`;class rt{constructor(t){this.parent=t.parent,this.target=t.target,this.callback=t.callback,this.devicePixelRatio=window.devicePixelRatio,this.width=this.target.offsetWidth*this.devicePixelRatio,this.height=this.target.offsetHeight*this.devicePixelRatio,this.aspect=this.width/this.height,this.resolution=new A(this.width,this.height),this.renderer=new T({powerPreference:"high-performance",alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(0,1),this.scene=new N,this.target.appendChild(this.renderer.domElement),this.camera=new B(50,this.aspect,.1,1e3),this.camera.setFocalLength(50),this.camera.position.set(300,300,300),this.camera.lookAt(new C(0,0,0)),this.control=new K(this.camera,this.renderer.domElement),this.control.enableDamping=!0,this.clock=new L,this.callback(),this.randomH=Math.random(),this.landInit(),this.waterInit(),this.group=new I,this.group.add(this.land),this.group.add(this.water),this.scene.add(this.group),this.rotation={x:0,y:0,z:0},this.animation(),this.resize()}landInit(){const t=D(Math.random),n=5,o=new E(100,n,100,60,1,60);for(let i=0;i<o.attributes.position.count;i++){const s=o.attributes.position.getX(i),a=o.attributes.position.getY(i),r=o.attributes.position.getZ(i),M=t(s/80,a/80,r/80,1),b=t(s/48,a/32,r/32,1),P=t(s/6,a/6,r/6,1),_=t(s/2,a/2,r/2,1),H=(c,v)=>v>=c?1:0,z=(c,v,R)=>{let d=w.clamp((R-c)/(v-c),0,1);return d*d*(3-2*d)},g=(M*.75+.25)*48+b*18+P*1.2+_*.6,S=z(0,5,g),k=H(0,a);o.attributes.position.setY(i,(a+g*S)*k)}const m=new p({uniforms:{time:{value:0},addH1:{value:this.randomH-.5},addH2:{value:this.randomH}},vertexShader:ot,fragmentShader:it});this.land=new h(o,m)}waterInit(){const t=new G(100,100,60,60),n=new p({uniforms:{time:{value:0},addH:{value:this.randomH-.5}},vertexShader:at,fragmentShader:st,transparent:!0});this.water=new h(t,n),this.water.translateY(8),this.water.rotation.set(w.radians(-90),0,0)}animation(){this.renderer.setAnimationLoop(()=>this.animation());const t=this.clock.getDelta();this.control.update(),this.land.material.uniforms.time.value+=t,this.water.material.uniforms.time.value+=t,this.renderer.render(this.scene,this.camera)}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.renderer.setSize(this.width,this.height),this.camera.updateProjectionMatrix()})}destroy(){this.scene.traverse(t=>{var n;t instanceof h&&((n=t.geometry)==null||n.dispose(),Object.values(t.material).forEach(o=>{o&&typeof o.dispose=="function"&&o.dispose()}))}),this.renderer.dispose()}}const ct={class:"land"},lt={class:"load"},vt={__name:"index",setup(e){const t=u(!1);u(0);let n=null;const o=()=>{t.value=!0};return O(()=>{n=new rt({parent:document.querySelector(".land"),target:document.querySelector(".canvas"),callback:o})}),U(()=>{n.destroy(),n=null,console.info("%c金属方块-销毁😁","color:#fff;background-color:red")}),(m,i)=>(f(),x("div",ct,[l("div",{class:q(["loading",{loadOk:t.value}])},[l("div",lt,[(f(),x(j,null,F("LOADING...",(s,a)=>l("span",{key:a,style:Y("--i:"+a)},V(s),5)),64))])],2),i[0]||(i[0]=l("div",{class:"canvas"},null,-1))]))}},gt=W(vt,[["__scopeId","data-v-78b30447"]]);export{gt as default};
