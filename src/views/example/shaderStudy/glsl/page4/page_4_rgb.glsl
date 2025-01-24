varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel3;
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
    vec2 r = uv;
    vec2 g = uv;
    vec2 b = uv;
    float noise = random(uv) * 0.5 + 0.5;
    vec2 offset = 0.0025 * vec2(cos(noise), sin(noise));
    r+=offset;
    b-=offset;
    vec4 RT = texture(iChannel3, r);
    vec4 GT = texture(iChannel3, g);
    vec4 BT = texture(iChannel3, b);
    vec4 col = vec4(RT.r, GT.g, BT.b, GT.a);
    gl_FragColor = col;
}
