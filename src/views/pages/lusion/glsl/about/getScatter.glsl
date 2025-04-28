#define GLSLIFY 1
uniform vec2 u_lightScatterDivider;
uniform float u_lightScatterPowInv;
uniform vec3 u_lightScatterPos0;
uniform vec3 u_lightScatterPos1;
uniform float u_lightScatterRatio;
float getScatterCoff(vec3 start, vec3 dir, vec3 lightPos, float d){
    vec3 q=start-lightPos;
    float b=dot(dir, q);
    float c=dot(q, q);
    float t=c-b*b;
    float s=1.0/(2.5+pow(0.001+t, 0.8));
    return s*(atan((d+b)*s)-atan(b*s));
}
vec2 getScatterLine(vec3 start, vec3 dir, vec3 lightPos0, vec3 lightPos1, float d){
    vec3 segCenter=(lightPos0+lightPos1)*0.5;
    vec3 segDir=normalize(lightPos1-lightPos0);
    vec3 diff=start-segCenter;
    float segExtent=distance(lightPos0, lightPos1)*0.5;
    float a01=-dot(dir, segDir);
    float b0=dot(diff, dir);
    float b1=-dot(diff, segDir);
    float det=abs(1.0-a01*a01);
    float s=clamp((a01*b0-b1)/max(0.0001, det), -segExtent, segExtent);
    vec3 lightPos=segDir*s+segCenter;
    return vec2(getScatterCoff(start, dir, segExtent>0.0 ? lightPos : lightPos0, d), s/segExtent*0.5+0.5);
}
float getScatter(vec3 cameraPosition, vec3 worldPos, vec2 lightScatterDivider, float lightScatterPowInv){
    vec3 worldToCamera=worldPos-cameraPosition;
    float d=length(worldToCamera);
    vec3 dir=worldToCamera/d;
    vec2 val=getScatterLine(cameraPosition, dir, u_lightScatterPos0, u_lightScatterPos1, d);
    return pow(max(0.0, val.x/mix(lightScatterDivider.x, lightScatterDivider.y, val.y)), lightScatterPowInv)*u_lightScatterRatio;
}
float getScatter(vec3 cameraPosition, vec3 worldPos){
    return getScatter(cameraPosition, worldPos, u_lightScatterDivider, u_lightScatterPowInv);
}


