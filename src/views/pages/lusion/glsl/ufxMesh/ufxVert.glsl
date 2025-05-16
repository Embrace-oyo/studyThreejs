#define GLSLIFY 1
uniform vec3 u_position;
uniform vec4 u_quaternion;
uniform vec3 u_scale;
uniform vec2 u_domXY;
uniform vec2 u_domWH;
uniform vec2 u_domPivot;
uniform vec4 u_domPadding;
vec3 qrotate(vec4 q, vec3 v){
    return v+2.*cross(q.xyz, cross(q.xyz, v)+q.w*v);
}
vec3 getBasePosition(in vec3 pos){
    vec3 basePos=vec3((pos.xy)*u_domWH-u_domPivot, pos.z);
    basePos.xy+=mix(-u_domPadding.xz, u_domPadding.yw, pos.xy);
    return basePos;
}
vec3 getScreenPosition(in vec3 basePos){
    vec3 screenPos=qrotate(u_quaternion, basePos*u_scale)+vec3(u_domPivot.xy, 0.);
    screenPos=(screenPos+vec3(u_domXY.xy, 0.)+u_position)*vec3(1., -1., 1.);
    return screenPos;
}
vec2 padUv(in vec2 uv){
    vec2 paddedUv=uv+mix(-u_domPadding.xz, u_domPadding.yw, uv)/u_domWH;
    paddedUv.y=1.-paddedUv.y;
    return paddedUv;
}
