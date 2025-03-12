/**
 * justThreeJs sky.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/6 14:09:29
 */
import * as THREE from "three";
// glsl
import skyVertex from '@/views/pages/ocean/glsl/sky/vertex.glsl'
import skyFragment from '@/views/pages/ocean/glsl/sky/fragment.glsl'

export default class Sky {
    constructor(base) {
        this.base = base;
        this.parameters = {
            elevation: 2,
            azimuth: 180
        };
        this.pmremGenerator = new THREE.PMREMGenerator( this.base.renderer );
        this.sceneEnv = new THREE.Scene();
        this.sun = new THREE.Vector3();
        this.renderTarget;
        this.skyGeometry = new THREE.BoxGeometry(1, 1, 1);
        this.skyMaterial = new THREE.ShaderMaterial({
            name: 'SkyShader',
            uniforms: {
                turbidity: {value: 10},
                rayleigh: {value: 2},
                mieCoefficient: {value: 0.005},
                mieDirectionalG: {value: 0.8},
                sunPosition: {value: new THREE.Vector3()},
                up: {value: new THREE.Vector3(0, 1, 0)}
            },
            vertexShader: skyVertex,
            fragmentShader: skyFragment,
            side: THREE.BackSide,
            depthWrite: false
        });
        this.mesh = new THREE.Mesh(this.skyGeometry, this.skyMaterial);
        this.mesh.scale.setScalar(10000);
        this.base.scene.add(this.mesh);
        this.update();
    }

    update(){

        const phi = THREE.MathUtils.degToRad( 90 - this.parameters.elevation );
        const theta = THREE.MathUtils.degToRad( this.parameters.azimuth );

        this.sun.setFromSphericalCoords( 1, phi, theta );

        this.mesh.material.uniforms[ 'sunPosition' ].value.copy( this.sun );
        this.base.sea.mesh.material.uniforms[ 'sunDirection' ].value.copy( this.sun ).normalize();

        if ( this.renderTarget !== undefined ) this.renderTarget.dispose();

        this.sceneEnv.add( this.mesh );
        this.renderTarget = this.pmremGenerator.fromScene( this.sceneEnv );
        this.base.scene.add( this.mesh );

        this.base.scene.environment = this.renderTarget.texture;
    }

}
