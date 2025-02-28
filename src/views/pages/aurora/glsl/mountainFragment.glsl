#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;

#include <fog_pars_fragment>

float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rand2(vec2 p)
{
    p = vec2(dot(p, vec2(12.9898,78.233)), dot(p, vec2(26.65125, 83.054543)));
    return fract(sin(p) * 43758.5453);
}

float rand(vec2 p)
{
    return fract(sin(dot(p.xy ,vec2(54.90898,18.233))) * 4337.5453);
}

void main() {
    float offset = random(vec2(gl_FragCoord.w));
    vec2 c = vUv;
    vec2 p = vUv;
    p *= .3;
    p.y = p.y * 30. - 4.;
    p.x = p.x * (80. * offset) + 14.8 * offset;
    vec2 q = (p - vec2(0.5,0.5)) * 1.;
    // p = q;
    vec3 col = vec3(0.);

    float h = max(
    .0,
    max(
    max(
    abs(fract(p.x)-.5)-.25,
    3.*(abs(fract(.7*p.x+.4)-.5)-.4)
    ),
    max(
    1.2*(abs(fract(.8*p.x+.6)-.5)-.2),
    .3*(abs(fract(.5*p.x+.2)-.5))
    )
    )
    );
    float fill = 1.0 - smoothstep(h, h+.001, p.y);

    vec3 col2 = col * min(fill, 2.0);

    gl_FragColor = vec4(col2, fill);

    #ifdef USE_FOG
    #ifdef USE_LOGDEPTHBUF_EXT
    float depth = gl_FragDepthEXT / gl_FragCoord.w;
    #else
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    #endif
    float fogFactor = smoothstep(fogNear, fogFar, depth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
    #endif
}
