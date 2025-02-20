uniform sampler2D tDiffuse;
uniform sampler2D uBloomTexture;
uniform sampler2D uRGBShiftTexture;
uniform float uStrength;
varying vec2 vUv;
void main(){
    vec4 baseEffect = texture2D(tDiffuse, vUv);
    vec4 bloomEffect = texture2D(uBloomTexture, vUv) * uStrength;
    vec4 rgbShiftEffect = texture2D(uRGBShiftTexture, vUv);
    gl_FragColor = baseEffect + bloomEffect + rgbShiftEffect;
}
