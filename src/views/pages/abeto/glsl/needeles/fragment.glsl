layout(location = 1) out highp vec4 gInfo;

uniform Global{ vec2 resolution;float time;float dtRatio; };
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }
vec2 encodeNormal(vec3 n){ n/=(abs(n.x)+abs(n.y)+abs(n.z));return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy); }
vec3 decodeNormal(vec2 f){ vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));float t=max(-n.z, 0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n); }
vec2 encodeNormalUint8(vec3 n){ return encodeNormal(n)*0.5+0.5; }
vec3 deodeNormalUint8(vec2 n){ return decodeNormal(n*2.0-1.0); }
vec2 encodeNormalSpheremap(vec3 n){ float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0; }
vec3 decodeNormalSpheremap(vec2 n){ vec4 nn=vec4(n.xy, 1.0, -1.0);float l=dot(nn.xyz, -nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0, 0.0, -1.0); }
vec2 encodeNormalSpheremapUint8(vec3 n){ return encodeNormalSpheremap(n)*0.5+0.5; }
vec3 deodeNormalSimpleUint8(vec2 n){ return decodeNormalSpheremap(n*2.0-1.0); }

uniform sampler2D tPetal;
uniform sampler2D tNoise;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uOutlineColor;

varying vec3 vNormal;
varying vec2 vUv;
varying vec2 vHighPrecisionZW;
varying vec4 vRandom;
varying float vProgress;
flat varying float vIndex;

void main() {
    vec2 uv = vUv;
    float steppedTime = floor(time * 6.0);

    // uv displacement
    uv.x += sin(uv.y * 25.0 + steppedTime * 2.0) * 0.004;

    // break up outlines
    float noise = texture2D(tNoise, vUv * 0.5 + vRandom.x + steppedTime * 0.02).r;
    noise = smoothstep(0.1, 0.2, noise);
    float outlineContribution = noise;

    // random light/dark color
    vec3 color = mix(uColor1, uColor2, step(0.75, vRandom.z));

    // draw inner lines
    float lines = texture2D(tPetal, uv).r;
    lines = aastep(0.5, lines);
    color = mix(uOutlineColor, color, lines);

    gl_FragColor = vec4(color, fract(vIndex * 4.975645));
    gInfo = vec4(1.0 - (0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5), vec3(encodeNormalSpheremap(normalize(vNormal)), noise));
}
