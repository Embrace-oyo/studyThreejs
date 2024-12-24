uniform float mixRatio;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tMixTexture;
uniform int useTexture;
uniform float threshold;
varying vec2 vUv;

void main() {
    vec4 t1 = texture2D( tDiffuse1, vUv );
    vec4 t2 = texture2D( tDiffuse2, vUv );
    vec4 col = mix(t1, t2, 1.0 - step(abs(mixRatio), vUv.x));
    gl_FragColor = vec4(col);
}
