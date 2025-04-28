#define GLSLIFY 1
uniform sampler2D u_weightsTexture;
uniform sampler2D u_texture;
uniform vec2 u_texelSize;
varying vec2 v_uv;
varying vec4 v_offsets[2];
vec4 SMAANeighborhoodBlendingPS(vec2 texcoord, vec4 offset[2], sampler2D colorTex, sampler2D blendTex){
    vec4 a;
    a.xz=texture2D(blendTex, texcoord).xz;
    a.y=texture2D(blendTex, offset[1].zw).g;
    a.w=texture2D(blendTex, offset[1].xy).a;
    if (dot(a, vec4(1.0, 1.0, 1.0, 1.0))<1e-5){
        return texture2D(colorTex, texcoord, 0.0);
    } else {
        vec2 offset;
        offset.x=a.a>a.b ? a.a :-a.b;
        offset.y=a.g>a.r ?-a.g : a.r;
        if (abs(offset.x)>abs(offset.y)){
            offset.y=0.0;
        } else {
            offset.x=0.0;
        }
        vec4 C=texture2D(colorTex, texcoord, 0.0);
        texcoord+=sign(offset)*u_texelSize;
        vec4 Cop=texture2D(colorTex, texcoord, 0.0);
        float s=abs(offset.x)>abs(offset.y)? abs(offset.x): abs(offset.y);
        C.xyz=pow(abs(C.xyz), vec3(2.2));
        Cop.xyz=pow(abs(Cop.xyz), vec3(2.2));
        vec4 mixed=mix(C, Cop, s);
        mixed.xyz=pow(abs(mixed.xyz), vec3(1.0/2.2));
        return mixed;
    }
}
void main(){
    gl_FragColor=SMAANeighborhoodBlendingPS(v_uv, v_offsets, u_texture, u_weightsTexture);
}

