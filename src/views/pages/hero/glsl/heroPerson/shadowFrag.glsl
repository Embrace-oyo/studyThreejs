#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec3 u_lightMixer;
varying vec2 v_uv;

#include "../common/getBlueNoise.glsl"
void main(){
    vec3 blueNoises=getBlueNoise(gl_FragCoord.xy+vec2(3., 36.));
    vec3 map3=texture2D(u_texture, v_uv).xyz;
    float light1=dot(u_lightMixer, map3);
    float light2=dot(u_lightMixer.gbr, map3);
    float light=mix(light1, light2, blueNoises.x);
    light=light*light*.3+.7;
    gl_FragColor=vec4(light, 1., 1., 0.);
}

