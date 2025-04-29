#define GLSLIFY 1
varying float v_shade;
varying float v_showRatio;
varying vec2 v_toCenter;
varying float v_blurriness;
varying vec2 v_uv;
varying vec3 v_color;
float linearStep(float edge0, float edge1, float x){
    return clamp((x-edge0)/(edge1-edge0), 0.0, 1.0);
}
vec3 linearStep(vec3 edge0, vec3 edge1, vec3 x){
    return clamp((x-edge0)/(edge1-edge0), vec3(0.), vec3(1.));
}
void main(){
    float shade=v_shade;
    float d=length(v_toCenter);
    float range=v_blurriness*5.;
    float brightness=linearStep(1., 1.-range-fwidth(d), d);
    shade*=brightness*(1.25-v_blurriness*v_shade);
    gl_FragColor=vec4(shade)*v_showRatio*v_showRatio;
    gl_FragColor.a*=pow(1.-v_blurriness, 3.)*0.8*linearStep(0.8, 1.0, v_showRatio*v_showRatio);
}
