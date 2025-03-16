import{V as w,v as C,e as k,P as I,x as F,w as l,a2 as K,a3 as G,a4 as _,K as L,aq as X,al as P,s as g,y as f,M as u,X as S,ab as N,g as M,aF as O,aG as d,aH as j,t as Y,aI as B,aJ as $,u as V,aK as Z,aL as W,W as D,ap as q,aj as z}from"./threejs-DBMWHTjA.js";import{M as y,_ as Q}from"../lib/index-ChcEMU0S.js";import{l as R,b as J,m as ee,i as H,c as A,d as E,F as te,n as ne,p as ie,e as oe,q as re}from"./vendor-jP0BXN2k.js";const se=""+new URL("../jpg/noise-e6AtwKHs.jpg",import.meta.url).href;var ae=`attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec2 vUv;

void main() {
    
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,ce=`precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D noiseTex;
varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 updateUv = vec2(
    vUv.x * min(resolution.x / resolution.y, 1.0) + max(1.0 - resolution.x / resolution.y, 0.0) / 2.0,
    vUv.y * min(resolution.y / resolution.x, 1.0) + max(1.0 - resolution.y / resolution.x, 0.0) / 2.0
    );
    vec2 p = updateUv * 2.0 - 1.0;
    vec4 texColor1 = texture2D(noiseTex, updateUv + vec2(0.0, time * 0.01));
    vec4 texColor2 = texture2D(noiseTex, updateUv - vec2(0.0, time * 0.02));
    vec3 hsv1 = vec3(0.5 + time * 0.1 + vUv.y * 0.2, 0.4, 0.05);
    vec3 hsv2 = vec3(0.0 + time * 0.1 + vUv.y * 0.2, 0.4, 0.4);
    float hsvAlpha = pow((texColor1.r + texColor2.g) / 2.0, 3.0) * 2.0;
    vec3 color = convertHsvToRgb(mix(hsv1, hsv2, hsvAlpha) - (1.0 - smoothstep(0.0, 1.0, length(p))) * 0.3);

    gl_FragColor = vec4(color, 1.0);
}`,le=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;

varying vec2 vUv;
varying float vEdge;

void main(void) {
    
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    float angleToCamera = acos(dot(normalize(cameraPosition), normal));

    vUv = uv;
    vEdge = smoothstep(0.4, 1.0, abs(sin(angleToCamera)));

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,ve=`precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;
varying float vEdge;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float noise1 = texture2D(noiseTex, vUv + vec2(time * 0.1, 0.0)).r;
    float noise2 = texture2D(noiseTex, vUv + vec2(time * -0.1, 0.0)).g;
    vec3 hsv = vec3(
    (noise1 + noise2) * 0.35 + time * 0.1,
    1.0 - vEdge,
    0.02 + vEdge * 0.98
    );
    vec3 rgb = convertHsvToRgb(hsv);

    gl_FragColor = vec4(rgb, 1.0);
}`,he=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform vec3 cameraPosition;

varying vec2 vUv;

void main(void) {
    
    vec4 mPosition = modelMatrix * vec4(position, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,ue=`precision highp float;

uniform float time;
uniform sampler2D noiseTex;
varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float noise1 = texture2D(noiseTex, vUv * 0.25 + vec2(time * 0.1, 0.0)).r;
    float noise2 = texture2D(noiseTex, vUv * 0.25 + vec2(time * -0.1, 0.0)).g;
    float noise = (noise1 + noise2) / 2.0;
    vec3 hsv = vec3(
    noise * 0.5 + time * 0.1,
    0.7,
    0.7
    );
    vec3 rgb = convertHsvToRgb(hsv) * (1.0 - smoothstep(0.4, 1.0, length(p))) + (1.0 - smoothstep(0.67, 0.74, length(p)));
    float opacity = 1.0 - smoothstep(0.9, 1.0, length(p));

    if (opacity < 0.01) discard;

    gl_FragColor = vec4(rgb, opacity);
}`,me=`attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float time;
uniform sampler2D noiseTex;
uniform vec3 acceleration;

varying vec2 vUv;

void main(void) {
    float noise1 = texture2D(noiseTex, uv * 0.25 + vec2(0.1, -0.1) * time).r;
    float noise2 = texture2D(noiseTex, uv * 0.25 + vec2(-0.1, -0.1) * time).g;
    float noise = (noise1 + noise2) * 0.5 * (1.0 - min(length(acceleration) / 5.0, 1.0));

    vec3 transformed = vec3(position + normalize(position) * smoothstep(0.2, 1.0, noise) * 15.0);

    vec4 mPosition = modelMatrix * vec4(transformed, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,fe=`precision highp float;

uniform float time;
uniform sampler2D noiseTex;
uniform vec3 acceleration;

varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    float noise1 = texture2D(noiseTex, vUv * vec2(1.0, 0.5) + vec2(0.4, -0.3) * time).r;
    float noise2 = texture2D(noiseTex, vUv * vec2(1.0, 0.5) + vec2(-0.4, -0.6) * time).g;
    float noise3 = texture2D(noiseTex, vUv * vec2(1.0, 0.5) + vec2(0.0, -0.6) * time).b;
    float noise = (noise1 + noise2) / 2.0 * smoothstep(0.0, 0.15, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
    noise = smoothstep(0.5 - min(length(acceleration) / 5.0, 1.0) * 0.15, 1.0, noise);
    vec3 hsv = vec3(
    noise * 0.5 + time * 0.1 + noise3 * 0.4,
    0.7 - noise * 3.0,
    0.6 + noise * 0.6
    );
    vec3 rgb = convertHsvToRgb(hsv);
    float opacity = noise;

    if (opacity < 0.01) discard;

    gl_FragColor = vec4(rgb, opacity);
}`,de=`attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec3 iDirection;
attribute float iTime;
attribute float iDuration;
attribute float iDistance;
attribute float iScale;
attribute vec3 iRotate;
attribute vec2 iUvDiff;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec2 vUv;
varying vec2 vUvDiff;
varying float vOpacity;
varying float vStep;

mat4 calcRotateMat4X(float radian) {
    return mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, cos(radian), -sin(radian), 0.0,
    0.0, sin(radian), cos(radian), 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

mat4 calcRotateMat4Y(float radian) {
    return mat4(
    cos(radian), 0.0, sin(radian), 0.0,
    0.0, 1.0, 0.0, 0.0,
    -sin(radian), 0.0, cos(radian), 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

mat4 calcRotateMat4Z(float radian) {
    return mat4(
    cos(radian), -sin(radian), 0.0, 0.0,
    sin(radian), cos(radian), 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

mat4 calcRotateMat4(vec3 radian) {
    return calcRotateMat4X(radian.x) * calcRotateMat4Y(radian.y) * calcRotateMat4Z(radian.z);
}

mat4 calcScaleMat4(vec3 scale) {
    return mat4(
    scale.x, 0.0, 0.0, 0.0,
    0.0, scale.y, 0.0, 0.0,
    0.0, 0.0, scale.z, 0.0,
    0.0, 0.0, 0.0, 1.0
    );
}

void main(void) {
    float stp = iTime / iDuration;

    mat4 rotateMat = calcRotateMat4(iRotate * time * 2.0);
    mat4 scaleMat = calcScaleMat4(vec3(iScale));
    vec3 transformed = position + vec3(cos(time * 3.0) * 6.0 * stp, 0.0, sin(time * 3.0) * 6.0 * stp);
    transformed = (rotateMat * scaleMat * vec4(transformed, 1.0)).xyz;
    transformed = transformed + iPosition + iDirection * iDistance * stp;
    vec4 mPosition = modelMatrix * vec4(transformed, 1.0);

    vUv = uv;
    vUvDiff = iUvDiff;
    vOpacity = step(0.0, iTime);
    vStep = stp;

    gl_Position = projectionMatrix * viewMatrix * mPosition;
}`,pe=`precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;
varying vec2 vUvDiff;
varying float vOpacity;
varying float vStep;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    vec2 p = vUv * 2.0 - 1.0;

    float noise = texture2D(noiseTex, (vUv + vUvDiff) * 0.25 + time * 0.1).r * 2.0 - 1.0;
    float stp = smoothstep(0.25, 1.0, vStep);
    noise = smoothstep(0.0 + stp, 0.2 + stp, noise * (1.0 - length(p)));
    float noise2 = texture2D(noiseTex, (vUv + vUvDiff) * 0.125 + time * 0.1).g;

    vec3 hsv = vec3(
    noise2 * 0.5 + time * 0.1,
    0.4 - stp * 5.0,
    0.95
    );
    vec3 rgb = convertHsvToRgb(hsv);
    float opacity = noise * vOpacity;

    gl_FragColor = vec4(rgb, opacity);
}`,xe=`precision highp float;

#define MAX_BONES 1024

attribute vec3 position;
attribute vec2 uv;
attribute vec4 skinIndex;
attribute vec4 skinWeight;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform mat4 bindMatrix;
uniform mat4 bindMatrixInverse;
uniform highp sampler2D boneTexture;
uniform int boneTextureSize;

uniform float time;
uniform sampler2D noiseTex;
uniform vec3 acceleration;
uniform mat4 boneMatrices[20];

mat4 getBoneMatrix(const in float i) {
    float j = i * 4.0;
    float x = mod(j, float(boneTextureSize));
    float y = floor(j / float(boneTextureSize));
    float dx = 1.0 / float(boneTextureSize);
    float dy = 1.0 / float(boneTextureSize);

    y = dy * (y + 0.5);

    vec4 v1 = texture2D(boneTexture, vec2(dx * (x + 0.5), y));
    vec4 v2 = texture2D(boneTexture, vec2(dx * (x + 1.5), y));
    vec4 v3 = texture2D(boneTexture, vec2(dx * (x + 2.5), y));
    vec4 v4 = texture2D(boneTexture, vec2(dx * (x + 3.5), y));
    mat4 bone = mat4(v1, v2, v3, v4);

    return bone;
}

varying vec2 vUv;

void main() {
    float noise1 = texture2D(noiseTex, uv + vec2(0.4, -0.8) * time).r;
    float noise2 = texture2D(noiseTex, uv + vec2(-0.4, -1.4) * time).g;
    float noise = ((noise1 + noise2) - 1.0) * (uv.y * 0.9 + 0.1) * min(length(acceleration) / 3.0, 1.0);

    vec3 transformed = vec3(position + normalize(position) * vec3(1.0, 0.0, 1.0) * noise * 40.0);

    vec4 skinVertex = bindMatrix * vec4(transformed, 1.0);
    vec4 skinned = vec4(0.0);

    
    for (int i = 0; i < 4; i++) {
        int index = int(skinIndex[i]);
        float weight = skinWeight[i];

        
        skinned += weight * (boneMatrices[index] * vec4(position, 1.0));
    }

    transformed = (bindMatrixInverse * skinned).xyz;

    vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);

    vUv = uv;

    gl_Position = projectionMatrix * mvPosition;
}`,ge=`precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;

vec3 convertHsvToRgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
    float noise1 = texture2D(noiseTex, vUv + vec2(0.4, -1.6) * time).r;
    float noise2 = texture2D(noiseTex, vUv + vec2(-0.4, -2.4) * time).g;
    float noise3 = texture2D(noiseTex, vUv + vec2(0.0, -0.6) * time).b;
    float noise = (noise1 + noise2) / 2.0 * (1.0 - vUv.y) * smoothstep(0.0, 0.05, vUv.y);
    noise = smoothstep(0.3, 1.0, noise);
    vec3 hsv = vec3(
    noise * 0.5 + time * 0.1 + noise3 * 0.4,
    0.7 - noise * 3.0,
    0.6 + noise * 0.6
    );
    vec3 rgb = convertHsvToRgb(hsv);
    float opacity = noise;

    if (opacity < 0.01) discard;

    gl_FragColor = vec4(rgb, opacity);
}`,ye=`attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}`,be=`precision highp float;

uniform float minBright;
uniform sampler2D texture;

varying vec2 vUv;

void main() {
    vec4 bright = max(vec4(0.0), (texture2D(texture, vUv) - minBright));
    gl_FragColor = bright;
}`,Te=`attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}`,we=`precision highp float;

uniform vec2 resolution;
uniform vec2 direction;
uniform sampler2D texture;

varying vec2 vUv;

vec4 gaussianBlur(sampler2D texture, vec2 uv, float radius, vec2 resolution, vec2 direction) {
    vec4 color = vec4(0.0);
    vec2 step = radius / resolution * direction;
    color += texture2D(texture, uv - 4.0 * step) * 0.02699548325659403;
    color += texture2D(texture, uv - 3.0 * step) * 0.06475879783294587;
    color += texture2D(texture, uv - 2.0 * step) * 0.12098536225957168;
    color += texture2D(texture, uv - 1.0 * step) * 0.17603266338214976;
    color += texture2D(texture, uv) * 0.19947114020071635;
    color += texture2D(texture, uv + 1.0 * step) * 0.17603266338214976;
    color += texture2D(texture, uv + 2.0 * step) * 0.12098536225957168;
    color += texture2D(texture, uv + 3.0 * step) * 0.06475879783294587;
    color += texture2D(texture, uv + 4.0 * step) * 0.02699548325659403;
    return color;
}

void main() {
    vec4 color = gaussianBlur(texture, vUv, 1.0, resolution, direction);
    gl_FragColor = color;
}`,Ee=`attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main() {
    vUv = uv;

    gl_Position = vec4(position, 1.0);
}`,Ue=`precision highp float;

uniform sampler2D texture1;
uniform sampler2D texture2;

varying vec2 vUv;

void main() {
    vec4 color1 = texture2D(texture1, vUv);
    vec4 color2 = texture2D(texture2, vUv);
    gl_FragColor = color1 + color2;
}`;function Me(U){return new URL(Object.assign({"../assets/texture/noise.jpg":se})[`../assets/${U}`],import.meta.url).href}class De{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.devicePixelRatio=window.devicePixelRatio,this.width=this.target.offsetWidth*this.devicePixelRatio,this.height=this.target.offsetHeight*this.devicePixelRatio,this.resolution=new w(this.width,this.height),this.aspect=this.width/this.height,this.renderer=new C({powerPreference:"high-performance",antialias:!1,stencil:!1,depth:!1,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(921102,1),this.target.appendChild(this.renderer.domElement),this.scene=new k,this.camera=new I(50,this.aspect,.1,5e3),this.clock=new F,this.vTouch=new w,this.acceleration=new l,this.anchor=new l,this.isTouched=!1,this.assetsInit()}cameraStart(){this.camera.far=5e3,this.camera.setFocalLength(50),this.camera.position.set(0,0,130),this.camera.lookAt(new l)}cameraUpdate(e){this.camera.time+=e}cameraResize(){this.camera.aspect=this.resolution.x/this.resolution.y,this.camera.updateProjectionMatrix(),this.camera.position.z=this.aspect<1?150:120}assetsInit(){this.manager=new K,this.noiseTexture=new G(this.manager).load(Me("texture/noise.jpg")),this.noiseTexture.wrapS=_,this.noiseTexture.wrapT=_,this.noiseTexture.format=L,this.noiseTexture.type=X,this.noiseTexture.minFilter=P,this.noiseTexture.magFilter=P,this.manager.onLoad=()=>{console.info("%c资源加载完成!✅","color:#fff;background-color:red"),this.callback(),this.backgroundInit(),this.coreInit(),this.coreLightInit(),this.auraInit(),this.sparksInit(),this.trailInit(),this.cameraStart(),this.postEffectInit(),this.postEffectBrightInit(),this.postEffectBlurInit(),this.postEffectBloomInit(),this.animation(),this.resize(),this.addEventListener(),this.play()}}backgroundInit(){const e=new g(1,1),t=new f({uniforms:{time:{value:0},resolution:{value:this.resolution},noiseTex:{value:this.noiseTexture}},vertexShader:ae,fragmentShader:ce});this.background=new u(e,t),this.background.name="Background",this.background.position.z=-1e3,this.scene.add(this.background),this.backgroundResize()}backgroundUpdate(e){this.background.material.uniforms.time.value+=e}backgroundResize(){const e=Math.abs((this.camera.position.z-this.background.position.z)*Math.tan(y.radians(this.camera.fov)/2)*2),t=e*this.camera.aspect;this.background.scale.set(t,e,1),this.background.material.uniforms.resolution.value.copy(this.resolution)}coreInit(){const e=new S(10,6),t=new f({uniforms:{time:{value:0},noiseTex:{value:this.noiseTexture}},vertexShader:le,fragmentShader:ve});this.core=new u(e,t),this.core.name="Core",this.scene.add(this.core)}applyDrag(e){const t=this.acceleration.clone();t.multiplyScalar(-1),t.normalize(),t.multiplyScalar(this.acceleration.length()*e),this.acceleration.add(t)}applyHook(e,t){const n=this.core.position.clone().sub(this.anchor),i=n.length()-e;n.normalize(),n.multiplyScalar(-1*t*i),this.acceleration.add(n)}coreUpdate(e){this.core.material.uniforms.time.value+=e,this.applyHook(0,.2),this.applyDrag(.6),this.core.position.add(this.acceleration),this.core.lookAt(this.camera.position)}coreLightInit(){const e=new g(30,30),t=new f({uniforms:{time:{value:0},noiseTex:{value:this.noiseTexture},acceleration:{value:new l}},vertexShader:he,fragmentShader:ue,transparent:!0,blending:N});this.coreLight=new u(e,t),this.coreLight.name="CoreLight",this.scene.add(this.coreLight)}coreLightUpdate(e){this.coreLight.material.uniforms.time.value+=e,this.coreLight.material.uniforms.acceleration.value.copy(this.acceleration),this.coreLight.position.copy(this.core.position)}auraInit(){const e=new S(10.1,10),t=new f({uniforms:{time:{value:0},noiseTex:{value:this.noiseTexture},acceleration:{value:new l}},vertexShader:me,fragmentShader:fe,side:M});this.aura=new u(e,t),this.aura.name="Aura",this.scene.add(this.aura)}auraUpdate(e){this.aura.material.uniforms.time.value+=e,this.aura.material.uniforms.acceleration.value.copy(this.acceleration),this.aura.position.copy(this.core.position)}sparksInit(){this.COUNT=400;const e=new O,t=new g(1,1);e.copy(t);const n=new d(new Float32Array(this.COUNT*3),3),i=new d(new Float32Array(this.COUNT*3),3),r=new d(new Float32Array(this.COUNT),1),o=new d(new Float32Array(this.COUNT),1),a=new d(new Float32Array(this.COUNT),1),c=new d(new Float32Array(this.COUNT),1),m=new d(new Float32Array(this.COUNT*3),3),v=new d(new Float32Array(this.COUNT*2),2);for(let s=0,h=this.COUNT;s<h;s++){const p=y.radians((Math.random()*2-1)*75),T=y.radians(Math.random()*360),x=y.spherical(p,T,1);n.setXYZ(s,x[0]*5,x[1]*5,x[2]*5),i.setXYZ(s,x[0],x[1],x[2]),r.setXYZ(s,0-Math.random()*5),o.setXYZ(s,2+Math.random()*4),a.setXYZ(s,20+Math.random()*15),c.setXYZ(s,1+Math.random()*1),m.setXYZ(s,Math.random()*2-1,Math.random()*2-1,Math.random()*2-1),v.setXYZ(s,Math.random()*2-1,Math.random()*2-1)}e.setAttribute("iPosition",n),e.setAttribute("iDirection",i),e.setAttribute("iTime",r),e.setAttribute("iDuration",o),e.setAttribute("iDistance",a),e.setAttribute("iScale",c),e.setAttribute("iRotate",m),e.setAttribute("iUvDiff",v);const b=new f({uniforms:{time:{value:0},noiseTex:{value:this.noiseTexture}},vertexShader:de,fragmentShader:pe,transparent:!0,side:M,depthWrite:!1});this.sparks=new j(e,b,this.COUNT),this.sparks.name="Sparks",this.sparks.frustumCulled=!1,this.scene.add(this.sparks)}sparksUpdate(e){const{iPosition:t,iDirection:n,iTime:i,iDuration:r}=this.sparks.geometry.attributes;this.sparks.material.uniforms.time.value+=e;for(let o=0;o<i.count;o++){const a=r.getX(o);let c=i.getX(o);(c>a||c<0&&c+e>0)&&(c%=a,t.setXYZ(o,n.getX(o)*5+this.core.position.x,n.getY(o)*5+this.core.position.y,n.getZ(o)*5+this.core.position.z)),i.setX(o,c+e)}t.needsUpdate=!0,i.needsUpdate=!0}trailInit(){const i=[],r=new Y(5,10,40,24,60,!0),{position:o}=r.attributes,a=new l,c=[],m=[];this.bones=[];let v=new B;for(let s=0;s<o.count;s++){a.fromBufferAttribute(o,s);const h=a.y+40/2,p=Math.floor(h/2),T=h%2/2;c.push(p,p+1,0,0),m.push(1-T,T,0,0)}for(let s=0;s<=20;s++){if(s===0)v.position.y=40/-2,this.bones.push(v);else{const h=new B;h.position.y=2,this.bones.push(h),v.add(h),v=h}i.push({velocity:new l,acceleration:new l})}r.setAttribute("skinIndex",new $(c,4)),r.setAttribute("skinWeight",new V(m,4)),this.skeleton=new Z(this.bones);const b=new f({uniforms:{time:{value:0},noiseTex:{value:this.noiseTexture},acceleration:{value:new l},boneMatrices:{value:[]}},vertexShader:xe,fragmentShader:ge,side:M});this.trail=new W(r,b),this.trailTop=new l(0,1,0),this.trailHookes=i,this.trailTime=0,this.trail.add(this.bones[0]),this.trail.bind(this.skeleton),this.scene.add(this.trail)}trialApplyDrag(e,t){const n=e.clone();n.multiplyScalar(-1),n.normalize(),n.multiplyScalar(e.length()*t),e.add(n)}trialApplyHook(e,t,n,i,r){const o=e.clone().sub(n),a=o.length()-i;o.normalize(),o.multiplyScalar(-1*r*a),t.add(o)}trailUpdate(e){const t=new z,n=new z;this.trailTime+=e,this.trail.material.uniforms.time.value+=e,this.trail.material.uniforms.boneMatrices.value=this.trail.skeleton.boneMatrices;for(let i=0;i<this.trailHookes.length;i++){const{velocity:r,acceleration:o}=this.trailHookes[i];if(i===0)r.copy(this.core.position);else{const a=this.trailHookes[i-1].velocity;this.trialApplyHook(r,o,a,0,1),this.trialApplyDrag(o,.7),r.add(o)}}this.trail.material.uniforms.acceleration.value.copy(this.acceleration);for(let i=0;i<this.bones.length;i++){const r=this.bones[i],{velocity:o}=this.trailHookes[i];if(i===0){const c=this.trailHookes[i+1].velocity.clone().sub(o).normalize(),m=new l().crossVectors(this.trailTop,c).normalize(),v=Math.acos(this.trailTop.clone().dot(c));t.setFromAxisAngle(m,v),r.rotation.setFromQuaternion(t),r.position.copy(this.core.position)}else if(i<this.bones.length-1){const a=this.trailHookes[i-1].velocity,c=o.clone().sub(a).normalize(),m=new l().crossVectors(this.trailTop,c).normalize(),v=Math.acos(this.trailTop.clone().dot(c)),s=this.trailHookes[i+1].velocity.clone().sub(o).normalize(),h=new l().crossVectors(this.trailTop,s).normalize(),p=Math.acos(this.trailTop.clone().dot(s));t.setFromAxisAngle(m,v),n.setFromAxisAngle(h,p),t.conjugate().multiply(n),r.rotation.setFromQuaternion(t),r.position.y=o.distanceTo(a)}}}postEffectInit(){this.renderTarget1=new D(this.resolution.x,this.resolution.y),this.renderTarget2=new D(this.resolution.x,this.resolution.y),this.renderTarget3=new D(this.resolution.x,this.resolution.y),this.scenePE=new k,this.cameraPE=new q(-1,1,1,-1,1,2)}postEffectBrightInit(){const e=new g(2,2),t=new f({uniforms:{minBright:{value:.5},texture:{value:this.renderTarget1.texture}},vertexShader:ye,fragmentShader:be});this.postEffectBright=new u(e,t),this.postEffectBright.name="PostEffectBright"}postEffectBlurInit(){const e=new g(2,2),t=new f({uniforms:{resolution:{value:new w},direction:{value:new w},texture:{value:null}},vertexShader:Te,fragmentShader:we});this.postEffectBlurX=new u(e,t),this.postEffectBlurX.material.uniforms.resolution.value.set(this.resolution),this.postEffectBlurX.material.uniforms.direction.value.set(1,0),this.postEffectBlurX.material.uniforms.texture.value=this.renderTarget2.texture,this.postEffectBlurX.name="PostEffectBlurX",this.postEffectBlurY=new u(e,t),this.postEffectBlurY.material.uniforms.resolution.value.set(this.resolution),this.postEffectBlurY.material.uniforms.direction.value.set(0,1),this.postEffectBlurY.material.uniforms.texture.value=this.renderTarget3.texture,this.postEffectBlurY.name="PostEffectBlurY"}postEffectBlurResize(){this.postEffectBlurX.material.uniforms.resolution.value.set(this.resolution),this.postEffectBlurY.material.uniforms.resolution.value.set(this.resolution)}postEffectBloomInit(){const e=new g(2,2),t=new f({uniforms:{texture1:{value:this.renderTarget1.texture},texture2:{value:this.renderTarget2.texture}},vertexShader:Ee,fragmentShader:Ue});this.postEffectBloom=new u(e,t),this.postEffectBloom.name="PostEffectBloom"}animation(){if(this.renderer.setAnimationLoop(()=>this.animation()),this.clock.running===!1)return;const e=this.clock.getDelta();this.cameraUpdate(e),this.backgroundUpdate(e),this.coreUpdate(e),this.coreLightUpdate(e),this.auraUpdate(e),this.sparksUpdate(e),this.trailUpdate(e),this.renderer.setRenderTarget(this.renderTarget1),this.renderer.render(this.scene,this.camera),this.scenePE.add(this.postEffectBright),this.renderer.setRenderTarget(this.renderTarget2),this.renderer.render(this.scenePE,this.cameraPE),this.scenePE.remove(this.postEffectBright),this.scenePE.add(this.postEffectBlurX),this.renderer.setRenderTarget(this.renderTarget2),this.renderer.render(this.scenePE,this.cameraPE),this.scenePE.remove(this.postEffectBlurX),this.scenePE.add(this.postEffectBlurY),this.renderer.setRenderTarget(this.renderTarget2),this.renderer.render(this.scenePE,this.cameraPE),this.scenePE.remove(this.postEffectBlurY),this.scenePE.add(this.postEffectBloom),this.renderer.setRenderTarget(null),this.renderer.render(this.scenePE,this.cameraPE),this.scenePE.remove(this.postEffectBloom)}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.renderer.setSize(this.width,this.height),this.cameraResize(),this.backgroundResize(),this.postEffectBlurResize()})}play(){this.clock.start()}pause(){this.clock.stop()}setCoreAnchor(){const e=(this.vTouch.y/this.resolution.y*2-1)*70,t=Math.abs((this.camera.position.z-e)*Math.tan(y.radians(this.camera.fov)/2)*2),n=t*this.camera.aspect;this.anchor.set((this.vTouch.x/this.resolution.x-.5)*n,-(this.vTouch.y/this.resolution.y-.5)*t,e)}addEventListener(){this.target.addEventListener("mousedown",e=>{e.touches||e.preventDefault(),this.vTouch.set(e.touches?e.touches[0].clientX:e.clientX,e.touches?e.touches[0].clientY:e.clientY),this.isTouched=!0,this.setCoreAnchor()}),this.target.addEventListener("mousemove",e=>{e.touches||e.preventDefault(),this.isTouched===!0&&(this.vTouch.set(e.touches?e.touches[0].clientX:e.clientX,e.touches?e.touches[0].clientY:e.clientY),this.setCoreAnchor())}),this.target.addEventListener("mouseup",()=>{this.isTouched=!1})}destroy(){this.scene.traverse(e=>{var t;e instanceof u&&((t=e.geometry)==null||t.dispose(),Object.values(e.material).forEach(n=>{n&&typeof n.dispose=="function"&&n.dispose()}))}),this.scenePE.traverse(e=>{var t;e instanceof u&&((t=e.geometry)==null||t.dispose(),Object.values(e.material).forEach(n=>{n&&typeof n.dispose=="function"&&n.dispose()}))}),this.renderer.dispose(),this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget3.dispose()}}const ke={class:"fireBall"},_e={class:"load"},Pe={__name:"index",setup(U){const e=R(!1);R(0);let t=null;const n=()=>{e.value=!0};return J(()=>{t=new De({parent:document.querySelector(".shield"),target:document.querySelector(".canvas"),callback:n})}),ee(()=>{t.destroy(),t=null,console.info("%c火球-销毁😁","color:#fff;background-color:red")}),(i,r)=>(H(),A("div",ke,[E("div",{class:re(["loading",{loadOk:e.value}])},[E("div",_e,[(H(),A(te,null,ne("LOADING...",(o,a)=>E("span",{key:a,style:ie("--i:"+a)},oe(o),5)),64))])],2),r[0]||(r[0]=E("div",{class:"canvas"},null,-1))]))}},He=Q(Pe,[["__scopeId","data-v-caaad309"]]);export{He as default};
