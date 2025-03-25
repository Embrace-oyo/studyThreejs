#define GLSLIFY 1
varying vec3 v_viewPosition;
varying vec3 v_worldPosition;
varying vec3 v_viewNormal;
varying vec2 v_uv;
varying vec3 v_localPosition;
varying float v_depth;
uniform vec3 u_bgColor;
uniform vec3 u_lightPosition;
uniform vec2 u_resolution;
uniform sampler2D u_currSceneTexture;
uniform float u_sceneRatio;
uniform float u_hudRatio;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define saturate(a) clamp(a, 0.0, 1.0)
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
#include "../heroScatter/getScatter.glsl"
#include "../common/getBlueNoise.glsl"
void main(){
    vec3 noise=getBlueNoise(gl_FragCoord.xy+vec2(57., 27.));
    gl_FragColor.r=getScatter(cameraPosition, v_worldPosition);
    gl_FragColor.r*=u_sceneRatio*(1.-u_hudRatio);
    gl_FragColor.g=1.;
    gl_FragColor.b=linearStep(15., 66., v_worldPosition.z);
    gl_FragColor.a=0.;
    gl_FragColor.r+=noise.r*0.004;
}

