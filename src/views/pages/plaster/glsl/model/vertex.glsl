#define GLSLIFY 1
uniform sampler2D tFlow;
uniform sampler2D tMaskNoise;
uniform float uTime;
uniform float uAspect;
uniform float uScreenScroll;
uniform float uScrollSpeed;
uniform float uFastScroll;
uniform float uOpacity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPos;
varying vec3 vEye;
float circularIn(float t){
    return 1.0-sqrt(1.0-t*t);
}
vec2 getFastScrollNoise(float time, vec2 screenUv, sampler2D noiseTexture, vec4 params){
    float speed=params.x;
    float noiseSize=params.y;
    vec2 mask=params.zw;
    float t=time*speed;
    vec2 uvFastScrollNoise=screenUv/noiseSize+t*0.007;
    vec2 uvFastScrollNoise2=screenUv/noiseSize-t*0.007;
    vec3 fastScrollNoise=texture2D(noiseTexture, uvFastScrollNoise).rgb;
    vec3 fastScrollNoise2=texture2D(noiseTexture, uvFastScrollNoise2).rgb;
    fastScrollNoise=(fastScrollNoise+fastScrollNoise2)/2.;
    vec3 colorDot=vec3(sin(vec3(t, t+1.047, t+2.094)));
    float colorAvg=(abs(colorDot.r)+abs(colorDot.g)+abs(colorDot.b))/3.;
    colorDot/=colorAvg;
    vec3 colorDot2=vec3(sin(vec3(t+1.047, t+2.094, t)));
    float colorAvg2=(abs(colorDot2.r)+abs(colorDot2.g)+abs(colorDot2.b))/3.;
    colorDot2/=colorAvg2;
    float fastScrollExtrude=smoothstep(mask.x, mask.y, dot(normalize(fastScrollNoise-0.5), colorDot));
    float fastScrollExtrude2=smoothstep(mask.x, mask.y, dot(normalize(fastScrollNoise-0.5), colorDot2));
    return vec2(circularIn(fastScrollExtrude), circularIn(fastScrollExtrude2));
}
vec2 rotate2d(vec2 v, float a){
    float c=cos(a);
    float s=sin(a);
    return mat2(c, -s, s, c)*v;
}
void main(){
    vUv=uv;
    vPos=position;
    vNormal=normalize(normalMatrix*normal);
    vec4 pos=vec4(position, 1.0);
    vec4 ndc=projectionMatrix*modelViewMatrix*pos;
    vec2 uvScreen=(ndc.xy/ndc.w+1.0)/2.0;
    vec4 flow=texture2D(tFlow, uvScreen);
    float extrude=mix(flow.b, flow.a, 0.5);
    vec2 fastScrollNoise=getFastScrollNoise(uTime, uvScreen+vec2(0., -uScreenScroll), tMaskNoise, vec4(SCROLL_EXTRUDE_SPEED, SCROLL_EXTRUDE_NOISE_SIZE, SCROLL_EXTRUDE_MASK));
    float fastScrollExtrude=fastScrollNoise.r*SCROLL_EXTRUDE_STRENGTH;
    extrude=mix(extrude, fastScrollExtrude, uFastScroll)*uOpacity;
    pos.z*=mix(0.05, 1.0, extrude);
    pos.xy*=1.004;
    vec4 mPos=modelMatrix*pos;
    vec3 center=vec3(0);
    float deformStrength=5.5*min(1.0, abs(uScrollSpeed));
    vec2 deformDiff=mPos.xy-center.xy;
    vec3 deformOrigin=center+vec3(0.0, 0.0, 0.0);
    mPos.xyz-=deformOrigin;
    float deformY=max(-1.0, min(1.0, deformDiff.x*deformStrength));
    mPos.xyz+=deformOrigin;
    vec4 mvPos=viewMatrix*mPos;
    vEye=(modelMatrix*vec4(position, 1.)).xyz-cameraPosition;
    gl_Position=projectionMatrix*mvPos;
}
