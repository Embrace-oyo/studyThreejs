precision highp float;

varying vec2 vUv;
varying float vElevation;
uniform float uHue;

float hue2rgb(float f1, float f2, float hue) {
    if (hue < 0.0)
    hue += 1.0;
    else if (hue > 1.0)
    hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0)
    res = f1 + (f2 - f1) * 6.0 * hue;
    else if ((2.0 * hue) < 1.0)
    res = f2;
    else if ((3.0 * hue) < 2.0)
    res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
    else
    res = f1;
    return res;
}

vec3 hsl2rgb(vec3 hsl) {
    vec3 rgb;

    if (hsl.y == 0.0) {
        rgb = vec3(hsl.z);// Luminance
    } else {
        float f2;

        if (hsl.z < 0.5)
        f2 = hsl.z * (1.0 + hsl.y);
        else
        f2 = hsl.z + hsl.y - hsl.y * hsl.z;

        float f1 = 2.0 * hsl.z - f2;

        rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
        rgb.g = hue2rgb(f1, f2, hsl.x);
        rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
    }
    return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
    return hsl2rgb(vec3(h, s, l));
}

void main () {
    float hue = uHue + vElevation * .05 + cos(vUv.y)*.5;
    hue += smoothstep(.6, 1.0, vElevation * uHue) * .2;

    float highlight = sin (smoothstep(.6, .91, vElevation) * 3.14);

    hue += highlight * .1;

    float saturation = vElevation * 1.1;
    float darkborders = sin(vUv.x * 3.14) * sin(vUv.y * 3.14);
    float brightness = pow(darkborders * .3 + vElevation, 3.5);
    brightness *= .5 + smoothstep(.6, 1.0, vElevation) * .1;

    //brightness += highlight * .2;
    vec3 col = hsl2rgb(hue, saturation, brightness);

    gl_FragColor = vec4(col, 1.0);
}
