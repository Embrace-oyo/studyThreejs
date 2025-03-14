precision highp float;

#define GLSLIFY 1
#define PI 3.141592653589793
varying vec2 vUv;
uniform float uGradientStrength;
uniform sampler2D tPlaster;
uniform float uTextureStrength;
highp float rand(const in vec2 uv){
    const highp float a=12.9898, b=78.233, c=43758.5453;
    highp float dt=dot(uv.xy, vec2(a, b)), sn=mod(dt, PI);
    return fract(sin(sn)*c);
}
void main(){
    vec3 color=vec3(0);
    float alpha=1.0;
    color+=vec3(0.54504);
    vec2 uvPlaster=vUv/1.0;
    float plaster=texture2D(tPlaster, uvPlaster).g;
    color=mix(color, color*plaster, uTextureStrength);
    vec2 uv=vUv+rand(vUv)*0.01;
    float gradient=mix(1.0, 0.5, length(uv-vec2(0.0, 0.8)));
    color+=gradient*0.7*uGradientStrength;
    color=color*0.6+0.4;
    gl_FragColor.rgb=color;
    gl_FragColor.a=alpha;
}
