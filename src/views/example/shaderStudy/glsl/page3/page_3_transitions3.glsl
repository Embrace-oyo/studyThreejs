varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;

vec4 getImage(sampler2D img, vec2 uv){
    return texture(img, uv);
}

float sdCircle(vec2 p, float r)
{
    return length(p)-r;
}

void main() {
    vec2 uv = v_uv;
    vec4 dispVec = getImage(iChannel2, uv);
    //    float progress = iMouse.x;
    float progress = abs(sin(iTime));
    float ratio = iResolution.x / iResolution.y;
    vec2 uv1 = vec2(uv.x - dispVec.x * progress, uv.y);
    vec2 uv2 = vec2(uv.x - dispVec.x * (1.0 - progress), uv.y);
    vec4 t0 = getImage(iChannel0, uv1);
    vec4 t1 = getImage(iChannel1, uv2);
    vec4 col = mix(t0, t1, progress);
    gl_FragColor = vec4(col);
}
