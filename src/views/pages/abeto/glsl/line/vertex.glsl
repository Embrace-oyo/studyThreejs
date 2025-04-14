attribute float uvy;

uniform Global{vec2 resolution;float time;float dtRatio;};

uniform sampler2D tTexture1;
uniform float lineWidth;

varying vec2 vUv;
varying vec2 vHighPrecisionZW;

float parabola(float x,float k){return pow(4.0*x*(1.0-x),k);}float pcurve(float x,float a,float b){float k=pow(a+b,a+b)/(pow(a,a)*pow(b,b));return k*pow(x,a)*pow(1.0-x,b);}

float when_eq(float x, float y) {
    return 1.0 - abs(sign(x - y));
}

void main() {
    vUv = uv;

    vec3 current = texelFetch(tTexture1, ivec2(position.x, uvy), 0).xyz;
    vec3 previous = texelFetch(tTexture1, ivec2(position.y, uvy), 0).xyz;
    vec3 next = texelFetch(tTexture1, ivec2(position.z, uvy), 0).xyz;

    mat4 projViewModel = projectionMatrix * modelViewMatrix;
    vec4 currentProjected = projViewModel * vec4(current, 1.0);
    vec4 previousProjected = projViewModel * vec4(previous, 1.0);
    vec4 nextProjected = projViewModel * vec4(next, 1.0);

    vec2 aspectVec = vec2(resolution.x / resolution.y, 1.0);

    vec2 currentScreen = currentProjected.xy / currentProjected.w * aspectVec;
    vec2 previousScreen = previousProjected.xy / previousProjected.w * aspectVec;
    vec2 nextScreen = nextProjected.xy / nextProjected.w * aspectVec;

    vec2 dir1 = normalize(currentScreen - previousScreen);
    vec2 dir2 = normalize(nextScreen - currentScreen);
    vec2 dir = normalize(dir1 + dir2);

    dir = mix(dir, dir1, when_eq(position.x, position.z));
    dir = mix(dir, dir2, when_eq(position.x, position.y));

    vec2 normal = vec2(-dir.y, dir.x);
    normal.x /= aspectVec.x;
    float w = lineWidth;

    #if SHAPE == 1
    w *= uv.x;
    #elif SHAPE == 2
    w *= 1.0 - uv.x;
    #elif SHAPE == 3
    w *= parabola(uv.x, 1.0);
    #endif

    normal *= w;
    currentProjected.xy += normal * mix(1.0, -1.0, step(0.5, uv.y));

    gl_Position = currentProjected;
    vHighPrecisionZW = gl_Position.zw;
}
