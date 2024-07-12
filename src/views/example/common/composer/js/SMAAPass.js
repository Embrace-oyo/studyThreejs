/**
 * justThreeJs SMAAPass.js
 * @author kongjianqiu
 * @description
 * @created 2024/7/9 10:44:00
 */
import * as THREE from "three";
import {FullScreenQuad, Pass} from "three/addons/postprocessing/Pass.js";
import smaaEdgesVert from '@/views/example/common/composer/glsl/smaaEdgesVert.glsl'
import smaaEdgesFrag from '@/views/example/common/composer/glsl/smaaEdgesFrag.glsl'
import smaaWeightsVert from '@/views/example/common/composer/glsl/smaaWeightsVert.glsl'
import smaaWeightsFrag from '@/views/example/common/composer/glsl/smaaWeightsFrag.glsl'
import smaaBlendVert from '@/views/example/common/composer/glsl/smaaBlendVert.glsl'
import smaaBlendFrag from '@/views/example/common/composer/glsl/smaaBlendFrag.glsl'

class SMAAPass extends Pass {
    constructor(width, height) {
        super();
        this.RTInit(width, height)
        this.textureInit()
        this.materialInit(width, height)
    }

    RTInit(width, height) {
        this.edgesRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: THREE.LinearFilter,
            minFilter: THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            encoding: THREE.LinearEncoding,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: 0
        });
        this.edgesRenderTarget.texture.name = 'SMAAPass.edges';
        this.weightsRenderTarget = new THREE.WebGLRenderTarget(width, height, {
            wrapS: THREE.ClampToEdgeWrapping,
            wrapT: THREE.ClampToEdgeWrapping,
            magFilter: THREE.LinearFilter,
            minFilter: THREE.LinearFilter,
            type: THREE.UnsignedByteType,
            anisotropy: 0,
            encoding: THREE.LinearEncoding,
            depthBuffer: !1,
            stencilBuffer: !1,
            samples: 0
        });
        this.weightsRenderTarget.texture.name = 'SMAAPass.weights';
    }

    textureInit() {
        const areaTextureImage = new Image();
        areaTextureImage.src = 'https://lusion.dev/assets/textures/smaa-area.png';
        areaTextureImage.onload = () => {
            // assigning data to HTMLImageElement.src is asynchronous (see #15162)
            this.areaTexture.needsUpdate = true;
        };
        this.areaTexture = new THREE.Texture();
        this.areaTexture.name = 'SMAAPass.area';
        this.areaTexture.image = areaTextureImage;
        this.areaTexture.minFilter = THREE.LinearFilter;
        this.areaTexture.generateMipmaps = false;
        this.areaTexture.flipY = false;


        const searchTextureImage = new Image();
        searchTextureImage.src = 'https://lusion.dev/assets/textures/smaa-search.png';
        searchTextureImage.onload = () => {
            // assigning data to HTMLImageElement.src is asynchronous (see #15162)
            this.searchTexture.needsUpdate = true;

        };

        this.searchTexture = new THREE.Texture();
        this.searchTexture.name = 'SMAAPass.search';
        this.searchTexture.image = searchTextureImage;
        this.searchTexture.magFilter = THREE.NearestFilter;
        this.searchTexture.minFilter = THREE.NearestFilter;
        this.searchTexture.generateMipmaps = false;
        this.searchTexture.flipY = false;
    }

    materialInit(width, height) {
        this.edgesMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_texelSize: new THREE.Vector2(1 / width, 1 / height)
            },
            vertexShader: smaaEdgesVert,
            fragmentShader: smaaEdgesFrag,
            defines: {SMAA_THRESHOLD: "0.1"},
            blending: THREE.NoBlending,
            depthTest: !1,
            depthWrite: !1
        })


        this.weightsMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_edgesTexture: {value: this.edgesRenderTarget.texture},
                u_areaTexture: this.areaTexture,
                u_searchTexture: this.searchTexture,
                u_texelSize: new THREE.Vector2(1 / width, 1 / height)
            },
            vertexShader: smaaWeightsVert,
            fragmentShader: smaaWeightsFrag,
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


        this.blendMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                u_texture: {value: null},
                u_weightsTexture: {value: this.weightsRenderTarget.texture},
                u_texelSize: new THREE.Vector2(1 / width, 1 / height)
            },
            vertexShader: smaaBlendVert,
            fragmentShader: smaaBlendFrag
        });

        this.fsQuad = new FullScreenQuad(null);
    }

    render(renderer, writeBuffer, readBuffer) {

        // pass 1
        this.edgesMaterial.uniforms['u_texture'].value = readBuffer.texture;

        this.fsQuad.material = this.edgesMaterial;
        renderer.setRenderTarget(this.edgesRenderTarget);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);

        // pass 2

        this.fsQuad.material = this.weightsMaterial;

        renderer.setRenderTarget(this.weightsRenderTarget);
        if (this.clear) renderer.clear();
        this.fsQuad.render(renderer);

        // pass 3

        this.blendMaterial.uniforms['u_texture'].value = readBuffer.texture;

        this.fsQuad.material = this.blendMaterial;

        if (this.renderToScreen) {

            renderer.setRenderTarget(null);
            this.fsQuad.render(renderer);

        } else {

            renderer.setRenderTarget(writeBuffer);
            if (this.clear) renderer.clear();
            this.fsQuad.render(renderer);

        }
    }

    setSize(width, height) {
        this.edgesRenderTarget.setSize(width, height);
        this.weightsRenderTarget.setSize(width, height);

        this.edgesMaterial.uniforms['u_texelSize'].value = new THREE.Vector2(1 / width, 1 / height);
        this.weightsMaterial.uniforms['u_texelSize'].value = new THREE.Vector2(1 / width, 1 / height);
        this.blendMaterial.uniforms['u_texelSize'].value = new THREE.Vector2(1 / width, 1 / height);
    }

    dispose() {
        this.edgesRenderTarget.dispose();
        this.weightsRenderTarget.dispose();

        this.areaTexture.dispose();
        this.searchTexture.dispose();

        this.edgesMaterial.dispose();
        this.weightsMaterial.dispose();
        this.blendMaterial.dispose();

        this.fsQuad.dispose();
    }
}


export {SMAAPass}
