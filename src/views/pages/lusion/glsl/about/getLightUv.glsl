#define GLSLIFY 1
uniform vec2 u_lightShadowTextureTexelSize;
vec2 getLightUv(vec3 lightToWorld){
    float flatYScale=1.5;
    vec2 flatUv=normalize(lightToWorld*vec3(1., flatYScale, 1.)).xz;
    vec2 dir=abs(normalize(flatUv));
    flatUv=(flatUv*(dir.y>dir.x ? 1./dir.y : 1./dir.x)*0.5+0.5)*vec2(1., 0.5);
    float isTop=lightToWorld.y>0.0 ? 1.0 : 0.0;
    float halfTexelY=u_lightShadowTextureTexelSize.y*0.5;
    flatUv.y=clamp(0.+isTop*halfTexelY, 0.5-(1.-isTop)*halfTexelY, flatUv.y);
    return flatUv+vec2(0., isTop*.5);
}

