/**
 * justThreeJs ocean.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/6 13:04:26
 */
import * as THREE from "three";
// glsl
import seaVertex from '@/views/pages/ocean/glsl/sea/vertex.glsl'
import seaFragment from '@/views/pages/ocean/glsl/sea/fragment.glsl'

export default class Sea {
    constructor(base) {
        this.base = base;
        this.option = {
            clipBias: 0.0,
            alpha: 1.0,
            time: 0.0,
            normalSampler: this.base.waterTexture,
            sunDirection: new THREE.Vector3(0, 0, 0),
            sunColor: new THREE.Color(0xffffff),
            waterColor: new THREE.Color(0x001e0f),
            eye: new THREE.Vector3(0, 0, 0),
            distortionScale: 3.7,
            side: THREE.FrontSide,
            size: 1.0,
        }
        const mirrorPlane = new THREE.Plane();
        const normal = new THREE.Vector3();
        const mirrorWorldPosition = new THREE.Vector3();
        const cameraWorldPosition = new THREE.Vector3();
        const rotationMatrix = new THREE.Matrix4();
        const lookAtPosition = new THREE.Vector3(0, 0, -1);
        const clipPlane = new THREE.Vector4();
        const view = new THREE.Vector3();
        const target = new THREE.Vector3();
        const q = new THREE.Vector4();
        const textureMatrix = new THREE.Matrix4();
        const mirrorCamera = new THREE.PerspectiveCamera();
        this.renderTarget = new THREE.WebGLRenderTarget(512, 512);
        this.seaGeometry = new THREE.PlaneGeometry(10000, 10000);
        this.seaMaterial = new THREE.ShaderMaterial({
            name: 'seaMaterial',
            uniforms: {
                ...THREE.UniformsLib['lights'],
                normalSampler: {value: this.option.normalSampler},
                mirrorSampler: {value: this.renderTarget.texture},
                alpha: {value: this.option.alpha},
                time: {value: this.option.time},
                size: {value: this.option.size},
                distortionScale: {value: this.option.distortionScale},
                textureMatrix: {value: textureMatrix},
                sunColor: {value: this.option.sunColor},
                sunDirection: {value: this.option.sunDirection},
                eye: {value: this.option.eye},
                waterColor: {value: this.option.waterColor}
            },
            vertexShader: seaVertex,
            fragmentShader: seaFragment,
            side: THREE.FrontSide,
            lights: true,
        });
        this.mesh = new THREE.Mesh(this.seaGeometry, this.seaMaterial);
        this.mesh.rotation.x = -Math.PI / 2;
        this.base.scene.add(this.mesh);

        this.mesh.onBeforeRender = (renderer, scene, camera) => {
            mirrorWorldPosition.setFromMatrixPosition( this.mesh.matrixWorld );
            cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );

            rotationMatrix.extractRotation( this.mesh.matrixWorld );

            normal.set( 0, 0, 1 );
            normal.applyMatrix4( rotationMatrix );

            view.subVectors( mirrorWorldPosition, cameraWorldPosition );

            // Avoid rendering when mirror is facing away

            if ( view.dot( normal ) > 0 ) return;

            view.reflect( normal ).negate();
            view.add( mirrorWorldPosition );

            rotationMatrix.extractRotation( camera.matrixWorld );

            lookAtPosition.set( 0, 0, - 1 );
            lookAtPosition.applyMatrix4( rotationMatrix );
            lookAtPosition.add( cameraWorldPosition );

            target.subVectors( mirrorWorldPosition, lookAtPosition );
            target.reflect( normal ).negate();
            target.add( mirrorWorldPosition );

            mirrorCamera.position.copy( view );
            mirrorCamera.up.set( 0, 1, 0 );
            mirrorCamera.up.applyMatrix4( rotationMatrix );
            mirrorCamera.up.reflect( normal );
            mirrorCamera.lookAt( target );

            mirrorCamera.far = camera.far; // Used in WebGLBackground

            mirrorCamera.updateMatrixWorld();
            mirrorCamera.projectionMatrix.copy( camera.projectionMatrix );

            // Update the texture matrix
            textureMatrix.set(
                0.5, 0.0, 0.0, 0.5,
                0.0, 0.5, 0.0, 0.5,
                0.0, 0.0, 0.5, 0.5,
                0.0, 0.0, 0.0, 1.0
            );
            textureMatrix.multiply( mirrorCamera.projectionMatrix );
            textureMatrix.multiply( mirrorCamera.matrixWorldInverse );

            // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
            // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
            mirrorPlane.setFromNormalAndCoplanarPoint( normal, mirrorWorldPosition );
            mirrorPlane.applyMatrix4( mirrorCamera.matrixWorldInverse );

            clipPlane.set( mirrorPlane.normal.x, mirrorPlane.normal.y, mirrorPlane.normal.z, mirrorPlane.constant );

            const projectionMatrix = mirrorCamera.projectionMatrix;

            q.x = ( Math.sign( clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
            q.y = ( Math.sign( clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
            q.z = - 1.0;
            q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

            // Calculate the scaled plane vector
            clipPlane.multiplyScalar( 2.0 / clipPlane.dot( q ) );

            // Replacing the third row of the projection matrix
            projectionMatrix.elements[ 2 ] = clipPlane.x;
            projectionMatrix.elements[ 6 ] = clipPlane.y;
            projectionMatrix.elements[ 10 ] = clipPlane.z + 1.0 - this.option.clipBias;
            projectionMatrix.elements[ 14 ] = clipPlane.w;

            this.option.eye.setFromMatrixPosition( camera.matrixWorld );

            // Render

            const currentRenderTarget = renderer.getRenderTarget();

            const currentXrEnabled = renderer.xr.enabled;
            const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

            this.mesh.visible = false;

            renderer.xr.enabled = false; // Avoid camera modification and recursion
            renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

            renderer.setRenderTarget( this.renderTarget );

            renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897

            if ( renderer.autoClear === false ) renderer.clear();
            renderer.render( scene, mirrorCamera );

            this.mesh.visible = true;

            renderer.xr.enabled = currentXrEnabled;
            renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

            renderer.setRenderTarget( currentRenderTarget );

            // Restore viewport

            const viewport = camera.viewport;

            if ( viewport !== undefined ) {

                renderer.state.viewport( viewport );

            }
        }
    }

}
