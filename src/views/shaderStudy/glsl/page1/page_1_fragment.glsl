varying vec2 vUv;
uniform float uTime;
void main() {
    //        gl_FragColor = vec4(vUv.x, 0.0, 0.0, 1.0);
    //    gl_FragColor = vec4(vUv.y, 0.0, 0.0, 1.0);
    //        gl_FragColor = vec4(vec3(vUv.x), 1.0);
    //    gl_FragColor = vec4(vec3(vUv.y), 1.0);
    //    gl_FragColor = vec4(vUv, 0.0, 1.0);
    //    gl_FragColor = vec4(vUv, 1.0, 1.0);
    // 颜色突变
    //    float color = step(0.3, vUv.x);
    //    gl_FragColor = vec4(vec3(color), 1.0);
    // 重复效果、条纹效果 渐变
    //    gl_FragColor = vec4(vec3(fract(vUv.x * 3.0)), 1.0);
    // 重复效果、条纹效果 突变
    //    gl_FragColor = vec4(vec3(step(0.5, fract(vUv.x * 3.0))), 1.0);
    // 绘制渐变圆形
    /*    float dist = length(vUv);
        vec3 color = vec3(dist);
        gl_FragColor = vec4(color, 1.0);*/
    // 绘制突变圆形
    /*        float dist = length(vUv);
            vec3 color = vec3(step(0.5, dist));
            gl_FragColor = vec4(color, 1.0);*/
    // 圆形坐标点移动
    /* float dist = length(vUv - vec2(0.5));
     float radius = 0.5 * (sin(uTime) * 0.5 + 0.5);
     vec3 color = vec3(step(radius, dist));
     gl_FragColor = vec4(color, 1.0);*/
    // 重复圆形
    /* vec2 reapet = fract(vUv * 6.0);
     float dist = length(reapet - vec2(0.5));
     float radius = 0.4 * (sin(uTime * 1.8 + -vUv.x + -vUv.y) * 0.5 + 0.5);
     vec3 color = vec3(step(radius, dist));
     gl_FragColor = vec4(color, 1.0);*/
    float dist = fract((length(vUv - vec2(0.5)) / 0.707 - uTime) * 6.0);
//    float radius = 0.4 * (sin(uTime * 1.8 + vUv.x + vUv.y) * 0.5 + 0.5);
    float radius = 0.4;
    vec3 color = vec3(step(radius, dist));
    gl_FragColor = vec4(color, 1.0);
}
