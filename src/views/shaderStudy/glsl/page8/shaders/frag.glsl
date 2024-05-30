uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform sampler2D uTexture;
uniform vec2 uMediaSize;

varying vec2 vUv;

vec2 cover(vec2 s, vec2 i, vec2 uv){
    float rs=s.x/s.y;
    float ri=i.x/i.y;
    vec2 new=rs<ri?vec2(i.x*s.y/i.y, s.y):vec2(s.x, i.y*s.x/i.x);
    vec2 offset=(rs<ri?vec2((new.x-s.x)/2., 0.):vec2(0., (new.y-s.y)/2.))/new;
    uv=uv*s/new+offset;
    return uv;
}

void main(){
    vec2 uv=vUv;
    uv = cover(iResolution.xy, uMediaSize, uv);
    vec4 tex=texture(uTexture, uv);
    vec3 color=tex.rgb;
    gl_FragColor=vec4(color, 1.);
}
