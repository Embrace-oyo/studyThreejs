#define GLSLIFY 1
uniform sampler2D u_texture;
uniform sampler2D u_depthTexture;
uniform mat4 u_projectionViewInverseMatrix;
uniform mat4 u_prevProjectionViewMatrix;
uniform vec2 u_aspect;
uniform float u_amount;
varying vec2 v_uv;

#include "../getBlueNoise.glsl"
void main(){
    vec3 bnoise=getBlueNoise(gl_FragCoord.xy);
    float depth=texture2D(u_depthTexture, v_uv+bnoise.yz*0.01*u_aspect).r;
    vec4 ndc=vec4(v_uv.xy*2.0-1.0, depth, 1.0);
    vec4 worldPos=u_projectionViewInverseMatrix*ndc;
    vec4 prevPos=u_prevProjectionViewMatrix*worldPos;
    prevPos/=prevPos.w;
    prevPos.xy=prevPos.xy*0.5+0.5;
    vec2 velocity=(prevPos.xy-v_uv)/16.0*u_amount;
    vec2 uv=v_uv+bnoise.xy*velocity;
    vec4 color=vec4(0.0);
    float weightSum=0.0;
    float weight=1.0;
    float weightFalloff=1.0;
    for (int i=0;i<16;i++){
        color+=texture2D(u_texture, uv)*weight;
        uv+=velocity;
        weightSum+=weight;
        weight*=weightFalloff;
    }
    gl_FragColor=color/weightSum;
}

