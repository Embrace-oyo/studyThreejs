#define GLSLIFY 1
attribute vec2 simUv;
uniform sampler2D u_simPrevPosLifeTexture;
uniform sampler2D u_simCurrPosLifeTexture;
uniform vec2 u_simTextureSize;
uniform float u_strength;
uniform float u_aspect;
varying vec2 v_delta;
varying float v_headTail;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec4 hash43(vec3 p){
    vec4 p4=fract(vec4(p.xyzx)*vec4(.1031, .1030, .0973, .1099));
    p4+=dot(p4, p4.wzxy+33.33);
    return fract((p4.xxyz+p4.yzzw)*p4.zywx);
}
vec2 rotate(vec2 v, float a){
    float s=sin(a);
    float c=cos(a);
    mat2 m=mat2(c, s, -s, c);
    return m*v;
}
void main(){
    vec4 currPositionInfo=texture2D(u_simCurrPosLifeTexture, simUv);
    vec4 prevPositionInfo=texture2D(u_simPrevPosLifeTexture, simUv);
    vec4 rands=hash43(vec3(simUv.xy, 0.));
    float particleSize=(simUv.x<0.005 ? 0.175 : 0.06)*(0.5+rands.x*0.5);
    mat4 mvp=projectionMatrix*modelViewMatrix;
    vec4 currScreenPos=mvp*vec4(currPositionInfo.xyz, 1.0);
    vec4 prevScreenPos=mvp*vec4(prevPositionInfo.xyz, 1.0);
    currScreenPos/=currScreenPos.w;
    prevScreenPos/=prevScreenPos.w;
    vec2 screenPosDelta=currScreenPos.xy-prevScreenPos.xy;
    float screenPosDist=length(screenPosDelta);
    float angle=screenPosDist>0.001 ? atan(screenPosDelta.y, screenPosDelta.x*u_aspect): 0.;
    vec4 screenPos=position.x>-0.0001 ? currScreenPos : prevScreenPos;
    vec4 offsetScreenPos=modelViewMatrix*vec4((position.x>0. ? currPositionInfo.xyz : prevPositionInfo.xyz), 1.0);
    offsetScreenPos.xy+=particleSize;
    offsetScreenPos=projectionMatrix*offsetScreenPos;
    offsetScreenPos/=offsetScreenPos.w;
    offsetScreenPos=offsetScreenPos-screenPos;
    v_delta=screenPosDelta;
    v_headTail=position.x;
    vec4 pos=vec4(position, 0.);
    pos.xy=rotate(pos.xy, angle)*length(offsetScreenPos.xy*vec2(u_aspect, 1.));
    pos.xy*=vec2(1./u_aspect, 1.);
    pos+=screenPos;
    pos.xy+=v_delta*.5;
    v_delta=v_delta*2.+.5;
    gl_Position=pos;
    if (currPositionInfo.w>prevPositionInfo.w){
        gl_Position=vec4(2., 0., 0., 1.);
    }
}
