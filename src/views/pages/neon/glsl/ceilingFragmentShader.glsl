uniform sampler2D uReflectionTexture;
uniform float uOffset;

varying vec4 vClipSpace;

void main() {

    // normalized device space
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    vec2 reflectTextureCoords = vec2(ndc.x, 0.0 + 1.0 - ndc.y);

    vec4 reflectionColor = texture2D(uReflectionTexture, reflectTextureCoords);
    vec3 color = mix(reflectionColor.rgb, vec3(0.07, 0.07, 0.07), 0.7);

    gl_FragColor = vec4(color.rgb, 1.0);

}
