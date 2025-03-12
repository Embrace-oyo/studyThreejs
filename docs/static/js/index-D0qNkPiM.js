import{w as a,n as L,F as y,ak as k,al as C,o as _,P as D,W as F,s as O,h as I,A as G,M as x,am as B,e as E,r as R,f as W,ag as P,V as U,v as V,an as j,O as q,x as Z,H as X,I as $,J as Y,ao as J}from"./threejs-R2oN4ICD.js";import{P as K,l as M,b as Q,m as nn,i as b,c as T,d as w,F as en,n as tn,p as on,e as an,q as rn}from"./vendor-D10xMT_S.js";import{_ as sn}from"../lib/index-CADhc86s.js";const ln="/static/jpg/waternormals-Dfm-ILpY.jpg";var cn=`uniform mat4 textureMatrix;
uniform float time;

varying vec4 mirrorCoord;
varying vec4 worldPosition;

void main() {
    mirrorCoord = modelMatrix * vec4( position, 1.0 );
    worldPosition = mirrorCoord.xyzw;
    mirrorCoord = textureMatrix * mirrorCoord;
    vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}`,hn=`uniform sampler2D mirrorSampler;
uniform float alpha;
uniform float time;
uniform float size;
uniform float distortionScale;
uniform sampler2D normalSampler;
uniform vec3 sunColor;
uniform vec3 sunDirection;
uniform vec3 eye;
uniform vec3 waterColor;

varying vec4 mirrorCoord;
varying vec4 worldPosition;

vec4 getNoise(vec2 uv) {
    vec2 uv0 = (uv / 103.0) + vec2(time / 17.0, time / 29.0);
    vec2 uv1 = uv / 107.0-vec2(time / -19.0, time / 31.0);
    vec2 uv2 = uv / vec2(8907.0, 9803.0) + vec2(time / 101.0, time / 97.0);
    vec2 uv3 = uv / vec2(1091.0, 1027.0) - vec2(time / 109.0, time / -113.0);
    vec4 noise = texture2D(normalSampler, uv0) +
    texture2D(normalSampler, uv1) +
    texture2D(normalSampler, uv2) +
    texture2D(normalSampler, uv3);
    return noise * 0.5 - 1.0;
}

void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor) {
    vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));
    float direction = max(0.0, dot(eyeDirection, reflection));
    specularColor += pow(direction, shiny) * sunColor * spec;
    diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;
}

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

#ifndef saturate

#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )

float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }

highp float rand( const in vec2 uv ) {

    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );

    return fract( sin( sn ) * c );

}

#ifdef HIGH_PRECISION
float precisionSafeLength( vec3 v ) { return length( v ); }
#else
float precisionSafeLength( vec3 v ) {
    float maxComponent = max3( abs( v ) );
    return length( v / maxComponent ) * maxComponent;
}
#endif

struct IncidentLight {
    vec3 color;
    vec3 direction;
    bool visible;
};

struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};

#ifdef USE_ALPHAHASH

varying vec3 vPosition;

#endif

vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

    return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

}

vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {

    
    

    return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );

}

mat3 transposeMat3( const in mat3 m ) {

    mat3 tmp;

    tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
    tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
    tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );

    return tmp;

}

float luminance( const in vec3 rgb ) {

    

    const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );

    return dot( weights, rgb );

}

bool isPerspectiveMatrix( mat4 m ) {

    return m[ 2 ][ 3 ] == - 1.0;

}

vec2 equirectUv( in vec3 dir ) {

    

    float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;

    float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;

    return vec2( u, v );

}

vec3 BRDF_Lambert( const in vec3 diffuseColor ) {

    return RECIPROCAL_PI * diffuseColor;

} 

vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {

    
    

    
    
    float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

    return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

} 

float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {

    
    

    
    
    float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );

    return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );

}
uniform bool receiveShadow;
uniform vec3 ambientLightColor;

#if defined( USE_LIGHT_PROBES )

uniform vec3 lightProbe[ 9 ];

#endif

vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {

    

    float x = normal.x, y = normal.y, z = normal.z;

    
    vec3 result = shCoefficients[ 0 ] * 0.886227;

    
    result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
    result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
    result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;

    
    result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
    result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
    result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
    result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
    result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );

    return result;

}

vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {

    vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );

    vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );

    return irradiance;

}

vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {

    vec3 irradiance = ambientLightColor;

    return irradiance;

}

float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

    #if defined ( LEGACY_LIGHTS )

    if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {

        return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );

    }

    return 1.0;

    #else

    
    
    
    float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );

    if ( cutoffDistance > 0.0 ) {

        distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

    }

    return distanceFalloff;

    #endif

}

float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {

    return smoothstep( coneCosine, penumbraCosine, angleCosine );

}

#if NUM_DIR_LIGHTS > 0

struct DirectionalLight {
    vec3 direction;
    vec3 color;
};

uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];

void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {

    light.color = directionalLight.color;
    light.direction = directionalLight.direction;
    light.visible = true;

}

#endif

#if NUM_POINT_LIGHTS > 0

struct PointLight {
    vec3 position;
    vec3 color;
    float distance;
    float decay;
};

uniform PointLight pointLights[ NUM_POINT_LIGHTS ];

void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {

    vec3 lVector = pointLight.position - geometryPosition;

    light.direction = normalize( lVector );

    float lightDistance = length( lVector );

    light.color = pointLight.color;
    light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
    light.visible = ( light.color != vec3( 0.0 ) );

}

#endif

#if NUM_SPOT_LIGHTS > 0

struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float distance;
    float decay;
    float coneCos;
    float penumbraCos;
};

uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];

void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {

    vec3 lVector = spotLight.position - geometryPosition;

    light.direction = normalize( lVector );

    float angleCos = dot( light.direction, spotLight.direction );

    float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );

    if ( spotAttenuation > 0.0 ) {

        float lightDistance = length( lVector );

        light.color = spotLight.color * spotAttenuation;
        light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
        light.visible = ( light.color != vec3( 0.0 ) );

    } else {

        light.color = vec3( 0.0 );
        light.visible = false;

    }

}

#endif

#if NUM_RECT_AREA_LIGHTS > 0

struct RectAreaLight {
    vec3 color;
    vec3 position;
    vec3 halfWidth;
    vec3 halfHeight;
};

uniform sampler2D ltc_1; 
uniform sampler2D ltc_2; 

uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];

#endif

#if NUM_HEMI_LIGHTS > 0

struct HemisphereLight {
    vec3 direction;
    vec3 skyColor;
    vec3 groundColor;
};

uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];

vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {

    float dotNL = dot( normal, hemiLight.direction );
    float hemiDiffuseWeight = 0.5 * dotNL + 0.5;

    vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );

    return irradiance;

}

#endif
float getShadowMask() {

    float shadow = 1.0;

    #ifdef USE_SHADOWMAP

    #if NUM_DIR_LIGHT_SHADOWS > 0

    DirectionalLightShadow directionalLight;

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {

        directionalLight = directionalLightShadows[ i ];
        shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;

    }
    #pragma unroll_loop_end

    #endif

    #if NUM_SPOT_LIGHT_SHADOWS > 0

    SpotLightShadow spotLight;

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {

        spotLight = spotLightShadows[ i ];
        shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;

    }
    #pragma unroll_loop_end

    #endif

    #if NUM_POINT_LIGHT_SHADOWS > 0

    PointLightShadow pointLight;

    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {

        pointLight = pointLightShadows[ i ];
        shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;

    }
    #pragma unroll_loop_end

    #endif

    

    #endif

    return shadow;

}

void main() {

    vec4 noise = getNoise(worldPosition.xz * size);
    vec3 surfaceNormal = normalize(noise.xzy * vec3(1.5, 1.0, 1.5));

    vec3 diffuseLight = vec3(0.0);
    vec3 specularLight = vec3(0.0);

    vec3 worldToEye = eye-worldPosition.xyz;
    vec3 eyeDirection = normalize(worldToEye);
    sunLight(surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);

    float distance = length(worldToEye);

    vec2 distortion = surfaceNormal.xz * (0.001 + 1.0 / distance) * distortionScale;
    vec3 reflectionSample = vec3(texture2D(mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion));

    float theta = max(dot(eyeDirection, surfaceNormal), 0.0);
    float rf0 = 0.3;
    float reflectance = rf0 + (1.0 - rf0) * pow((1.0 - theta), 5.0);
    vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection)) * waterColor;
    vec3 albedo = mix((sunColor * diffuseLight * 0.3 + scatter) * getShadowMask(), (vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight), reflectance);
    vec3 outgoingLight = albedo;
    gl_FragColor = vec4(outgoingLight, alpha);

    #if defined(TONE_MAPPING)

    gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);

    #endif

    gl_FragColor = linearToOutputTexel(gl_FragColor);

}`;class dn{constructor(e){this.base=e,this.option={clipBias:0,alpha:1,time:0,normalSampler:this.base.waterTexture,sunDirection:new a(0,0,0),sunColor:new L(16777215),waterColor:new L(7695),eye:new a(0,0,0),distortionScale:3.7,side:y,size:1};const n=new k,i=new a,l=new a,d=new a,c=new C,h=new a(0,0,-1),s=new _,u=new a,g=new a,v=new _,p=new C,o=new D;this.renderTarget=new F(512,512),this.seaGeometry=new O(1e4,1e4),this.seaMaterial=new I({name:"seaMaterial",uniforms:{...G.lights,normalSampler:{value:this.option.normalSampler},mirrorSampler:{value:this.renderTarget.texture},alpha:{value:this.option.alpha},time:{value:this.option.time},size:{value:this.option.size},distortionScale:{value:this.option.distortionScale},textureMatrix:{value:p},sunColor:{value:this.option.sunColor},sunDirection:{value:this.option.sunDirection},eye:{value:this.option.eye},waterColor:{value:this.option.waterColor}},vertexShader:cn,fragmentShader:hn,side:y,lights:!0}),this.mesh=new x(this.seaGeometry,this.seaMaterial),this.mesh.rotation.x=-Math.PI/2,this.base.scene.add(this.mesh),this.mesh.onBeforeRender=(t,z,f)=>{if(l.setFromMatrixPosition(this.mesh.matrixWorld),d.setFromMatrixPosition(f.matrixWorld),c.extractRotation(this.mesh.matrixWorld),i.set(0,0,1),i.applyMatrix4(c),u.subVectors(l,d),u.dot(i)>0)return;u.reflect(i).negate(),u.add(l),c.extractRotation(f.matrixWorld),h.set(0,0,-1),h.applyMatrix4(c),h.add(d),g.subVectors(l,h),g.reflect(i).negate(),g.add(l),o.position.copy(u),o.up.set(0,1,0),o.up.applyMatrix4(c),o.up.reflect(i),o.lookAt(g),o.far=f.far,o.updateMatrixWorld(),o.projectionMatrix.copy(f.projectionMatrix),p.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),p.multiply(o.projectionMatrix),p.multiply(o.matrixWorldInverse),n.setFromNormalAndCoplanarPoint(i,l),n.applyMatrix4(o.matrixWorldInverse),s.set(n.normal.x,n.normal.y,n.normal.z,n.constant);const r=o.projectionMatrix;v.x=(Math.sign(s.x)+r.elements[8])/r.elements[0],v.y=(Math.sign(s.y)+r.elements[9])/r.elements[5],v.z=-1,v.w=(1+r.elements[10])/r.elements[14],s.multiplyScalar(2/s.dot(v)),r.elements[2]=s.x,r.elements[6]=s.y,r.elements[10]=s.z+1-this.option.clipBias,r.elements[14]=s.w,this.option.eye.setFromMatrixPosition(f.matrixWorld);const A=t.getRenderTarget(),H=t.xr.enabled,N=t.shadowMap.autoUpdate;this.mesh.visible=!1,t.xr.enabled=!1,t.shadowMap.autoUpdate=!1,t.setRenderTarget(this.renderTarget),t.state.buffers.depth.setMask(!0),t.autoClear===!1&&t.clear(),t.render(z,o),this.mesh.visible=!0,t.xr.enabled=H,t.shadowMap.autoUpdate=N,t.setRenderTarget(A);const S=f.viewport;S!==void 0&&t.state.viewport(S)}}}var fn=`uniform vec3 sunPosition;
uniform float rayleigh;
uniform float turbidity;
uniform float mieCoefficient;
uniform vec3 up;

varying vec3 vWorldPosition;
varying vec3 vSunDirection;
varying float vSunfade;
varying vec3 vBetaR;
varying vec3 vBetaM;
varying float vSunE;

const float e = 2.71828182845904523536028747135266249775724709369995957;
const float pi = 3.141592653589793238462643383279502884197169;

const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );

const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

const float v = 4.0;
const vec3 K = vec3( 0.686, 0.678, 0.666 );

const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

const float cutoffAngle = 1.6110731556870734;
const float steepness = 1.5;
const float EE = 1000.0;

float sunIntensity( float zenithAngleCos ) {
    zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
    return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
}

vec3 totalMie( float T ) {
    float c = ( 0.2 * T ) * 10E-18;
    return 0.434 * c * MieConst;
}

void main() {

    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = worldPosition.xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    gl_Position.z = gl_Position.w; 

    vSunDirection = normalize( sunPosition );

    vSunE = sunIntensity( dot( vSunDirection, up ) );

    vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

    float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

    
    
    vBetaR = totalRayleigh * rayleighCoefficient;

    
    vBetaM = totalMie( turbidity ) * mieCoefficient;

}`,mn=`varying vec3 vWorldPosition;
varying vec3 vSunDirection;
varying float vSunfade;
varying vec3 vBetaR;
varying vec3 vBetaM;
varying float vSunE;

uniform float mieDirectionalG;
uniform vec3 up;

const float pi = 3.141592653589793238462643383279502884197169;

const float n = 1.0003; 
const float N = 2.545E25; 

const float rayleighZenithLength = 8.4E3;
const float mieZenithLength = 1.25E3;

const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

const float THREE_OVER_SIXTEENPI = 0.05968310365946075;

const float ONE_OVER_FOURPI = 0.07957747154594767;

float rayleighPhase( float cosTheta ) {
    return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
}

float hgPhase( float cosTheta, float g ) {
    float g2 = pow( g, 2.0 );
    float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
    return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
}

void main() {

    vec3 direction = normalize( vWorldPosition - cameraPosition );

    
    
    float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
    float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
    float sR = rayleighZenithLength * inverse;
    float sM = mieZenithLength * inverse;

    
    vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

    
    float cosTheta = dot( direction, vSunDirection );

    float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
    vec3 betaRTheta = vBetaR * rPhase;

    float mPhase = hgPhase( cosTheta, mieDirectionalG );
    vec3 betaMTheta = vBetaM * mPhase;

    vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
    Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

    
    float theta = acos( direction.y ); 
    float phi = atan( direction.z, direction.x ); 
    vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
    vec3 L0 = vec3( 0.1 ) * Fex;

    
    float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
    L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

    vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

    vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

    gl_FragColor = vec4( retColor, 1.0 );

    #if defined(TONE_MAPPING)

    gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);

    #endif

    gl_FragColor = linearToOutputTexel(gl_FragColor);

}`;class un{constructor(e){this.base=e,this.parameters={elevation:2,azimuth:180},this.pmremGenerator=new B(this.base.renderer),this.sceneEnv=new E,this.sun=new a,this.renderTarget,this.skyGeometry=new R(1,1,1),this.skyMaterial=new I({name:"SkyShader",uniforms:{turbidity:{value:10},rayleigh:{value:2},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new a},up:{value:new a(0,1,0)}},vertexShader:fn,fragmentShader:mn,side:W,depthWrite:!1}),this.mesh=new x(this.skyGeometry,this.skyMaterial),this.mesh.scale.setScalar(1e4),this.base.scene.add(this.mesh),this.update()}update(){const e=P.degToRad(90-this.parameters.elevation),n=P.degToRad(this.parameters.azimuth);this.sun.setFromSphericalCoords(1,e,n),this.mesh.material.uniforms.sunPosition.value.copy(this.sun),this.base.sea.mesh.material.uniforms.sunDirection.value.copy(this.sun).normalize(),this.renderTarget!==void 0&&this.renderTarget.dispose(),this.sceneEnv.add(this.mesh),this.renderTarget=this.pmremGenerator.fromScene(this.sceneEnv),this.base.scene.add(this.mesh),this.base.scene.environment=this.renderTarget.texture}}function vn(m){return new URL(Object.assign({"../assets/waternormals.jpg":ln})[`../assets/${m}`],import.meta.url).href}class gn{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.devicePixelRatio=window.devicePixelRatio,this.width=this.target.offsetWidth*this.devicePixelRatio,this.height=this.target.offsetHeight*this.devicePixelRatio,this.aspect=this.width/this.height,this.resolution=new U(this.width,this.height),this.renderer=new V({powerPreference:"high-performance",alpha:!0,antialias:!0,preserveDrawingBuffer:!0}),this.renderer.setPixelRatio(window.devicePixelRatio),this.renderer.setSize(this.width,this.height),this.renderer.toneMapping=j,this.renderer.toneMappingExposure=.5,this.scene=new E,this.scene.background=new L("gray"),this.target.appendChild(this.renderer.domElement),this.camera=new D(55,this.aspect,.1,5e4),this.camera.position.set(30,30,100),this.camera.lookAt(new a(0,0,0)),this.controls=new q(this.camera,this.renderer.domElement),this.controls.maxPolarAngle=Math.PI*.495,this.controls.target.set(0,10,0),this.controls.minDistance=40,this.controls.maxDistance=200,this.controls.update(),this.clock=new Z,this.assetsInit()}assetsInit(){this.manager=new X,this.waterTexture=new $(this.manager).load(vn("waternormals.jpg")),this.waterTexture.wrapS=this.waterTexture.wrapT=Y,this.manager.onLoad=()=>{console.info("%c资源加载完成!✅","color:#fff;background-color:red"),this.callback(),this.worldInit(),this.animation(),this.resize(),this.paneInit()}}worldInit(){this.sea=new dn(this),this.sky=new un(this);const e=new R(30,30,30),n=new J({roughness:0});this.cube=new x(e,n),this.scene.add(this.cube)}animation(){this.renderer.setAnimationLoop(()=>this.animation());const e=this.clock.getDelta(),n=performance.now()*.001;this.controls.update(),this.cube.position.y=Math.sin(n)*20+5,this.cube.rotation.x=n*.5,this.cube.rotation.z=n*.51,this.sea.mesh.material.uniforms.time.value+=e,this.renderer.render(this.scene,this.camera)}paneInit(){this.pane=new K({container:this.parent}),this.skyFolder=this.pane.addFolder({title:"天空",expanded:!0}),this.skyFolder.addBinding(this.sky.parameters,"elevation",{min:0,max:360,step:.01,label:"海拔"}).on("change",()=>{this.sky.update()}),this.skyFolder.addBinding(this.sky.parameters,"azimuth",{min:-180,max:180,step:.01,label:"方位角"}).on("change",()=>{this.sky.update()}),this.seaFolder=this.pane.addFolder({title:"海洋",expanded:!0}),this.seaFolder.addBinding(this.sea.mesh.material.uniforms.distortionScale,"value",{min:0,max:8,step:.01,label:"失真度"}),this.seaFolder.addBinding(this.sea.mesh.material.uniforms.size,"value",{min:.1,max:10,step:.01,label:"size"})}resize(){window.addEventListener("resize",()=>{this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.resolution.set(this.width,this.height),this.aspect=this.width/this.height,this.camera.updateProjectionMatrix(),this.renderer.setSize(this.width,this.height)})}destroy(){this.scene.traverse(e=>{var n;e instanceof x&&((n=e.geometry)==null||n.dispose(),Object.values(e.material).forEach(i=>{i&&typeof i.dispose=="function"&&i.dispose()}))}),this.renderer.dispose(),this.sky.renderTarget.dispose(),this.sky.pmremGenerator.dispose(),this.sea.renderTarget.dispose()}}const pn={class:"ocean"},wn={class:"load"},xn={__name:"index",setup(m){const e=M(!1);M(0);let n=null;const i=()=>{e.value=!0};return Q(()=>{n=new gn({parent:document.querySelector(".ocean"),target:document.querySelector(".canvas"),callback:i})}),nn(()=>{n.destroy(),n=null,console.info("%c海洋-销毁😁","color:#fff;background-color:red")}),(l,d)=>(b(),T("div",pn,[w("div",{class:rn(["loading",{loadOk:e.value}])},[w("div",wn,[(b(),T(en,null,tn("LOADING...",(c,h)=>w("span",{key:h,style:on("--i:"+h)},an(c),5)),64))])],2),d[0]||(d[0]=w("div",{class:"canvas"},null,-1))]))}},Cn=sn(xn,[["__scopeId","data-v-7e55b1d8"]]);export{Cn as default};
