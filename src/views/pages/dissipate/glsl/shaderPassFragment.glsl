uniform sampler2D tDiffuse;
uniform sampler2D uBloomTexture;
uniform float uStrength;
varying vec2 vUv;
void main(){
    vec4 baseEffect = texture2D(tDiffuse, vUv);
    vec4 bloomEffect = texture2D(uBloomTexture, vUv) * uStrength;
    gl_FragColor = baseEffect + bloomEffect;
}
