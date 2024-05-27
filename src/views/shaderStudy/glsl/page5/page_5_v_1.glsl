varying vec2 v_uv;
uniform float iTime;

vec3 distort(vec3 p){
    p.x+=sin(p.y * 10.0 + iTime) * 0.25;
    return p;
}

void main() {
    v_uv = uv;
    vec3 p = position;
    p = distort(p);
    gl_Position= projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
