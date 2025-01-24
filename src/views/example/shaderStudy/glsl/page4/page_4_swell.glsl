varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform sampler2D iChannel3;

vec2 bulge(vec2 p){
    vec2 center = vec2(0.5);
    p -= center;
    float d = length(p);
    float dPow = pow(d, 0.5);
    p *= dPow;
    p += center;
    return p;
}

void main() {
    vec2 uv = v_uv;
    uv = bulge(uv);
    vec3 t = texture(iChannel3, uv).xyz;
    gl_FragColor = vec4(t, 1.0);
}
