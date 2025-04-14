uniform Global{ vec2 resolution;float time;float dtRatio; };

uniform sampler2D tLogo;
uniform sampler2D tDiffuse;
uniform sampler2D tInfo;
uniform sampler2D tSim;

uniform float uCameraNear;
uniform float uCameraFar;

uniform vec2 uOutlineFade;
uniform float uOutlineThickness;
uniform vec3 uOutlineColor;
uniform float uOutlineScale;

uniform vec3 uInfoRange;
uniform vec3 uDepthRange;
uniform vec3 uNormalRange;
uniform float uSmoothMargin;
uniform float uInfoMinScale;

varying vec2 vUv;

float efit(float x, float a1, float a2, float b1, float b2){ return b1+((x-a1)*(b2-b1))/(a2-a1); }
float fit(float x, float a1, float a2, float b1, float b2){ return clamp(efit(x, a1, a2, b1, b2), min(b1, b2), max(b1, b2)); }
float fit01(float x, float a1, float a2){ return fit(x, 0.0, 1.0, a1, a2); }
float fit10(float x, float a1, float a2){ return fit(x, 1.0, 0.0, a1, a2); }
float fit11(float x, float a1, float a2){ return fit(x, -1.0, 1.0, a1, a2); }
vec3 efit(vec3 x, vec3 a1, vec3 a2, vec3 b1, vec3 b2){ return b1+((x-a1)*(b2-b1))/(a2-a1); }
vec3 fit(vec3 x, vec3 a1, vec3 a2, vec3 b1, vec3 b2){ return clamp(efit(x, a1, a2, b1, b2), min(b1, b2), max(b1, b2)); }
vec3 fit01(vec3 x, vec3 a1, vec3 a2){ return fit(x, vec3(0.0), vec3(1.0), a1, a2); }
vec3 fit10(vec3 x, vec3 a1, vec3 a2){ return fit(x, vec3(1.0), vec3(0.0), a1, a2); }
vec3 fit11(vec3 x, vec3 a1, vec3 a2){ return fit(x, vec3(-1.0), vec3(1.0), a1, a2); }
float getDepth(sampler2D depth, vec2 uv){ return texture(depth, uv).x; }
highp float linearizeDepthLog(highp float depth, highp float near, highp float far){ float d=pow(2.0, depth*log2(far+1.0))-1.0;float a=far/(far-near);float b=far*near/(near-far);return a+b/d; }
highp float perspectiveDepthToViewZ(highp float depth, highp float near, highp float far){ return (near*far)/((far-near)*depth-far); }
highp float orthographicDepthToViewZ(highp float depth, highp float near, highp float far){ return depth*(near-far)-near; }
float viewZToPerspectiveDepth(float viewZ, float near, float far){ return ((near+viewZ)*far)/((far-near)*viewZ); }
float viewZToOrthographicDepth(float viewZ, float near, float far){ return (viewZ+near)/(near-far); }
float getViewZ(float depth, float near, float far){
    float fragCoordZ=depth;
    #ifdef ORTHOGRAPHIC_CAMERA
    return orthographicDepthToViewZ(fragCoordZ, near, far);
    #else
    #ifdef LOGDEPTH
    fragCoordZ=linearizeDepthLog(fragCoordZ, near, far);
    #endif
    return perspectiveDepthToViewZ(fragCoordZ, near, far);
    #endif
}
float getViewZ(sampler2D depth, vec2 uv, float near, float far){ return getViewZ(getDepth(depth, uv), near, far); }
float getLinearDepth(float depth, float near, float far){
    float fragCoordZ=depth;
    #ifdef ORTHOGRAPHIC_CAMERA
    return fragCoordZ;
    #else
    #ifdef LOGDEPTH
    fragCoordZ=linearizeDepthLog(fragCoordZ, near, far);
    #endif
    float viewZ=perspectiveDepthToViewZ(fragCoordZ, near, far);return viewZToOrthographicDepth(viewZ, near, far);
    #endif
}
float getLinearDepth(sampler2D depth, vec2 uv, float near, float far){ return getLinearDepth(getDepth(depth, uv), near, far); }
vec3 getViewPosition(float depth, vec2 uv, float near, float far, mat4 projMat){
    float viewZ=getViewZ(depth, near, far);
    #ifdef LOGDEPTH
    float d=linearizeDepthLog(depth, near, far);
    #else
    float d=depth;
    #endif
    float clipW=projMat[2][3]*viewZ+projMat[3][3];vec4 clipPosition=vec4((vec3(uv, d)-0.5)*2.0, 1.0);clipPosition*=clipW;return (inverse(projMat)*clipPosition).xyz;
}
vec3 getViewPosition(sampler2D depth, vec2 uv, float near, float far, mat4 projMat){ return getViewPosition(getDepth(depth, uv), uv, near, far, projMat); }
vec3 getWorldPosition(float depth, vec2 uv, float near, float far, mat4 projMat, mat4 worldMat){ return (worldMat*vec4(getViewPosition(depth, uv, near, far, projMat), 1.0)).xyz; }
vec3 getWorldPosition(sampler2D depth, vec2 uv, float near, float far, mat4 projMat, mat4 worldMat){ return (worldMat*vec4(getViewPosition(getDepth(depth, uv), uv, near, far, projMat), 1.0)).xyz; }
vec3 getViewNormal(sampler2D depth, vec2 uv, float near, float far, mat4 projMat){ vec2 depthres=vec2(textureSize(depth, 0));ivec2 p=ivec2(uv*depthres);float c0=texelFetch(depth, p, 0).x;float l2=texelFetch(depth, p-ivec2(2, 0), 0).x;float l1=texelFetch(depth, p-ivec2(1, 0), 0).x;float r1=texelFetch(depth, p+ivec2(1, 0), 0).x;float r2=texelFetch(depth, p+ivec2(2, 0), 0).x;float b2=texelFetch(depth, p-ivec2(0, 2), 0).x;float b1=texelFetch(depth, p-ivec2(0, 1), 0).x;float t1=texelFetch(depth, p+ivec2(0, 1), 0).x;float t2=texelFetch(depth, p+ivec2(0, 2), 0).x;float dl=abs((2.0*l1-l2)-c0);float dr=abs((2.0*r1-r2)-c0);float db=abs((2.0*b1-b2)-c0);float dt=abs((2.0*t1-t2)-c0);vec3 ce=getViewPosition(c0, uv, near, far, projMat).xyz;vec3 dpdx=(dl<dr)? ce-getViewPosition(l1, (uv-vec2(1.0/depthres.x, 0.0)), near, far, projMat).xyz:-ce+getViewPosition(r1, (uv+vec2(1.0/depthres.x, 0.0)), near, far, projMat).xyz;vec3 dpdy=(db<dt)? ce-getViewPosition(b1, (uv-vec2(0.0, 1.0/depthres.y)), near, far, projMat).xyz:-ce+getViewPosition(t1, (uv+vec2(0.0, 1.0/depthres.y)), near, far, projMat).xyz;return normalize(cross(dpdx, dpdy)); }
vec3 getWorldNormal(sampler2D depth, vec2 uv, float near, float far, mat4 projMat, mat4 worldMat){ vec2 depthres=vec2(textureSize(depth, 0));ivec2 p=ivec2(uv*depthres);float c0=texelFetch(depth, p, 0).x;float l2=texelFetch(depth, p-ivec2(2, 0), 0).x;float l1=texelFetch(depth, p-ivec2(1, 0), 0).x;float r1=texelFetch(depth, p+ivec2(1, 0), 0).x;float r2=texelFetch(depth, p+ivec2(2, 0), 0).x;float b2=texelFetch(depth, p-ivec2(0, 2), 0).x;float b1=texelFetch(depth, p-ivec2(0, 1), 0).x;float t1=texelFetch(depth, p+ivec2(0, 1), 0).x;float t2=texelFetch(depth, p+ivec2(0, 2), 0).x;float dl=abs((2.0*l1-l2)-c0);float dr=abs((2.0*r1-r2)-c0);float db=abs((2.0*b1-b2)-c0);float dt=abs((2.0*t1-t2)-c0);vec3 ce=getWorldPosition(c0, uv, near, far, projMat, worldMat).xyz;vec3 dpdx=(dl<dr)? ce-getWorldPosition(l1, (uv-vec2(1.0/depthres.x, 0.0)), near, far, projMat, worldMat).xyz:-ce+getWorldPosition(r1, (uv+vec2(1.0/depthres.x, 0.0)), near, far, projMat, worldMat).xyz;vec3 dpdy=(db<dt)? ce-getWorldPosition(b1, (uv-vec2(0.0, 1.0/depthres.y)), near, far, projMat, worldMat).xyz:-ce+getWorldPosition(t1, (uv+vec2(0.0, 1.0/depthres.y)), near, far, projMat, worldMat).xyz;return normalize(cross(dpdx, dpdy)); }
vec2 encodeNormal(vec3 n){ n/=(abs(n.x)+abs(n.y)+abs(n.z));return (n.z>=0.0)? n.xy :(1.0-abs(n.yx))*sign(n.xy); }
vec3 decodeNormal(vec2 f){ vec3 n=vec3(f, 1.0-abs(f.x)-abs(f.y));float t=max(-n.z, 0.0);n.x+=(n.x>0.0)?-t : t;n.y+=(n.y>0.0)?-t : t;return normalize(n); }
vec2 encodeNormalUint8(vec3 n){ return encodeNormal(n)*0.5+0.5; }
vec3 deodeNormalUint8(vec2 n){ return decodeNormal(n*2.0-1.0); }
vec2 encodeNormalSpheremap(vec3 n){ float f=sqrt(8.0*n.z+8.0);return n.xy/f*2.0; }
vec3 decodeNormalSpheremap(vec2 n){ vec4 nn=vec4(n.xy, 1.0, -1.0);float l=dot(nn.xyz, -nn.xyw);nn.z=l;nn.xy*=sqrt(l);return nn.xyz*2.0+vec3(0.0, 0.0, -1.0); }
vec2 encodeNormalSpheremapUint8(vec3 n){ return encodeNormalSpheremap(n)*0.5+0.5; }
vec3 deodeNormalSimpleUint8(vec2 n){ return decodeNormalSpheremap(n*2.0-1.0); }
float outline(sampler2D tColor, sampler2D tInfo, vec2 uv, float outlineWidth, float scale, vec3 idRange, vec3 depthRange, vec3 normalRange, float rangeSmoothMargin, float idMinScale, vec2 distanceFadeRange){ vec2 offset=1.0/vec2(textureSize(tInfo, 0))*outlineWidth*scale;float contributions[5];float faceIds[5];float distances[5];vec3 normals[5];vec4 n=texture(tInfo, uv+offset*vec2(0, 0));contributions[0]=n.a;distances[0]=1.0-n.r;normals[0]=decodeNormalSpheremap(n.gb);faceIds[0]=texture(tColor, uv+offset*vec2(0, 0)).a;n=texture(tInfo, uv+offset*vec2(-1, 0));contributions[1]=n.a;distances[1]=1.0-n.r;normals[1]=decodeNormalSpheremap(n.gb);faceIds[1]=texture(tColor, uv+offset*vec2(-1, 0)).a;n=texture(tInfo, uv+offset*vec2(1, 0));contributions[2]=n.a;distances[2]=1.0-n.r;normals[2]=decodeNormalSpheremap(n.gb);faceIds[2]=texture(tColor, uv+offset*vec2(1, 0)).a;n=texture(tInfo, uv+offset*vec2(0, -1));contributions[3]=n.a;distances[3]=1.0-n.r;normals[3]=decodeNormalSpheremap(n.gb);faceIds[3]=texture(tColor, uv+offset*vec2(0, -1)).a;n=texture(tInfo, uv+offset*vec2(0, 1));contributions[4]=n.a;distances[4]=1.0-n.r;normals[4]=decodeNormalSpheremap(n.gb);faceIds[4]=texture(tColor, uv+offset*vec2(0, 1)).a;float centerId=faceIds[0];float centerDistance=distances[0];float centerContribution=contributions[0];vec3 centerNormal=normals[0];vec2 idVariation=vec2((faceIds[1]-centerId)-(faceIds[2]-centerId), (faceIds[3]-centerId)-(faceIds[4]-centerId));vec2 distanceVariation=vec2((distances[1]-centerDistance)-(distances[2]-centerDistance), (distances[3]-centerDistance)-(distances[4]-centerDistance));vec2 normalVariation=vec2(distance(normals[1], centerNormal)-distance(normals[2], centerNormal), distance(normals[3], centerNormal)-distance(normals[4], centerNormal));float idVariationTotal=sqrt((idVariation.x*idVariation.x)+(idVariation.y*idVariation.y));float distanceVariationTotal=sqrt((distanceVariation.x*distanceVariation.x)+(distanceVariation.y*distanceVariation.y));float normalVariationTotal=sqrt((normalVariation.x*normalVariation.x)+(normalVariation.y*normalVariation.y));float idContribution=fit(fit(idVariationTotal, idRange.x, idRange.y, 0.0, 1.0), idRange.z, idRange.z+rangeSmoothMargin, 0.0, 1.0);idContribution=mix(idContribution*idMinScale, idContribution, clamp(scale, 0.0, 1.0));float normalContribution=fit(fit(normalVariationTotal, normalRange.x, normalRange.y, 0.0, 1.0), normalRange.z, normalRange.z+rangeSmoothMargin, 0.0, 1.0);float depthLimit=depthRange.z+1.0-centerNormal.z;float depthContribution=fit(fit(distanceVariationTotal, depthRange.x, depthRange.y, 0.0, 1.0), depthLimit, depthLimit+rangeSmoothMargin, 0.0, 1.0);float minDistance=centerDistance;float minContrib=centerContribution;
    #pragma unroll_loop_start
    for (int i=1;i<5;i++){ if (distances[i]<minDistance){ minDistance=distances[i];minContrib=contributions[i]; } }
    #pragma unroll_loop_end
    if (minDistance<centerDistance){ if (minContrib>centerContribution)centerContribution=max(centerContribution, ceil(minContrib)); else centerContribution=min(centerContribution, floor(minContrib)); }centerContribution*=fit(-getViewZ(minDistance, uCameraNear, uCameraFar), distanceFadeRange.x, distanceFadeRange.y, 1.0, 0.0);return clamp(idContribution+normalContribution+depthContribution, 0.0, 1.0)*centerContribution;
}
float aastep(float threshold, float value){ float afwidth=length(vec2(dFdx(value), dFdy(value)))*0.70710678118654757;return smoothstep(threshold-afwidth, threshold+afwidth, value); }

uniform sampler2D tNoise;

uniform sampler2D tTransition;
uniform vec3 uBgColor;
uniform float uProgress1;
uniform float uProgress2;
uniform float uProgress3;
uniform float uProgress4;

mat2 rotateAngle(float a) {
    float s = sin(a);
    float c = cos(a);
    mat2 m = mat2(c, s, -s, c);
    return m;
}

vec3 hash32(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    return fract((p3.xxy+p3.yzz)*p3.zyx);
}

void main() {
    vec2 uv = vUv;
    float aspect = resolution.x / resolution.y;

    // get scene color
    vec4 scene = texture2D(tDiffuse, uv);
    vec3 sceneColor = scene.rgb;

    // compensate outline with resolution
    float resScale = min(1.0, resolution.y / 1300.0) * uOutlineScale;

    float outlineValue = outline(tDiffuse, tInfo, vUv, uOutlineThickness, resScale, uInfoRange, uDepthRange, uNormalRange, uSmoothMargin, uInfoMinScale, uOutlineFade);
    sceneColor = mix(sceneColor, uOutlineColor, outlineValue);

    vec2 screenUv = gl_FragCoord.xy / resolution.xy;
    screenUv.x *= aspect;
    uv -= 0.5;
    uv.x *= aspect;
    uv *= 2.2;
    uv += 0.5;

    // add some noise distortion to text uvs
    vec2 noiseUv = screenUv * 3.5;
    float steppedTime = floor(time * 6.0) * 3.14159 * 0.2;
    noiseUv = rotateAngle(steppedTime) * noiseUv;
    vec2 n0 = texture2D(tNoise, noiseUv).rg;
    uv += n0 * 0.0035;

    // text
    float logo = texture2D(tLogo, uv).r;
    logo = aastep(0.5, logo);

    // begin transition
    vec2 transitionUv = vUv;

    // adjust transition uvs for mobile
    if (resolution.y > resolution.x) {
        transitionUv -= 0.5;
        transitionUv *= resolution / max(resolution.x, resolution.y);
        transitionUv += 0.5;
    }

    float transitionNoise = texture2D(tTransition, transitionUv).r;
    vec3 sceneSansText = sceneColor;
    vec3 outlineColor = mix(uBgColor, uOutlineColor, outlineValue);

    // superimpose text
    vec3 finalColor = mix(sceneColor, vec3(1.0), logo);

    // apply final scene color
    sceneColor = finalColor;

    // overwrite final scene color for intro transition
    if (uProgress4 < 1.0) {
        // transition phase 1
        float progress1 = uProgress1;
        sceneColor = mix(uBgColor, vec3(1.0), step(progress1, transitionNoise));

        // transition phase 2
        float progress2 = uProgress2;
        sceneColor = mix(outlineColor, sceneColor, step(progress2, transitionNoise));

        // transition phase 3
        float progress3 = uProgress3;
        sceneColor = mix(sceneSansText, sceneColor, step(progress3, transitionNoise));

        // transition phase 4
        float progress4 = uProgress4;
        sceneColor = mix(finalColor, sceneColor, step(progress4, transitionNoise));
    }

    // film grain
    vec3 noise = hash32(uv * 100.0 + steppedTime);
    noise *= 2.0;
    noise -= 1.0;
    sceneColor += noise * 0.075;

    // fluid debug
    // gl_FragColor = vec4(vec3(texture(tSim, vUv).rgb), 1.0);

    // outline debug
    // gl_FragColor = vec4(vec3(outlineValue), 1.0); // debug

    gl_FragColor = vec4(sceneColor, 1.0);
}
