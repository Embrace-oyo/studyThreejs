uniform float uPointSize;
uniform float uPixelRatio;

uniform sampler2D texturePosition;

attribute vec2 reference;

void main(){
    vec3 p=texture(texturePosition, reference).xyz;
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p, 1.);

    gl_PointSize=uPointSize*uPixelRatio;
}
