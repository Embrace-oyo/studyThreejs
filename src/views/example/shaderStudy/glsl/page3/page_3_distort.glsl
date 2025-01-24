varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel0;

vec2 distort(vec2 p){
    p.x += sin(p.y * 10.0 + iTime) / 50.0;
    return p;
}

void main() {
    vec2 uv = v_uv;
    uv=distort(uv);
    vec3 tex = texture(iChannel0, uv).xyz;
    gl_FragColor = vec4(tex, 1.0);
}
