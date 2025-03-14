precision highp float;
#define GLSLIFY 1
uniform sampler2D tMap;
uniform float uFalloff;
uniform float uAlpha;
uniform float uDissipation;
uniform float uDeltaMult;
uniform float uOffset;
uniform float uAspect;
uniform vec2 uMouse;
uniform vec2 uVelocity;
uniform vec2 uMouse2;
uniform vec2 uVelocity2;
uniform sampler2D tNoise;
uniform float uTime;
varying vec2 vUv;
vec4 getStamp(vec2 velocity, vec2 mouse){
    vec2 cursor=vUv-mouse;
    cursor.x*=uAspect;
    velocity*=50.0;
    float magnitude=1.0-pow(1.0-min(1.0, length(velocity)), 2.0);
    vec4 stamp=vec4(velocity, magnitude, 1.0);
    float falloff=smoothstep(uFalloff, 0.0, length(cursor))*uAlpha;
    return stamp*falloff;
}
void main(){
    vec2 uv=vUv;
    uv.y+=uOffset;
    vec4 data=texture2D(tMap, uv);
    float friction=(1.0/uDissipation)-1.0;
    float dissipation=1.0/(1.0+(uDeltaMult*friction));
    data*=dissipation;
    float noise=0.00+1.00*smoothstep(0.4, 1.0, texture2D(tNoise, (vUv*vec2(uAspect, 1.0))*0.35+vec2(0.01, 0.01)*uTime).g);
    float noise2=0.15+0.85*smoothstep(0.4, 1.0, texture2D(tNoise, (vUv*vec2(uAspect, 1.0))*0.8+vec2(0.01, 0.01)*uTime).g);
    vec4 stamp=getStamp(uVelocity, uMouse);
    data+=stamp*noise2*uDeltaMult;
    vec4 stamp2=getStamp(uVelocity2, uMouse2)*3.;
    stamp2.a=stamp2.b;
    stamp2.rg*=0.0;
    data+=stamp2*noise*uDeltaMult;
    data=min(data, vec4(1));
    data.rgb=max(data.rgb, vec3(-1));
    gl_FragColor=data;
}
