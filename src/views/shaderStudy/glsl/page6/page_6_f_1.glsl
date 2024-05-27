varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_worldPosition;
void main() {
    vec3 col=vec3(0.);
    vec3 objectColor=vec3(1.);
    vec3 lightColor=vec3(.875, .286, .333);

    // ambient
    float ambIntensity=.2;
    vec3 ambient=lightColor*ambIntensity;
    col+=ambient*objectColor;

    // diffuse
    vec3 lightPos=vec3(10., 10., 10.);
    vec3 lightDir=normalize(lightPos-v_worldPosition);
    float diff=dot(v_normal, lightDir);
    diff=max(diff, 0.);
    vec3 diffuse=lightColor*diff;
    col+=diffuse*objectColor;

    gl_FragColor = vec4(col, 1.0);
}
