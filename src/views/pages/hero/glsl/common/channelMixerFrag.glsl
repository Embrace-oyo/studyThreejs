#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec4 u_channelMixerR;
uniform vec4 u_channelMixerG;
uniform vec4 u_channelMixerB;
uniform vec4 u_channelMixerA;
varying vec2 v_uv;
void main(){
    vec4 color=texture2D(u_texture, v_uv);
    gl_FragColor=vec4(dot(color, u_channelMixerR), dot(color, u_channelMixerG), dot(color, u_channelMixerB), dot(color, u_channelMixerA));
}

