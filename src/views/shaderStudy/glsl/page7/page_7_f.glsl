varying vec2 v_uv;
uniform vec2 iResolution;

float sdCircle(vec2 p, float r){
    return length(p)-r;
}

float sdSphere(vec3 p, float r){
    return length(p)-r;
}

float map(vec3 p){
    float d = sdSphere(p-vec3(0., 0., -2.), 1.);
    return d;
}

vec3 calcNormal(in vec3 p){
    const float h=.0001;
    const vec2 k=vec2(1, -1);
    return normalize(k.xyy*map(p+k.xyy*h)+
    k.yyx*map(p+k.yyx*h)+
    k.yxy*map(p+k.yxy*h)+
    k.xxx*map(p+k.xxx*h));
}

void main() {
    vec2 uv = v_uv;
    uv = (uv - 0.5) * 2.0;
    uv.x *= iResolution.x / iResolution.y;

    vec3 ro = vec3(0., 0., 1.);

    vec3 rd = normalize(vec3(uv, 0.)-ro);

    vec3 col=vec3(0.);

    float depth=0.;

    for (int i=0;i<64;i++){
        vec3 p = ro + rd * depth;
        float d = map(p);
        depth += d;
        if (d < .01){
            col = vec3(0.);
            vec3 normal = calcNormal(p);

            vec3 objectColor=vec3(1.);
            vec3 lightColor=vec3(.875, .286, .333);

            // ambient
            float ambIntensity=.2;
            vec3 ambient=lightColor*ambIntensity;
            col+=ambient*objectColor;

            // diffuse
            vec3 lightPos=vec3(10., 10., 10.);
            vec3 lightDir=normalize(lightPos-p);
            float diff=dot(normal, lightDir);
            diff=max(diff, 0.);
            vec3 diffuse=lightColor*diff;
            col+=diffuse*objectColor;

            // specular
            vec3 reflectDir=reflect(-lightDir, normal);
            vec3 viewDir=normalize(ro-p);
            vec3 halfVec=normalize(lightDir+viewDir);
            float spec=dot(normal, halfVec);
            spec=max(spec, 0.);
            float shininess=32.;
            spec=pow(spec, shininess);
            vec3 specular=lightColor*spec;
            col+=specular*objectColor;

            break;
        }
    }

    gl_FragColor = vec4(col, 1.0);
}
