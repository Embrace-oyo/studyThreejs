varying vec2 v_uv;
uniform vec2 iResolution;
uniform float iTime;
uniform vec4 iMouse;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;

vec4 getImage(sampler2D img, vec2 uv){
    return texture(img, uv);
}


void main() {
    vec2 uv = v_uv;
    vec4 t1 = getImage(iChannel0, uv);
    vec4 t2 = getImage(iChannel1, uv);
    float progress= iMouse.x;
    // 鼠标控制
    //    vec4 col = mix(t1, t2, 1.0 - step(progress, uv.x));
    // 自动展示
    vec4 col = mix(t1, t2, 1.0 - step(abs(sin(iTime)), uv.x));
    gl_FragColor = vec4(col);
}
