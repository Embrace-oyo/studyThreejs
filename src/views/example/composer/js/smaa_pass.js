/**
 * justThreeJs smaa_pass.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/17 14:32:32
 */
import * as THREE from "three";
import smaaEdgesVert from "@/views/example/common/postprocessing/glsl/smaaEdgesVert.glsl";
import smaaEdgesFrag from "@/views/example/common/postprocessing/glsl/smaaEdgesFrag.glsl";
import smaaWeightsVert from "@/views/example/common/postprocessing/glsl/smaaWeightsVert.glsl";
import smaaWeightsFrag from "@/views/example/common/postprocessing/glsl/smaaWeightsFrag.glsl";
import smaaBlendVert from "@/views/example/common/postprocessing/glsl/smaaBlendVert.glsl";
import smaaBlendFrag from "@/views/example/common/postprocessing/glsl/smaaBlendFrag.glsl";
import blitVert from "@/views/example/common/postprocessing/glsl/blitVert.glsl";
import blitFrag from "@/views/example/common/postprocessing/glsl/blitFrag.glsl";

class Smaa {
    isPass = !0;
    enabled = !0;
    needsSwap = !0;
    clear = !0;
    renderToScreen = !0;
    edgesRenderTarget = null;
    weightsRenderTarget = null;
    edgesMaterial = null;
    weightsMaterial = null;
    renderOrder = 500;

    smaa_shaderUniforms = {
        u_areaTexture: {value: null},
        u_searchTexture: {value: null}
    }

    floatType = THREE.HalfFloatType;

    constructor(base) {
        this.base = base

        this.weightsRenderTarget = this.base.createRenderTarget(1, 1)
        this.edgesRenderTarget = this.base.createRenderTarget(1, 1)

        this.edgesMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_texelSize: null
            },
            vertexShader: this.base.precisionPrefix + smaaEdgesVert,
            fragmentShader: this.base.precisionPrefix + smaaEdgesFrag,
            defines: {SMAA_THRESHOLD: "0.1"},
            blending: THREE.NoBlending,
            depthTest: !1,
            depthWrite: !1
        })
        this.weightsMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_edgesTexture: {value: this.edgesRenderTarget.texture},
                u_areaTexture: this.smaa_shaderUniforms.u_areaTexture,
                u_searchTexture: this.smaa_shaderUniforms.u_searchTexture,
                u_texelSize: null
            },
            vertexShader: this.base.precisionPrefix + smaaWeightsVert,
            fragmentShader: this.base.precisionPrefix + smaaWeightsFrag,
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
        })

        this.material = this.base.createRawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_weightsTexture: {value: this.weightsRenderTarget.texture},
                u_texelSize: null
            },
            vertexShader: this.base.precisionPrefix + smaaBlendVert,
            fragmentShader: this.base.precisionPrefix + smaaBlendFrag
        })

        this.loader()


    }

    async loader() {
        let loader = new THREE.TextureLoader()
        let t = await loader.loadAsync('https://lusion.dev/assets/textures/smaa-area.png')
        let e = await loader.loadAsync('https://lusion.dev/assets/textures/smaa-search.png')
        this.setTextures(t.image, e.image)
    }

    setTextures(e, t) {
        const r = this.smaa_shaderUniforms.u_areaTexture.value = this._createTexture(e);
        r.minFilter = THREE.LinearFilter;
        const n = this.smaa_shaderUniforms.u_searchTexture.value = this._createTexture(t);
        n.magFilter = THREE.NearestFilter
        n.minFilter = THREE.NearestFilter
    }

    updateTextures() {
        this.smaa_shaderUniforms.u_areaTexture.value.needsUpdate = !0
        this.smaa_shaderUniforms.u_searchTexture.value.needsUpdate = !0
    }

    _createTexture(e) {
        const t = new THREE.Texture(e);
        t.generateMipmaps = !1
        t.flipY = !1
        return t
    }

    setPostprocessing(e) {
        const t = e.width;
        const r = e.height;
        this.edgesRenderTarget.setSize(t, r)
        this.weightsRenderTarget.setSize(t, r)
    }


    setSize() {
    }


    render(a) {
        const r = this.base.getColorState();
        this.smaa_shaderUniforms.u_searchTexture.value || console.warn("You need to use Smaa.setImages() to set the smaa textures manually and assign to this class.");
        const n = this.base.mainRenderer;
        if (n) {
            n.autoClear = !0
            n.setClearColor(0, 0)
        }
        this.edgesMaterial.uniforms.u_texelSize = this.weightsMaterial.uniforms.u_texelSize = this.material.uniforms.u_texelSize = a.postShaderUniforms.u_texelSize
        this.edgesMaterial.uniforms.u_texture.value = a.fromTexture


        this.base.FBOMesh.material = this.edgesMaterial;
        this.base.FBOMesh.visible = !1
        this.base.FBOSence.add(this.base.FBOMesh)
        this.base.mainRenderer.setRenderTarget(this.edgesRenderTarget)
        this.base.mainRenderer.render(this.base.FBOSence, this.base.FBOCamera)
        this.base.mainRenderer.setRenderTarget(null)
        this.base.FBOSence.remove(this.edgesMaterial)
        this.base.FBOMesh.visible = !0


        this.base.FBOMesh.material = this.weightsMaterial;
        this.base.FBOMesh.visible = !1
        this.base.FBOSence.add(this.base.FBOMesh)
        this.base.mainRenderer.setRenderTarget(this.weightsRenderTarget)
        this.base.mainRenderer.render(this.base.FBOSence, this.base.FBOCamera)
        this.base.mainRenderer.setRenderTarget(null)
        this.base.FBOSence.remove(this.weightsMaterial)
        this.base.FBOMesh.visible = !0

        this.base.setColorState(r)
        this.material.uniforms.u_texture.value = a.fromTexture

        let t = true


        this.base.FBOSence.material = this.material
        this.base.mainRenderer.setRenderTarget(t ? null : a.toRenderTarget)
        this.base.mainRenderer.render(this.base.FBOSence, this.base.FBOCamera)


    }

    dispose() {
        this.edgesRenderTarget && this.edgesRenderTarget.dispose()
        this.weightsRenderTarget && this.weightsRenderTarget.dispose()
    }
}


export default Smaa
