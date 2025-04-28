#define GLSLIFY 1
uniform vec2 u_lightFieldSlicedTextureSize;
uniform vec2 u_lightFieldSliceColRowCount;
uniform vec3 u_lightFieldGridCount;
uniform vec3 u_lightFieldVolumeOffset;
uniform vec3 u_lightFieldVolumeSize;
vec2 lightFieldGridToUv(vec3 grid){
    vec2 uv=grid.xy;
    vec2 colRow=floor(vec2(mod(grid.z, u_lightFieldSliceColRowCount.x), grid.z/u_lightFieldSliceColRowCount.x));
    uv+=colRow*u_lightFieldGridCount.xy+.5;
    return uv/u_lightFieldSlicedTextureSize;
}
vec3 lightFieldGridToUv3(vec3 grid){
    return grid/u_lightFieldGridCount;
}
vec3 clampLightFieldGrid(vec3 grid){
    return clamp(grid, vec3(.5), u_lightFieldGridCount-vec3(.5));
}
vec3 lightFieldPosToGrid(vec3 pos){
    return (pos-u_lightFieldVolumeOffset)/u_lightFieldVolumeSize*u_lightFieldGridCount;
}
vec3 clampedLightFieldPosToGrid(vec3 pos){
    return clampLightFieldGrid(lightFieldPosToGrid(pos));
}
vec4 sampleLightField(sampler2D tex, vec3 gridPos){
    gridPos.z-=.5;
    vec2 uv1=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, floor(gridPos.z)+.5)));
    vec2 uv2=lightFieldGridToUv(clampLightFieldGrid(vec3(gridPos.xy, ceil(gridPos.z)+.5)));
    return mix(texture2D(tex, uv1), texture2D(tex, uv2), fract(gridPos.z));
}

