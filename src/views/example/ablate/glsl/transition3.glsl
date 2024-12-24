uniform float mixRatio;
uniform sampler2D tDiffuse1;
uniform sampler2D tDiffuse2;
uniform sampler2D tMixTexture;
uniform int useTexture;
uniform float threshold;
uniform float ratio;
varying vec2 vUv;


float sdCircle(vec2 p, float r){
    return length(p)-r;
}

void main() {
    vec4 t1 = texture2D( tDiffuse2, vUv );
    vec4 t2 = texture2D( tDiffuse1, vUv );

    vec2 p = vUv;
    p-=0.5;
    p.x*=ratio;
    float d = sdCircle(p, mixRatio * sqrt(2.0));

    d = smoothstep(-0.2, 0.0, d);
    vec4 col = mix(t1, t2, d);
    gl_FragColor = vec4(col);
}
