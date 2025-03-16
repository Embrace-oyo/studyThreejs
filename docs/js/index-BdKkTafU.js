import{H as U,x as D,w as l,n as A,W as y,I as C,L as d,U as L,i as G,J as S,K as P,h as b,V as z,Q,v as I,e as E,P as O,O as V,X as N,l as W,f as H,M as R,Y as j,Z as X,_ as Y,$ as _,a0 as $,a1 as J}from"./threejs-DBMWHTjA.js";import{v as K,f as Z,_ as ee}from"../lib/index-ChcEMU0S.js";import{l as M,b as te,m as se,i as k,c as B,d as m,F as ie,n as ae,p as re,e as ne,q as oe}from"./vendor-jP0BXN2k.js";var le=`uniform vec2 iResolution;
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

    if (iMouse.z > 0.0){
        d = smoothstep(4.5, 0.5, length(iMouse.xy - gl_FragCoord.xy));
    } else {
        float t = iTime * 10.0;
        vec2 pos = fract(float(t) * vec2(0.456665, 0.708618)) * iResolution;
        float amp = 1.0 - step(0.25, fract(t));
        d = -amp * smoothstep(4.5, 0.5, length(pos - gl_FragCoord.xy));
    }

    d+= -(p11 - 0.5) * 2.0 + (p10 + p01 + p21 + p12 - 2.0);
    d *= 0.99;
    d *= float(iTime >= 2.0);
    d = d * 0.5 + 0.5;

    gl_FragColor = vec4(d, c.x, 0.0, 0.0);
}`,he=`uniform vec2 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;
uniform sampler2D tDiffuse;
varying vec2 vUv;
void main(){
    vec2 q = vUv * 0.5;
    vec3 e = vec3(vec2(1.0) / iResolution, 0.0);

    float p10 = texture(iChannel0, q - e.zy).x;
    float p01 = texture(iChannel0, q - e.xz).x;
    float p21 = texture(iChannel0, q + e.xz).x;
    float p12 = texture(iChannel0, q + e.zy).x;

    vec3 grad = normalize(vec3(p21 - p01, p12 - p10, 1.0));
    vec4 c = texture(tDiffuse, q * 2.0 + grad.xy * 0.35);
    vec3 light = normalize(vec3(0.2, -0.5, 0.7));
    float diffues = dot(grad, light);
    float spec = pow(max(0.2, -reflect(light, grad).z), 32.0);

    gl_FragColor = mix(c, vec4(0.7, 0.8, 1.0, 1.0), 0.25) * max(diffues, 0.0) + spec;
}`,F=`varying vec2 vUv;

void main() {

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}`;class de extends U{constructor(s){super(),this.base=s,this.width=this.base.width,this.height=this.base.height,this.clock=new D,this.mouse=new l(0,0,0),this.time=null,this.base.target.addEventListener("mousemove",e=>{const t=this.base.target.getBoundingClientRect();this.mouse.x=e.clientX-t.left,this.mouse.y=this.base.height-(e.clientY-t.top),this.mouse.z=1,clearTimeout(this.time),this.time=setTimeout(()=>{this.mouse.z=0,clearTimeout(this.time)},50)}),this.clearColor=new A(0,0,0),this.lowRenderTarget=new y(this.width>>2,this.width>>2,{wrapS:C,wrapT:C,magFilter:d,minFilter:d,type:L,anisotropy:0,colorSpace:G,depthBuffer:!1,stencilBuffer:!1,samples:0}),this.renderTargetA=new y(512,512,{samples:4,type:S,minFilter:d,magFilter:d,format:P}),this.renderTargetA.texture.name="ripples",this.renderTargetB=new y(512,512,{samples:4,type:S,minFilter:d,magFilter:d,format:P}),this.renderTargetB.texture.name="water",this.ripplesMaterial=new b({uniforms:{iResolution:{value:new z(this.width,this.height)},iTime:{value:0},iMouse:{value:this.mouse},iChannel0:{value:null}},vertexShader:F,fragmentShader:le}),this.waterMaterial=new b({uniforms:{iResolution:{value:new z(this.width,this.height)},iTime:{value:0},tDiffuse:{value:null},iChannel0:{value:null}},vertexShader:F,fragmentShader:he}),this.fsQuad=new Q(null),this.base.renderer.setRenderTarget(this.renderTargetA),this.base.renderer.setClearColor(this.clearColor),this.base.renderer.clear(),this.base.renderer.setRenderTarget(null)}render(s,e,t){this.ripplesMaterial.uniforms.iChannel0.value=this.renderTargetA.texture,this.ripplesMaterial.uniforms.iMouse.value=this.mouse,this.ripplesMaterial.uniforms.iTime.value=performance.now()/1e3,this.fsQuad.material=this.ripplesMaterial,this.fsQuad.material.needsUpdate=!0,s.setRenderTarget(this.renderTargetB),this.fsQuad.render(s);const i=this.renderTargetA;this.renderTargetA=this.renderTargetB,this.renderTargetB=i,this.waterMaterial.uniforms.iChannel0.value=this.renderTargetA.texture,this.waterMaterial.uniforms.tDiffuse.value=t.texture,this.fsQuad.material=this.waterMaterial,this.fsQuad.material.needsUpdate=!0,this.renderToScreen?s.setRenderTarget(null):(s.setRenderTarget(e),this.clear&&s.clear()),this.fsQuad.render(s)}setSize(s,e){this.lowRenderTarget.setSize(s>>2,e>>2),this.renderTargetA.setSize(s,e),this.renderTargetB.setSize(s,e),this.width=s,this.height=e,this.ripplesMaterial.uniforms.iResolution.value.set(s,e),this.waterMaterial.uniforms.iResolution.value.set(s,e)}dispose(){this.renderTargetA.dispose(),this.renderTargetB.dispose(),this.ripplesMaterial.dispose(),this.waterMaterial.dispose(),this.fsQuad.dispose()}}class ce{constructor(s){this.parent=s.parent,this.target=s.target,this.callback=s.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.resolution=new z(this.width,this.height),this.renderer=new I({powerPreference:"high-performance",alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.scene=new E,this.scene.background=new A("gray"),this.target.appendChild(this.renderer.domElement),this.camera=new O(75,this.aspect,.1,5e4),this.camera.position.set(100,30,100),this.camera.lookAt(new l(0,0,0)),this.control=new V(this.camera,this.renderer.domElement),this.control.enableDamping=!0,this.callback(),this.backgroundInit(),this.composerInit(),this.animation(),this.resize()}backgroundInit(){const e=new N(30,4).toNonIndexed(),t=e.attributes.position.array,i=new Float32Array(t.length);for(let a=0;a<t.length;a+=9){const o=t[a],c=t[a+1],u=t[a+2],p=t[a+3],f=t[a+4],g=t[a+5],v=t[a+6],w=t[a+7],x=t[a+8],r=new l(p-o,f-c,g-u),q=new l(v-o,w-c,x-u),n=new l().crossVectors(r,q).normalize();i.set([n.x,n.y,n.z],a),i.set([n.x,n.y,n.z],a+3),i.set([n.x,n.y,n.z],a+6)}e.setAttribute("normal",new W(i,3));const h=new b({uniforms:{time:{value:0},acceleration:{value:0}},vertexShader:K,fragmentShader:Z,side:H});this.background=new R(e,h),this.background.name="Background",this.scene.add(this.background)}updateNormals(s){this.background.material.uniforms.time.value++;const e=s.attributes.position.array,t=s.attributes.normal.array;for(let i=0;i<e.length;i+=9){const h=e[i],a=e[i+1],o=e[i+2],c=e[i+3],u=e[i+4],p=e[i+5],f=e[i+6],g=e[i+7],v=e[i+8],w=new l(c-h,u-a,p-o),x=new l(f-h,g-a,v-o),r=new l().crossVectors(w,x).normalize();t[i]=r.x,t[i+1]=r.y,t[i+2]=r.z,t[i+3]=r.x,t[i+4]=r.y,t[i+5]=r.z,t[i+6]=r.x,t[i+7]=r.y,t[i+8]=r.z}s.attributes.normal.needsUpdate=!0}composerInit(){this.composer=new j(this.renderer),this.renderPass=new X(this.scene,this.camera),this.outPass=new Y,this.rgbShiftPass=new _($),this.filmPass=new _(J),this.ripplesPass=new de(this),this.composer.addPass(this.renderPass),this.composer.addPass(this.rgbShiftPass),this.composer.addPass(this.filmPass),this.composer.addPass(this.ripplesPass),this.composer.addPass(this.outPass)}animation(){this.renderer.setAnimationLoop(()=>this.animation()),this.updateNormals(this.background.geometry),this.composer.render()}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.camera.updateProjectionMatrix(),this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.composer.setSize(this.width,this.height),this.renderer.setSize(this.width,this.height)})}destroy(){this.scene.traverse(s=>{var e;s instanceof R&&((e=s.geometry)==null||e.dispose(),Object.values(s.material).forEach(t=>{t&&typeof t.dispose=="function"&&t.dispose()}))}),this.renderer.dispose(),this.composer.dispose()}}const ue={class:"ripples"},me={class:"load"},pe={__name:"index",setup(T){const s=M(!1);M(0);let e=null;const t=()=>{s.value=!0};return te(()=>{e=new ce({parent:document.querySelector(".ripples"),target:document.querySelector(".canvas"),callback:t})}),se(()=>{e.destroy(),e=null,console.info("%c涟漪-销毁😁","color:#fff;background-color:red")}),(i,h)=>(k(),B("div",ue,[m("div",{class:oe(["loading",{loadOk:s.value}])},[m("div",me,[(k(),B(ie,null,ae("LOADING...",(a,o)=>m("span",{key:o,style:re("--i:"+o)},ne(a),5)),64))])],2),h[0]||(h[0]=m("div",{class:"canvas"},null,-1))]))}},we=ee(pe,[["__scopeId","data-v-f0f50bd1"]]);export{we as default};
