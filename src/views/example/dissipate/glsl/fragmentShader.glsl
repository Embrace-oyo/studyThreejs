uniform sampler2D uParticleTexture;
uniform vec3 uColor;
uniform float uProgress;
uniform float uEdge;
varying float vNoise;
varying mat2 rotMat;
void main() {
    if (vNoise < uProgress - 1.0) discard;
    if (vNoise > uProgress + uEdge + 1.0) discard;
    vec2 coord = gl_PointCoord - 0.5;
    coord = coord * rotMat;
    coord = coord + 0.5;
    vec4 color = texture2D(uParticleTexture, coord);
    color.xyz *= uColor;
    gl_FragColor = color;
}
