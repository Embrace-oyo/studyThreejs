#include "/node_modules/lygia/generative/curl.glsl"



void main(){
   /* vec2 uv = gl_FragCoord.xy / resolution.xy;

    // 计算位置
    vec3 pos = texture(texturePosition, uv).xyz;

    // 生成噪声并更新尾焰粒子的速度
    vec3 velocity = fbm(pos);

    // 影响速度，模拟尾焰的扩散
    velocity *= 0.05;

    // 更新位置
    pos += velocity * iTime;

    // 通过噪声模拟尾焰的透明度变化
    float intensity = length(velocity);
    float alpha = smoothstep(0.1, 0.5, intensity);

    gl_FragColor = vec4(pos, alpha);  // 将位置和透明度输出为最终的颜色*/



    vec4 col=vec4(0.1, 0.2, 0.3, 1.0);
    gl_FragColor=col;
}
