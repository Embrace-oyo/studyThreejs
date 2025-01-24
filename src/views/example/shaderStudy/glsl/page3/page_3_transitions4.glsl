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
highp float random(vec2 co){
    highp float a=12.9898;
    highp float b=78.233;
    highp float c=43758.5453;
    highp float dt=dot(co.xy, vec2(a, b));
    highp float sn=mod(dt, 3.14);
    return fract(sin(sn)*c);
}
void main() {
    vec2 uv = v_uv;
    float noise = random(uv + iTime);
    vec3 col = texture(iChannel0, uv).xyz;
    col += (noise - 0.5);
    gl_FragColor = vec4(col, 1.0);
}
