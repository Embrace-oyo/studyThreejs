varying vec2 v_uv;
uniform vec3 iResolution;
uniform float iTime;
uniform sampler2D iChannel0;

#define time iTime*0.15
#define tau 6.2831853


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

void main(){
    vec2 uv = v_uv;
    uv = (v_uv - 0.5) * 2.0;
    uv.x *=  iResolution.x / iResolution.y;
    uv*=4.0;

    float rz = dualfbm(uv);
    //rings
    uv /= exp(mod(time*10., 3.14159));
    rz *= pow(abs((0.1-circ(uv))), .9);

    //final color
    vec3 col = vec3(.2, 0.1, 0.4)/rz;
    col=pow(abs(col), vec3(.99));
    gl_FragColor = vec4(col, 1.0);
}
