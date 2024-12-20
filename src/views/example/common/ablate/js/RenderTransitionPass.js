import {
	HalfFloatType,
	ShaderMaterial,
	WebGLRenderTarget
} from 'three';
import { FullScreenQuad, Pass } from 'three/addons/postprocessing/Pass.js';
import vertex from '@/views/example/common/ablate/glsl/vertex.glsl'
import transition1 from '@/views/example/common/ablate/glsl/transition1.glsl'
import transition2 from '@/views/example/common/ablate/glsl/transition2.glsl'
import transition3 from '@/views/example/common/ablate/glsl/transition3.glsl'
import transition4 from '@/views/example/common/ablate/glsl/transition4.glsl'
import transition5 from '@/views/example/common/ablate/glsl/transition5.glsl'
import transition6 from '@/views/example/common/ablate/glsl/transition6.glsl'
import transition7 from '@/views/example/common/ablate/glsl/transition7.glsl'
import transition8 from '@/views/example/common/ablate/glsl/transition8.glsl'
import transition9 from '@/views/example/common/ablate/glsl/transition9.glsl'
import transition10 from '@/views/example/common/ablate/glsl/transition10.glsl'
import transition11 from '@/views/example/common/ablate/glsl/transition11.glsl'
import transition12 from '@/views/example/common/ablate/glsl/transition12.glsl'
import * as THREE from "three";
class RenderTransitionPass extends Pass {

	constructor( scene = [], aspect = 1, texture = null, texture1 = null,texture2 = null,texture3 = null,texture4 = null, texture5 = null, texture6 = null) {

		super();
        this.sceneArray = scene
        this.aspect = aspect
        this.array = [transition1, transition2, transition3, transition4, transition5, transition6,transition7,transition8,transition9, transition10, transition11, transition12]
        this.index = 0;
        this.texture = texture;
        this.texture1 = texture1;
        this.texture2 = texture2;
        this.texture3 = texture3;
        this.texture4 = texture4;
        this.texture5 = texture5;
        this.texture6 = texture6;
		this.material = this.createMaterial();
		this.fsQuad = new FullScreenQuad( this.material );

        if(this.sceneArray.length){
            for(let i = 0; i < this.sceneArray.length; i++){
                this['scene'+i] = this.sceneArray[i].scene;
                this['camera'+i] = this.sceneArray[i].camera;
                this['renderTarget'+i] = new WebGLRenderTarget();
                this['renderTarget'+i].texture.type = HalfFloatType;
            }
        }

	}

	setTransition( value ) {

		this.material.uniforms.mixRatio.value = value;

	}

    setFragment(index){
        this.index = index;
        const newMaterial = new THREE.ShaderMaterial().copy(this.material);
        newMaterial.fragmentShader = this.array[this.index];
        this.material = null;
        this.material = newMaterial;
        this.fsQuad = null
        this.fsQuad = new FullScreenQuad( this.material );
    }

	useTexture( value ) {

		this.material.uniforms.useTexture.value = value ? 1 : 0;

	}

	setTexture( value ) {

		this.material.uniforms.tMixTexture.value = value;

	}

	setTextureThreshold( value ) {

		this.material.uniforms.threshold.value = value;

	}

	setSize( width, height ) {
        for(let i = 0; i < this.sceneArray.length; i++){
            this['renderTarget'+i].setSize( width, height );
        }
	}

	render( renderer, writeBuffer ) {

        for(let i = 0; i < this.sceneArray.length; i++){
            renderer.setRenderTarget( this['renderTarget'+i] );
            renderer.render( this['scene'+i], this['camera'+i] );
        }

        if(!this.fsQuad) return

		const uniforms = this.fsQuad.material.uniforms;
		uniforms.tDiffuse1.value = this['renderTarget0'].texture;
		uniforms.tDiffuse2.value = this['renderTarget1'].texture;

		if ( this.renderToScreen ) {

			renderer.setRenderTarget( null );
			renderer.clear();

		} else {

			renderer.setRenderTarget( writeBuffer );
			if ( this.clear ) renderer.clear();

		}

		this.fsQuad.render( renderer );

	}

	dispose() {
        for(let i = 0; i < this.sceneArray.length; i++){
            this['renderTarget'+i].dispose();
        }
		this.material.dispose();
		this.fsQuad.dispose();

	}

	createMaterial() {

		return new ShaderMaterial( {
			uniforms: {
                ratio:{
                  value: this.aspect
                },
				tDiffuse1: {
					value: null
				},
				tDiffuse2: {
					value: null
				},
                tDiffuse3:{
                  value: this.texture
                },
                texture1:{
                    value: this.texture1
                },
                texture2:{
                    value: this.texture2
                },
                texture3:{
                    value: this.texture3
                },
                texture4:{
                    value: this.texture4
                },
                texture5:{
                    value: this.texture5
                },
                texture6:{
                    value: this.texture6
                },
				mixRatio: {
					value: 0.0
				},
				threshold: {
					value: 0.1
				},
				useTexture: {
					value: 1
				},
				tMixTexture: {
					value: null
				}
			},
			vertexShader: vertex,
			fragmentShader: this.array[this.index]
		} );

	}

}

export { RenderTransitionPass };
