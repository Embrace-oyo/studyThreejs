#define GLSLIFY 1
attribute float piece;
attribute float instanceId;
attribute vec4 instanceRands;
uniform sampler2D u_posRandTexture;
uniform sampler2D u_orientTexture;
uniform vec2 u_animationTextureSize;
uniform float u_time;
uniform float u_globalTime;
uniform float u_scale;
uniform float u_noiseStableFactor;
uniform float u_hudRatio;

#ifdef IS_SHADOW
uniform vec3 u_lightPosition;
uniform float u_lightShadowMaxDistance;
varying float v_distToLight;

#include "./getLightUv.glsl"
#else
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying float v_depth;

#endif
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec3 qrotate(vec4 q, vec3 v){
    return v+2.0*cross(q.xyz, cross(q.xyz, v)+q.w*v);
}
vec4 quaternion(vec3 axis, float halfAngle){
    return vec4(axis*sin(halfAngle), cos(halfAngle));
}
vec4 hash42(vec2 p){
    vec4 p4=fract(vec4(p.xyxy)*vec4(.1031, .1030, .0973, .1099));
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
    float duration=0.25+2.+4.;
    float time=duration*instanceRands.x+u_time;
    float cycle=floor(time/duration);
    time=time-duration*cycle;
    vec4 cycleRands=hash42(vec2(cycle, instanceId));
    float flyUpRatio=pow(linearStep(2.25, 6.25, time), 1.5);
    float appearRatio=linearStep(0., 0.25, time-instanceRands.y)*(1.0-u_hudRatio);
    vec4 selfSpin=quaternion(normalize(instanceRands.xyz-0.5), flyUpRatio*mix(5.0, 30., cycleRands.z));
    float pieceScale=appearRatio;
    vec3 origin=vec3(0.0, 1.9+instanceRands.w*0.4, 0.0);
    float angle=cycleRands.x*6.2832;
    float radius=4.+cycleRands.w*4.;
    float rollRatio=1.0-linearStep(0., 3.25, time+instanceRands.x);
    radius-=(rollRatio*rollRatio)*5.;
    vec2 dir=vec2(cos(angle), sin(angle));
    vec3 instanceOffset=vec3(dir.x*radius, flyUpRatio*mix(30.0, 40., cycleRands.z)+u_noiseStableFactor*(0.5+0.5*sin(u_globalTime+instanceId*0.1))*0.1, dir.y*radius);
    instanceOffset.xz=rotate(instanceOffset.xz, flyUpRatio*flyUpRatio*mix(-1., 1., instanceRands.z))*smoothstep(1.5, 0.35, flyUpRatio);
    float frame=linearStep(0.25, 2.25, time)*119.;
    float frameFloor=floor(frame);
    float frameCeil=min(frameFloor+1., 119.);
    float frameFract=frame-frameFloor;
    vec4 simUvs=(vec3(piece, frameFloor, frameCeil).xyxz+.5)/u_animationTextureSize.xyxy;
    vec4 posRand1=texture2D(u_posRandTexture, simUvs.xy);
    vec4 orient1=texture2D(u_orientTexture, simUvs.xy);
    vec4 posRand2=texture2D(u_posRandTexture, simUvs.zw);
    vec4 orient2=texture2D(u_orientTexture, simUvs.zw);

    #ifdef IS_SHADOW
    pieceScale*=1.5;

    #endif
    vec3 pos1=qrotate(orient1, position)*pieceScale+posRand1.xyz;
    vec3 pos2=qrotate(orient2, position)*pieceScale+posRand2.xyz;
    vec3 pos=u_scale*0.75*mix(0.5, 1.5, instanceRands.z*instanceRands.z)*linearStep(1., 0.9, flyUpRatio)*(qrotate(selfSpin, mix(pos1, pos2, frameFract)-origin)+origin)*mix(0.3, 0.7, cycleRands.w)+instanceOffset;

    #ifdef IS_SHADOW
    pos=(modelMatrix*vec4(pos, 1.0)).xyz;
    vec3 center=instanceOffset+origin-u_lightPosition;
    pos-=u_lightPosition;
    v_distToLight=length(pos)/u_lightShadowMaxDistance;
    if (center.y>0.0){
        pos.y=max(0.001, pos.y);
    }
    else {
        pos.y=min(-0.001, pos.y);
    }
    gl_Position=vec4(getLightUv(pos)*2.0-1.0, 1.-v_distToLight, 1.0);

    #else
    vec3 nor1=qrotate(selfSpin, qrotate(orient1, normal));
    vec3 nor2=qrotate(selfSpin, qrotate(orient2, normal));
    vec3 nor=normalize(mix(nor1, nor2, frameFract));
    gl_Position=projectionMatrix*modelViewMatrix*vec4(pos, 1.0);
    v_worldPosition=(modelMatrix*vec4(pos, 1.0)).xyz;
    v_viewNormal=normalMatrix*nor;
    v_uv=uv;
    vec4 viewPosition=modelViewMatrix*vec4(pos, 1.0);

    #include "./aboutHeroVisualFinal_vert.glsl"
    #endif
}
