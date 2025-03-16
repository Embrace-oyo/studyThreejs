import{V as _,v as M,e as N,w as s,x as D,O as I,a8 as R,X as j,l as A,h as b,f as O,M as w,s as V,P as B}from"./threejs-DBMWHTjA.js";import{v as L,f as U,_ as E}from"../lib/index-ChcEMU0S.js";import{l as C,b as q,m as G,i as F,c as k,d as m,F as Y,n as T,p as H,e as X,q as Z}from"./vendor-jP0BXN2k.js";var K=`varying mat4 m_matrix;

void main(void) {
    m_matrix = inverse(modelMatrix);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,W=`uniform float time;
uniform float time2;
uniform float acceleration;
uniform vec2 resolution;
varying mat4 m_matrix;

const float targetDepth = 3.5;
const vec3 lightDir = vec3(0.577, -0.577, 0.577);

vec3 hsv2rgb(vec3 c){
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

#ifndef FNC_MOD289
#define FNC_MOD289

float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

#endif
#ifndef FNC_MOD289
#define FNC_MOD289

float mod289(const in float x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(const in vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 mod289(const in vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec4 mod289(const in vec4 x) { return x - floor(x * (1. / 289.)) * 289.; }

#endif

#ifndef FNC_PERMUTE
#define FNC_PERMUTE

float permute(const in float v) { return mod289(((v * 34.0) + 1.0) * v); }
vec2 permute(const in vec2 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec3 permute(const in vec3 v) { return mod289(((v * 34.0) + 1.0) * v); }
vec4 permute(const in vec4 v) { return mod289(((v * 34.0) + 1.0) * v); }

#endif
#ifndef FNC_TAYLORINVSQRT
#define FNC_TAYLORINVSQRT
float taylorInvSqrt(in float r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 taylorInvSqrt(in vec2 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 taylorInvSqrt(in vec3 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec4 taylorInvSqrt(in vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
#endif
#ifndef FNC_GRAD4
#define FNC_GRAD4
vec4 grad4(float j, vec4 ip) {
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
    vec4 p,s;
    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
    s = vec4(lessThan(p, vec4(0.0)));
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;
    return p;
}
#endif

#ifndef FNC_SNOISE
#define FNC_SNOISE
float snoise(in vec2 v) {
    const vec4 C = vec4(0.211324865405187,  
                        0.366025403784439,  
                        -0.577350269189626,  
                        0.024390243902439); 
    
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    
    vec2 i1;
    
    
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    
    
    
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    
    i = mod289(i); 
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    
    

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    
    
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

float snoise(in vec3 v) {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );

    
    
    
    
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;      

    
    i = mod289(i);
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );

    
    
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);

    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float snoise(in vec4 v) {
    const vec4  C = vec4( 0.138196601125011,  
                        0.276393202250021,  
                        0.414589803375032,  
                        -0.447213595499958); 

    
    vec4 i  = floor(v + dot(v, vec4(.309016994374947451)) ); 
    vec4 x0 = v -   i + dot(i, C.xxxx);

    

    
    vec4 i0;
    vec3 isX = step( x0.yzw, x0.xxx );
    vec3 isYZ = step( x0.zww, x0.yyz );
    
    i0.x = isX.x + isX.y + isX.z;
    i0.yzw = 1.0 - isX;
    
    i0.y += isYZ.x + isYZ.y;
    i0.zw += 1.0 - isYZ.xy;
    i0.z += isYZ.z;
    i0.w += 1.0 - isYZ.z;

    
    vec4 i3 = clamp( i0, 0.0, 1.0 );
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    
    
    
    
    
    vec4 x1 = x0 - i1 + C.xxxx;
    vec4 x2 = x0 - i2 + C.yyyy;
    vec4 x3 = x0 - i3 + C.zzzz;
    vec4 x4 = x0 + C.wwww;

    
    i = mod289(i);
    float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
    vec4 j1 = permute( permute( permute( permute (
                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
            + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
            + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    
    
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = grad4(j0,   ip);
    vec4 p1 = grad4(j1.x, ip);
    vec4 p2 = grad4(j1.y, ip);
    vec4 p3 = grad4(j1.z, ip);
    vec4 p4 = grad4(j1.w, ip);

    
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    p4 *= taylorInvSqrt(dot(p4,p4));

    
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
    m0 = m0 * m0;
    m1 = m1 * m1;
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;
}

vec2 snoise2( vec2 x ){
    float s  = snoise(vec2( x ));
    float s1 = snoise(vec2( x.y - 19.1, x.x + 47.2 ));
    return vec2( s , s1 );
}

vec3 snoise3( vec3 x ){
    float s  = snoise(vec3( x ));
    float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
    float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
    return vec3( s , s1 , s2 );
}

vec3 snoise3( vec4 x ){
    float s  = snoise(vec4( x ));
    float s1 = snoise(vec4( x.y - 19.1 , x.z + 33.4 , x.x + 47.2, x.w ));
    float s2 = snoise(vec4( x.z + 74.2 , x.x - 124.5 , x.y + 99.4, x.w ));
    return vec3( s , s1 , s2 );
}

#endif

vec3 rotate(vec3 p, float radian_x, float radian_y, float radian_z) {
    mat3 mx = mat3(
    1.0, 0.0, 0.0,
    0.0, cos(radian_x), -sin(radian_x),
    0.0, sin(radian_x), cos(radian_x)
    );
    mat3 my = mat3(
    cos(radian_y), 0.0, sin(radian_y),
    0.0, 1.0, 0.0,
    -sin(radian_y), 0.0, cos(radian_y)
    );
    mat3 mz = mat3(
    cos(radian_z), -sin(radian_z), 0.0,
    sin(radian_z), cos(radian_z), 0.0,
    0.0, 0.0, 1.0
    );
    return mx * my * mz * p;
}

float dBox(vec3 p, vec3 size) {
    return length(max(abs(p) - size, 0.0));
}

float getNoise(vec3 p) {
    return snoise(p * (0.4 + acceleration * 0.1) + time / 100.0);
}

vec3 getRotate(vec3 p) {
    return rotate(p, radians(time2), radians(time2 * 2.0), radians(time2));
}

float distanceFunc(vec3 p) {
    vec4 p1 = m_matrix * vec4(p, 1.0);
    float n1 = getNoise(p1.xyz);
    vec3 p2 = getRotate(p1.xyz);
    float d1 = dBox(p2, vec3(0.8 - min(acceleration, 0.8))) - 0.2;
    float d2 = dBox(p2, vec3(1.0)) - n1;
    float d3 = dBox(p2, vec3(0.5 + acceleration * 0.4)) - n1;
    return min(max(d1, -d2), d3);
}

float distanceFuncForFill(vec3 p) {
    vec4 p1 = m_matrix * vec4(p, 1.0);
    float n = getNoise(p1.xyz);
    vec3 p2 = getRotate(p1.xyz);
    return dBox(p2, vec3(0.5 + acceleration * 0.4)) - n;
}

vec3 getNormal(vec3 p) {
    const float d = 0.1;
    return normalize(vec3(
    distanceFunc(p + vec3(d, 0.0, 0.0)) - distanceFunc(p + vec3(-d, 0.0, 0.0)),
    distanceFunc(p + vec3(0.0, d, 0.0)) - distanceFunc(p + vec3(0.0, -d, 0.0)),
    distanceFunc(p + vec3(0.0, 0.0, d)) - distanceFunc(p + vec3(0.0, 0.0, -d))
    ));
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    vec3 cDir = normalize(cameraPosition * -1.0);
    vec3 cUp  = vec3(0.0, 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    float distance = 0.0;
    float rLen = 0.0;
    vec3 rPos = cameraPosition;
    for(int i = 0; i < 64; i++){
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cameraPosition + ray * rLen * 0.2;
    }

    vec3 normal = getNormal(rPos);
    if(abs(distance) < 0.5){
        if (distanceFuncForFill(rPos) > 0.5) {
            gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.8 + time / 400.0, 0.2, dot(normal, cUp) * 0.8 + 0.1)), 1.0);
        } else {
            gl_FragColor = vec4(hsv2rgb(vec3(dot(normal, cUp) * 0.1 + time / 400.0, 0.8, dot(normal, cUp) * 0.2 + 0.8)), 1.0);
        }
    } else {
        gl_FragColor = vec4(0.0);
    }
}`;const S={getRandomInt:function(a,t){return Math.floor(Math.random()*(t-a))+a},getDegree:function(a){return a/Math.PI*180},getRadian:function(a){return a*Math.PI/180},getPolarCoord:function(a,t,n){let e=Math.cos(a)*Math.cos(t)*n,o=Math.cos(a)*Math.sin(t)*n,c=Math.sin(a)*n;return new s(e,c,o)}};class p{constructor(){this.velocity=new s,this.acceleration=new s,this.anchor=new s,this.mass=1}updateVelocity(){this.acceleration.divideScalar(this.mass),this.velocity.add(this.acceleration)}applyForce(t){this.acceleration.add(t)}applyFriction(t,n){let e=this.acceleration.clone();e.multiplyScalar(-1),e.normalize(),e.multiplyScalar(t),this.applyForce(e)}applyDrag(t){let n=this.acceleration.clone();n.multiplyScalar(-1),n.normalize(),n.multiplyScalar(this.acceleration.length()*t),this.applyForce(n)}applyHook(t,n){let e=this.velocity.clone().sub(this.anchor),o=e.length()-t;e.normalize(),e.multiplyScalar(-1*n*o),this.applyForce(e)}}class Q extends B{constructor(t,n,e,o){super(t,n,e,o),this.force={position:new p,look:new p},this.up.set(0,1,0)}updatePosition(){this.position.copy(this.force.position.velocity)}updateLook(){this.lookAt(this.force.look.velocity.x,this.force.look.velocity.y,this.force.look.velocity.z)}reset(){this.setPolarCoord(),this.lookAtCenter()}resize(t,n){this.aspect=t/n,this.updateProjectionMatrix()}setPolarCoord(t,n,e){this.force.position.anchor.copy(S.getPolarCoord(t,n,e))}lookAtCenter(){this.lookAt(0,0,0)}}class ${constructor(t){this.parent=t.parent,this.target=t.target,this.callback=t.callback,this.devicePixelRatio=window.devicePixelRatio,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.resolution=new _(this.width,this.height),this.renderer=new M({powerPreference:"high-performance",alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.setClearColor(0,1),this.scene=new N,this.target.appendChild(this.renderer.domElement),this.camera=new Q(35,this.aspect,.1,1e4),this.camera.position.set(1e3,1e3,1e3),this.camera.lookAt(new s),this.clock=new D,this.controls=new I(this.camera,this.renderer.domElement),this.controls.target.set(0,0,0),this.controls.update(),this.controls.enablePan=!0,this.controls.enableDamping=!0,this.callback(),this.paramsInit(),this.backgroundInit(),this.metalCubeInit(),this.camera.setPolarCoord(0,S.getRadian(90),24),this.animation(),this.resize()}paramsInit(){this.raycaster=new R,this.intersects=null,this.cube_force=new p,this.cube_force2=new p,this.vactor_raycast=null,this.cube_force.mass=1.4}backgroundInit(){const n=new j(30,4).toNonIndexed(),e=n.attributes.position.array,o=new Float32Array(e.length);for(let i=0;i<e.length;i+=9){const v=e[i],x=e[i+1],d=e[i+2],h=e[i+3],u=e[i+4],y=e[i+5],f=e[i+6],z=e[i+7],g=e[i+8],r=new s(h-v,u-x,y-d),P=new s(f-v,z-x,g-d),l=new s().crossVectors(r,P).normalize();o.set([l.x,l.y,l.z],i),o.set([l.x,l.y,l.z],i+3),o.set([l.x,l.y,l.z],i+6)}n.setAttribute("normal",new A(o,3));const c=new b({uniforms:{time:{value:0},acceleration:{value:0}},vertexShader:L,fragmentShader:U,side:O});this.background=new w(n,c),this.background.name="Background",this.scene.add(this.background)}updateNormals(t){const n=t.attributes.position.array,e=t.attributes.normal.array;for(let o=0;o<n.length;o+=9){const c=n[o],i=n[o+1],v=n[o+2],x=n[o+3],d=n[o+4],h=n[o+5],u=n[o+6],y=n[o+7],f=n[o+8],z=new s(x-c,d-i,h-v),g=new s(u-c,y-i,f-v),r=new s().crossVectors(z,g).normalize();e[o]=r.x,e[o+1]=r.y,e[o+2]=r.z,e[o+3]=r.x,e[o+4]=r.y,e[o+5]=r.z,e[o+6]=r.x,e[o+7]=r.y,e[o+8]=r.z}t.attributes.normal.needsUpdate=!0}metalCubeInit(){const t=new V(6,6),n=new b({uniforms:{time:{value:0},time2:{value:0},acceleration:{value:0},resolution:{value:new _(this.width,this.height)}},vertexShader:K,fragmentShader:W,transparent:!0});this.metalCube=new w(t,n),this.metalCube.name="MetalCube",this.scene.add(this.metalCube)}animation(){this.renderer.setAnimationLoop(()=>this.animation()),this.cube_force.applyHook(0,.12),this.cube_force.applyDrag(.01),this.cube_force.updateVelocity(),this.cube_force2.applyHook(0,.005),this.cube_force2.applyDrag(.2),this.cube_force2.updateVelocity(),this.metalCube.position.copy(this.cube_force.velocity),this.metalCube.material.uniforms.time.value++,this.metalCube.material.uniforms.time2.value+=1+Math.floor(this.cube_force.acceleration.length()*4),this.metalCube.material.uniforms.acceleration.value=this.cube_force.acceleration.length(),this.background.material.uniforms.time.value++,this.background.material.uniforms.acceleration.value=this.cube_force2.velocity.length(),this.updateNormals(this.background.geometry),this.camera.force.position.applyHook(0,.025),this.camera.force.position.applyDrag(.2),this.camera.force.position.updateVelocity(),this.camera.updatePosition(),this.camera.lookAtCenter(),this.renderer.render(this.scene,this.camera)}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.renderer.setSize(this.width,this.height),this.camera.updateProjectionMatrix(),this.metalCube.material.uniforms.resolution.value.set(this.width,this.height)})}destroy(){this.scene.traverse(t=>{var n;t instanceof w&&((n=t.geometry)==null||n.dispose(),Object.values(t.material).forEach(e=>{e&&typeof e.dispose=="function"&&e.dispose()}))}),this.renderer.dispose()}}const J={class:"metalCube"},ee={class:"load"},ne={__name:"index",setup(a){const t=C(!1);C(0);let n=null;const e=()=>{t.value=!0};return q(()=>{n=new $({parent:document.querySelector(".metalCube"),target:document.querySelector(".canvas"),callback:e})}),G(()=>{n.destroy(),n=null,console.info("%c金属方块-销毁😁","color:#fff;background-color:red")}),(o,c)=>(F(),k("div",J,[m("div",{class:Z(["loading",{loadOk:t.value}])},[m("div",ee,[(F(),k(Y,null,T("LOADING...",(i,v)=>m("span",{key:v,style:H("--i:"+v)},X(i),5)),64))])],2),c[0]||(c[0]=m("div",{class:"canvas"},null,-1))]))}},ae=E(ne,[["__scopeId","data-v-05b0dad7"]]);export{ae as default};
