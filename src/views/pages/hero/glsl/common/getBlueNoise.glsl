#define GLSLIFY 1
uniform sampler2D u_blueNoiseTexture;
uniform vec2 u_blueNoiseTexelSize;
uniform vec2 u_blueNoiseCoordOffset;
vec3 getBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize+u_blueNoiseCoordOffset).rgb;
}
vec3 getStaticBlueNoise(vec2 coord){
    return texture2D(u_blueNoiseTexture, coord*u_blueNoiseTexelSize).rgb;
}

