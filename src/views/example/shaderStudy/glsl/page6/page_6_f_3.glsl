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

    // specular
    vec3 reflectDir=reflect(-lightDir, v_normal);
    vec3 viewDir=normalize(cameraPosition-v_worldPosition);
    vec3 halfVec=normalize(lightDir+viewDir);
    float spec=dot(v_normal, halfVec);
    //    float spec=dot(viewDir, reflectDir);
    spec=max(spec, 0.);
    float shininess=32.;
    spec=pow(spec, shininess);
    vec3 specular=lightColor*spec;
    col+=specular*objectColor;


    gl_FragColor = vec4(col, 1.0);
}
