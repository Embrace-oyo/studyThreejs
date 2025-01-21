precision mediump float;
varying vec2 v_uv;
uniform float audioData;
uniform float iTime;
uniform sampler2D iChannel0;
#define time audioData*0.05
#define tau 6.2831853
float PI = 3.141592;

mat2 makem2(in float theta){
    float c = cos(theta);
    float s = sin(theta);
    return mat2(c, -s, s, c);
}
float noise(in vec2 x){
    return texture(iChannel0, x*.01).x;
}
float fbm(in vec2 p){
    float z=2.;
    float rz = 0.;
    vec2 bp = p;
    for (float i= 1.;i < 6.;i++)
    {
        rz+= abs((noise(p)-0.5)*2.)/z;
        z = z*2.;
        p = p*2.;
    }
    return rz;
}
float dualfbm(in vec2 p){
    //get two rotated fbm calls and displace the domain
    vec2 p2 = p*.7;
    vec2 basis = vec2(fbm(p2-time*1.6), fbm(p2+time*1.7));
    basis = (basis-.5)*.2;
    p += basis;

    //coloring
    return fbm(p*makem2(time*0.2));
}
float circ(vec2 p){
    float r = length(p);
    r = log(sqrt(r));
    return abs(mod(r*4., tau)-3.14)*3.+.2;
}
void main() {
    v_uv = uv;
    vec2 pos = (uv - 0.5) * 2.0;
    float rz = dualfbm(pos);
    pos /= exp(mod(iTime * 2.0, 3.14159));
    rz *= pow(abs((0.1-circ(pos))), .9);
    vec3 col = vec3(.2, 0.1, 0.4)/rz;
    col=pow(abs(col), vec3(.99));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xy, (rz / col.z) * 0.1 + col.z * audioData * 0.01, 1.0);
}
