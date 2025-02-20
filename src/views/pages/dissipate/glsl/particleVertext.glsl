#include "../glsl/snoise.glsl";

uniform float uPixelDensity;
uniform float uBaseSize;
uniform float uFreq;
uniform float uAmp;
uniform float uEdge;
uniform float uProgress;

varying float vNoise;
varying float vAngle;

attribute vec3 aCurrentPos;
attribute float aDist;
attribute float aAngle;

void main() {
    vec3 pos = position;

    float noise = snoise(pos * uFreq) * uAmp;
    vNoise =noise;

    vAngle = aAngle;

    if (vNoise > uProgress-2.0 && vNoise < uProgress + uEdge+2.0){
        pos = aCurrentPos;
    }

    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    float size = uBaseSize * uPixelDensity;
    size = size  / (aDist + 1.0);
    gl_PointSize = size / -viewPosition.z;
}
