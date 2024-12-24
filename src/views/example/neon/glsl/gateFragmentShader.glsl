varying vec2 vUv;

uniform sampler2D uTexture;
uniform float uShowMask;
uniform float uMaskDirection;
uniform bool uMaskHorizontal;
uniform float uStrength;

void main() {

    vec4 color = texture2D(uTexture, vUv);

    float axis = vUv.x;
    float strength = 38.0;

    if (uMaskHorizontal) {
        axis = vUv.y;
        strength = 1.9;
    }

    float alpha = color.a - abs(1.0 * uMaskDirection - axis) * uStrength * uShowMask;
    gl_FragColor = vec4(color.rgb, alpha);

}
