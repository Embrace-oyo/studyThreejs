uniform vec3 uColor;
uniform float uEdge;
uniform float uProgress;
uniform sampler2D uTexture;

varying float vNoise;
varying float vAngle;

void main(){
    if (vNoise < uProgress) discard;
    if (vNoise > uProgress + uEdge) discard;

    vec2 coord = gl_PointCoord;
    coord = coord - 0.5;// get the coordinate from 0-1 ot -0.5 to 0.5
    coord = coord * mat2(cos(vAngle), sin(vAngle), -sin(vAngle), cos(vAngle));// apply the rotation transformaion
    coord = coord +  0.5;// reset the coordinate to 0-1

    vec4 texture = texture2D(uTexture, coord);

    gl_FragColor = vec4(vec3(uColor.xyz * texture.xyz), 1.0);
}
