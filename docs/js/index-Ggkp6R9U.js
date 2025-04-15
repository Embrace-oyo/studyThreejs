import{z as q,x as D,w as h,n as A,W as T,H as C,L as u,A as S,h as y,V as z,I as L,v as Q,e as U,P as G,O as I,J as E,l as O,f as V,M as _,K as N,Q as W,X as H,Y as M,Z as j,_ as X}from"./threejs-X_Qec1pD.js";import{v as Y,f as J,_ as K}from"../lib/index-C14GzQpN.js";import{l as P,b as Z,m as $,i as k,c as R,d as m,F as ee,n as te,p as se,e as ie,q as ae}from"./vendor-DXKZwkeo.js";var re=`uniform vec2 iResolution;
uniform float iTime;
uniform vec3 iMouse;
uniform sampler2D iChannel0;
varying vec2 vUv;

void main(){
    vec3 e = vec3(vec2(1.0) / iResolution, 0.0);
    vec2 q = vUv;

    vec4 c = texture(iChannel0, q);
    float p11 = c.y;

    float p10 = texture(iChannel0, q - e.zy).x;
    float p01 = texture(iChannel0, q - e.xz).x;
    float p21 = texture(iChannel0, q + e.xz).x;
    float p12 = texture(iChannel0, q + e.zy).x;

    float d = 0.0;
    float radius = 1.0;
    if (iMouse.z > 0.0){
        d = smoothstep(radius + 6.5, radius - 0.5, length(iMouse.xy - gl_FragCoord.xy));
    } else {
        float t = iTime * 10.0;
        vec2 pos = fract(float(t) * vec2(0.456665, 0.708618)) * iResolution;
        float amp = 1.0 - step(0.55, fract(t));
        d = -amp * smoothstep(radius + 6.5, radius - 0.5, length(pos - gl_FragCoord.xy));
    }

    d+= -(p11 - 0.5) * 2.0 + (p10 + p01 + p21 + p12 - 2.0);
    d *= 0.99;
    d *= float(iTime >= 2.0);
    d = d * 0.5 + 0.5;

    gl_FragColor = vec4(d, c.x, 0.0, 0.0);
}`,ne=`uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main(){
    vec2 q = vUv;
    vec3 e = vec3(vec2(1.0) / iResolution, 0.0);

    float p10 = texture(iChannel0, q - e.zy).x;
    float p01 = texture(iChannel0, q - e.xz).x;
    float p21 = texture(iChannel0, q + e.xz).x;
    float p12 = texture(iChannel0, q + e.zy).x;

    vec3 grad = normalize(vec3(p21 - p01, p12 - p10, 1.0));
    vec4 c = texture(tDiffuse, q + grad.xy * 0.35);
    vec3 light = normalize(vec3(0.2, -0.5, 0.7));
    float diffues = dot(grad, light);
    float spec = pow(max(0.2, -reflect(light, grad).z), 32.0);

    gl_FragColor = mix(c, vec4(0.7, 0.8, 1.0, 1.0), 0.25) * max(diffues, 0.0) + spec;
}`,B=`varying vec2 vUv;

void main() {

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}`;class oe extends q{constructor(s){super(),this.base=s,this.width=this.base.width,this.height=this.base.height,this.clock=new D,this.mouse=new h(0,0,0),this.time=null,this.base.target.addEventListener("mousemove",t=>{const e=this.base.target.getBoundingClientRect();this.mouse.x=t.clientX-e.left,this.mouse.y=this.height-(t.clientY-e.top),this.mouse.z=1,clearTimeout(this.time),this.time=setTimeout(()=>{this.mouse.z=0,clearTimeout(this.time)},50)}),this.clearColor=new A(0,0,0),this.renderTargetA=new T(this.width,this.height,{samples:4,type:C,minFilter:u,magFilter:u,format:S}),this.renderTargetA.texture.name="ripples",this.renderTargetB=new T(this.width,this.height,{samples:4,type:C,minFilter:u,magFilter:u,format:S}),this.renderTargetB.texture.name="water",this.ripplesMaterial=new y({uniforms:{iResolution:{value:new z(this.width,this.height)},iTime:{value:0},iMouse:{value:this.mouse},iChannel0:{value:null}},vertexShader:B,fragmentShader:re}),this.waterMaterial=new y({uniforms:{iResolution:{value:new z(this.width,this.height)},iTime:{value:0},tDiffuse:{value:null},iChannel0:{value:null}},vertexShader:B,fragmentShader:ne}),this.fsQuad=new L(null)}render(s,t,e){this.ripplesMaterial.uniforms.iChannel0.value=this.renderTargetA.texture,this.ripplesMaterial.uniforms.iMouse.value=this.mouse,this.ripplesMaterial.uniforms.iTime.value=performance.now()/1e3,this.fsQuad.material=this.ripplesMaterial,this.fsQuad.material.needsUpdate=!0,s.setRenderTarget(this.renderTargetB),this.fsQuad.render(s);const i=this.renderTargetA;this.renderTargetA=this.renderTargetB,this.renderTargetB=i,this.waterMaterial.uniforms.iChannel0.value=this.renderTargetA.texture,this.waterMaterial.uniforms.tDiffuse.value=e.texture,this.fsQuad.material=this.waterMaterial,this.fsQuad.material.needsUpdate=!0,this.renderToScreen?s.setRenderTarget(null):(s.setRenderTarget(t),this.clear&&s.clear()),this.fsQuad.render(s)}setSize(s,t){this.renderTargetA.setSize(s,t),this.renderTargetB.setSize(s,t),this.ripplesMaterial.uniforms.iResolution.value.set(s,t),this.waterMaterial.uniforms.iResolution.value.set(s,t)}dispose(){this.renderTargetA.dispose(),this.renderTargetB.dispose(),this.ripplesMaterial.dispose(),this.waterMaterial.dispose(),this.fsQuad.dispose()}}class he{constructor(s){this.parent=s.parent,this.target=s.target,this.callback=s.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.resolution=new z(this.width,this.height),this.renderer=new Q({powerPreference:"high-performance",alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.scene=new U,this.scene.background=new A("gray"),this.target.appendChild(this.renderer.domElement),this.camera=new G(75,this.aspect,.1,5e4),this.camera.position.set(100,30,100),this.camera.lookAt(new h(0,0,0)),this.control=new I(this.camera,this.renderer.domElement),this.control.enableDamping=!0,this.callback(),this.backgroundInit(),this.composerInit(),this.animation(),this.resize()}backgroundInit(){const t=new E(30,4).toNonIndexed(),e=t.attributes.position.array,i=new Float32Array(e.length);for(let a=0;a<e.length;a+=9){const o=e[a],d=e[a+1],c=e[a+2],p=e[a+3],f=e[a+4],g=e[a+5],v=e[a+6],w=e[a+7],x=e[a+8],r=new h(p-o,f-d,g-c),F=new h(v-o,w-d,x-c),n=new h().crossVectors(r,F).normalize();i.set([n.x,n.y,n.z],a),i.set([n.x,n.y,n.z],a+3),i.set([n.x,n.y,n.z],a+6)}t.setAttribute("normal",new O(i,3));const l=new y({uniforms:{time:{value:0},acceleration:{value:0}},vertexShader:Y,fragmentShader:J,side:V});this.background=new _(t,l),this.background.name="Background",this.scene.add(this.background)}updateNormals(s){this.background.material.uniforms.time.value++;const t=s.attributes.position.array,e=s.attributes.normal.array;for(let i=0;i<t.length;i+=9){const l=t[i],a=t[i+1],o=t[i+2],d=t[i+3],c=t[i+4],p=t[i+5],f=t[i+6],g=t[i+7],v=t[i+8],w=new h(d-l,c-a,p-o),x=new h(f-l,g-a,v-o),r=new h().crossVectors(w,x).normalize();e[i]=r.x,e[i+1]=r.y,e[i+2]=r.z,e[i+3]=r.x,e[i+4]=r.y,e[i+5]=r.z,e[i+6]=r.x,e[i+7]=r.y,e[i+8]=r.z}s.attributes.normal.needsUpdate=!0}composerInit(){this.composer=new N(this.renderer),this.renderPass=new W(this.scene,this.camera),this.outPass=new H,this.rgbShiftPass=new M(j),this.filmPass=new M(X),this.ripplesPass=new oe(this),this.composer.addPass(this.renderPass),this.composer.addPass(this.rgbShiftPass),this.composer.addPass(this.filmPass),this.composer.addPass(this.ripplesPass),this.composer.addPass(this.outPass)}animation(){this.renderer.setAnimationLoop(()=>this.animation()),this.updateNormals(this.background.geometry),this.composer.render()}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.camera.updateProjectionMatrix(),this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.composer.setSize(this.width,this.height),this.renderer.setSize(this.width,this.height)})}destroy(){this.scene.traverse(s=>{var t;s instanceof _&&((t=s.geometry)==null||t.dispose(),Object.values(s.material).forEach(e=>{e&&typeof e.dispose=="function"&&e.dispose()}))}),this.renderer.dispose(),this.composer.dispose()}}const le={class:"ripples"},de={class:"load"},ce={__name:"index",setup(b){const s=P(!1);P(0);let t=null;const e=()=>{s.value=!0};return Z(()=>{t=new he({parent:document.querySelector(".ripples"),target:document.querySelector(".canvas"),callback:e})}),$(()=>{t.destroy(),t=null,console.info("%c涟漪-销毁😁","color:#fff;background-color:red")}),(i,l)=>(k(),R("div",le,[m("div",{class:ae(["loading",{loadOk:s.value}])},[m("div",de,[(k(),R(ee,null,te("LOADING...",(a,o)=>m("span",{key:o,style:se("--i:"+o)},ie(a),5)),64))])],2),l[0]||(l[0]=m("div",{class:"canvas"},null,-1))]))}},fe=K(ce,[["__scopeId","data-v-f0f50bd1"]]);export{fe as default};
