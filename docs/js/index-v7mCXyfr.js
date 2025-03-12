import{ax as d,s as u,W as f,ay as g,y as s,M as i,F as b,f as M,U as R,k as z,l as p,a1 as D,e as I,n as h,P as L,w as x,x as T,O as A,ad as O,V as S,H as F,I as W,az as P}from"./threejs-R2oN4ICD.js";import{_ as k}from"../lib/index-xycz1Eof.js";import{l as y,b as E,m as V,i as w,c as _,d as l,F as j,n as H,p as N,e as U,q as B}from"./vendor-D10xMT_S.js";const $=""+new URL("../png/negx-BZXF1WCu.png",import.meta.url).href,G=""+new URL("../png/negy-BxnsZrKn.png",import.meta.url).href,q=""+new URL("../png/negz-CIKPOJjo.png",import.meta.url).href,X=""+new URL("../png/posx-CkmFNUx9.png",import.meta.url).href,K=""+new URL("../png/posy-WjQtEcX9.png",import.meta.url).href,Z=""+new URL("../png/posz-oMpNLhAn.png",import.meta.url).href,J=""+new URL("../jpg/tiles-CyC06c8e.jpg",import.meta.url).href;var v=`attribute vec3 position;
varying vec2 coord;

void main() {
    coord = position.xy * 0.5 + 0.5;

    gl_Position = vec4(position.xyz, 1.0);
}`,Q=`precision highp float;
precision highp int;

const float PI = 3.141592653589793;
uniform sampler2D texture;
uniform vec2 center;
uniform float radius;
uniform float strength;
varying vec2 coord;

void main() {
    
    vec4 info = texture2D(texture, coord);

    /* Add the drop to the height */
    float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - coord) / radius);
    drop = 0.5 - cos(drop * PI) * 0.5;
    info.r += drop * strength;

    gl_FragColor = info;
}`,Y=`precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 delta;
varying vec2 coord;

void main() {
    
    vec4 info = texture2D(texture, coord);

    /* update the normal */
    vec3 dx = vec3(delta.x, texture2D(texture, vec2(coord.x + delta.x, coord.y)).r - info.r, 0.0);
    vec3 dy = vec3(0.0, texture2D(texture, vec2(coord.x, coord.y + delta.y)).r - info.r, delta.y);
    info.ba = normalize(cross(dy, dx)).xz;

    gl_FragColor = info;
}`,ee=`precision highp float;
precision highp int;

uniform sampler2D texture;
uniform vec2 delta;
varying vec2 coord;

void main() {
    
    vec4 info = texture2D(texture, coord);

    /* calculate average neighbor height */
    vec2 dx = vec2(delta.x, 0.0);
    vec2 dy = vec2(0.0, delta.y);
    float average = (
    texture2D(texture, coord - dx).r +
    texture2D(texture, coord - dy).r +
    texture2D(texture, coord + dx).r +
    texture2D(texture, coord + dy).r
    ) * 0.25;

    /* change the velocity to move toward the average */
    info.g += (average - info.r) * 2.0;

    /* attenuate the velocity a little so waves do not last forever */
    info.g *= 0.995;

    /* move the vertex along the velocity */
    info.r += info.g;

    gl_FragColor = info;
}`,te=`uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform sampler2D water;

attribute vec3 position;

varying vec3 eye;
varying vec3 pos;

void main() {
    vec4 info = texture2D(water, position.xy * 0.5 + 0.5);
    pos = position.xzy;
    pos.y += info.r;

    vec3 axis_x = vec3(modelViewMatrix[0].x, modelViewMatrix[0].y, modelViewMatrix[0].z);
    vec3 axis_y = vec3(modelViewMatrix[1].x, modelViewMatrix[1].y, modelViewMatrix[1].z);
    vec3 axis_z = vec3(modelViewMatrix[2].x, modelViewMatrix[2].y, modelViewMatrix[2].z);
    vec3 offset = vec3(modelViewMatrix[3].x, modelViewMatrix[3].y, modelViewMatrix[3].z);

    eye = vec3(dot(-offset, axis_x), dot(-offset, axis_y), dot(-offset, axis_z));

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,ne=`precision highp float;
precision highp int;

const float IOR_AIR = 1.0;
const float IOR_WATER = 1.333;

const vec3 abovewaterColor = vec3(0.25, 1.0, 1.25);
const vec3 underwaterColor = vec3(0.4, 0.9, 1.0);

const float poolHeight = 1.0;

uniform vec3 light;
uniform sampler2D tiles;
uniform sampler2D causticTex;
uniform sampler2D water;

vec2 intersectCube(vec3 origin, vec3 ray, vec3 cubeMin, vec3 cubeMax) {
    vec3 tMin = (cubeMin - origin) / ray;
    vec3 tMax = (cubeMax - origin) / ray;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

vec3 getWallColor(vec3 point) {
    float scale = 0.5;

    vec3 wallColor;
    vec3 normal;
    if (abs(point.x) > 0.999) {
        wallColor = texture2D(tiles, point.yz * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(-point.x, 0.0, 0.0);
    } else if (abs(point.z) > 0.999) {
        wallColor = texture2D(tiles, point.yx * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(0.0, 0.0, -point.z);
    } else {
        wallColor = texture2D(tiles, point.xz * 0.5 + 0.5).rgb;
        normal = vec3(0.0, 1.0, 0.0);
    }

    scale /= length(point); 

    /* caustics */
    vec3 refractedLight = -refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
    float diffuse = max(0.0, dot(refractedLight, normal));
    vec4 info = texture2D(water, point.xz * 0.5 + 0.5);
    if (point.y < info.r) {
        vec4 caustic = texture2D(causticTex, 0.75 * (point.xz - point.y * refractedLight.xz / refractedLight.y) * 0.5 + 0.5);
        scale += diffuse * caustic.r * 2.0 * caustic.g;
    } else {
        /* shadow for the rim of the pool */
        vec2 t = intersectCube(point, refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        diffuse *= 1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (point.y + refractedLight.y * t.y - 2.0 / 12.0)));

        scale += diffuse * 0.5;
    }

    return wallColor * scale;
}

uniform float underwater;
uniform samplerCube sky;

varying vec3 eye;
varying vec3 pos;

vec3 getSurfaceRayColor(vec3 origin, vec3 ray, vec3 waterColor) {
    vec3 color;

    if (ray.y < 0.0) {
        vec2 t = intersectCube(origin, ray, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        color = getWallColor(origin + ray * t.y);
    } else {
        vec2 t = intersectCube(origin, ray, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        vec3 hit = origin + ray * t.y;
        if (hit.y < 7.0 / 12.0) {
            color = getWallColor(hit);
        } else {
            color = textureCube(sky, ray).rgb;
            color += 0.01 * vec3(pow(max(0.0, dot(light, ray)), 20.0)) * vec3(10.0, 8.0, 6.0);
        }
    }

    if (ray.y < 0.0) color *= waterColor;

    return color;
}

void main() {
    vec2 coord = pos.xz * 0.5 + 0.5;
    vec4 info = texture2D(water, coord);

    
    for (int i = 0; i < 5; i++) {
        coord += info.ba * 0.005;
        info = texture2D(water, coord);
    }

    vec3 normal = vec3(info.b, sqrt(1.0 - dot(info.ba, info.ba)), info.a);
    vec3 incomingRay = normalize(pos - eye);

    if (underwater == 1.) {
        normal = -normal;
        vec3 reflectedRay = reflect(incomingRay, normal);
        vec3 refractedRay = refract(incomingRay, normal, IOR_WATER / IOR_AIR);
        float fresnel = mix(0.5, 1.0, pow(1.0 - dot(normal, -incomingRay), 3.0));

        vec3 reflectedColor = getSurfaceRayColor(pos, reflectedRay, underwaterColor);
        vec3 refractedColor = getSurfaceRayColor(pos, refractedRay, vec3(1.0)) * vec3(0.8, 1.0, 1.1);

        gl_FragColor = vec4(mix(reflectedColor, refractedColor, (1.0 - fresnel) * length(refractedRay)), 1.0);
    } else {
        vec3 reflectedRay = reflect(incomingRay, normal);
        vec3 refractedRay = refract(incomingRay, normal, IOR_AIR / IOR_WATER);
        float fresnel = mix(0.25, 1.0, pow(1.0 - dot(normal, -incomingRay), 3.0));

        vec3 reflectedColor = getSurfaceRayColor(pos, reflectedRay, abovewaterColor);
        vec3 refractedColor = getSurfaceRayColor(pos, refractedRay, abovewaterColor);

        gl_FragColor = vec4(mix(refractedColor, reflectedColor, fresnel), 1.0);
    }
}`,re=`precision highp float;
precision highp int;

varying vec3 oldPos;
varying vec3 newPos;
varying vec3 ray;
attribute vec3 position;

const float IOR_AIR = 1.0;
const float IOR_WATER = 1.333;

const vec3 abovewaterColor = vec3(0.25, 1.0, 1.25);
const vec3 underwaterColor = vec3(0.4, 0.9, 1.0);

const float poolHeight = 1.0;

uniform vec3 light;
uniform sampler2D tiles;
uniform sampler2D causticTex;
uniform sampler2D water;

vec2 intersectCube(vec3 origin, vec3 ray, vec3 cubeMin, vec3 cubeMax) {
    vec3 tMin = (cubeMin - origin) / ray;
    vec3 tMax = (cubeMax - origin) / ray;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

vec3 getWallColor(vec3 point) {
    float scale = 0.5;

    vec3 wallColor;
    vec3 normal;
    if (abs(point.x) > 0.999) {
        wallColor = texture2D(tiles, point.yz * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(-point.x, 0.0, 0.0);
    } else if (abs(point.z) > 0.999) {
        wallColor = texture2D(tiles, point.yx * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(0.0, 0.0, -point.z);
    } else {
        wallColor = texture2D(tiles, point.xz * 0.5 + 0.5).rgb;
        normal = vec3(0.0, 1.0, 0.0);
    }

    scale /= length(point); 

    /* caustics */
    vec3 refractedLight = -refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
    float diffuse = max(0.0, dot(refractedLight, normal));
    vec4 info = texture2D(water, point.xz * 0.5 + 0.5);
    if (point.y < info.r) {
        vec4 caustic = texture2D(causticTex, 0.75 * (point.xz - point.y * refractedLight.xz / refractedLight.y) * 0.5 + 0.5);
        scale += diffuse * caustic.r * 2.0 * caustic.g;
    } else {
        /* shadow for the rim of the pool */
        vec2 t = intersectCube(point, refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        diffuse *= 1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (point.y + refractedLight.y * t.y - 2.0 / 12.0)));

        scale += diffuse * 0.5;
    }

    return wallColor * scale;
}

vec3 project(vec3 origin, vec3 ray, vec3 refractedLight) {
    vec2 tcube = intersectCube(origin, ray, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
    origin += ray * tcube.y;
    float tplane = (-origin.y - 1.0) / refractedLight.y;

    return origin + refractedLight * tplane;
}

void main() {
    vec4 info = texture2D(water, position.xy * 0.5 + 0.5);
    info.ba *= 0.5;
    vec3 normal = vec3(info.b, sqrt(1.0 - dot(info.ba, info.ba)), info.a);

    /* project the vertices along the refracted vertex ray */
    vec3 refractedLight = refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
    ray = refract(-light, normal, IOR_AIR / IOR_WATER);
    oldPos = project(position.xzy, refractedLight, refractedLight);
    newPos = project(position.xzy + vec3(0.0, info.r, 0.0), ray, refractedLight);

    gl_Position = vec4(0.75 * (newPos.xz + refractedLight.xz / refractedLight.y), 0.0, 1.0);
}`,ae=`precision highp float;
precision highp int;

#extension GL_OES_standard_derivatives : enable

const float IOR_AIR = 1.0;
const float IOR_WATER = 1.333;

const vec3 abovewaterColor = vec3(0.25, 1.0, 1.25);
const vec3 underwaterColor = vec3(0.4, 0.9, 1.0);

const float poolHeight = 1.0;

uniform vec3 light;
uniform sampler2D tiles;
uniform sampler2D causticTex;
uniform sampler2D water;

vec2 intersectCube(vec3 origin, vec3 ray, vec3 cubeMin, vec3 cubeMax) {
    vec3 tMin = (cubeMin - origin) / ray;
    vec3 tMax = (cubeMax - origin) / ray;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

vec3 getWallColor(vec3 point) {
    float scale = 0.5;

    vec3 wallColor;
    vec3 normal;
    if (abs(point.x) > 0.999) {
        wallColor = texture2D(tiles, point.yz * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(-point.x, 0.0, 0.0);
    } else if (abs(point.z) > 0.999) {
        wallColor = texture2D(tiles, point.yx * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(0.0, 0.0, -point.z);
    } else {
        wallColor = texture2D(tiles, point.xz * 0.5 + 0.5).rgb;
        normal = vec3(0.0, 1.0, 0.0);
    }

    scale /= length(point); 

    /* caustics */
    vec3 refractedLight = -refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
    float diffuse = max(0.0, dot(refractedLight, normal));
    vec4 info = texture2D(water, point.xz * 0.5 + 0.5);
    if (point.y < info.r) {
        vec4 caustic = texture2D(causticTex, 0.75 * (point.xz - point.y * refractedLight.xz / refractedLight.y) * 0.5 + 0.5);
        scale += diffuse * caustic.r * 2.0 * caustic.g;
    } else {
        /* shadow for the rim of the pool */
        vec2 t = intersectCube(point, refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        diffuse *= 1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (point.y + refractedLight.y * t.y - 2.0 / 12.0)));

        scale += diffuse * 0.5;
    }

    return wallColor * scale;
}

varying vec3 oldPos;
varying vec3 newPos;
varying vec3 ray;

void main() {
    
    float oldArea = length(dFdx(oldPos)) * length(dFdy(oldPos));
    float newArea = length(dFdx(newPos)) * length(dFdy(newPos));
    gl_FragColor = vec4(oldArea / newArea * 0.2, 1.0, 0.0, 0.0);

    vec3 refractedLight = refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);

    /* shadow for the rim of the pool */
    vec2 t = intersectCube(newPos, -refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
    gl_FragColor.r *= 1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (newPos.y - refractedLight.y * t.y - 2.0 / 12.0)));
}`,ie=`const float IOR_AIR = 1.0;
const float IOR_WATER = 1.333;

const vec3 abovewaterColor = vec3(0.25, 1.0, 1.25);
const vec3 underwaterColor = vec3(0.4, 0.9, 1.0);

const float poolHeight = 1.0;

uniform vec3 light;
uniform sampler2D tiles;
uniform sampler2D causticTex;
uniform sampler2D water;

vec2 intersectCube(vec3 origin, vec3 ray, vec3 cubeMin, vec3 cubeMax) {
    vec3 tMin = (cubeMin - origin) / ray;
    vec3 tMax = (cubeMax - origin) / ray;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

vec3 getWallColor(vec3 point) {
    float scale = 0.5;

    vec3 wallColor;
    vec3 normal;
    if (abs(point.x) > 0.999) {
        wallColor = texture2D(tiles, point.yz * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(-point.x, 0.0, 0.0);
    } else if (abs(point.z) > 0.999) {
        wallColor = texture2D(tiles, point.yx * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(0.0, 0.0, -point.z);
    } else {
        wallColor = texture2D(tiles, point.xz * 0.5 + 0.5).rgb;
        normal = vec3(0.0, 1.0, 0.0);
    }

    scale /= length(point); 

    /* caustics */
    vec3 refractedLight = -refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
    float diffuse = max(0.0, dot(refractedLight, normal));
    vec4 info = texture2D(water, point.xz * 0.5 + 0.5);
    if (point.y < info.r) {
        vec4 caustic = texture2D(causticTex, 0.75 * (point.xz - point.y * refractedLight.xz / refractedLight.y) * 0.5 + 0.5);
        scale += diffuse * caustic.r * 2.0 * caustic.g;
    } else {
        /* shadow for the rim of the pool */
        vec2 t = intersectCube(point, refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        diffuse *= 1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (point.y + refractedLight.y * t.y - 2.0 / 12.0)));

        scale += diffuse * 0.5;
    }

    return wallColor * scale;
}

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

attribute vec3 position;

varying vec3 pos;

void main() {
    pos = position.xyz;
    pos.y = ((1.0 - pos.y) * (7.0 / 12.0) - 1.0) * poolHeight;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`,oe=`precision highp float;
precision highp int;

const float IOR_AIR = 1.0;
const float IOR_WATER = 1.333;

const vec3 abovewaterColor = vec3(0.25, 1.0, 1.25);
const vec3 underwaterColor = vec3(0.4, 0.9, 1.0);

const float poolHeight = 1.0;

uniform vec3 light;
uniform sampler2D tiles;
uniform sampler2D causticTex;
uniform sampler2D water;

vec2 intersectCube(vec3 origin, vec3 ray, vec3 cubeMin, vec3 cubeMax) {
    vec3 tMin = (cubeMin - origin) / ray;
    vec3 tMax = (cubeMax - origin) / ray;
    vec3 t1 = min(tMin, tMax);
    vec3 t2 = max(tMin, tMax);
    float tNear = max(max(t1.x, t1.y), t1.z);
    float tFar = min(min(t2.x, t2.y), t2.z);
    return vec2(tNear, tFar);
}

vec3 getWallColor(vec3 point) {
    float scale = 0.5;

    vec3 wallColor;
    vec3 normal;
    if (abs(point.x) > 0.999) {
        wallColor = texture2D(tiles, point.yz * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(-point.x, 0.0, 0.0);
    } else if (abs(point.z) > 0.999) {
        wallColor = texture2D(tiles, point.yx * 0.5 + vec2(1.0, 0.5)).rgb;
        normal = vec3(0.0, 0.0, -point.z);
    } else {
        wallColor = texture2D(tiles, point.xz * 0.5 + 0.5).rgb;
        normal = vec3(0.0, 1.0, 0.0);
    }

    scale /= length(point); 

    /* caustics */
    vec3 refractedLight = -refract(-light, vec3(0.0, 1.0, 0.0), IOR_AIR / IOR_WATER);
    float diffuse = max(0.0, dot(refractedLight, normal));
    vec4 info = texture2D(water, point.xz * 0.5 + 0.5);
    if (point.y < info.r) {
        vec4 caustic = texture2D(causticTex, 0.75 * (point.xz - point.y * refractedLight.xz / refractedLight.y) * 0.5 + 0.5);
        scale += diffuse * caustic.r * 2.0 * caustic.g;
    } else {
        /* shadow for the rim of the pool */
        vec2 t = intersectCube(point, refractedLight, vec3(-1.0, -poolHeight, -1.0), vec3(1.0, 2.0, 1.0));
        diffuse *= 1.0 / (1.0 + exp(-200.0 / (1.0 + 10.0 * (t.y - t.x)) * (point.y + refractedLight.y * t.y - 2.0 / 12.0)));

        scale += diffuse * 0.5;
    }

    return wallColor * scale;
}

varying vec3 pos;

void main() {
    gl_FragColor = vec4(getWallColor(pos), 1.0);

    vec4 info = texture2D(water, pos.xz * 0.5 + 0.5);

    if (pos.y < info.r) {
        gl_FragColor.rgb *= underwaterColor * 1.2;
    }
}`,se=`uniform sampler2D texture;
attribute vec3 position;
varying vec2 coord;

void main() {
    coord = position.xy + 0.5;

    gl_Position = vec4(position.xy * 2., 0., 1.);
}`,ce=`precision highp float;
precision highp int;

uniform sampler2D texture;
varying vec2 coord;

void main() {
    vec4 color = texture2D(texture, coord);

    gl_FragColor = vec4(color.x, color.y, color.z, 1.);
}`;class le{constructor(){this._camera=new d(0,1,1,0,0,2e3),this._geometry=new u(2,2),this._textureA=new f(256,256,{type:g}),this._textureB=new f(256,256,{type:g}),this.texture=this._textureA;const e=new s({uniforms:{center:{value:[0,0]},radius:{value:0},strength:{value:0},texture:{value:null}},vertexShader:v,fragmentShader:Q}),t=new s({uniforms:{delta:{value:[1/256,1/256]},texture:{value:null}},vertexShader:v,fragmentShader:Y}),n=new s({uniforms:{delta:{value:[1/256,1/256]},texture:{value:null}},vertexShader:v,fragmentShader:ee});this._dropMesh=new i(this._geometry,e),this._normalMesh=new i(this._geometry,t),this._updateMesh=new i(this._geometry,n)}addDrop(e,t,n,a,c){this._dropMesh.material.uniforms.center.value=[t,n],this._dropMesh.material.uniforms.radius.value=a,this._dropMesh.material.uniforms.strength.value=c,this._render(e,this._dropMesh)}stepSimulation(e){this._render(e,this._updateMesh)}updateNormals(e){this._render(e,this._normalMesh)}_render(e,t){const n=this.texture,a=this.texture===this._textureA?this._textureB:this._textureA;t.material.uniforms.texture.value=n.texture,e.setRenderTarget(a),e.render(t,this._camera),this.texture=a}}class ue{constructor(e){this.base=e,this.geometry=new u(2,2,200,200),this.material=new s({uniforms:{light:{value:this.base.light},tiles:{value:this.base.tilesTexture},sky:{value:this.base.cubeTexture},water:{value:null},causticTex:{value:null},underwater:{value:!1}},vertexShader:te,fragmentShader:ne}),this.mesh=new i(this.geometry,this.material)}draw(e,t,n){this.material.uniforms.water.value=t,this.material.uniforms.causticTex.value=n,this.material.side=b,this.material.uniforms.underwater.value=!0,e.render(this.mesh,this.base.camera),this.material.side=M,this.material.uniforms.underwater.value=!1,e.render(this.mesh,this.base.camera)}}class he{constructor(e){this.base=e,this._camera=new d(0,1,1,0,0,2e3),this._geometry=this.base.water.geometry,this.texture=new f(1024,1024,{type:R});const t=new s({uniforms:{light:{value:this.base.light},water:{value:null}},vertexShader:re,fragmentShader:ae});this._causticMesh=new i(this._geometry,t)}update(e,t){this._causticMesh.material.uniforms.water.value=t,e.setRenderTarget(this.texture),e.setClearColor(this.base.black,0),e.clear(),e.render(this._causticMesh,this._camera)}}class ve{constructor(e){this.base=e,this._geometry=new z;const t=new Float32Array([-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,1,-1,1,-1,1,1,1,1,-1,-1,-1,1,-1,-1,-1,-1,1,1,-1,1,-1,1,-1,-1,1,1,1,1,-1,1,1,1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,-1,-1,-1,1,1,-1,1,-1,1,1,1,1,1]),n=new Uint32Array([0,1,2,2,1,3,4,5,6,6,5,7,12,13,14,14,13,15,16,17,18,18,17,19,20,21,22,22,21,23]);this._geometry.setAttribute("position",new p(t,3)),this._geometry.setIndex(new p(n,1)),this._material=new s({uniforms:{light:{value:this.base.light},tiles:{value:this.base.tilesTexture},water:{value:null},causticTex:{value:null}},vertexShader:ie,fragmentShader:oe}),this._material.side=b,this._mesh=new i(this._geometry,this._material)}draw(e,t,n){this._material.uniforms.water.value=t,this._material.uniforms.causticTex.value=n,e.render(this._mesh,this.base.camera)}}class fe{constructor(){this._camera=new d(0,1,1,0,0,1),this._geometry=new u,this._material=new s({uniforms:{texture:{value:null}},vertexShader:se,fragmentShader:ce}),this._mesh=new i(this._geometry,this._material)}draw(e,t){this._material.uniforms.texture.value=t,e.setRenderTarget(null),e.render(this._mesh,this._camera)}}function o(r){return new URL(Object.assign({"../assets/cubeMap/negx.png":$,"../assets/cubeMap/negy.png":G,"../assets/cubeMap/negz.png":q,"../assets/cubeMap/posx.png":X,"../assets/cubeMap/posy.png":K,"../assets/cubeMap/posz.png":Z,"../assets/tiles.jpg":J})[`../assets/${r}`],import.meta.url).href}class de{constructor(e){this.parent=e.parent,this.target=e.target,this.callback=e.callback,this.width=this.target.offsetWidth,this.height=this.target.offsetHeight,this.aspect=this.width/this.height,this.renderer=new D({powerPreference:"high-performance",antialias:!0,alpha:!0,premultipliedAlpha:!1,preserveDrawingBuffer:!0}),this.renderer.setSize(this.width,this.height),this.renderer.autoClear=!1,this.target.appendChild(this.renderer.domElement),this.scene=new I,this.scene.background=new h("#646464"),this.camera=new L(45,this.aspect,.01,1e3),this.camera.position.copy(new x(2,1,2)),this.camera.lookAt(new x(0,0,0)),this.camera.updateProjectionMatrix(),this.scene.add(this.camera),this.clock=new T,this.paramsInit(),this.controlsInit(),this.rayCasterInit(),this.assetsInit()}paramsInit(){this.light=[.7559289460184544,.7559289460184544,-.3779644730092272],this.black=new h("black"),this.white=new h("white")}controlsInit(){this.controls=new A(this.camera,this.renderer.domElement),this.controls.enableDamping=!0}rayCasterInit(){this.raycaster=new O,this.mouse=new S,this.targetgeometry=new u(2,2);const e=this.targetgeometry.attributes.position.array;for(let t=0;t<e.length;t+=3){const n=e[t+1];e[t+2]=-n,e[t+1]=0}this.targetgeometry.attributes.position.needsUpdate=!0,this.targetmesh=new i(this.targetgeometry)}worldInit(){this.waterSimulation=new le,this.water=new ue(this),this.caustics=new he(this),this.pool=new ve(this),this.debug=new fe}assetsInit(){this.manager=new F,this.tilesTexture=new W(this.manager).load(o("tiles.jpg")),this.cubeTexture=new P(this.manager).load([o("cubeMap/posx.png"),o("cubeMap/negx.png"),o("cubeMap/posy.png"),o("cubeMap/negy.png"),o("cubeMap/posz.png"),o("cubeMap/negz.png")]),this.manager.onLoad=()=>{console.info("%c资源加载完成!✅","color:#fff;background-color:red"),this.scene.environment=this.cubeTexture,this.scene.background=this.cubeTexture,this.callback(),this.worldInit(),this.animation(),this.paneInit(),this.resize(),this.target.addEventListener("mousemove",e=>this.onMouseMove(e))}}onMouseMove(e){const t=this.target.getBoundingClientRect();this.mouse.x=(e.clientX-t.left)*2/this.width-1,this.mouse.y=-(e.clientY-t.top)*2/this.height+1,this.raycaster.setFromCamera(this.mouse,this.camera);const n=this.raycaster.intersectObject(this.targetmesh);for(let a of n)this.waterSimulation.addDrop(this.renderer,a.point.x,a.point.z,.03,.04)}animation(){this.controls.update(),this.waterSimulation.stepSimulation(this.renderer),this.waterSimulation.updateNormals(this.renderer);const e=this.waterSimulation.texture.texture;this.caustics.update(this.renderer,e);const t=this.caustics.texture.texture;this.debug.draw(this.renderer,t),this.renderer.setRenderTarget(null),this.renderer.clear(),this.water.draw(this.renderer,e,t),this.pool.draw(this.renderer,e,t),this.renderer.setAnimationLoop(()=>this.animation())}paneInit(){}resize(){}destroy(){}}const me={class:"water"},ge={class:"load"},pe={__name:"index",setup(r){const e=y(!1);y(0);let t=null;const n=()=>{e.value=!0};return E(()=>{t=new de({parent:document.querySelector(".water"),target:document.querySelector(".canvas"),callback:n})}),V(()=>{t.destroy(),t=null,console.info("%c泳池-销毁😁","color:#fff;background-color:red")}),(a,c)=>(w(),_("div",me,[l("div",{class:B(["loading",{loadOk:e.value}])},[l("div",ge,[(w(),_(j,null,H("LOADING...",(C,m)=>l("span",{key:m,style:N("--i:"+m)},U(C),5)),64))])],2),c[0]||(c[0]=l("div",{class:"canvas"},null,-1))]))}},_e=k(pe,[["__scopeId","data-v-eaedba8a"]]);export{_e as default};
