#define GLSLIFY 1
uniform sampler2D u_prevSliceTexture;
uniform sampler2D u_drawnSliceTexture;
varying vec2 v_uv;

#include "./lightFieldSlice.glsl"
vec4 sampleSlice4(vec3 gridPos){
    vec3 sliceOffset=vec3(-.5, .5, 0.);
    return (texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.xxz)))+texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.xyz)))+texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.yxz)))+texture2D(u_drawnSliceTexture, lightFieldGridToUv(clampLightFieldGrid(gridPos+sliceOffset.yyz))))/4.;
}
void main(){
    vec3 gridPos=vec3(mod(gl_FragCoord.xy, u_lightFieldGridCount.xy), dot(floor(gl_FragCoord.xy/u_lightFieldGridCount.xy), vec2(1., u_lightFieldSliceColRowCount.x))+.5);
    vec4 prev=texture2D(u_prevSliceTexture, v_uv);
    vec4 curr=(sampleSlice4(gridPos+vec3(0., 0., -1.))+sampleSlice4(gridPos)*2.+sampleSlice4(gridPos+vec3(0., 0., 1.)))*.25;
    prev+=(curr-prev)*mix(0.15, 0.08, clamp(prev.r, 0., 1.));
    gl_FragColor=prev;
}


