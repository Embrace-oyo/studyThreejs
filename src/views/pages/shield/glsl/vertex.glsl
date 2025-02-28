varying vec2 vUv;
varying float vIntensity;
uniform float uThickness;
varying vec3 vPos;
void main(){
    vUv = uv;
    vPos = position;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vec3 worldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
    vec3 dirToCamera = normalize(cameraPosition - worldNormal.xyz);
    vIntensity = 1.0 - dot(worldNormal, dirToCamera);
    vIntensity = pow(vIntensity, uThickness);


    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
