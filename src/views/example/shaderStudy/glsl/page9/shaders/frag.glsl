uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform vec3 uThemeColor;
uniform vec3 uLightColor;
uniform float uFresnelIntensity;
uniform float uLightIntensity;
uniform vec3 uLight2Color;
uniform float uLight2Intensity;

varying vec2 vUv;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vWorldPosition;

#include "/node_modules/lygia/lighting/fresnel.glsl"
#include "/node_modules/lygia/color/space.glsl"




void main(){
    vec2 uv=vUv;
    vec3 normal = normalize(vNormal);


    vec3 col = vec3(1.0);

    // basic
    col=uThemeColor;

    // fresnel
    vec3 viewDir=normalize(cameraPosition-vWorldPosition);
    vec3 fres=fresnel(vec3(0.), normal, viewDir);
    col+=fres*uFresnelIntensity;

    // diffuse
    vec3 lightPos=vec3(10., 5., 10.);
    float diff=max(dot(normal, normalize(lightPos-vWorldPosition)), 0.);
    col=mix(col, uLightColor, diff*fres*uLightIntensity);

    vec3 light2Pos=vec3(-10., -5., 10.);
    float diff2=max(dot(normal, normalize(light2Pos-vWorldPosition)), 0.);
    col=mix(col, uLight2Color, diff2*fres*uLight2Intensity);


    // gamma
    col=linear2gamma(col);


    gl_FragColor=vec4(col, 1.);
}
