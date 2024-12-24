uniform float mixRatio;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tDiffuse3;
uniform float ratio;
varying vec2 vUv;


void main() {
    vec4 dispVec = texture2D( tDiffuse3, vUv );
    vec2 uv1 = vec2(vUv.x - dispVec.x * mixRatio, vUv.y);
    vec2 uv2 = vec2(vUv.x - dispVec.x * (1.0 - mixRatio), vUv.y);
    vec4 t0 = texture2D( tDiffuse1, uv1 );
    vec4 t1 = texture2D( tDiffuse2, uv2 );
    vec4 col = mix(t0, t1, mixRatio);
    gl_FragColor = vec4(col);
}
