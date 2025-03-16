import{V as u,a9 as U,x as A,W as d,e as p,P as f,w as g,O as R,a2 as C,a3 as S,a4 as w,aa as z,q as E,y as a,f as I,M as i,s as D,G as y,k as O,l as b,ab as K,ac as H}from"./threejs-DBMWHTjA.js";import{M as l,_ as j}from"../lib/index-ChcEMU0S.js";import{P as L,l as k,b as B,m as F,i as T,c as P,d as c,F as G,n as N,p as $,e as W,q as V}from"./vendor-jP0BXN2k.js";const q=""+new URL("../obj/SkullHead-ChT8SaEw.obj",import.meta.url).href,J=""+new URL("../png/noise-QVA7tH9y.png",import.meta.url).href;var X=`attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;

void main(void) {
    
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,Q=`precision highp float;

uniform float time;
uniform float hex;

varying vec2 vUv;
varying vec3 vColor;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec3 rgb = mix(
    convertHsvToRgb(vec3(0.5, 0.8, 0.7)),
    convertHsvToRgb(vec3(0.0, 0.2, 0.95)),
    vUv.y * 4.0 - 1.15
    );

    gl_FragColor = vec4(rgb, 1.0);
}`,Y=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;
uniform float time;
uniform float renderOutline;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

void main(void) {
    
    vec4 mPosition = modelMatrix * vec4(position + normal * renderOutline * 0.5, 1.0);

    float angleToCamera = acos(dot(normalize(cameraPosition), normalize(mPosition.xyz)));

    vPosition = mPosition.xyz;
    vUv = uv;
    vColor = vec3(smoothstep(0.8, 1.0, abs(sin(angleToCamera))));

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,Z=`#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;

uniform float time;
uniform float renderOutline;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    
    vec3 light = normalize(vec3(-1.0, 1.0, 0.2));
    vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    float diff = dot(normal, light);

    float noiseR = texture2D(
    noiseTex,
    normal.yz * 0.2 + vec2(time * 0.02, 0.0)
    ).r * 2.0 - 1.0;
    float noiseG = texture2D(
    noiseTex,
    normal.zx * 0.2 + vec2(0.0, time * 0.02)
    ).g * 2.0 - 1.0;
    float noiseB = texture2D(
    noiseTex,
    normal.xy * 0.2 - time * 0.02
    ).b * 2.0 - 1.0;
    float noise = length(vec3(noiseR, noiseG, noiseB));

    vec3 hsvNoise = vec3(noise * 0.1, noise * 0.1, -noise * 0.1);
    vec3 hsv1 = vec3(0.55, 0.55, 0.8) + hsvNoise;
    vec3 hsv2 = vec3(0.88, 0.55, 1.0) + hsvNoise;
    vec3 rgb = mix(convertHsvToRgb(hsv1), convertHsvToRgb(hsv2), diff);

    vec3 hsv3 = vec3(0.55, 0.05, 0.95);
    vec3 color = (rgb * (1.0 - vColor) + convertHsvToRgb(hsv3) * vColor) * (1.0 - renderOutline);
    vec3 colorOutline = vec3(1.0) * renderOutline;

    gl_FragColor = vec4(color + colorOutline, 1.0);
}`,ee=`attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
}`,te=`precision highp float;

uniform vec2 resolution;
uniform vec2 direction;
uniform float radius;
uniform sampler2D texture;

varying vec2 vUv;

vec4 gaussianBlur(sampler2D texture, vec2 uv, float radius, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 step = radius / resolution * direction;
    color += texture2D(texture, uv + -30.0 * step) * 0.000044463576696752694;
    color += texture2D(texture, uv + -29.0 * step) * 0.00007045416494915056;
    color += texture2D(texture, uv + -28.0 * step) * 0.0001099096126906708;
    color += texture2D(texture, uv + -27.0 * step) * 0.00016880723998699519;
    color += texture2D(texture, uv + -26.0 * step) * 0.00025525396029412817;
    color += texture2D(texture, uv + -25.0 * step) * 0.0003799964739478872;
    color += texture2D(texture, uv + -24.0 * step) * 0.0005569445069582366;
    color += texture2D(texture, uv + -23.0 * step) * 0.0008036541345232365;
    color += texture2D(texture, uv + -22.0 * step) * 0.0011416972770451463;
    color += texture2D(texture, uv + -21.0 * step) * 0.001596823459247415;
    color += texture2D(texture, uv + -20.0 * step) * 0.002198804676697693;
    color += texture2D(texture, uv + -19.0 * step) * 0.0029808483791945177;
    color += texture2D(texture, uv + -18.0 * step) * 0.003978472126807061;
    color += texture2D(texture, uv + -17.0 * step) * 0.005227760816555183;
    color += texture2D(texture, uv + -16.0 * step) * 0.006762976274064666;
    color += texture2D(texture, uv + -15.0 * step) * 0.008613559380852844;
    color += texture2D(texture, uv + -14.0 * step) * 0.010800652851120281;
    color += texture2D(texture, uv + -13.0 * step) * 0.013333369986564198;
    color += texture2D(texture, uv + -12.0 * step) * 0.016205128746770582;
    color += texture2D(texture, uv + -11.0 * step) * 0.01939044575559005;
    color += texture2D(texture, uv + -10.0 * step) * 0.022842624955526088;
    color += texture2D(texture, uv + -9.0 * step) * 0.02649276597348318;
    color += texture2D(texture, uv + -8.0 * step) * 0.030250448423666733;
    color += texture2D(texture, uv + -7.0 * step) * 0.03400631888443281;
    color += texture2D(texture, uv + -6.0 * step) * 0.037636625557126956;
    color += texture2D(texture, uv + -5.0 * step) * 0.0410095302098648;
    color += texture2D(texture, uv + -4.0 * step) * 0.04399280495100364;
    color += texture2D(texture, uv + -3.0 * step) * 0.04646232452009806;
    color += texture2D(texture, uv + -2.0 * step) * 0.048310624731385546;
    color += texture2D(texture, uv + -1.0 * step) * 0.04945474015528432;
    color += texture2D(texture, uv + 0.0 * step) * 0.049842336475142184;
    color += texture2D(texture, uv + 1.0 * step) * 0.04945474015528432;
    color += texture2D(texture, uv + 2.0 * step) * 0.048310624731385546;
    color += texture2D(texture, uv + 3.0 * step) * 0.04646232452009806;
    color += texture2D(texture, uv + 4.0 * step) * 0.04399280495100364;
    color += texture2D(texture, uv + 5.0 * step) * 0.0410095302098648;
    color += texture2D(texture, uv + 6.0 * step) * 0.037636625557126956;
    color += texture2D(texture, uv + 7.0 * step) * 0.03400631888443281;
    color += texture2D(texture, uv + 8.0 * step) * 0.030250448423666733;
    color += texture2D(texture, uv + 9.0 * step) * 0.02649276597348318;
    color += texture2D(texture, uv + 10.0 * step) * 0.022842624955526088;
    color += texture2D(texture, uv + 11.0 * step) * 0.01939044575559005;
    color += texture2D(texture, uv + 12.0 * step) * 0.016205128746770582;
    color += texture2D(texture, uv + 13.0 * step) * 0.013333369986564198;
    color += texture2D(texture, uv + 14.0 * step) * 0.010800652851120281;
    color += texture2D(texture, uv + 15.0 * step) * 0.008613559380852844;
    color += texture2D(texture, uv + 16.0 * step) * 0.006762976274064666;
    color += texture2D(texture, uv + 17.0 * step) * 0.005227760816555183;
    color += texture2D(texture, uv + 18.0 * step) * 0.003978472126807061;
    color += texture2D(texture, uv + 19.0 * step) * 0.0029808483791945177;
    color += texture2D(texture, uv + 20.0 * step) * 0.002198804676697693;
    color += texture2D(texture, uv + 21.0 * step) * 0.001596823459247415;
    color += texture2D(texture, uv + 22.0 * step) * 0.0011416972770451463;
    color += texture2D(texture, uv + 23.0 * step) * 0.0008036541345232365;
    color += texture2D(texture, uv + 24.0 * step) * 0.0005569445069582366;
    color += texture2D(texture, uv + 25.0 * step) * 0.0003799964739478872;
    color += texture2D(texture, uv + 26.0 * step) * 0.00025525396029412817;
    color += texture2D(texture, uv + 27.0 * step) * 0.00016880723998699519;
    color += texture2D(texture, uv + 28.0 * step) * 0.0001099096126906708;
    color += texture2D(texture, uv + 29.0 * step) * 0.00007045416494915056;
    color += texture2D(texture, uv + 30.0 * step) * 0.000044463576696752694;
    return color;
}

void main() {
    vec4 color = gaussianBlur(texture, vUv, radius, resolution, direction);
    gl_FragColor = color;
}`,ne=`attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 vPosition;
varying vec2 vUv;

void main(void) {
    
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    vPosition = position;
    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,re=`precision highp float;

uniform float time;
uniform vec2 direction;
uniform vec2 resolution;
uniform float radius;
uniform sampler2D postEffectTex;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;

const float blurIteration = 12.0;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec4 texColor1 = texture2D(postEffectTex, vUv * 1.05 - 0.025);
    vec4 texColor2 = texture2D(postEffectTex, vUv * vec2(0.8, 0.75) + vec2(0.1, 0.075));
    vec4 texColor3 = texture2D(postEffectTex, vUv * vec2(0.6, 0.55) + vec2(0.2, 0.175));

    float noise1 = texture2D(noiseTex, vUv - vec2(0.0, time * 0.6)).r;
    float noise2 = texture2D(noiseTex, vUv * 2.0 - vec2(0.0, time * 0.7)).g;
    float noise3 = texture2D(noiseTex, vUv * 3.0 + vec2(0.0, time * 0.8)).b;
    float noise = (noise1 * 0.65 + noise2 * 0.3 + noise3 * 0.05);

    float mask1 = (texColor1.r + noise) / 2.0;
    float mask2 = (texColor2.r + (noise * 2.0 - 1.0)) * (1.0 - mask1);
    float mask3 = smoothstep(0.5, 1.0, texColor3.r + noise * 0.5);
    float mask = (mask1 * 2.0 + mask2) / 3.0 * mask3;

    float strength = smoothstep(0.05, 0.17, pow(mask, 3.0));
    vec3 hsv1 = vec3(0.84, 0.4, 0.85);
    vec3 hsv2 = vec3(0.55, 0.05, 0.95);
    vec3 rgb = convertHsvToRgb(mix(hsv1, hsv2, strength));

    float opacity = smoothstep(0.05, 0.055, pow(mask, 3.0));

    if (opacity < 0.01) {
        discard;
    }

    gl_FragColor = vec4(rgb, opacity);
}`,ie=`attribute vec3 position;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;
uniform float duration;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D noiseTex;

varying vec3 vColor;
varying float vAlpha;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    
    float alpha = mod(time - delay, duration) / duration;
    vec3 risePosition = vec3(0.0, alpha * 10.0 - 4.0, 0.0);

    float noiseR = texture2D(
    noiseTex,
    position.yz * 0.4 + vec2(time * 0.02, 0.0)
    ).r * 2.0 - 1.0;
    float noiseG = texture2D(
    noiseTex,
    position.zx * 0.4 + vec2(0.0, time * 0.02)
    ).g * 2.0 - 1.0;
    float noiseB = texture2D(
    noiseTex,
    position.xy * 0.4 - time * 0.02
    ).b * 2.0 - 1.0;
    vec3 noisePosition = vec3(noiseR, noiseG, noiseB) * alpha * 12.0;

    vec4 mvPosition = viewMatrix * modelMatrix * vec4(position + noisePosition + risePosition, 1.0);
    float distanceFromCamera = length(mvPosition.xyz);

    
    float pointSize = 7.0 * pixelRatio * 40.0 / distanceFromCamera * resolution.y / 1024.0;

    vColor = convertHsvToRgb(
    vec3(
    0.55 + delay * 0.33,
    0.8,
    0.4
    )
    );
    vAlpha = alpha;

    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = pointSize;
}`,oe=`precision highp float;

uniform float alpha;

varying vec3 vColor;
varying float vAlpha;

void main() {
    
    vec2 p = gl_PointCoord * 2.0 - 1.0;

    
    float radius = length(p);
    float opacity = smoothstep(0.0, 0.2, vAlpha)
    * (1.0 - smoothstep(0.8, 1.0, vAlpha))
    * (1.0 - smoothstep(0.5, 1.0, radius))
    * 0.6;

    
    vec3 color = vColor;

    gl_FragColor = vec4(color, opacity);
}`;function M(v){return new URL(Object.assign({"../assets/SkullHead.obj":q,"../assets/noise.png":J})[`../assets/${v}`],import.meta.url).href}class ae{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.devicePixelRatio=window.devicePixelRatio,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution=new u(this.width,this.height),this.renderer=new U({powerPreference:"high-performance",alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(0,1),this.target.appendChild(this.renderer.domElement),this.clock=new A,this.time=0,this.radian=0,this.renderTarget1=new d(256,256),this.renderTarget2=new d(256,256),this.cameraInit(),this.assetsInit(),this.paneInit()}paneInit(){this.pane=new L({container:this.parent}),this.controller=this.pane.addFolder({title:"控制台",expanded:!0}),this.controller.addBinding(this,"distance",{min:.1,max:50,step:.01,label:"光环大小"})}cameraInit(){this.scene=new p,this.sceneAura=new p,this.aspect=this.width/this.height,this.camera=new f(50,this.aspect,.1,1e3),this.camera.setFocalLength(50),this.camera.position.set(0,10,40),this.camera.lookAt(new g(0,0,0)),this.cameraAura=new f(50,1,.1,1e3),this.cameraAura.setFocalLength(50),this.distance=Math.abs(Math.tan(l.radians(50)/2)*2)*20*1.55,this.controls=new R(this.camera,this.renderer.domElement),this.controls.enableDamping=!0}async assetsInit(){this.manager=new C,this.noiseTexture=new S(this.manager).load(M("noise.png")),this.noiseTexture.wrapS=w,this.noiseTexture.wrapT=w,this.model=await new z(this.manager).loadAsync(M("SkullHead.obj")),this.skullHead=this.model.children[1].geometry,this.skullJaw=this.model.children[0].geometry,this.manager.onLoad=()=>{console.info("%c资源加载完成!✅","color:#fff;background-color:red"),this.callback(),this.backgroundInit(),this.auraPostEffectInit(),this.skullInit(),this.auraInit(),this.pointsInit(),this.readyInit(),this.animation(),this.resize()}}cameraUpdate(e){this.time+=e,this.cameraAura.position.copy(this.camera.position).normalize().multiplyScalar(this.distance),this.cameraAura.lookAt(new g)}backgroundInit(){const e=new E(100,12,12),t=new a({uniforms:{time:{value:0},hex:{value:0}},vertexShader:X,fragmentShader:Q,side:I});this.background=new i(e,t),this.background.name="Background"}auraPostEffectInit(){const e=new D(2,2),t=new a({uniforms:{resolution:{value:new u(this.width,this.height)},direction:{value:new u(0,0)},radius:{value:1},texture:{value:this.noiseTexture}},vertexShader:ee,fragmentShader:te});this.auraPostEffect=new i(e,t),this.auraPostEffect.name="AuraPostEffect"}skullInit(){this.skull=new y,this.skullMaterial=new a({uniforms:{time:{value:0},renderOutline:{value:0},noiseTex:{value:this.noiseTexture}},vertexShader:Y,fragmentShader:Z}),this.head=new i(this.skullHead,this.skullMaterial),this.jaw=new i(this.skullJaw,this.skullMaterial),this.skull.add(this.head),this.skull.add(this.jaw),this.skull.name="Skull"}skullUpdate(e){this.skullMaterial.uniforms.time.value+=e,this.head.rotation.set(l.radians(-(Math.sin(this.skullMaterial.uniforms.time.value)*.7+.7)*8),0,0),this.jaw.rotation.set(l.radians((Math.sin(this.skullMaterial.uniforms.time.value)*.7+.7)*8),0,0)}auraInit(){const e=new D(20,20),t=new a({uniforms:{time:{value:0},postEffectTex:{value:this.renderTarget1.texture},noiseTex:{value:this.noiseTexture}},vertexShader:ne,fragmentShader:re,transparent:!0});this.aura=new i(e,t),this.aura.name="Aura"}auraUpdate(e){this.aura.rotation.copy(this.camera.rotation),this.aura.material.uniforms.time.value+=e}pointsInit(){const n=new O,h=new b(new Float32Array(360*3),3),o=new b(new Float32Array(360),1);for(var r=0,s=360;r<s;r++){const x=l.radians(Math.random()*360),m=Math.random()*4+1;h.setXYZ(r,Math.cos(x)*m,0,Math.sin(x)*m),o.setX(r,Math.random()*4)}n.setAttribute("position",h),n.setAttribute("delay",o);const _=new a({uniforms:{time:{value:0},duration:{value:4},resolution:{value:new u(this.width,this.height)},pixelRatio:{value:window.devicePixelRatio},noiseTex:{value:this.noiseTexture}},vertexShader:ie,fragmentShader:oe,transparent:!0,blending:K,depthWrite:!1});this.points=new H(n,_),this.points.name="Points"}pointUpdate(e){this.points.material.uniforms.time.value+=e,this.points.rotation.set(0,this.points.material.uniforms.time.value*.2,0)}readyInit(){this.group=new y,this.group.add(this.skull),this.group.add(this.aura),this.group.add(this.points),this.scene.add(this.group),this.scene.add(this.background)}animation(){this.renderer.setAnimationLoop(()=>this.animation());const e=this.clock.getDelta();this.radian+=e,this.controls.update(),this.cameraUpdate(e),this.skullUpdate(e),this.auraUpdate(e),this.pointUpdate(e),this.renderer.setRenderTarget(this.renderTarget1),this.sceneAura.add(this.skull),this.skullMaterial.uniforms.renderOutline.value=1,this.renderer.render(this.sceneAura,this.cameraAura),this.renderer.setRenderTarget(this.renderTarget2),this.sceneAura.remove(this.skull),this.sceneAura.add(this.auraPostEffect),this.auraPostEffect.material.uniforms.direction.value.set(1,0),this.auraPostEffect.material.uniforms.texture.value=this.renderTarget1.texture,this.renderer.render(this.sceneAura,this.cameraAura),this.renderer.setRenderTarget(this.renderTarget1),this.auraPostEffect.material.uniforms.direction.value.set(0,1),this.auraPostEffect.material.uniforms.texture.value=this.renderTarget2.texture,this.renderer.render(this.sceneAura,this.cameraAura),this.renderer.setRenderTarget(null),this.sceneAura.remove(this.auraPostEffect),this.group.add(this.skull),this.skullMaterial.uniforms.renderOutline.value=0,this.renderer.render(this.scene,this.camera)}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.renderer.setSize(this.width,this.height),this.camera.updateProjectionMatrix(),this.points.material.uniforms.resolution.value.copy(this.resolution)})}destroy(){this.scene.traverse(e=>{var t;e instanceof i&&((t=e.geometry)==null||t.dispose(),Object.values(e.material).forEach(n=>{n&&typeof n.dispose=="function"&&n.dispose()}))}),this.renderer.dispose(),this.renderTarget1.dispose(),this.renderTarget2.dispose()}}const se={class:"skull"},ue={class:"load"},le={__name:"index",setup(v){const e=k(!1);k(0);let t=null;const n=()=>{e.value=!0};return B(()=>{t=new ae({parent:document.querySelector(".skull"),target:document.querySelector(".canvas"),callback:n})}),F(()=>{t.destroy(),t=null,console.info("%c头骨-销毁😁","color:#fff;background-color:red")}),(h,o)=>(T(),P("div",se,[c("div",{class:V(["loading",{loadOk:e.value}])},[c("div",ue,[(T(),P(G,null,N("LOADING...",(r,s)=>c("span",{key:s,style:$("--i:"+s)},W(r),5)),64))])],2),o[0]||(o[0]=c("div",{class:"canvas"},null,-1))]))}},xe=j(le,[["__scopeId","data-v-fcfd62b0"]]);export{xe as default};
