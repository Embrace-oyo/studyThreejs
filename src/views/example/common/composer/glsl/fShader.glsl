precision highp float;
#define GLSLIFY 1
uniform sampler2D u_texture;
uniform sampler2D u_screenPaintTexture;
uniform vec2 u_screenPaintTexelSize;
uniform float u_amount;
uniform float u_rgbShift;
uniform float u_multiplier;
uniform float u_colorMultiplier;
uniform float u_shade;
varying vec2 v_uv;
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}

void main(){
    vec3 bnoise=getBlueNoise(gl_FragCoord.xy+vec2(17., 29.));
    vec4 data=texture2D(u_screenPaintTexture, v_uv);
    float weight=(data.z+data.w)*0.5;
    vec2 vel=(0.5-data.xy-0.001)*2.*weight;
    vec4 color=vec4(0.0);
    vec2 velocity=vel*u_amount/4.0*u_screenPaintTexelSize*u_multiplier;
    vec2 uv=v_uv+bnoise.xy*velocity;
    for (int i=0;i<9;i++){
        color+=texture2D(u_texture, uv);
        uv+=velocity;
    }
    color/=9.;
    color.rgb+=sin(vec3(vel.x+vel.y)*40.0+vec3(0.0, 2.0, 4.0)*u_rgbShift)*smoothstep(0.4, -0.9, weight)*u_shade*max(abs(vel.x), abs(vel.y))*u_colorMultiplier;
    gl_FragColor=color;
}