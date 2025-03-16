var U=Object.defineProperty;var z=(r,e,i)=>e in r?U(r,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):r[e]=i;var t=(r,e,i)=>z(r,typeof e!="symbol"?e+"":e,i);import{o as f,V as o,e as I,C as B,k as C,l as G,M as S,a7 as N,y as _,w as M,j as y,T as L,L as h,a4 as b,al as c,W as p,I as u,U as m,i as v,D as Y,c as X,am as E,v as O,n as W,P as k,a2 as $,a3 as A,ah as V,an as H,r as j,p as q,Y as Z,Z as J,_ as K}from"./threejs-DBMWHTjA.js";import{v as Q,l as D,b as ee,m as te,i as R,c as P,d as w,F as ae,n as ie,p as re,e as se,q as ne}from"./vendor-jP0BXN2k.js";import{_ as oe}from"../lib/index-ChcEMU0S.js";const he=""+new URL("../png/LDR_RGB1_0-BHt__6eT.png",import.meta.url).href;var x=`precision highp float;
attribute vec2 position;
varying vec2 v_uv;
void main(){
    v_uv=position*0.5+0.5;
    gl_Position=vec4(position, 0.0, 1.0);
}`,ue=`precision highp float;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main(){
    gl_FragColor=texture2D(u_texture, v_uv);
}`,le=`precision highp float;

uniform sampler2D u_lowPaintTexture;
uniform sampler2D u_prevPaintTexture;
uniform vec2 u_paintTexelSize;
uniform vec2 u_scrollOffset;
uniform vec4 u_drawFrom;
uniform vec4 u_drawTo;
uniform float u_pushStrength;
uniform vec3 u_dissipations;
uniform vec2 u_vel;
varying vec2 v_uv;

vec2 sdSegment(in vec2 p, in vec2 a, in vec2 b){
    vec2 pa=p-a;
    vec2 ba=b-a;
    float h=clamp(dot(pa, ba)/dot(ba, ba), 0.0, 1.0);
    return vec2(length(pa-ba*h), h);
}

#ifdef USE_NOISE
uniform float u_curlScale;
uniform float u_curlStrength;

vec2 hash(vec2 p){
    vec3 p3=fract(vec3(p.xyx)*vec3(.1031, .1030, .0973));
    p3+=dot(p3, p3.yzx+33.33);
    return fract((p3.xx+p3.yz)*p3.zy)*2.0-1.0;
}

vec3 noised(in vec2 p){
    vec2 i=floor(p);
    vec2 f=fract(p);
    vec2 u=f*f*f*(f*(f*6.0-15.0)+10.0);
    vec2 du=30.0*f*f*(f*(f-2.0)+1.0);
    vec2 ga=hash(i+vec2(0.0, 0.0));
    vec2 gb=hash(i+vec2(1.0, 0.0));
    vec2 gc=hash(i+vec2(0.0, 1.0));
    vec2 gd=hash(i+vec2(1.0, 1.0));
    float va=dot(ga, f-vec2(0.0, 0.0));
    float vb=dot(gb, f-vec2(1.0, 0.0));
    float vc=dot(gc, f-vec2(0.0, 1.0));
    float vd=dot(gd, f-vec2(1.0, 1.0));
    return vec3(va+u.x*(vb-va)+u.y*(vc-va)+u.x*u.y*(va-vb-vc+vd), ga+u.x*(gb-ga)+u.y*(gc-ga)+u.x*u.y*(ga-gb-gc+gd)+du*(u.yx*(va-vb-vc+vd)+vec2(vb, vc)-va));
}
#endif

void main(){
    vec2 res=sdSegment(gl_FragCoord.xy, u_drawFrom.xy, u_drawTo.xy);
    vec2 radiusWeight=mix(u_drawFrom.zw, u_drawTo.zw, res.y);
    float d=1.0-smoothstep(-0.01, radiusWeight.x, res.x);
    vec4 lowData=texture2D(u_lowPaintTexture, v_uv-u_scrollOffset);
    vec2 velInv=(0.5-lowData.xy)*u_pushStrength;

    #ifdef USE_NOISE
    vec3 noise3=noised(gl_FragCoord.xy*u_curlScale*(1.0-lowData.xy));
    vec2 noise=noised(gl_FragCoord.xy*u_curlScale*(2.0-lowData.xy*(0.5+noise3.x)+noise3.yz*0.1)).yz;
    velInv+=noise*(lowData.z+lowData.w)*u_curlStrength;
    #endif

    vec4 data=texture2D(u_prevPaintTexture, v_uv-u_scrollOffset+velInv*u_paintTexelSize);
    data.xy-=0.5;
    vec4 delta=(u_dissipations.xxyz-1.0)*data;
    vec2 newVel=u_vel*d;
    delta+=vec4(newVel, radiusWeight.yy*d);
    delta.zw=sign(delta.zw)*max(vec2(0.004), abs(delta.zw));
    data+=delta;
    data.xy+=0.5;
    gl_FragColor=clamp(data, vec4(0.0), vec4(1.0));

}`,de=`precision highp float;
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
}`,ce=`precision highp float;

varying vec2 v_uv;
uniform sampler2D u_texture;
uniform sampler2D u_screenPaintTexture;
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_screenPaintTexelSize;
uniform float u_amount;
uniform float u_rgbShift;
uniform float u_multiplier;
uniform float u_colorMultiplier;
uniform float u_shade;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}

void main(){
    vec3 bnoise=getBlueNoise(gl_FragCoord.xy+vec2(17., 29.));
    vec4 data=texture2D(u_screenPaintTexture, v_uv);
    float weight=(data.z+data.w)*0.5;
    vec2 vel=(0.5-data.xy-0.001)*2.*weight;
    vec4 color=vec4(0.0);
    vec2 velocity=vel*u_amount/4.0*u_screenPaintTexelSize*u_multiplier;
    vec2 uv=v_uv+bnoise.xy*velocity;
    for (int i=0;i<9;i++){
        color+=texture2D(u_texture, uv);
        uv+=velocity;
    }
    color/=9.;
    color.rgb+=sin(vec3(vel.x+vel.y)*40.0+vec3(0.0, 2.0, 4.0)*u_rgbShift)*smoothstep(0.4, -0.9, weight)*u_shade*max(abs(vel.x), abs(vel.y))*u_colorMultiplier;
    gl_FragColor=color;
}`;function pe(r,e,i){return E.clamp((i-r)/(e-r),0,1)}function me(r,e,i,a,s,n){return r=pe(e,i,r),a+r*(s-a)}class ve{constructor(e){t(this,"isPass",!0);t(this,"enabled",!0);t(this,"needsSwap",!0);t(this,"clear",!0);t(this,"renderToScreen",!0);t(this,"DOM");t(this,"width",0);t(this,"height",0);t(this,"GUI");t(this,"option",{USE_NOISE:!0,minRadius:0,maxRadius:Math.max(40,this.width/20),radiusDistanceRange:100,velocityDissipation:.975,weight1Dissipation:.95,weight2Dissipation:.8,curlScale:.02,curlStrength:3,accelerationDissipation:.8,pushStrength:25,amount:3,rgbShift:.5,multiplier:5,colorMultiplier:10,shade:1.25});t(this,"fromDrawData",new f(0,0,0,0));t(this,"toDrawData",new f(0,0,0,0));t(this,"_v$4",new o);t(this,"deltaXY",new o);t(this,"mouseXY",new o);t(this,"mousePixelXY",new o);t(this,"prevMousePixelXY",new o);t(this,"_prevMouseXY",new o);t(this,"drawEnabled",!0);t(this,"hadMoved",!1);t(this,"hasMoved",!1);t(this,"prevPaintRenderTarget");t(this,"currPaintRenderTarget");t(this,"lowRenderTarget");t(this,"lowBlurRenderTarget");t(this,"targetScene",new I);t(this,"targetCamera",new B);t(this,"targetMesh");t(this,"isLoad",!1);t(this,"depth");this.base=e,this.target=this.base.target,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.targetGeometry=new C,this.targetGeometry.setAttribute("position",new G(new Float32Array([-1,-1,0,4,-1,0,-1,4,0]),3)),this.targetCamera.position.copy(this.base.camera.position),this.targetMesh=new S(this.targetGeometry),this.targetMesh.frustumCulled=!1,this.dateTime=performance.now(),this.randomMouseXY=new o,this.meshInit(),this.guiInit(),this.t1=new Q.timeline({}),this.randomMouse(),this.timer=setInterval(()=>this.randomMouse(),200,!1)}randomMouse(){this.t1.to(this.randomMouseXY,{x:Math.random()*this.target.offsetWidth,y:Math.random()*this.target.offsetHeight,duration:.5,ease:"power2.inOut",onUpdate:()=>{this.mouseXY.set(this.randomMouseXY.x/this.target.offsetWidth*2-1,1-this.randomMouseXY.y/this.target.offsetHeight*2),this.mousePixelXY.set(this.randomMouseXY.x,this.randomMouseXY.y),this.deltaXY.copy(this.mouseXY).sub(this._prevMouseXY),this._prevMouseXY.copy(this.mouseXY),this.hasMoved=this.deltaXY.length()>0},onComplete:()=>{this.t1.clear()}})}guiInit(){this.GUI=new N({container:this.target}),this.GUI.domElement.style.position="absolute",this.GUI.domElement.style.right="0",this.GUI.domElement.style.top="0",this.GUI.domElement.style.zIndex="999",this.GUI.add(this.option,"USE_NOISE").name("开启噪音").onChange(()=>this.rawShaderMaterial.needsUpdate=!0),this.GUI.add(this.option,"minRadius",0,100,.1).name("最小半径"),this.GUI.add(this.option,"maxRadius",0,100,.1).name("最大半径"),this.GUI.add(this.option,"radiusDistanceRange",50,200,.1).name("半径距离范围"),this.GUI.add(this.option,"velocityDissipation",0,2,.01).name("速度耗散"),this.GUI.add(this.option,"weight1Dissipation",0,2,.01).name("重量1D耗散"),this.GUI.add(this.option,"weight2Dissipation",0,2,.01).name("重量2D耗散"),this.GUI.add(this.option,"curlScale",0,1,.001).name("卷曲尺度"),this.GUI.add(this.option,"curlStrength",0,20,.1).name("卷曲强度"),this.GUI.add(this.option,"pushStrength",0,20,.1).name("推力"),this.GUI.add(this.option,"accelerationDissipation",0,10,.1).name("加速度耗散"),this.GUI.add(this.option,"amount",0,50,1).name("数量"),this.GUI.add(this.option,"rgbShift",0,20,.1).name("RGB移位"),this.GUI.add(this.option,"multiplier",0,20,.1).name("乘数"),this.GUI.add(this.option,"colorMultiplier",0,20,.1).name("颜色倍增器"),this.GUI.add(this.option,"shade",0,20,.1).name("阴影")}async meshInit(){this.rawShaderMaterial=new _({name:"rawShaderMaterial",vertexShader:x,fragmentShader:le,uniforms:{u_lowPaintTexture:{value:null},u_prevPaintTexture:{value:null},u_paintTexelSize:{value:new o},u_drawFrom:{value:new f(0,0,0,0)},u_drawTo:{value:new f(0,0,0,0)},u_pushStrength:{value:0},u_curlScale:{value:0},u_curlStrength:{value:0},u_vel:{value:new o},u_dissipations:{value:new M},u_scrollOffset:{value:new o}},defines:{USE_NOISE:this.option.USE_NOISE},depthTest:!1,depthWrite:!1,blending:y}),this.blurShaderMaterial=new _({name:"blurShaderMaterial",vertexShader:x,fragmentShader:de,uniforms:{u_texture:{value:null},u_delta:{value:new o}},depthWrite:!1,depthTest:!1}),this.copyShaderMaterial=new _({name:"copyShaderMaterial",uniforms:{u_texture:{value:null}},vertexShader:x,fragmentShader:ue,depthTest:!1,depthWrite:!1,blending:y}),this.outShaderMaterial=new _({vertexShader:x,fragmentShader:ce,uniforms:{u_texture:{value:null},u_screenPaintTexture:{value:null},u_screenPaintTexelSize:{value:new o},u_amount:{value:0},u_rgbShift:{value:0},u_multiplier:{value:0},u_colorMultiplier:{value:0},u_shade:{value:0},u_blueNoiseTexture:{value:null},u_blueNoiseLinearTexture:{value:null},u_blueNoiseTexelSize:{value:null},u_blueNoiseCoordOffset:{value:new o}}});let e=new L;e.generateMipmaps=!1,e.minFilter=e.magFilter=h,e.wrapS=e.wrapT=b;let a=this.base.texture.image;e.image=a.image,a.generateMipmaps=!1,a.minFilter=a.magFilter=c,a.wrapS=a.wrapT=b,this.outShaderMaterial.uniforms.u_blueNoiseTexture.value=a,this.outShaderMaterial.uniforms.u_blueNoiseLinearTexture.value=e,this.outShaderMaterial.uniforms.u_blueNoiseTexelSize.value=new o(1/128,1/128),this.isLoad=!0;let s=this.width>>2,n=this.height>>2,l=this.width>>3,d=this.height>>3;this.rawShaderMaterial.uniforms.u_paintTexelSize.value.set(1/s,1/n),this.rawShaderMaterial.uniforms.u_vel.value.set(0,0),this.prevPaintRenderTarget=new p(s,n,{wrapS:u,wrapT:u,magFilter:h,minFilter:h,type:m,anisotropy:0,colorSpace:v,depthBuffer:!1,stencilBuffer:!1,samples:0}),this.currPaintRenderTarget=new p(s,n,{wrapS:u,wrapT:u,magFilter:h,minFilter:h,type:m,anisotropy:0,colorSpace:v,depthBuffer:!1,stencilBuffer:!1,samples:0}),this.lowRenderTarget=new p(l,d,{wrapS:u,wrapT:u,magFilter:h,minFilter:h,type:m,anisotropy:0,colorSpace:v,depthBuffer:!1,stencilBuffer:!1,samples:0}),this.lowBlurRenderTarget=new p(l,d,{wrapS:u,wrapT:u,magFilter:h,minFilter:h,type:m,anisotropy:0,colorSpace:v,depthBuffer:!1,stencilBuffer:!1,samples:0}),this.sceneFlatRenderTarget=new p(this.width,this.height,{wrapS:u,wrapT:u,magFilter:s?c:h,minFilter:s?c:h,type:m,anisotropy:0,colorSpace:v,depthBuffer:!1,stencilBuffer:!1,samples:8}),this.sceneFlatRenderTarget.depthBuffer=!0,this.depth=new Y(this.width,this.height),this.depth.type=X,this.depth.minFilter=c,this.depth.magFilter=c,this.sceneFlatRenderTarget.depthTexture=this.depth}frameOne(e,i,a){let s=performance.now(),n=(s-this.dateTime)/1e3;this.dateTime=s,n=Math.min(n,1/20),this.outShaderMaterial.uniforms.u_blueNoiseCoordOffset.value.set(Math.random(),Math.random()),this.rawShaderMaterial.needsUpdate=!0,this.rawShaderMaterial.uniforms.u_drawTo.value=this.toDrawData,this.rawShaderMaterial.uniforms.u_drawFrom.value=this.fromDrawData;let l=this.prevPaintRenderTarget;this.prevPaintRenderTarget=this.currPaintRenderTarget,this.currPaintRenderTarget=l,this.rawShaderMaterial.uniforms.u_prevPaintTexture.value=this.prevPaintRenderTarget.texture,this.rawShaderMaterial.uniforms.u_lowPaintTexture.value=this.lowRenderTarget.texture;let d=this.width>>2,T=this.height>>2;this._v$4.copy(this.mousePixelXY);let F=this._v$4.distanceTo(this.prevMousePixelXY),g=me(F,0,this.option.radiusDistanceRange,this.option.minRadius,this.option.maxRadius);(!this.hadMoved||!this.drawEnabled)&&(g=0),g=g/this.height*T,this.rawShaderMaterial.uniforms.u_pushStrength.value=this.option.pushStrength,this.rawShaderMaterial.uniforms.u_curlScale.value=this.option.curlScale,this.rawShaderMaterial.uniforms.u_curlStrength.value=this.option.curlStrength,this.rawShaderMaterial.uniforms.u_dissipations.value.set(this.option.velocityDissipation,this.option.weight1Dissipation,this.option.weight2Dissipation),this.fromDrawData.copy(this.toDrawData),this._v$4.copy(this.mouseXY),this.toDrawData.set((this._v$4.x+1)*d/2,(this._v$4.y+1)*T/2,g,1),this._v$4.set(this.toDrawData.x-this.fromDrawData.x,this.toDrawData.y-this.fromDrawData.y).multiplyScalar(n*.8),this.rawShaderMaterial.uniforms.u_vel.value.multiplyScalar(this.option.accelerationDissipation).add(this._v$4),this.targetMesh.material=this.rawShaderMaterial,this.targetMesh.material.needsUpdate=!0,e.setRenderTarget(this.currPaintRenderTarget),e.render(this.targetMesh,this.targetCamera),this.targetMesh.material=this.copyShaderMaterial,this.targetMesh.material.needsUpdate=!0,this.copyShaderMaterial.uniforms.u_texture.value=this.currPaintRenderTarget.texture,e.setRenderTarget(this.lowRenderTarget),e.render(this.targetMesh,this.targetCamera),this.prevMousePixelXY.copy(this.mousePixelXY),this.hadMoved=this.hasMoved,this.deltaXY.set(0,0)}frameTwo(e){this.blurShaderMaterial.uniforms.u_texture.value=this.lowRenderTarget.texture,this.blurShaderMaterial.uniforms.u_delta.value.set(8/this.lowRenderTarget.width*.25,0),this.targetMesh.material=this.blurShaderMaterial,this.targetMesh.material.needsUpdate=!0,e.setRenderTarget(this.lowBlurRenderTarget),e.render(this.targetMesh,this.targetCamera),this.blurShaderMaterial.uniforms.u_texture.value=this.lowBlurRenderTarget.texture,this.blurShaderMaterial.uniforms.u_delta.value.set(0,8/this.lowRenderTarget.height*.25),e.setRenderTarget(this.lowRenderTarget),e.render(this.targetMesh,this.targetCamera)}frameThree(e,i,a){this.outShaderMaterial.uniforms.u_blueNoiseCoordOffset.value.set(Math.random(),Math.random()),this.outShaderMaterial.uniforms.u_amount.value=this.option.amount,this.outShaderMaterial.uniforms.u_rgbShift.value=this.option.rgbShift,this.outShaderMaterial.uniforms.u_multiplier.value=this.option.multiplier,this.outShaderMaterial.uniforms.u_colorMultiplier.value=this.option.colorMultiplier,this.outShaderMaterial.uniforms.u_shade.value=this.option.shade,this.outShaderMaterial.uniforms.u_screenPaintTexelSize.value=this.rawShaderMaterial.uniforms.u_paintTexelSize.value,this.outShaderMaterial.uniforms.u_screenPaintTexture.value=this.currPaintRenderTarget.texture,this.copyShaderMaterial.uniforms.u_texture.value=this.lowRenderTarget.texture,this.targetMesh.material=this.copyShaderMaterial,this.targetMesh.material.needsUpdate=!0,e.setRenderTarget(this.sceneFlatRenderTarget),e.render(this.targetMesh,this.targetCamera),this.outShaderMaterial.uniforms.u_texture.value=a.texture}render(e,i,a){this.isLoad&&(this.frameOne(e,i,a),this.frameTwo(e),this.frameThree(e,i,a),this.renderToScreen?(e.setRenderTarget(null),this.targetMesh.material=this.outShaderMaterial,this.targetMesh.material.needsUpdate=!0,e.render(this.targetMesh,this.targetCamera)):(e.setRenderTarget(i),this.clear&&e.clear(),this.targetMesh.material=this.outShaderMaterial,this.targetMesh.material.needsUpdate=!0,e.render(this.targetMesh,this.targetCamera)))}setSize(e,i){if(!this.isLoad)return;this.width=e,this.height=i,this.aspect=e/i;let a=this.width>>2,s=this.height>>2,n=this.width>>3,l=this.height>>3;this.rawShaderMaterial.uniforms.u_paintTexelSize.value.set(1/a,1/s),this.prevPaintRenderTarget.setSize(a,s),this.currPaintRenderTarget.setSize(a,s),this.lowRenderTarget.setSize(n,l),this.lowBlurRenderTarget.setSize(n,l),this.sceneFlatRenderTarget.setSize(e,i)}dispose(){this.rawShaderMaterial.dispose(),this.blurShaderMaterial.dispose(),this.copyShaderMaterial.dispose(),this.outShaderMaterial.dispose(),this.prevPaintRenderTarget.dispose(),this.currPaintRenderTarget.dispose(),this.lowRenderTarget.dispose(),this.lowBlurRenderTarget.dispose(),this.sceneFlatRenderTarget.dispose(),this.depth.dispose(),this.targetMesh.geometry.dispose(),clearInterval(this.timer)}}function ge(r){return new URL(Object.assign({"../assets/LDR_RGB1_0.png":he})[`../assets/${r}`],import.meta.url).href}class fe{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.renderer=new O({powerPreference:"high-performance",antialias:!1,alpha:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.target.appendChild(this.renderer.domElement),this.scene=new I,this.scene.background=new W("#464646"),this.camera=new k(75,this.aspect,.01,1e3),this.camera.position.copy(new M(0,0,2)),this.camera.lookAt(new M(0,0,0)),this.camera.updateProjectionMatrix(),this.scene.add(this.camera),this.assetsInit(),this.resize()}async assetsInit(){this.manager=new $,this.texture=await new A(this.manager).load(ge("LDR_RGB1_0.png")),this.manager.onLoad=async()=>{console.info("%c资源加载完成!✅","color:#fff;background-color:red"),this.callback(),this.geometryInit(),this.composerInit(),this.animation()}}geometryInit(){const e=new V(16777215,3);e.position.set(1,1,1),this.scene.add(new H(13421772)),this.scene.add(e);const i=new j(1,1,1),a=new q({color:12698049});this.cube=new S(i,a),this.scene.add(this.cube)}composerInit(){this.composer=new Z(this.renderer),this.renderPass=new J(this.scene,this.camera),this.fluidPass=new ve(this),this.fluidPass.renderToScreen=!1,this.outPass=new K,this.composer.addPass(this.renderPass),this.composer.addPass(this.fluidPass),this.composer.addPass(this.outPass)}animation(){this.renderer.setAnimationLoop(()=>this.animation()),this.cube.rotation.x+=.005,this.cube.rotation.y+=.01,this.composer.render()}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height)})}destroy(){this.scene.traverse(e=>{var i;e instanceof S&&((i=e.geometry)==null||i.dispose(),Object.values(e.material).forEach(a=>{a&&typeof a.dispose=="function"&&a.dispose()}))}),this.composer.dispose(),this.renderer.dispose()}}const _e={class:"fluid"},we={class:"load"},xe={__name:"index",setup(r){const e=D(!1);D(0);let i=null;const a=()=>{e.value=!0};return ee(()=>{i=new fe({parent:document.querySelector(".dissipate"),target:document.querySelector(".canvas"),callback:a})}),te(()=>{i.destroy(),i=null,console.info("%c流体效果-销毁😁","color:#fff;background-color:red")}),(s,n)=>(R(),P("div",_e,[w("div",{class:ne(["loading",{loadOk:e.value}])},[w("div",we,[(R(),P(ae,null,ie("LOADING...",(l,d)=>w("span",{key:d,style:re("--i:"+d)},se(l),5)),64))])],2),n[0]||(n[0]=w("div",{class:"canvas"},null,-1))]))}},be=oe(xe,[["__scopeId","data-v-cdf4ac27"]]);export{be as default};
