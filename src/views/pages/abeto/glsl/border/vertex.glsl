uniform Global{ vec2 resolution;float time;float dtRatio; };

attribute vec3 inset;
attribute vec3 notch;

uniform float uBorderSizePixels;
uniform vec2 uNotchSizePixels;
uniform vec2 uRes;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 pos = position;

    float aspect = uRes.x / uRes.y;
    vec2 borderDir = inset.xy;
    vec2 notchDir = notch.xy;
    borderDir /= uRes;
    notchDir /= uRes;

    // set border width in pixels
    pos.xy += borderDir * uBorderSizePixels;

    // add notch width in pixels
    pos.xy += notchDir * uNotchSizePixels;

    gl_Position = vec4(pos, 1.0);


    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
