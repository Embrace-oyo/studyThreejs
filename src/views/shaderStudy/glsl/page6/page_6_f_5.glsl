varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_worldPosition;
uniform samplerCube iChannel0;


float fresnel(float bias, float scale, float power, vec3 I, vec3 N){
    return bias+scale*pow(1.-dot(I, N), power);
}

void main() {
    vec3 col=vec3(0.);
    vec3 objectColor=vec3(1.);
    vec3 lightColor=vec3(.875, .286, .333);
    vec3 normal = normalize(v_normal);

    // ambient
    float ambIntensity=.2;
    vec3 ambient=lightColor*ambIntensity;
    col+=ambient*objectColor;

    // diffuse
    vec3 lightPos=vec3(10., 10., 10.);
    vec3 lightDir=normalize(lightPos-v_worldPosition);
    float diff=dot(normal, lightDir);
    diff=max(diff, 0.);
    vec3 diffuse=lightColor*diff;
    col+=diffuse*objectColor;

    // specular
    vec3 reflectDir=reflect(-lightDir, normal);
    vec3 viewDir=normalize(cameraPosition-v_worldPosition);
    vec3 halfVec=normalize(lightDir+viewDir);
    float spec=dot(normal, halfVec);
    //    float spec=dot(viewDir, reflectDir);
    spec=max(spec, 0.);
    float shininess=32.;
    spec=pow(spec, shininess);
    vec3 specular=lightColor*spec;
    col+=specular*objectColor;

    // IBL
    float iblIntensity=.2;
    vec3 iblCoord=normalize(reflect(-viewDir, normal));
    vec3 ibl=texture(iChannel0, iblCoord).xyz;
    vec3 iblLight=ibl*iblIntensity;
    col+=iblLight*objectColor;

    // fresnel
    vec3 fresColor=vec3(1.);
    float fresIntensity=.6;
    float fres=fresnel(0., 1., 5., viewDir, normal);
    vec3 fresLight=fres*fresColor*fresIntensity;
    col+=fresLight*objectColor;


    gl_FragColor = vec4(col, 1.0);
}
