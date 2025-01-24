varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

vec4 getImage(sampler2D img, vec2 uv){
    return texture(img, uv);
}

float sdCircle(vec2 p, float r)
{
    return length(p)-r;
}

void main() {
    vec2 uv = v_uv;
    vec4 t1 = getImage(iChannel0, uv);
    vec4 t2 = getImage(iChannel1, uv);
    float progress= iMouse.x;
    float ratio=iResolution.x/iResolution.y;
    vec2 p = uv;
    p-=0.5;
    p.x*=ratio;
    float d = sdCircle(p, progress * sqrt(2.0));
//    float d = sdCircle(p, abs(sin(iTime)) * sqrt(2.0));
    d = smoothstep(-0.2, 0.0, d);
    vec4 col = mix(t1, t2, d);
    gl_FragColor = vec4(col);
}
