#define GLSLIFY 1
attribute vec3 position;
uniform vec2 u_texelSize;
varying vec2 v_uv;
varying vec4 v_offsets[3];
varying vec2 v_pixcoord;
void SMAABlendingWeightCalculationVS(vec2 texcoord){
    v_pixcoord=texcoord/u_texelSize;
    v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-0.25, 0.125, 1.25, 0.125);
    v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(-0.125, 0.25, -0.125, -1.25);
    v_offsets[2]=vec4(v_offsets[0].xz, v_offsets[1].yw)+vec4(-2.0, 2.0, -2.0, 2.0)*u_texelSize.xxyy*float(SMAA_MAX_SEARCH_STEPS);
}
void main(){
    v_uv=position.xy*0.5+0.5;
    SMAABlendingWeightCalculationVS(v_uv);
    gl_Position=vec4(position, 1.0);
}

