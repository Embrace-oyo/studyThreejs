#define GLSLIFY 1
vec4 cubic(float v){
    vec4 n=vec4(1.0, 2.0, 3.0, 4.0)-v;
    vec4 s=n*n*n;
    float x=s.x;
    float y=s.y-4.0*s.x;
    float z=s.z-4.0*s.y+6.0*s.x;
    float w=6.0-x-y-z;
    return vec4(x, y, z, w);
}
vec4 textureBicubic(sampler2D t, vec2 texCoords, vec2 textureSize){
    vec2 invTexSize=1.0/textureSize;
    texCoords=texCoords*textureSize-0.5;
    vec2 fxy=fract(texCoords);
    texCoords-=fxy;
    vec4 xcubic=cubic(fxy.x);
    vec4 ycubic=cubic(fxy.y);
    vec4 c=texCoords.xxyy+vec2(-0.5, 1.5).xyxy;
    vec4 s=vec4(xcubic.xz+xcubic.yw, ycubic.xz+ycubic.yw);
    vec4 offset=c+vec4(xcubic.yw, ycubic.yw)/s;
    offset*=invTexSize.xxyy;
    vec4 sample0=texture2D(t, offset.xz);
    vec4 sample1=texture2D(t, offset.yz);
    vec4 sample2=texture2D(t, offset.xw);
    vec4 sample3=texture2D(t, offset.yw);
    float sx=s.x/(s.x+s.y);
    float sy=s.z/(s.z+s.w);
    return mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);
}
vec4 textureBicubic(sampler2D t, vec2 texCoords, vec2 textureSize, vec4 clampRect){
    vec2 invTexSize=1.0/textureSize;
    texCoords=texCoords*textureSize-0.5;
    vec2 fxy=fract(texCoords);
    texCoords-=fxy;
    vec4 xcubic=cubic(fxy.x);
    vec4 ycubic=cubic(fxy.y);
    vec4 c=texCoords.xxyy+vec2(-0.5, 1.5).xyxy;
    vec4 s=vec4(xcubic.xz+xcubic.yw, ycubic.xz+ycubic.yw);
    vec4 offset=c+vec4(xcubic.yw, ycubic.yw)/s;
    offset*=invTexSize.xxyy;
    vec4 sample0=texture2D(t, clamp(offset.xz, clampRect.xy, clampRect.zw));
    vec4 sample1=texture2D(t, clamp(offset.yz, clampRect.xy, clampRect.zw));
    vec4 sample2=texture2D(t, clamp(offset.xw, clampRect.xy, clampRect.zw));
    vec4 sample3=texture2D(t, clamp(offset.yw, clampRect.xy, clampRect.zw));
    float sx=s.x/(s.x+s.y);
    float sy=s.z/(s.z+s.w);
    return mix(mix(sample3, sample2, sx), mix(sample1, sample0, sx), sy);
}
