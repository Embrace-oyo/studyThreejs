#define GLSLIFY 1
uniform sampler2D u_texture;
varying vec2 v_uv;
varying vec4 v_offsets[3];
vec4 SMAAColorEdgeDetectionPS(vec2 texcoord, vec4 offset[3], sampler2D colorTex){
    vec2 threshold=vec2(SMAA_THRESHOLD, SMAA_THRESHOLD);
    vec4 delta;
    vec3 C=texture2D(colorTex, texcoord).rgb;
    vec3 Cleft=texture2D(colorTex, offset[0].xy).rgb;
    vec3 t=abs(C-Cleft);
    delta.x=max(max(t.r, t.g), t.b);
    vec3 Ctop=texture2D(colorTex, offset[0].zw).rgb;
    t=abs(C-Ctop);
    delta.y=max(max(t.r, t.g), t.b);
    vec2 edges=step(threshold, delta.xy);
    if (dot(edges, vec2(1.0, 1.0))==0.0)discard;
    vec3 Cright=texture2D(colorTex, offset[1].xy).rgb;
    t=abs(C-Cright);
    delta.z=max(max(t.r, t.g), t.b);
    vec3 Cbottom=texture2D(colorTex, offset[1].zw).rgb;
    t=abs(C-Cbottom);
    delta.w=max(max(t.r, t.g), t.b);
    float maxDelta=max(max(max(delta.x, delta.y), delta.z), delta.w);
    vec3 Cleftleft=texture2D(colorTex, offset[2].xy).rgb;
    t=abs(C-Cleftleft);
    delta.z=max(max(t.r, t.g), t.b);
    vec3 Ctoptop=texture2D(colorTex, offset[2].zw).rgb;
    t=abs(C-Ctoptop);
    delta.w=max(max(t.r, t.g), t.b);
    maxDelta=max(max(maxDelta, delta.z), delta.w);
    edges.xy*=step(0.5*maxDelta, delta.xy);
    return vec4(edges, 0.0, 0.0);
}
void main(){
    gl_FragColor=SMAAColorEdgeDetectionPS(v_uv, v_offsets, u_texture);
}
