uniform sampler2D uRoadTexture;
uniform sampler2D uReflectionTexture;
uniform float uRepeatY;

varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    // normalized device space
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    vec2 reflectTextureCoords = vec2(ndc.x, 1.0 - ndc.y);

    vec4 reflectionColor = texture2D(uReflectionTexture, reflectTextureCoords);
    vec3 mixedColor = mix(reflectionColor.rgb, vec3(0.0, 0.0, 0.0), 0.7);

    vec2 roadPosition = vec2(vUv.x, vUv.y * uRepeatY);
    vec4 roadColor = texture2D(uRoadTexture, roadPosition);

    vec3 color = roadColor.rgb + mixedColor;

    gl_FragColor = vec4(color.rgb, 1.0);

}
