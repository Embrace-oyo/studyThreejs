#define GLSLIFY 1
uniform sampler2D u_texture;
uniform vec2 u_inResolution;
uniform vec2 u_outResolution;
vec3 FsrEasuCF(vec2 p){
    return texture2D(u_texture, p).rgb;
}
void FsrEasuCon(out vec4 con0, out vec4 con1, out vec4 con2, out vec4 con3, vec2 inputViewportInPixels, vec2 inputSizeInPixels, vec2 outputSizeInPixels){
    con0=vec4(inputViewportInPixels.x/outputSizeInPixels.x, inputViewportInPixels.y/outputSizeInPixels.y, .5*inputViewportInPixels.x/outputSizeInPixels.x-.5, .5*inputViewportInPixels.y/outputSizeInPixels.y-.5);
    con1=vec4(1, 1, 1, -1)/inputSizeInPixels.xyxy;
    con2=vec4(-1, 2, 1, 2)/inputSizeInPixels.xyxy;
    con3=vec4(0, 4, 0, 0)/inputSizeInPixels.xyxy;
}
void FsrEasuTapF(inout vec3 aC, inout float aW, vec2 off, vec2 dir, vec2 len, float lob, float clp, vec3 c){
    vec2 v=vec2(dot(off, dir), dot(off, vec2(-dir.y, dir.x)));
    v*=len;
    float d2=min(dot(v, v), clp);
    float wB=.4*d2-1.;
    float wA=lob*d2-1.;
    wB*=wB;
    wA*=wA;
    wB=1.5625*wB-.5625;
    float w=wB*wA;
    aC+=c*w;
    aW+=w;
}
void FsrEasuSetF(inout vec2 dir, inout float len, float w, float lA, float lB, float lC, float lD, float lE){
    float lenX=max(abs(lD-lC), abs(lC-lB));
    float dirX=lD-lB;
    dir.x+=dirX*w;
    lenX=clamp(abs(dirX)/lenX, 0., 1.);
    lenX*=lenX;
    len+=lenX*w;
    float lenY=max(abs(lE-lC), abs(lC-lA));
    float dirY=lE-lA;
    dir.y+=dirY*w;
    lenY=clamp(abs(dirY)/lenY, 0., 1.);
    lenY*=lenY;
    len+=lenY*w;
}
void FsrEasuF(out vec3 pix, vec2 ip, vec4 con0, vec4 con1, vec4 con2, vec4 con3){
    vec2 pp=ip*con0.xy+con0.zw;
    vec2 fp=floor(pp);
    pp-=fp;
    vec2 p0=fp*con1.xy+con1.zw;
    vec2 p1=p0+con2.xy;
    vec2 p2=p0+con2.zw;
    vec2 p3=p0+con3.xy;
    vec4 off=vec4(-.5, .5, -.5, .5)*con1.xxyy;
    vec3 bC=FsrEasuCF(p0+off.xw);
    float bL=bC.g+0.5*(bC.r+bC.b);
    vec3 cC=FsrEasuCF(p0+off.yw);
    float cL=cC.g+0.5*(cC.r+cC.b);
    vec3 iC=FsrEasuCF(p1+off.xw);
    float iL=iC.g+0.5*(iC.r+iC.b);
    vec3 jC=FsrEasuCF(p1+off.yw);
    float jL=jC.g+0.5*(jC.r+jC.b);
    vec3 fC=FsrEasuCF(p1+off.yz);
    float fL=fC.g+0.5*(fC.r+fC.b);
    vec3 eC=FsrEasuCF(p1+off.xz);
    float eL=eC.g+0.5*(eC.r+eC.b);
    vec3 kC=FsrEasuCF(p2+off.xw);
    float kL=kC.g+0.5*(kC.r+kC.b);
    vec3 lC=FsrEasuCF(p2+off.yw);
    float lL=lC.g+0.5*(lC.r+lC.b);
    vec3 hC=FsrEasuCF(p2+off.yz);
    float hL=hC.g+0.5*(hC.r+hC.b);
    vec3 gC=FsrEasuCF(p2+off.xz);
    float gL=gC.g+0.5*(gC.r+gC.b);
    vec3 oC=FsrEasuCF(p3+off.yz);
    float oL=oC.g+0.5*(oC.r+oC.b);
    vec3 nC=FsrEasuCF(p3+off.xz);
    float nL=nC.g+0.5*(nC.r+nC.b);
    vec2 dir=vec2(0.);
    float len=0.;
    FsrEasuSetF(dir, len, (1.-pp.x)*(1.-pp.y), bL, eL, fL, gL, jL);
    FsrEasuSetF(dir, len, pp.x*(1.-pp.y), cL, fL, gL, hL, kL);
    FsrEasuSetF(dir, len, (1.-pp.x)*pp.y, fL, iL, jL, kL, nL);
    FsrEasuSetF(dir, len, pp.x*pp.y, gL, jL, kL, lL, oL);
    vec2 dir2=dir*dir;
    float dirR=dir2.x+dir2.y;
    bool zro=dirR<(1./32768.);
    dirR=inversesqrt(dirR);
    dirR=zro ? 1. : dirR;
    dir.x=zro ? 1. : dir.x;
    dir*=vec2(dirR);
    len=len*.5;
    len*=len;
    float stretch=dot(dir, dir)/(max(abs(dir.x), abs(dir.y)));
    vec2 len2=vec2(1.+(stretch-1.0)*len, 1.-.5*len);
    float lob=.5-.29*len;
    float clp=1./lob;
    vec3 min4=min(min(fC, gC), min(jC, kC));
    vec3 max4=max(max(fC, gC), max(jC, kC));
    vec3 aC=vec3(0);
    float aW=0.;
    FsrEasuTapF(aC, aW, vec2(0., -1.)-pp, dir, len2, lob, clp, bC);
    FsrEasuTapF(aC, aW, vec2(1., -1.)-pp, dir, len2, lob, clp, cC);
    FsrEasuTapF(aC, aW, vec2(-1., 1.)-pp, dir, len2, lob, clp, iC);
    FsrEasuTapF(aC, aW, vec2(0., 1.)-pp, dir, len2, lob, clp, jC);
    FsrEasuTapF(aC, aW, vec2(0., 0.)-pp, dir, len2, lob, clp, fC);
    FsrEasuTapF(aC, aW, vec2(-1., 0.)-pp, dir, len2, lob, clp, eC);
    FsrEasuTapF(aC, aW, vec2(1., 1.)-pp, dir, len2, lob, clp, kC);
    FsrEasuTapF(aC, aW, vec2(2., 1.)-pp, dir, len2, lob, clp, lC);
    FsrEasuTapF(aC, aW, vec2(2., 0.)-pp, dir, len2, lob, clp, hC);
    FsrEasuTapF(aC, aW, vec2(1., 0.)-pp, dir, len2, lob, clp, gC);
    FsrEasuTapF(aC, aW, vec2(1., 2.)-pp, dir, len2, lob, clp, oC);
    FsrEasuTapF(aC, aW, vec2(0., 2.)-pp, dir, len2, lob, clp, nC);
    pix=min(max4, max(min4, aC/aW));
}
void main(){
    vec3 c;
    vec4 con0, con1, con2, con3;
    FsrEasuCon(con0, con1, con2, con3, u_inResolution, u_inResolution, u_outResolution);
    FsrEasuF(c, gl_FragCoord.xy, con0, con1, con2, con3);
    gl_FragColor=vec4(c.xyz, 1);
}
