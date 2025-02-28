uniform sampler2D uWallTexture;
uniform sampler2D uReflectionTexture;
uniform float uRepeatZ;

varying vec2 vUv;
varying vec4 vClipSpace;

void main() {

    // normalized device space
    vec2 ndc = (vClipSpace.xy / vClipSpace.w) / 2.0 + 0.5;
    vec2 reflectTextureCoords = vec2(1.0 - ndc.x, ndc.y);

    vec4 reflectionColor = texture2D(uReflectionTexture, reflectTextureCoords);
    vec3 mixedColor = mix(reflectionColor.rgb, vec3(0.07, 0.07, 0.07), 0.7);

    vec2 wallPosition = vec2(vUv.x * uRepeatZ, vUv.y);
    vec4 wallColor = texture2D(uWallTexture, wallPosition);

    vec3 color = wallColor.rgb + mixedColor;

    gl_FragColor = vec4(color.rgb, 1.0);

}
