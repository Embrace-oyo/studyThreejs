var b=Object.defineProperty;var P=(r,t,e)=>t in r?b(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var c=(r,t,e)=>P(r,typeof t!="symbol"?t+"":t,e);import{H as D,I as _,J as x,L as w,v as U,e as y,P as z,s as l,h,M as o,f as G,K as I,Q as S,X as W,V as j,Y as p,Z as H,_ as E,$ as F,a0 as V,W as B}from"./threejs-R2oN4ICD.js";import{v,l as M,b as O,m as A,i as C,c as k,d as u,F as Z,n as q,p as N,e as Y,q as J}from"./vendor-D10xMT_S.js";import{_ as K}from"../lib/index-CADhc86s.js";var Q=`varying vec2 vUv;

void main() {

    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}`,X=`varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uShowMask;
uniform float uMaskDirection;
uniform bool uMaskHorizontal;
uniform float uStrength;

void main() {

    vec4 color = texture2D(uTexture, vUv);

    float axis = vUv.x;
    float strength = 38.0;

    if (uMaskHorizontal) {
        axis = vUv.y;
        strength = 1.9;
    }

    float alpha = color.a - abs(1.0 * uMaskDirection - axis) * uStrength * uShowMask;
    gl_FragColor = vec4(color.rgb, alpha);

}`,$=`varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    vUv = uv;

    vClipSpace = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipSpace;

}`,ee=`uniform sampler2D uRoadTexture;
uniform sampler2D uReflectionTexture;
uniform float uRepeatY;

varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    vec2 reflectTextureCoords = vec2(ndc.x, 1.0 - ndc.y);

    vec4 reflectionColor = texture2D(uReflectionTexture, reflectTextureCoords);
    vec3 mixedColor = mix(reflectionColor.rgb, vec3(0.0, 0.0, 0.0), 0.7);

    vec2 roadPosition = vec2(vUv.x, vUv.y * uRepeatY);
    vec4 roadColor = texture2D(uRoadTexture, roadPosition);

    vec3 color = roadColor.rgb + mixedColor;

    gl_FragColor = vec4(color.rgb, 1.0);

}`,te=`varying vec4 vClipSpace;

void main() {

    vClipSpace = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipSpace;

}`,ie=`uniform sampler2D uReflectionTexture;
uniform float uOffset;

varying vec4 vClipSpace;

void main() {

    
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    vec2 reflectTextureCoords = vec2(ndc.x, 0.0 + 1.0 - ndc.y);

    vec4 reflectionColor = texture2D(uReflectionTexture, reflectTextureCoords);
    vec3 color = mix(reflectionColor.rgb, vec3(0.07, 0.07, 0.07), 0.7);

    gl_FragColor = vec4(color.rgb, 1.0);

}`,T=`varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    vUv = uv;

    vClipSpace = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_Position = vClipSpace;

}`,L=`uniform sampler2D uWallTexture;
uniform sampler2D uReflectionTexture;
uniform float uRepeatZ;

varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    vec2 reflectTextureCoords = vec2(1.0 - ndc.x, ndc.y);

    vec4 reflectionColor = texture2D(uReflectionTexture, reflectTextureCoords);
    vec3 mixedColor = mix(reflectionColor.rgb, vec3(0.07, 0.07, 0.07), 0.7);

    vec2 wallPosition = vec2(vUv.x * uRepeatZ, vUv.y);
    vec4 wallColor = texture2D(uWallTexture, wallPosition);

    vec3 color = wallColor.rgb + mixedColor;

    gl_FragColor = vec4(color.rgb, 1.0);

}`;const n=4.3,a=100,s=1.65,g=47;class d{constructor(t){this.width=t.width,this.height=t.height,this.renderer=t.renderer,this.target=new B(this.width,this.height),this.texture=this.target.texture}render(t,e,i){i.x&&(e.position.x-=i.x),i.y&&(e.position.y-=i.y),e.rotation.z=-e.rotation.z,this.renderer.setRenderTarget(this.target),this.renderer.clear(),this.renderer.render(t,e),this.renderer.setRenderTarget(null),i.x&&(e.position.x+=i.x),i.y&&(e.position.y+=i.y),e.rotation.z=-e.rotation.z}}class re{constructor(t){c(this,"textureList",[{type:"road",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-1.png"},{type:"road",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-2.png"},{type:"road",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-3.png"},{type:"road",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/road-4.png"},{type:"gate",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-1.png"},{type:"gate",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-2.png"},{type:"gate",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-3.png"},{type:"gate",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/gate-4.png"},{type:"wall",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-1.png"},{type:"wall",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-2.png"},{type:"wall",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-3.png"},{type:"wall",url:"https://res.cloudinary.com/dbo3jfkpl/image/upload/v1519579527/wall-4.png"}]);c(this,"textureListLoader",[]);c(this,"settings",{speed:.06,bloom:.65,strength:.3,radius:0,threshold:0});this.parent=t.parent,this.target=t.target,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.callback=t.callback,this.assetsManage(),this.setupEventListeners(),window.onresize=()=>{this.resize()}}assetsManage(){this.manager=new D,this.textureLoader=new _(this.manager),this.textureLoader.crossOrigin="anonymous",this.textureList.map(t=>{let e=this.textureLoader.load(t.url);t.type==="wall"?(e.wrapS=x,e.minFilter=w):t.type==="road"&&(e.wrapT=x,e.minFilter=w),this.textureListLoader.push(e)}),this.manager.onLoad=()=>{console.log("complete"),this.callback(),this.setRenderer(),this.setReflection(),this.setCamera(),this.createGates(),this.createRoad(),this.createCeiling(),this.createLeftWall(),this.createRightWall(),this.setPostProcessing(),this.animation()}}setRenderer(){this.renderer=new U({antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.renderer.autoClear=!1,this.target.appendChild(this.renderer.domElement),this.scene=new y,this.sceneGates=new y}setReflection(){this.reflectRoad=new d({renderer:this.renderer,width:this.width,height:this.height}),this.reflectLeftWall=new d({renderer:this.renderer,width:this.width,height:this.height}),this.reflectRightWall=new d({renderer:this.renderer,width:this.width,height:this.height}),this.reflectCeiling=new d({renderer:this.renderer,width:this.width,height:this.height})}setCamera(){this.camera=new z(75,this.aspect,.1,1e3),this.camera.position.x=1.035,this.camera.position.y=.5,this.camera.position.z=5}createRoad(){const t=new l(n,a);this.roadMaterial=new h({uniforms:{uRoadTexture:{value:this.textureListLoader[0]},uReflectionTexture:{value:this.reflectRoad.texture},uRepeatY:{value:g}},vertexShader:$,fragmentShader:ee});const e=new o(t,this.roadMaterial);e.position.z=-a/2+5,e.rotation.x=-Math.PI*.5,this.scene.add(e)}createGates(){const t=new l(n,s);this.gateMaterial=new h({uniforms:{uTexture:{value:this.textureListLoader[8]},uShowMask:{value:!0},uMaskDirection:{value:1},uMaskHorizontal:{value:!0},uStrength:{value:1}},transparent:!0,vertexShader:Q,fragmentShader:X});for(let e=0;e<40;e++){const i=new o(t,this.gateMaterial);i.position.y=s*.5,i.position.z=2.86+-2.13*e,this.sceneGates.add(i)}}createCeiling(){const t=new l(n,a),e=new h({uniforms:{uReflectionTexture:{value:this.reflectCeiling.texture}},vertexShader:te,fragmentShader:ie}),i=new o(t,e);i.position.y=s,i.position.z=-a/2+5,i.rotation.x=Math.PI*.5,this.scene.add(i)}createLeftWall(){const t=new l(a,s);this.wallLeftMaterial=new h({uniforms:{uWallTexture:{value:this.textureListLoader[9]},uReflectionTexture:{value:this.reflectLeftWall.texture},uRepeatZ:{value:g}},vertexShader:T,fragmentShader:L});const e=new o(t,this.wallLeftMaterial);e.position.x=-n*.5,e.position.y=s*.5,e.position.z=-a/2+5,e.rotation.y=Math.PI*.5,this.scene.add(e)}createRightWall(){const t=new l(a,s);this.wallRightMaterial=new h({uniforms:{uWallTexture:{value:this.textureListLoader[9]},uReflectionTexture:{value:this.reflectRightWall.texture},uRepeatZ:{value:g}},side:G,vertexShader:T,fragmentShader:L});const e=new o(t,this.wallRightMaterial);e.position.x=n/2,e.position.y=s*.5,e.position.z=-a/2+5,e.rotation.y=Math.PI*.5,this.scene.add(e)}setPostProcessing(){this.composer=new I(this.renderer);const t=new S(this.scene,this.camera),e=new S(this.sceneGates,this.camera);e.clear=!1,this.bloomPass=new W(new j(this.width,this.height),this.settings.strength,this.settings.radius,this.settings.threshold),this.bloomPass.renderToScreen=!0,this.dotScreenPass=new p(H),this.dotScreenPass.uniforms.scale.value=4,this.RGBShiftPass=new p(E),this.RGBShiftPass.uniforms.amount.value=.0015;const i=new p({uniforms:{tDiffuse:{type:"t",value:null},opacity:{type:"f",value:1}},vertexShader:["varying vec2 vUv;","void main() {","vUv = uv;","gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );","}"].join(`
`),fragmentShader:["uniform float opacity;","uniform sampler2D tDiffuse;","varying vec2 vUv;","void main() {","vec4 texel = texture2D( tDiffuse, vUv );","gl_FragColor = opacity * texel;","}"].join(`
`)});i.renderToScreen=!0,new F,this.composer.addPass(t),this.composer.addPass(e),this.composer.addPass(this.bloomPass),this.composer.addPass(i)}swapTextures(){this.currentTextureIndex||(this.currentTextureIndex=0),this.currentTextureIndex=(this.currentTextureIndex+1)%4,this.roadMaterial.uniforms.uRoadTexture.value=this.textureListLoader[this.currentTextureIndex],this.gateMaterial.uniforms.uTexture.value=this.textureListLoader[this.currentTextureIndex+4],this.wallLeftMaterial.uniforms.uWallTexture.value=this.textureListLoader[this.currentTextureIndex+8],this.wallRightMaterial.uniforms.uWallTexture.value=this.textureListLoader[this.currentTextureIndex+8]}update(){this.counter=this.counter||0,this.counter++,this.camera.position.z-=this.settings.speed,this.camera.position.z<-10.9&&(this.camera.position.z=4),this.counter%20===0&&this.swapTextures()}animation(){requestAnimationFrame(()=>this.animation()),this.update(),this.gateMaterial.uniforms.uShowMask.value=!0,this.gateMaterial.uniforms.uMaskDirection.value=0,this.gateMaterial.uniforms.uMaskHorizontal.value=1,this.gateMaterial.uniforms.uStrength.value=2.8,this.reflectRoad.render(this.sceneGates,this.camera,{y:this.camera.position.y*2}),this.gateMaterial.uniforms.uMaskDirection.value=1,this.gateMaterial.uniforms.uStrength.value=12,this.reflectCeiling.render(this.sceneGates,this.camera,{y:(this.camera.position.y-s)*2}),this.gateMaterial.uniforms.uMaskHorizontal.value=0,this.gateMaterial.uniforms.uMaskDirection.value=0,this.gateMaterial.uniforms.uStrength.value=38,this.reflectLeftWall.render(this.sceneGates,this.camera,{x:(this.camera.position.x+n*.5)*2}),this.gateMaterial.uniforms.uMaskDirection.value=1,this.reflectRightWall.render(this.sceneGates,this.camera,{x:(this.camera.position.x-n*.5)*2}),this.gateMaterial.uniforms.uShowMask.value=!1,this.composer?this.composer.render():this.renderer.render(this.scene,this.camera)}guiInit(){this.GUI=new V({container:this.parent}),this.GUI.domElement.style.position="absolute",this.GUI.domElement.style.right="0",this.GUI.domElement.style.top="0",this.GUI.domElement.style.zIndex="999"}setupEventListeners(){this.keyDownHandler=this.keyDownHandler.bind(this),this.keyUpHandler=this.keyUpHandler.bind(this),document.body.addEventListener("keydown",this.keyDownHandler),document.body.addEventListener("keyup",this.keyUpHandler)}keyDownHandler(t){switch(t.keyCode){case 37:case 65:this.switchLane(-1);break;case 38:case 87:this.speedUp();break;case 39:case 68:this.switchLane(1);break}}keyUpHandler(t){(t.keyCode===38||t.keyCode===87)&&this.slowDown()}switchLane(t){v.to(this.camera.position,{x:1.035*t,duration:.3,ease:"sine.out"})}speedUp(){this.isSpeedingUp||(this.isSpeedingUp=!0,v.to(this.settings,{speed:1,duration:15,ease:"sine.out"}))}slowDown(){this.isSpeedingUp=!1,v.to(this.settings,{speed:.05,duration:3,ease:"sine.in"})}resize(){this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.renderer.setSize(this.width,this.height),this.camera.aspect=this.width/this.height,this.camera.updateProjectionMatrix()}destroy(){this.scene.traverse(t=>{var e;t instanceof o&&((e=t.geometry)==null||e.dispose(),Object.values(t.material).forEach(i=>{i&&typeof i.dispose=="function"&&i.dispose()}))}),this.renderer.dispose()}}const ae={class:"neon"},se={class:"load"},ne={__name:"index",setup(r){const t=M(!1);M(0);let e=null;const i=()=>{t.value=!0};return O(()=>{e=new re({parent:document.querySelector(".neon"),target:document.querySelector(".canvas"),callback:i})}),A(()=>{e.destroy(),e=null,console.info("%c霓虹灯-销毁😁","color:#fff;background-color:red")}),(oe,m)=>(C(),k("div",ae,[u("div",{class:J(["loading",{loadOk:t.value}])},[u("div",se,[(C(),k(Z,null,q("LOADING...",(R,f)=>u("span",{key:f,style:N("--i:"+f)},Y(R),5)),64))])],2),m[0]||(m[0]=u("div",{class:"canvas"},null,-1))]))}},de=K(ne,[["__scopeId","data-v-c777e8f4"]]);export{de as default};
