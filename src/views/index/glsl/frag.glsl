uniform float time;
uniform float progress;
uniform float intensity;
uniform float width;
uniform float scaleX;
uniform float scaleY;
uniform float transition;
uniform float radius;
uniform float swipe;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D displacement;
uniform vec4 resolution;
varying vec2 vUv;
mat2 getRotM(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}
const float PI = 3.1415;
const float angle1 = PI *-0.25;
const float angle2 = PI *0.75;
const float angle = 1.55;

void main()	{
    vec2 newUV = (vUv + vec2(0.0))*resolution.wz + vec2(0.0);
    vec4 disp = texture2D(displacement, vUv);
    vec2 dispVec = vec2(disp.r, disp.g);


    vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * 1.40 * progress*-0.3;
    vec4 t1 = texture2D(texture1, distortedPosition1);
    vec2 distortedPosition1g = vUv + getRotM(angle1) * dispVec * 1.40 * progress*0.4;
    vec4 t1g = texture2D(texture1, distortedPosition1g);
    vec2 distortedPosition1r = vUv + getRotM(angle1) * dispVec * 1.40 * progress*1.2;
    vec4 t1r = texture2D(texture1, distortedPosition1r);



    vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * 1.40 * (1.0 - progress)*-0.3;
    vec4 t2 = texture2D(texture2, distortedPosition2);
    vec2 distortedPosition2g = vUv + getRotM(angle2) * dispVec * 1.40 * (1.0 - progress)*0.4;
    vec4 t2g = texture2D(texture2, distortedPosition2g);
    vec2 distortedPosition2r = vUv + getRotM(angle2) * dispVec * 1.40 * (1.0 - progress)*1.2;
    vec4 t2r = texture2D(texture2, distortedPosition2r);


    gl_FragColor = mix(vec4(t1r.r,t1g.g,t1.b,t1g.a), vec4(t2r.r,t2g.g,t2.b,t2g.a), progress);
}
