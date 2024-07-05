/**
 * justThreeJs screenPaintDistortion.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/4 14:34:57
 */
import * as THREE from "three";

function _sfc32(a, e, t, r) {
    return function () {
        a |= 0, e |= 0, t |= 0, r |= 0;
        var n = (a + e | 0) + r | 0;
        return r = r + 1 | 0, a = e ^ e >>> 9, e = t + (t << 3) | 0, t = t << 21 | t >>> 11, t = t + n | 0, (n >>> 0) / 4294967296
    }
}

class MathUtils {
    PI = Math.PI;
    PI2 = this.PI * 2;
    HALF_PI = this.PI * .5;
    DEG2RAD = this.PI / 180;
    RAD2DEG = 180 / this.PI;

    linearStep(e, t, r) {
        return this.clamp((r - e) / (t - e), 0, 1)
    }

    step(e, t) {
        return t < e ? 0 : 1
    }

    clamp(e, t, r) {
        return e < t ? t : e > r ? r : e
    }

    mod(e, t) {
        return e - t * Math.floor(e / t)
    }

    mix(e, t, r) {
        return e + (t - e) * r
    }

    cMix(e, t, r) {
        return e + (t - e) * this.clamp(r, 0, 1)
    }

    unMix(e, t, r) {
        return (r - e) / (t - e)
    }

    cUnMix(e, t, r) {
        return this.clamp((r - e) / (t - e), 0, 1)
    }

    saturate(e) {
        return this.clamp(e, 0, 1)
    }

    fit(e, t, r, n, o, l) {
        return e = this.cUnMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    unClampedFit(e, t, r, n, o, l) {
        return e = this.unMix(t, r, e), l && (e = l(e)), n + e * (o - n)
    }

    lerp(e, t, r) {
        return e * (1 - r) + t * r
    }

    loop(e, t, r) {
        return e -= t, r -= t, (e < 0 ? (r - Math.abs(e) % r) % r : e % r) + t
    }

    normalize(e, t, r) {
        return Math.max(0, Math.min(1, e - t / r - t))
    }

    smoothstep(e, t, r) {
        return r = this.cUnMix(e, t, r), r * r * (3 - r * 2)
    }

    fract(e) {
        return e - Math.floor(e)
    }

    hash(e) {
        return this.fract(Math.sin(e) * 43758.5453123)
    }

    hash2(e, t) {
        return this.fract(Math.sin(e * 12.9898 + t * 4.1414) * 43758.5453)
    }

    sign(e) {
        return e ? e < 0 ? -1 : 1 : 0
    }

    isPowerOfTwo(e) {
        return (e & -e) === e
    }

    powerTwoCeilingBase(e) {
        return Math.ceil(Math.log(e) / Math.log(2))
    }

    powerTwoCeiling(e) {
        return this.isPowerOfTwo(e) ? e : 1 << this.powerTwoCeilingBase(e)
    }

    powerTwoFloorBase(e) {
        return Math.floor(Math.log(e) / Math.log(2))
    }

    powerTwoFloor(e) {
        return this.isPowerOfTwo(e) ? e : 1 << this.powerTwoFloorBase(e)
    }

    latLngBearing(e, t, r, n) {
        let o = Math.sin(n - t) * Math.cos(r),
            l = Math.cos(e) * Math.sin(r) - Math.sin(e) * Math.cos(r) * Math.cos(n - t);
        return Math.atan2(o, l)
    }

    distanceTo(e, t) {
        return Math.sqrt(e * e + t * t)
    }

    distanceSqrTo(e, t) {
        return e * e + t * t
    }

    distanceTo3(e, t, r) {
        return Math.sqrt(e * e + t * t + r * r)
    }

    distanceSqrTo3(e, t, r) {
        return e * e + t * t + r * r
    }

    latLngDistance(e, t, r, n) {
        let o = Math.sin((r - e) / 2), l = Math.sin((n - t) / 2), c = o * o + Math.cos(e) * Math.cos(r) * l * l;
        return 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    }

    cubicBezier(e, t, r, n, o) {
        let l = (t - e) * 3, c = (r - t) * 3 - l, u = n - e - l - c, f = o * o, p = f * o;
        return u * p + c * f + l * o + e
    }

    cubicBezierFn(e, t, r, n) {
        let o = (t - e) * 3, l = (r - t) * 3 - o, c = n - e - o - l;
        return u => {
            let f = u * u, p = f * u;
            return c * p + l * f + o * u + e
        }
    }

    normalizeAngle(e) {
        return e += this.PI, e = e < 0 ? this.PI2 - Math.abs(e % PI2) : e % this.PI2, e -= this.PI, e
    }

    closestAngleTo(e, t) {
        return e + this.normalizeAngle(t - e)
    }

    randomRange(e, t) {
        return e + Math.random() * (t - e)
    }

    randomRangeInt(e, t) {
        return Math.floor(this.randomRange(e, t + 1))
    }

    padZero(e, t) {
        return e.toString().length >= t ? e : (Math.pow(10, t) + Math.floor(e)).toString().substring(1)
    }

    lerpColor(e, t, r) {
        const n = e >> 16, o = e >> 8 & 255, l = e & 255, c = t >> 16, u = t >> 8 & 255, f = t & 255,
            p = n + r * (c - n), g = o + r * (u - o), v = l + r * (f - l);
        return (p << 16) + (g << 8) + (v | 0)
    }

    getSeedRandomFn(e) {
        let t = 1779033703, r = 3144134277, n = 1013904242, o = 2773480762;
        for (let l = 0, c; l < e.length; l++) c = e.charCodeAt(l), t = r ^ Math.imul(t ^ c, 597399067), r = n ^ Math.imul(r ^ c, 2869860233), n = o ^ Math.imul(n ^ c, 951274213), o = t ^ Math.imul(o ^ c, 2716044179);
        return _sfc32(Math.imul(n ^ t >>> 18, 597399067), Math.imul(o ^ r >>> 22, 2869860233), Math.imul(t ^ n >>> 17, 951274213), Math.imul(r ^ o >>> 19, 2716044179))
    }
}

const math = new MathUtils()

const frag$1 = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform sampler2D u_screenPaintTexture;uniform vec2 u_screenPaintTexelSize;uniform float u_amount;uniform float u_rgbShift;uniform float u_multiplier;uniform float u_colorMultiplier;uniform float u_shade;varying vec2 v_uv;
#include <getBlueNoise>
void main(){vec3 bnoise=getBlueNoise(gl_FragCoord.xy+vec2(17.,29.));vec4 data=texture2D(u_screenPaintTexture,v_uv);float weight=(data.z+data.w)*0.5;vec2 vel=(0.5-data.xy-0.001)*2.*weight;vec4 color=vec4(0.0);vec2 velocity=vel*u_amount/4.0*u_screenPaintTexelSize*u_multiplier;vec2 uv=v_uv+bnoise.xy*velocity;for(int i=0;i<9;i++){color+=texture2D(u_texture,uv);uv+=velocity;}color/=9.;color.rgb+=sin(vec3(vel.x+vel.y)*40.0+vec3(0.0,2.0,4.0)*u_rgbShift)*smoothstep(0.4,-0.9,weight)*u_shade*max(abs(vel.x),abs(vel.y))*u_colorMultiplier;gl_FragColor=color;}`


class PostEffect {
    sharedUniforms = {};
    enabled = !0;
    material = null;
    renderOrder = 0;
    _hasShownWarning = !1;

    constructor(base) {
        this.base = base
    }

    init(e) {
        Object.assign(this, e)
    }

    needsRender() {
        return !0
    }

    warn(e) {
        this._hasShownWarning || (console.warn(e), this._hasShownWarning = !0)
    }

    setPostprocessing(e) {
    }

    render(e, t = !1) {
        this.material.uniforms.u_texture && (this.material.uniforms.u_texture.value = e.fromTexture), this.base.fboHelper.render(this.material, t ? null : e.toRenderTarget), e.swap()
    }
}

const smaaBlendVert = `#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[2];void SMAANeighborhoodBlendingVS(vec2 texcoord){v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-1.0,0.0,0.0,1.0);v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(1.0,0.0,0.0,-1.0);}void main(){v_uv=position.xy*0.5+0.5;SMAANeighborhoodBlendingVS(v_uv);gl_Position=vec4(position,1.0);}`,
    smaaBlendFrag = `#define GLSLIFY 1
uniform sampler2D u_weightsTexture;uniform sampler2D u_texture;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[2];vec4 SMAANeighborhoodBlendingPS(vec2 texcoord,vec4 offset[2],sampler2D colorTex,sampler2D blendTex){vec4 a;a.xz=texture2D(blendTex,texcoord).xz;a.y=texture2D(blendTex,offset[1].zw).g;a.w=texture2D(blendTex,offset[1].xy).a;if(dot(a,vec4(1.0,1.0,1.0,1.0))<1e-5){return texture2D(colorTex,texcoord,0.0);}else{vec2 offset;offset.x=a.a>a.b ? a.a :-a.b;offset.y=a.g>a.r ?-a.g : a.r;if(abs(offset.x)>abs(offset.y)){offset.y=0.0;}else{offset.x=0.0;}vec4 C=texture2D(colorTex,texcoord,0.0);texcoord+=sign(offset)*u_texelSize;vec4 Cop=texture2D(colorTex,texcoord,0.0);float s=abs(offset.x)>abs(offset.y)? abs(offset.x): abs(offset.y);C.xyz=pow(abs(C.xyz),vec3(2.2));Cop.xyz=pow(abs(Cop.xyz),vec3(2.2));vec4 mixed=mix(C,Cop,s);mixed.xyz=pow(abs(mixed.xyz),vec3(1.0/2.2));return mixed;}}void main(){gl_FragColor=SMAANeighborhoodBlendingPS(v_uv,v_offsets,u_texture,u_weightsTexture);}`,
    smaaEdgesVert = `#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[3];void SMAAEdgeDetectionVS(vec2 texcoord){v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-1.0,0.0,0.0,1.0);v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(1.0,0.0,0.0,-1.0);v_offsets[2]=texcoord.xyxy+u_texelSize.xyxy*vec4(-2.0,0.0,0.0,2.0);}void main(){v_uv=position.xy*0.5+0.5;SMAAEdgeDetectionVS(v_uv);gl_Position=vec4(position,1.0);}`,
    smaaEdgesFrag = `#define GLSLIFY 1
uniform sampler2D u_texture;varying vec2 v_uv;varying vec4 v_offsets[3];vec4 SMAAColorEdgeDetectionPS(vec2 texcoord,vec4 offset[3],sampler2D colorTex){vec2 threshold=vec2(SMAA_THRESHOLD,SMAA_THRESHOLD);vec4 delta;vec3 C=texture2D(colorTex,texcoord).rgb;vec3 Cleft=texture2D(colorTex,offset[0].xy).rgb;vec3 t=abs(C-Cleft);delta.x=max(max(t.r,t.g),t.b);vec3 Ctop=texture2D(colorTex,offset[0].zw).rgb;t=abs(C-Ctop);delta.y=max(max(t.r,t.g),t.b);vec2 edges=step(threshold,delta.xy);if(dot(edges,vec2(1.0,1.0))==0.0)discard;vec3 Cright=texture2D(colorTex,offset[1].xy).rgb;t=abs(C-Cright);delta.z=max(max(t.r,t.g),t.b);vec3 Cbottom=texture2D(colorTex,offset[1].zw).rgb;t=abs(C-Cbottom);delta.w=max(max(t.r,t.g),t.b);float maxDelta=max(max(max(delta.x,delta.y),delta.z),delta.w);vec3 Cleftleft=texture2D(colorTex,offset[2].xy).rgb;t=abs(C-Cleftleft);delta.z=max(max(t.r,t.g),t.b);vec3 Ctoptop=texture2D(colorTex,offset[2].zw).rgb;t=abs(C-Ctoptop);delta.w=max(max(t.r,t.g),t.b);maxDelta=max(max(maxDelta,delta.z),delta.w);edges.xy*=step(0.5*maxDelta,delta.xy);return vec4(edges,0.0,0.0);}void main(){gl_FragColor=SMAAColorEdgeDetectionPS(v_uv,v_offsets,u_texture);}`,
    smaaWeightsVert = `#define GLSLIFY 1
attribute vec3 position;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[3];varying vec2 v_pixcoord;void SMAABlendingWeightCalculationVS(vec2 texcoord){v_pixcoord=texcoord/u_texelSize;v_offsets[0]=texcoord.xyxy+u_texelSize.xyxy*vec4(-0.25,0.125,1.25,0.125);v_offsets[1]=texcoord.xyxy+u_texelSize.xyxy*vec4(-0.125,0.25,-0.125,-1.25);v_offsets[2]=vec4(v_offsets[0].xz,v_offsets[1].yw)+vec4(-2.0,2.0,-2.0,2.0)*u_texelSize.xxyy*float(SMAA_MAX_SEARCH_STEPS);}void main(){v_uv=position.xy*0.5+0.5;SMAABlendingWeightCalculationVS(v_uv);gl_Position=vec4(position,1.0);}`,
    smaaWeightsFrag = `#define GLSLIFY 1
#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * u_texelSize, 0.0 )
uniform sampler2D u_edgesTexture;uniform sampler2D u_areaTexture;uniform sampler2D u_searchTexture;uniform vec2 u_texelSize;varying vec2 v_uv;varying vec4 v_offsets[3];varying vec2 v_pixcoord;vec2 round(vec2 x){return sign(x)*floor(abs(x)+0.5);}float SMAASearchLength(sampler2D searchTex,vec2 e,float bias,float scale){e.r=bias+e.r*scale;return 255.0*texture2D(searchTex,e,0.0).r;}float SMAASearchXLeft(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord-=vec2(2.0,0.0)*u_texelSize;if(!(texcoord.x>end&&e.g>0.8281&&e.r==0.0))break;}texcoord.x+=0.25*u_texelSize.x;texcoord.x+=u_texelSize.x;texcoord.x+=2.0*u_texelSize.x;texcoord.x-=u_texelSize.x*SMAASearchLength(searchTex,e,0.0,0.5);return texcoord.x;}float SMAASearchXRight(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(0.0,1.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord+=vec2(2.0,0.0)*u_texelSize;if(!(texcoord.x<end&&e.g>0.8281&&e.r==0.0))break;}texcoord.x-=0.25*u_texelSize.x;texcoord.x-=u_texelSize.x;texcoord.x-=2.0*u_texelSize.x;texcoord.x+=u_texelSize.x*SMAASearchLength(searchTex,e,0.5,0.5);return texcoord.x;}float SMAASearchYUp(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord+=vec2(0.0,2.0)*u_texelSize;if(!(texcoord.y>end&&e.r>0.8281&&e.g==0.0))break;}texcoord.y-=0.25*u_texelSize.y;texcoord.y-=u_texelSize.y;texcoord.y-=2.0*u_texelSize.y;texcoord.y+=u_texelSize.y*SMAASearchLength(searchTex,e.gr,0.0,0.5);return texcoord.y;}float SMAASearchYDown(sampler2D edgesTex,sampler2D searchTex,vec2 texcoord,float end){vec2 e=vec2(1.0,0.0);for(int i=0;i<SMAA_MAX_SEARCH_STEPS;i++){e=texture2D(edgesTex,texcoord,0.0).rg;texcoord-=vec2(0.0,2.0)*u_texelSize;if(!(texcoord.y<end&&e.r>0.8281&&e.g==0.0))break;}texcoord.y+=0.25*u_texelSize.y;texcoord.y+=u_texelSize.y;texcoord.y+=2.0*u_texelSize.y;texcoord.y-=u_texelSize.y*SMAASearchLength(searchTex,e.gr,0.5,0.5);return texcoord.y;}vec2 SMAAArea(sampler2D areaTex,vec2 dist,float e1,float e2,float offset){vec2 texcoord=float(SMAA_AREATEX_MAX_DISTANCE)*round(4.0*vec2(e1,e2))+dist;texcoord=SMAA_AREATEX_PIXEL_SIZE*texcoord+(0.5*SMAA_AREATEX_PIXEL_SIZE);texcoord.y+=SMAA_AREATEX_SUBTEX_SIZE*offset;return texture2D(areaTex,texcoord,0.0).rg;}vec4 SMAABlendingWeightCalculationPS(vec2 texcoord,vec2 pixcoord,vec4 offset[3],sampler2D edgesTex,sampler2D areaTex,sampler2D searchTex,ivec4 subsampleIndices){vec4 weights=vec4(0.0,0.0,0.0,0.0);vec2 e=texture2D(edgesTex,texcoord).rg;if(e.g>0.0){vec2 d;vec2 coords;coords.x=SMAASearchXLeft(edgesTex,searchTex,offset[0].xy,offset[2].x);coords.y=offset[1].y;d.x=coords.x;float e1=texture2D(edgesTex,coords,0.0).r;coords.x=SMAASearchXRight(edgesTex,searchTex,offset[0].zw,offset[2].y);d.y=coords.x;d=d/u_texelSize.x-pixcoord.x;vec2 sqrt_d=sqrt(abs(d));coords.y-=1.0*u_texelSize.y;float e2=SMAASampleLevelZeroOffset(edgesTex,coords,ivec2(1,0)).r;weights.rg=SMAAArea(areaTex,sqrt_d,e1,e2,float(subsampleIndices.y));}if(e.r>0.0){vec2 d;vec2 coords;coords.y=SMAASearchYUp(edgesTex,searchTex,offset[1].xy,offset[2].z);coords.x=offset[0].x;d.x=coords.y;float e1=texture2D(edgesTex,coords,0.0).g;coords.y=SMAASearchYDown(edgesTex,searchTex,offset[1].zw,offset[2].w);d.y=coords.y;d=d/u_texelSize.y-pixcoord.y;vec2 sqrt_d=sqrt(abs(d));coords.y-=1.0*u_texelSize.y;float e2=SMAASampleLevelZeroOffset(edgesTex,coords,ivec2(0,1)).g;weights.ba=SMAAArea(areaTex,sqrt_d,e1,e2,float(subsampleIndices.x));}return weights;}void main(){gl_FragColor=SMAABlendingWeightCalculationPS(v_uv,v_pixcoord,v_offsets,u_edgesTexture,u_areaTexture,u_searchTexture,ivec4(0.0));}`;


export class Smaa extends PostEffect {
    edgesRenderTarget = null;
    weightsRenderTarget = null;
    edgesMaterial = null;
    weightsMaterial = null;
    renderOrder = 500;

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        Object.assign(this, {
            sharedUniforms: {
                u_areaTexture: {value: null},
                u_searchTexture: {value: null}
            }
        }, e), super.init(), this.weightsRenderTarget = this.base.fboHelper.createRenderTarget(1, 1), this.edgesRenderTarget = this.base.fboHelper.createRenderTarget(1, 1), this.edgesMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_texelSize: null
            },
            vertexShader: this.base.fboHelper.precisionPrefix + smaaEdgesVert,
            fragmentShader: this.base.fboHelper.precisionPrefix + smaaEdgesFrag,
            defines: {SMAA_THRESHOLD: "0.1"},
            blending: THREE.NoBlending,
            depthTest: !1,
            depthWrite: !1
        }), this.weightsMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_edgesTexture: {value: this.edgesRenderTarget.texture},
                u_areaTexture: this.sharedUniforms.u_areaTexture,
                u_searchTexture: this.sharedUniforms.u_searchTexture,
                u_texelSize: null
            },
            vertexShader: this.base.fboHelper.precisionPrefix + smaaWeightsVert,
            fragmentShader: this.base.fboHelper.precisionPrefix + smaaWeightsFrag,
            defines: {
                SMAA_MAX_SEARCH_STEPS: "8",
                SMAA_AREATEX_MAX_DISTANCE: "16",
                SMAA_AREATEX_PIXEL_SIZE: "( 1.0 / vec2( 160.0, 560.0 ) )",
                SMAA_AREATEX_SUBTEX_SIZE: "( 1.0 / 7.0 )"
            },
            transparent: !0,
            blending: THREE.NoBlending,
            depthTest: !1,
            depthWrite: !1
        }), this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_weightsTexture: {value: this.weightsRenderTarget.texture},
                u_texelSize: null
            },
            vertexShader: this.base.fboHelper.precisionPrefix + smaaBlendVert,
            fragmentShader: this.base.fboHelper.precisionPrefix + smaaBlendFrag
        })
    }

    setTextures(e, t) {
        const r = this.sharedUniforms.u_areaTexture.value = this._createTexture(e);
        r.minFilter = THREE.LinearFilter;
        const n = this.sharedUniforms.u_searchTexture.value = this._createTexture(t);
        n.magFilter = THREE.NearestFilter, n.minFilter = THREE.NearestFilter
    }

    updateTextures() {
        this.sharedUniforms.u_areaTexture.value.needsUpdate = !0, this.sharedUniforms.u_searchTexture.value.needsUpdate = !0
    }

    setPostprocessing(e) {
        super.setPostprocessing(e);
        const t = e.width, r = e.height;
        this.edgesRenderTarget.setSize(t, r), this.weightsRenderTarget.setSize(t, r)
    }

    dispose() {
        this.edgesRenderTarget && this.edgesRenderTarget.dispose(), this.weightsRenderTarget && this.weightsRenderTarget.dispose()
    }

    needsRender() {
        return this.enabled && !this.sharedUniforms.u_areaTexture.value.needsUpdate && this.base.properties.isSmaaEnabled
    }

    render(e, t) {
        const r = this.base.fboHelper.getColorState();
        this.sharedUniforms.u_searchTexture.value || console.warn("You need to use Smaa.setImages() to set the smaa textures manually and assign to this class.");
        const n = this.base.fboHelper.renderer;
        n && (n.autoClear = !0, n.setClearColor(0, 0)), this.edgesMaterial.uniforms.u_texelSize = this.weightsMaterial.uniforms.u_texelSize = this.material.uniforms.u_texelSize = e.sharedUniforms.u_texelSize, this.edgesMaterial.uniforms.u_texture.value = e.fromTexture, e.renderMaterial(this.edgesMaterial, this.edgesRenderTarget), e.renderMaterial(this.weightsMaterial, this.weightsRenderTarget), this.base.fboHelper.setColorState(r), this.material.uniforms.u_texture.value = e.fromTexture, super.render(e, t)
    }

    _createTexture(e) {
        const t = new THREE.Texture(e);
        return t.generateMipmaps = !1, t.flipY = !1, t
    }
}

const frag$2 = `#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform float u_saturation;uniform sampler2D u_blurTexture0;
#if ITERATION > 1
uniform sampler2D u_blurTexture1;
#endif
#if ITERATION > 2
uniform sampler2D u_blurTexture2;
#endif
#if ITERATION > 3
uniform sampler2D u_blurTexture3;
#endif
#if ITERATION > 4
uniform sampler2D u_blurTexture4;
#endif
uniform float u_bloomWeights[ITERATION];
#include <common>
vec3 dithering(vec3 color){float grid_position=rand(gl_FragCoord.xy);vec3 dither_shift_RGB=vec3(0.25/255.0,-0.25/255.0,0.25/255.0);dither_shift_RGB=mix(2.0*dither_shift_RGB,-2.0*dither_shift_RGB,grid_position);return color+dither_shift_RGB;}void main(){vec4 c=texture2D(u_texture,v_uv);gl_FragColor=c+(u_bloomWeights[0]*texture2D(u_blurTexture0,v_uv)
#if ITERATION > 1
+u_bloomWeights[1]*texture2D(u_blurTexture1,v_uv)
#endif
#if ITERATION > 2
+u_bloomWeights[2]*texture2D(u_blurTexture2,v_uv)
#endif
#if ITERATION > 3
+u_bloomWeights[3]*texture2D(u_blurTexture3,v_uv)
#endif
#if ITERATION > 4
+u_bloomWeights[4]*texture2D(u_blurTexture4,v_uv)
#endif
);gl_FragColor.rgb=mix(vec3(dot(gl_FragColor.rgb,vec3(0.299,0.587,0.114))),gl_FragColor.rgb,u_saturation);gl_FragColor.rgb=dithering(gl_FragColor.rgb);gl_FragColor.a=1.0;}`,
    highPassFrag = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform float u_luminosityThreshold;uniform float u_smoothWidth;uniform float u_amount;
#ifdef USE_HALO
uniform vec2 u_texelSize;uniform vec2 u_aspect;uniform float u_haloWidth;uniform float u_haloRGBShift;uniform float u_haloStrength;uniform float u_haloMaskInner;uniform float u_haloMaskOuter;
#ifdef USE_LENS_DIRT
uniform sampler2D u_dirtTexture;uniform vec2 u_dirtAspect;
#endif
#endif
#ifdef USE_CONVOLUTION
uniform float u_convolutionBuffer;
#endif
varying vec2 v_uv;void main(){vec2 uv=v_uv;
#ifdef USE_CONVOLUTION
uv=(uv-0.5)*(1.0+u_convolutionBuffer)+0.5;
#endif
vec4 texel=texture2D(u_texture,uv);vec3 luma=vec3(0.299,0.587,0.114);float v=dot(texel.xyz,luma);float alpha=texel.a*u_amount;gl_FragColor=vec4(texel.rgb*alpha,1.0);
#ifdef USE_HALO
vec2 toCenter=(uv-0.5)*u_aspect;vec2 ghostUv=1.0-(toCenter+0.5);vec2 ghostVec=(vec2(0.5)-ghostUv);vec2 direction=normalize(ghostVec);vec2 haloVec=direction*u_haloWidth;float weight=length(vec2(0.5)-fract(ghostUv+haloVec));weight=pow(1.0-weight,3.0);vec3 distortion=vec3(-u_texelSize.x,0.0,u_texelSize.x)*u_haloRGBShift;float zoomBlurRatio=fract(atan(toCenter.y,toCenter.x)*40.0)*0.05+0.95;ghostUv*=zoomBlurRatio;vec2 haloUv=ghostUv+haloVec;vec3 halo=vec3(texture2D(u_texture,haloUv+direction*distortion.r).r,texture2D(u_texture,haloUv+direction*distortion.g).g,texture2D(u_texture,haloUv+direction*distortion.b).b)*u_haloStrength*smoothstep(u_haloMaskInner,u_haloMaskOuter,length(toCenter));
#ifdef USE_LENS_DIRT
vec2 dirtUv=(uv-0.5)*u_dirtAspect+0.5;vec3 dirt=texture2D(u_dirtTexture,dirtUv).rgb;gl_FragColor.rgb+=(halo+alpha+0.05*dirt)*dirt;
#else
gl_FragColor.rgb+=halo;
#endif
#endif
#ifdef USE_CONVOLUTION
gl_FragColor.rgb*=max(abs(uv.x-0.5),abs(uv.y-0.5))>0.5 ? 0. : 1.;
#endif
}`, blurFrag = `#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform vec2 u_resolution;uniform vec2 u_direction;float gaussianPdf(in float x,in float sigma){return 0.39894*exp(-0.5*x*x/(sigma*sigma))/sigma;}void main(){vec2 invSize=1.0/u_resolution;float fSigma=float(SIGMA);float weightSum=gaussianPdf(0.0,fSigma);vec3 diffuseSum=texture2D(u_texture,v_uv).rgb*weightSum;for(int i=1;i<KERNEL_RADIUS;i++){float x=float(i);float w=gaussianPdf(x,fSigma);vec2 uvOffset=u_direction*invSize*x;vec3 sample1=texture2D(u_texture,v_uv+uvOffset).rgb;vec3 sample2=texture2D(u_texture,v_uv-uvOffset).rgb;diffuseSum+=(sample1+sample2)*w;weightSum+=2.0*w;}gl_FragColor=vec4(diffuseSum/weightSum,1.0);}`,
    fftFrag = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_texelSize;uniform float u_subtransformSize;uniform float u_normalization;uniform bool u_isForward;const float TWOPI=6.283185307179586;void main(){
#ifdef HORIZTONAL
float index=gl_FragCoord.x-.5;
#else
float index=gl_FragCoord.y-.5;
#endif
float evenIndex=floor(index/u_subtransformSize)*(u_subtransformSize*0.5)+mod(index,u_subtransformSize*0.5);
#ifdef HORIZTONAL
vec2 evenPos=vec2(evenIndex,gl_FragCoord.y)*u_texelSize;vec2 oddPos=evenPos+vec2(.5,0.);
#else
vec2 evenPos=vec2(gl_FragCoord.x,evenIndex)*u_texelSize;vec2 oddPos=evenPos+vec2(0.,.5);
#endif
vec4 even=texture2D(u_texture,evenPos);vec4 odd=texture2D(u_texture,oddPos);float twiddleArgument=(u_isForward ? TWOPI :-TWOPI)*(index/u_subtransformSize);vec2 twiddle=vec2(cos(twiddleArgument),sin(twiddleArgument));gl_FragColor=(even+vec4(twiddle.x*odd.xy-twiddle.y*odd.zw,twiddle.y*odd.xy+twiddle.x*odd.zw))*u_normalization;}`,
    convolutionSrcFrag = `#define GLSLIFY 1
uniform vec2 u_aspect;uniform sampler2D u_texture;varying vec2 v_uv;void main(){vec2 toCenter=(fract(v_uv+0.5)-0.5)*u_aspect;vec2 rotToCenter=mat2(0.7071067811865476,-0.7071067811865476,0.7071067811865476,0.7071067811865476)*toCenter;float res=exp(-length(toCenter)*1.0)*0.05+exp(-length(toCenter)*7.5)*0.5+exp(-length(toCenter)*25.0)*1.+exp(-length(toCenter*vec2(1.0,10.0))*30.0)*20.+exp(-length(toCenter*vec2(1.0,20.0))*60.0)*300.+exp(-length(toCenter*vec2(10.0,1.0))*30.0)*20.+exp(-length(toCenter*vec2(20.0,1.0))*60.0)*300.+exp(-length(rotToCenter*vec2(1.0,8.0))*37.5)*12.+exp(-length(rotToCenter*vec2(1.0,20.0))*75.0)*300.+exp(-length(rotToCenter*vec2(20.0,1.0))*75.0)*300.;gl_FragColor=vec4(res,res,0.,0.);}`,
    convolutionMixFrag = `#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_kernelTexture;void main(){vec4 a=texture2D(u_texture,v_uv);vec4 b=texture2D(u_kernelTexture,v_uv);gl_FragColor=vec4(a.xy*b.xy-a.zw*b.zw,a.xy*b.zw+a.zw*b.xy);}`,
    convolutionCacheFrag = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform float u_amount;uniform float u_saturation;varying vec2 v_uv;void main(){gl_FragColor=texture2D(u_texture,v_uv)*u_amount;gl_FragColor.rgb=mix(vec3(dot(gl_FragColor.rgb,vec3(0.299,0.587,0.114))),gl_FragColor.rgb,u_saturation);}`,
    convolutionFrag = `#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform sampler2D u_bloomTexture;uniform float u_convolutionBuffer;
#include <common>
vec3 dithering(vec3 color){float grid_position=rand(gl_FragCoord.xy);vec3 dither_shift_RGB=vec3(0.25/255.0,-0.25/255.0,0.25/255.0);dither_shift_RGB=mix(2.0*dither_shift_RGB,-2.0*dither_shift_RGB,grid_position);return color+dither_shift_RGB;}void main(){vec4 c=texture2D(u_texture,v_uv);vec2 bloomUv=(v_uv-0.5)/(1.0+u_convolutionBuffer)+0.5;gl_FragColor=c+texture2D(u_bloomTexture,bloomUv);gl_FragColor.rgb=dithering(gl_FragColor.rgb);gl_FragColor.a=1.0;}`;


export class Bloom extends PostEffect {
    ITERATION = 5;
    USE_CONVOLUTION = !0;
    USE_HD = !0;
    USE_LENS_DIRT = !1;
    amount = 1;
    radius = 0;
    threshold = .1;
    smoothWidth = 1;
    highPassMultiplier = 1;
    haloWidth = .8;
    haloRGBShift = .03;
    haloStrength = .21;
    haloMaskInner = .3;
    haloMaskOuter = .5;
    highPassMaterial;
    highPassRenderTarget;
    fftHMaterial;
    fftVMaterial;
    srcMaterial;
    convolutionSrcFrag = convolutionSrcFrag;
    srcSize = 256;
    srcRT;
    fftCacheRT1;
    fftCacheRT2;
    fftSrcRT;
    fftBloomOutCacheMaterial;
    fftBloomOutCacheRT;
    convolutionMixMaterial;
    convolutionMixDownScale = 1;
    convolutionBuffer = .1;
    renderTargetsHorizontal = [];
    renderTargetsVertical = [];
    blurMaterials = [];
    saturation = 1;
    renderOrder = 10;
    directionX = new THREE.Vector2(1, 0);
    directionY = new THREE.Vector2(0, 1);

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        Object.assign(this, e), super.init();
        let t = THREE.HalfFloatType;
        if (this.highPassRenderTarget = this.base.fboHelper.createRenderTarget(1, 1, !this.USE_HD, t), this.highPassMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_luminosityThreshold: {value: 1},
                u_smoothWidth: {value: 1},
                u_amount: {value: 1},
                u_haloWidth: {value: 1},
                u_haloRGBShift: {value: 1},
                u_haloStrength: {value: 1},
                u_haloMaskInner: {value: 1},
                u_haloMaskOuter: {value: 1},
                u_texelSize: null,
                u_aspect: {value: new THREE.Vector2},
                u_dirtTexture: {value: null},
                u_dirtAspect: {value: new THREE.Vector2}
            }, fragmentShader: highPassFrag
        }), this.highPassMaterial.defines.USE_LENS_DIRT = this.USE_LENS_DIRT, this.USE_CONVOLUTION) this.highPassMaterial.defines.USE_CONVOLUTION = !0, this.highPassMaterial.uniforms.u_convolutionBuffer = {value: .15}, this.fftSrcRT = this.base.fboHelper.createRenderTarget(1, 1, !0, t), this.fftCacheRT1 = this.base.fboHelper.createRenderTarget(1, 1, !0, t), this.fftCacheRT2 = this.fftCacheRT1.clone(), this.fftBloomOutCacheRT = this.base.fboHelper.createRenderTarget(1, 1), this.srcMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {u_aspect: {value: new THREE.Vector2}},
            fragmentShader: this.convolutionSrcFrag
        }), this.fftHMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_texelSize: {value: new THREE.Vector2},
                u_subtransformSize: {value: 0},
                u_normalization: {value: 0},
                u_isForward: {value: 0}
            }, fragmentShader: fftFrag
        }), this.fftHMaterial.defines.HORIZTONAL = !0, this.fftVMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: this.fftHMaterial.uniforms,
            fragmentShader: fftFrag
        }), this.convolutionMixMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_kernelTexture: {value: this.fftSrcRT.texture}
            }, fragmentShader: convolutionMixFrag
        }), this.fftBloomOutCacheMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_amount: {value: 0},
                u_saturation: {value: 0}
            }, fragmentShader: convolutionCacheFrag
        }), this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_bloomTexture: {value: this.fftBloomOutCacheRT.texture},
                u_convolutionBuffer: this.highPassMaterial.uniforms.u_convolutionBuffer
            }, fragmentShader: convolutionFrag, blending: THREE.NoBlending
        }); else {
            for (let r = 0; r < this.ITERATION; r++) {
                this.renderTargetsHorizontal.push(this.base.fboHelper.createRenderTarget(1, 1, !1, t)), this.renderTargetsVertical.push(this.base.fboHelper.createRenderTarget(1, 1, !1, t));
                const n = 3 + r * 2;
                this.blurMaterials[r] = this.base.fboHelper.createRawShaderMaterial({
                    uniforms: {
                        u_texture: {value: null},
                        u_resolution: {value: new THREE.Vector2},
                        u_direction: {value: null}
                    }, fragmentShader: blurFrag, defines: {KERNEL_RADIUS: n, SIGMA: n}
                })
            }
            this.material = this.base.fboHelper.createRawShaderMaterial({
                uniforms: {
                    u_texture: {value: null},
                    u_bloomStrength: {value: 1},
                    u_bloomWeights: {value: []},
                    u_saturation: {value: 0}
                }, fragmentShader: frag$2, blending: THREE.NoBlending, defines: {ITERATION: this.ITERATION}
            });
            for (let r = 0; r < this.ITERATION; r++) this.material.uniforms["u_blurTexture" + r] = {value: this.renderTargetsVertical[r].texture}
        }
    }

    setDirtTexture(e) {
        this.highPassMaterial.uniforms.u_dirtTexture.value = e
    }

    setPostprocessing(e) {
        const t = e.width, r = e.height;
        if (this.USE_CONVOLUTION) {
            let n = math.powerTwoCeiling(t / 2) >> this.convolutionMixDownScale,
                o = math.powerTwoCeiling(r / 2) >> this.convolutionMixDownScale;
            if (this.highPassRenderTarget.setSize(n, o), n !== this.fftCacheRT1.width || o !== this.fftCacheRT1.height) {
                this.fftSrcRT.setSize(n, o), this.fftCacheRT1.setSize(n, o), this.fftCacheRT2.setSize(n, o), this.fftBloomOutCacheRT.setSize(n, o);
                let l = r / Math.max(t, r);
                this.srcMaterial.uniforms.u_aspect.value.set(t / r * l, l), this.base.fboHelper.render(this.srcMaterial, this.fftCacheRT1), this.renderFFT(this.fftCacheRT1, this.fftSrcRT, !0)
            }
        } else {
            let n = Math.ceil(t / 2), o = Math.ceil(r / 2);
            this.highPassRenderTarget.setSize(n, o), super.setPostprocessing(e);
            for (let l = 0; l < this.ITERATION; l++) this.renderTargetsHorizontal[l].setSize(n, o), this.renderTargetsVertical[l].setSize(n, o), this.blurMaterials[l].uniforms.u_resolution.value.set(n, o), n = Math.ceil(n / 2), o = Math.ceil(o / 2)
        }
    }

    dispose() {
        if (!this.USE_CONVOLUTION) {
            this.highPassRenderTarget && this.highPassRenderTarget.dispose();
            for (let e = 0; e < this.ITERATION; e++) this.renderTargetsHorizontal[e] && this.renderTargetsHorizontal[e].dispose(), this.renderTargetsVertical[e] && this.renderTargetsVertical[e].dispose()
        }
    }

    needsRender() {
        return !!this.amount
    }

    renderFFT(e, t, r) {
        let n = e.width, o = e.height, l = Math.round(Math.log(n) / Math.log(2)),
            c = Math.round(Math.log(o) / Math.log(2)), u = l + c, f = u % 2 === 0;
        this.fftHMaterial;
        let p = this.fftHMaterial.uniforms;
        for (let g = 0; g < u; g++) {
            let v = g < l;
            p.u_texture.value = e.texture, p.u_normalization.value = g === 0 ? 1 / Math.sqrt(n * o) : 1, p.u_isForward.value = !!r, p.u_texelSize.value.set(1 / n, 1 / o), p.u_subtransformSize.value = Math.pow(2, (v ? g : g - l) + 1), this.base.fboHelper.render(v ? this.fftHMaterial : this.fftVMaterial, t);
            let _ = e;
            e = t, t = _
        }
        f && this.base.fboHelper.copy(e.texture, t)
    }

    render(e, t = !1) {
        let r = this.base.properties.postprocessing.width, n = this.base.properties.postprocessing.height;
        this.highPassMaterial.uniforms.u_texture.value = e.fromTexture, this.highPassMaterial.uniforms.u_luminosityThreshold.value = this.threshold, this.highPassMaterial.uniforms.u_smoothWidth.value = this.smoothWidth, this.highPassMaterial.uniforms.u_amount.value = this.highPassMultiplier, this.highPassMaterial.uniforms.u_haloWidth.value = this.haloWidth, this.highPassMaterial.uniforms.u_haloRGBShift.value = this.haloRGBShift * r, this.highPassMaterial.uniforms.u_haloStrength.value = this.haloStrength, this.highPassMaterial.uniforms.u_haloMaskInner.value = this.haloMaskInner, this.highPassMaterial.uniforms.u_haloMaskOuter.value = this.haloMaskOuter, this.highPassMaterial.uniforms.u_texelSize = e.sharedUniforms.u_texelSize, this.highPassMaterial.uniforms.u_aspect = e.sharedUniforms.u_aspect;
        let o = this.haloStrength > 0, l = n / Math.sqrt(r * r + n * n) * 2;
        if (this.highPassMaterial.uniforms.u_aspect.value.set(r / n * l, l), l = n / Math.max(r, n), this.highPassMaterial.uniforms.u_dirtAspect.value.set(r / n * l, l), this.highPassMaterial.defines.USE_HALO !== o && (this.highPassMaterial.defines.USE_HALO = o, this.highPassMaterial.needsUpdate = !0), this.USE_CONVOLUTION && (this.highPassMaterial.uniforms.u_convolutionBuffer.value = this.convolutionBuffer), e.renderMaterial(this.highPassMaterial, this.highPassRenderTarget), this.USE_CONVOLUTION) {
            this.base.fboHelper.copy(this.highPassRenderTarget.texture, this.fftCacheRT1), this.renderFFT(this.fftCacheRT1, this.fftCacheRT2, !0), this.convolutionMixMaterial.uniforms.u_texture.value = this.fftCacheRT2.texture, this.base.fboHelper.render(this.convolutionMixMaterial, this.fftCacheRT1), this.renderFFT(this.fftCacheRT1, this.fftCacheRT2, !1);
            let c = this.amount * 1024;
            c = c / Math.pow(math.powerTwoCeilingBase(this.fftCacheRT1.width * this.fftCacheRT1.height), 4) * .85, this.fftBloomOutCacheMaterial.uniforms.u_amount.value = c, this.fftBloomOutCacheMaterial.uniforms.u_saturation.value = this.saturation, this.fftBloomOutCacheMaterial.uniforms.u_texture.value = this.fftCacheRT2.texture, e.renderMaterial(this.fftBloomOutCacheMaterial, this.fftBloomOutCacheRT), super.render(e, t)
        } else {
            let c = this.highPassRenderTarget;
            for (let u = 0; u < this.ITERATION; u++) {
                const f = this.blurMaterials[u];
                f.uniforms.u_texture.value = c.texture, f.uniforms.u_direction.value = this.directionX, e.renderMaterial(f, this.renderTargetsHorizontal[u]), f.uniforms.u_texture.value = this.renderTargetsHorizontal[u].texture, f.uniforms.u_direction.value = this.directionY, e.renderMaterial(f, this.renderTargetsVertical[u]), c = this.renderTargetsVertical[u]
            }
            this.material.uniforms.u_texture.value = e.fromTexture, this.material.uniforms.u_saturation.value = math.mix(1, this.saturation, .5);
            for (let u = 0; u < this.ITERATION; u++) {
                const f = (this.ITERATION - u) / this.ITERATION;
                this.material.uniforms.u_bloomWeights.value[u] = this.amount * (f + (1.2 - f * 2) * this.radius) / Math.pow(2, this.ITERATION - u - 1)
            }
            super.render(e, t)
        }
    }
}

export class ScreenPaintDistortion extends PostEffect {
    screenPaint = null;
    amount = 20;
    rgbShift = 1;
    multiplier = 1.25;
    colorMultiplier = 1;
    shade = 1.25;
    renderOrder = 75;

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        if (Object.assign(this, e), super.init(), !this.screenPaint) throw new Error("screenPaint is required");
        this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: Object.assign({
                u_texture: {value: null},
                u_screenPaintTexture: this.screenPaint.sharedUniforms.u_currPaintTexture,
                u_screenPaintTexelSize: this.screenPaint.sharedUniforms.u_paintTexelSize,
                u_amount: {value: 0},
                u_rgbShift: {value: 0},
                u_multiplier: {value: 0},
                u_colorMultiplier: {value: 0},
                u_shade: {value: 0}
            }, this.base.blueNoise.sharedUniforms), fragmentShader: frag$1
        })
    }

    needsRender(e) {
        return this.amount > 0
    }

    syncCamera(e) {
        this.needsSync = !0, e && (e.matrixWorldInverse.decompose(this._position, this._quaternion, this._scale), this.projectionViewMatrix.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), this.projectionViewInverseMatrix.copy(this.projectionViewMatrix).invert()), this.prevProjectionViewMatrix.copy(this.projectionViewMatrix)
    }

    render(e, t = !1) {
        this.material.uniforms.u_amount.value = this.amount, this.material.uniforms.u_rgbShift.value = this.rgbShift, this.material.uniforms.u_multiplier.value = this.multiplier, this.material.uniforms.u_colorMultiplier.value = this.colorMultiplier, this.material.uniforms.u_shade.value = this.shade, super.render(e, t)
    }
}


const fragmentShader = `#define GLSLIFY 1
varying vec2 v_uv;uniform sampler2D u_texture;uniform vec3 u_bgColor;uniform float u_opacity;uniform float u_vignetteFrom;uniform float u_vignetteTo;uniform vec2 u_vignetteAspect;uniform vec3 u_vignetteColor;uniform float u_saturation;uniform float u_contrast;uniform float u_brightness;uniform vec3 u_tintColor;uniform float u_tintOpacity;uniform float u_ditherSeed;float hash13(vec3 p3){p3=fract(p3*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}vec3 screen(vec3 cb,vec3 cs){return cb+cs-(cb*cs);}vec3 colorDodge(vec3 cb,vec3 cs){return mix(min(vec3(1.0),cb/(1.0-cs)),vec3(1.0),step(vec3(1.0),cs));}void main(){vec2 uv=v_uv;vec3 color=texture2D(u_texture,uv).rgb;float luma=dot(color,vec3(0.299,0.587,0.114));color=mix(vec3(luma),color,1.0+u_saturation);color=0.5+(1.0+u_contrast)*(color-0.5);color+=u_brightness;color=mix(color,screen(colorDodge(color,u_tintColor),u_tintColor),u_tintOpacity);float d=length((uv-0.5)*u_vignetteAspect)*2.0;color=mix(color,u_vignetteColor,smoothstep(u_vignetteFrom,u_vignetteTo,d));gl_FragColor=vec4(mix(u_bgColor,color,u_opacity)+hash13(vec3(gl_FragCoord.xy,u_ditherSeed))/255.0,1.0);}`;


export class Final extends PostEffect {
    vignetteFrom = .6;
    vignetteTo = 1.6;
    vignetteAspect = new THREE.Vector2;
    vignetteColor = new THREE.Color;
    saturation = 1;
    contrast = 0;
    brightness = 1;
    tintColor = new THREE.Color;
    tintOpacity = 1;
    bgColor = new THREE.Color;
    opacity = 1;
    isActive = !1;
    renderOrder = 30;

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        Object.assign(this, e), super.init(), this.material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_vignetteFrom: {value: 0},
                u_vignetteTo: {value: 0},
                u_vignetteAspect: {value: this.vignetteAspect},
                u_vignetteColor: {value: this.vignetteColor},
                u_saturation: {value: 0},
                u_contrast: {value: 0},
                u_brightness: {value: 0},
                u_tintColor: {value: this.tintColor},
                u_tintOpacity: {value: 0},
                u_bgColor: {value: this.bgColor},
                u_opacity: {value: 0},
                u_ditherSeed: {value: 0}
            }, fragmentShader
        })
    }

    needsRender() {
        return this.isActive
    }

    render(e, t = !1) {
        const r = e.width, n = e.height;
        let o = this.material.uniforms;
        o.u_vignetteFrom.value = this.vignetteFrom, o.u_vignetteTo.value = this.vignetteTo;
        const l = n / Math.sqrt(r * r + n * n);
        this.vignetteAspect.set(r / n * l, l), o.u_saturation.value = this.saturation - 1, o.u_contrast.value = this.contrast, o.u_brightness.value = this.brightness - 1, o.u_tintOpacity.value = this.tintOpacity, o.u_opacity.value = this.opacity, o.u_ditherSeed.value = Math.random() * 1e3, super.render(e, t)
    }
}


const easuFrag = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_inResolution;uniform vec2 u_outResolution;vec3 FsrEasuCF(vec2 p){return texture2D(u_texture,p).rgb;}void FsrEasuCon(out vec4 con0,out vec4 con1,out vec4 con2,out vec4 con3,vec2 inputViewportInPixels,vec2 inputSizeInPixels,vec2 outputSizeInPixels){con0=vec4(inputViewportInPixels.x/outputSizeInPixels.x,inputViewportInPixels.y/outputSizeInPixels.y,.5*inputViewportInPixels.x/outputSizeInPixels.x-.5,.5*inputViewportInPixels.y/outputSizeInPixels.y-.5);con1=vec4(1,1,1,-1)/inputSizeInPixels.xyxy;con2=vec4(-1,2,1,2)/inputSizeInPixels.xyxy;con3=vec4(0,4,0,0)/inputSizeInPixels.xyxy;}void FsrEasuTapF(inout vec3 aC,inout float aW,vec2 off,vec2 dir,vec2 len,float lob,float clp,vec3 c){vec2 v=vec2(dot(off,dir),dot(off,vec2(-dir.y,dir.x)));v*=len;float d2=min(dot(v,v),clp);float wB=.4*d2-1.;float wA=lob*d2-1.;wB*=wB;wA*=wA;wB=1.5625*wB-.5625;float w=wB*wA;aC+=c*w;aW+=w;}void FsrEasuSetF(inout vec2 dir,inout float len,float w,float lA,float lB,float lC,float lD,float lE){float lenX=max(abs(lD-lC),abs(lC-lB));float dirX=lD-lB;dir.x+=dirX*w;lenX=clamp(abs(dirX)/lenX,0.,1.);lenX*=lenX;len+=lenX*w;float lenY=max(abs(lE-lC),abs(lC-lA));float dirY=lE-lA;dir.y+=dirY*w;lenY=clamp(abs(dirY)/lenY,0.,1.);lenY*=lenY;len+=lenY*w;}void FsrEasuF(out vec3 pix,vec2 ip,vec4 con0,vec4 con1,vec4 con2,vec4 con3){vec2 pp=ip*con0.xy+con0.zw;vec2 fp=floor(pp);pp-=fp;vec2 p0=fp*con1.xy+con1.zw;vec2 p1=p0+con2.xy;vec2 p2=p0+con2.zw;vec2 p3=p0+con3.xy;vec4 off=vec4(-.5,.5,-.5,.5)*con1.xxyy;vec3 bC=FsrEasuCF(p0+off.xw);float bL=bC.g+0.5*(bC.r+bC.b);vec3 cC=FsrEasuCF(p0+off.yw);float cL=cC.g+0.5*(cC.r+cC.b);vec3 iC=FsrEasuCF(p1+off.xw);float iL=iC.g+0.5*(iC.r+iC.b);vec3 jC=FsrEasuCF(p1+off.yw);float jL=jC.g+0.5*(jC.r+jC.b);vec3 fC=FsrEasuCF(p1+off.yz);float fL=fC.g+0.5*(fC.r+fC.b);vec3 eC=FsrEasuCF(p1+off.xz);float eL=eC.g+0.5*(eC.r+eC.b);vec3 kC=FsrEasuCF(p2+off.xw);float kL=kC.g+0.5*(kC.r+kC.b);vec3 lC=FsrEasuCF(p2+off.yw);float lL=lC.g+0.5*(lC.r+lC.b);vec3 hC=FsrEasuCF(p2+off.yz);float hL=hC.g+0.5*(hC.r+hC.b);vec3 gC=FsrEasuCF(p2+off.xz);float gL=gC.g+0.5*(gC.r+gC.b);vec3 oC=FsrEasuCF(p3+off.yz);float oL=oC.g+0.5*(oC.r+oC.b);vec3 nC=FsrEasuCF(p3+off.xz);float nL=nC.g+0.5*(nC.r+nC.b);vec2 dir=vec2(0.);float len=0.;FsrEasuSetF(dir,len,(1.-pp.x)*(1.-pp.y),bL,eL,fL,gL,jL);FsrEasuSetF(dir,len,pp.x*(1.-pp.y),cL,fL,gL,hL,kL);FsrEasuSetF(dir,len,(1.-pp.x)*pp.y,fL,iL,jL,kL,nL);FsrEasuSetF(dir,len,pp.x*pp.y,gL,jL,kL,lL,oL);vec2 dir2=dir*dir;float dirR=dir2.x+dir2.y;bool zro=dirR<(1./32768.);dirR=inversesqrt(dirR);dirR=zro ? 1. : dirR;dir.x=zro ? 1. : dir.x;dir*=vec2(dirR);len=len*.5;len*=len;float stretch=dot(dir,dir)/(max(abs(dir.x),abs(dir.y)));vec2 len2=vec2(1.+(stretch-1.0)*len,1.-.5*len);float lob=.5-.29*len;float clp=1./lob;vec3 min4=min(min(fC,gC),min(jC,kC));vec3 max4=max(max(fC,gC),max(jC,kC));vec3 aC=vec3(0);float aW=0.;FsrEasuTapF(aC,aW,vec2(0.,-1.)-pp,dir,len2,lob,clp,bC);FsrEasuTapF(aC,aW,vec2(1.,-1.)-pp,dir,len2,lob,clp,cC);FsrEasuTapF(aC,aW,vec2(-1.,1.)-pp,dir,len2,lob,clp,iC);FsrEasuTapF(aC,aW,vec2(0.,1.)-pp,dir,len2,lob,clp,jC);FsrEasuTapF(aC,aW,vec2(0.,0.)-pp,dir,len2,lob,clp,fC);FsrEasuTapF(aC,aW,vec2(-1.,0.)-pp,dir,len2,lob,clp,eC);FsrEasuTapF(aC,aW,vec2(1.,1.)-pp,dir,len2,lob,clp,kC);FsrEasuTapF(aC,aW,vec2(2.,1.)-pp,dir,len2,lob,clp,lC);FsrEasuTapF(aC,aW,vec2(2.,0.)-pp,dir,len2,lob,clp,hC);FsrEasuTapF(aC,aW,vec2(1.,0.)-pp,dir,len2,lob,clp,gC);FsrEasuTapF(aC,aW,vec2(1.,2.)-pp,dir,len2,lob,clp,oC);FsrEasuTapF(aC,aW,vec2(0.,2.)-pp,dir,len2,lob,clp,nC);pix=min(max4,max(min4,aC/aW));}void main(){vec3 c;vec4 con0,con1,con2,con3;FsrEasuCon(con0,con1,con2,con3,u_inResolution,u_inResolution,u_outResolution);FsrEasuF(c,gl_FragCoord.xy,con0,con1,con2,con3);gl_FragColor=vec4(c.xyz,1);}`,
    frag = `#define GLSLIFY 1
uniform sampler2D u_texture;uniform vec2 u_outResolution;uniform float u_sharpness;
#define FSR_RCAS_LIMIT (0.25-(1.0/16.0))
vec4 FsrRcasLoadF(vec2 p);void FsrRcasCon(out float con,float sharpness){con=exp2(-sharpness);}vec3 FsrRcasF(vec2 ip,float con){vec2 sp=vec2(ip);vec3 b=FsrRcasLoadF(sp+vec2(0,-1)).rgb;vec3 d=FsrRcasLoadF(sp+vec2(-1,0)).rgb;vec3 e=FsrRcasLoadF(sp).rgb;vec3 f=FsrRcasLoadF(sp+vec2(1,0)).rgb;vec3 h=FsrRcasLoadF(sp+vec2(0,1)).rgb;float bL=b.g+.5*(b.b+b.r);float dL=d.g+.5*(d.b+d.r);float eL=e.g+.5*(e.b+e.r);float fL=f.g+.5*(f.b+f.r);float hL=h.g+.5*(h.b+h.r);float nz=.25*(bL+dL+fL+hL)-eL;nz=clamp(abs(nz)/(max(max(bL,dL),max(eL,max(fL,hL)))-min(min(bL,dL),min(eL,min(fL,hL)))),0.,1.);nz=1.-.5*nz;vec3 mn4=min(b,min(f,h));vec3 mx4=max(b,max(f,h));vec2 peakC=vec2(1.,-4.);vec3 hitMin=mn4/(4.*mx4);vec3 hitMax=(peakC.x-mx4)/(4.*mn4+peakC.y);vec3 lobeRGB=max(-hitMin,hitMax);float lobe=max(-FSR_RCAS_LIMIT,min(max(lobeRGB.r,max(lobeRGB.g,lobeRGB.b)),0.))*con;
#ifdef FSR_RCAS_DENOISE
lobe*=nz;
#endif
return(lobe*(b+d+h+f)+e)/(4.*lobe+1.);}vec4 FsrRcasLoadF(vec2 p){return texture2D(u_texture,p/u_outResolution.xy);}void main(){vec2 uv=gl_FragCoord.xy/u_outResolution.xy;float con;FsrRcasCon(con,u_sharpness);vec3 col=FsrRcasF(gl_FragCoord.xy,con);gl_FragColor=vec4(col,1.);}`;


let Fsr$1 = class {
    sharpness = 1;
    _easuMaterial;
    _material;
    _inResolution = new THREE.Vector2;
    _outResolution = new THREE.Vector2;
    _cacheRenderTarget = null;

    constructor(base) {
        this.base = base
        this._cacheRenderTarget = this.base.fboHelper.createRenderTarget(1, 1), this._easuMaterial = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_inResolution: {value: this._inResolution},
                u_outResolution: {value: this._outResolution}
            }, fragmentShader: easuFrag
        }), this._material = this.base.fboHelper.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: this._cacheRenderTarget.texture},
                u_outResolution: this._easuMaterial.uniforms.u_outResolution,
                u_sharpness: {value: 0}
            }, fragmentShader: frag
        })
    }

    render(e, t) {
        let r = e.image.width, n = e.image.height;
        this._material.uniforms.u_sharpness.value = this.sharpness, (this._inResolution.width !== r || this._inResolution.height !== n) && this._inResolution.set(r, n);
        let o, l;
        t ? (o = t.width, l = t.height) : (o = this.base.fboHelper.renderer.domElement.width, l = this.base.fboHelper.renderer.domElement.height), (this._outResolution.width !== o || this._outResolution.height !== l) && (this._outResolution.set(o, l), this._cacheRenderTarget.setSize(o, l)), this._easuMaterial.uniforms.u_texture.value = e, this.base.fboHelper.render(this._easuMaterial, this._cacheRenderTarget), t || (this.base.fboHelper.renderer.setRenderTarget(null), this.base.fboHelper.renderer.setViewport(0, 0, this._outResolution.x, this._outResolution.y)), this.base.fboHelper.render(this._material, t)
    }
};

export class Fsr extends PostEffect {
    sharpness = 1;
    fsr;
    renderOrder = 2e3;

    constructor(base) {
        super(base);
        this.base = base
    }

    init(e) {
        Object.assign(this, e), super.init(), this.fsr = new Fsr$1(this.base)
    }

    render(e, t = !1) {
        this.fsr.sharpness = this.sharpness, this.fsr.render(e.fromTexture, t ? null : e.toRenderTarget), e.swap()
    }
}

class Ufx extends PostEffect {
    scene = new THREE.Scene;
    camera = new THREE.PerspectiveCamera(60, 1);
    frameIdx = -1;
    sectionLayer = new THREE.Object3D;
    projectDetailsLayer = new THREE.Object3D;
    sharedUniforms = {u_fromTexture: {value: null}};

    constructor(base) {
        super(base);
        this.base = base
    }

    init() {
    }

    setPostprocessing(e) {
        let t = this.camera, r = this.base.properties.viewportWidth, n = this.base.properties.viewportHeight;
        t.position.set(r / 2, -n / 2, n / (2 * Math.tan(t.fov * Math.PI / 360))), t.aspect = r / n, t.far = t.position.z * 2, t.near = t.far / 1e3, t.updateProjectionMatrix()
    }

    render(e, t = !1) {
        let r = this.base.fboHelper.getColorState(), n = this.base.properties.renderer;
        this.base.fboHelper.copy(e.fromTexture, e.sceneRenderTarget), n.setRenderTarget(e.sceneRenderTarget), this.base.fboHelper.renderer.autoClear = !1, this.base.fboHelper.renderer.autoClearColor = !1, this.base.fboHelper.renderer.autoClearStencil = !0, this.base.fboHelper.renderer.autoClearDepth = !0, this.base.fboHelper.renderer.clear(!1, !0, !0), n.render(this.scene, this.camera), n.setRenderTarget(null);
        let o = t ? null : e.toRenderTarget;
        this.base.fboHelper.copy(e.sceneTexture, o), this.base.fboHelper.setColorState(r), e.swap()
    }
}

export class PreUfx extends Ufx {
    constructor(base) {
        super(base);
        this.base = base
    }

    renderOrder = 50
}

export class PostUfx extends Ufx {
    constructor(base) {
        super(base);
        this.base = base
    }

    renderOrder = 100
}
