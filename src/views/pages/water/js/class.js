/**
 * justThreeJs waterSimulation.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/26 15:37:07
 */
import * as THREE from "three";

// glsl
import simulationVertex from '@/views/pages/water/glsl/simulation/vertex.glsl';
import dropFragment from '@/views/pages/water/glsl/simulation/drop_fragment.glsl';
import normalFragment from '@/views/pages/water/glsl/simulation/normal_fragment.glsl';
import updateFragment from '@/views/pages/water/glsl/simulation/update_fragment.glsl';
import waterVertex from '@/views/pages/water/glsl/water/vertex.glsl';
import waterFragment from '@/views/pages/water/glsl/water/fragment.glsl';
import causticsVertex from '@/views/pages/water/glsl/caustics/vertex.glsl';
import causticsFragment from '@/views/pages/water/glsl/caustics/fragment.glsl';
import poolVertex from '@/views/pages/water/glsl/pool/vertex.glsl';
import poolFragment from '@/views/pages/water/glsl/pool/fragment.glsl';
import debugVertex from '@/views/pages/water/glsl/debug/vertex.glsl';
import debugFragment from '@/views/pages/water/glsl/debug/fragment.glsl';

function filePath(path) {
    return new URL(`../glsl/${path}`, import.meta.url).href
}

// 模拟
class WaterSimulation {

    constructor() {
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2000);

        this._geometry = new THREE.PlaneGeometry(2, 2);

        this._textureA = new THREE.WebGLRenderTarget(256, 256, {type: THREE.FloatType});
        this._textureB = new THREE.WebGLRenderTarget(256, 256, {type: THREE.FloatType});
        this.texture = this._textureA;

        const dropMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                center: {value: [0, 0]},
                radius: {value: 0},
                strength: {value: 0},
                texture: {value: null},
            },
            vertexShader: simulationVertex,
            fragmentShader: dropFragment,
        });

        const normalMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                delta: {value: [1 / 256, 1 / 256]},  // TODO: Remove this useless uniform and hardcode it in shaders?
                texture: {value: null},
            },
            vertexShader: simulationVertex,
            fragmentShader: normalFragment,
        });

        const updateMaterial = new THREE.RawShaderMaterial({
            uniforms: {
                delta: {value: [1 / 256, 1 / 256]},  // TODO: Remove this useless uniform and hardcode it in shaders?
                texture: {value: null},
            },
            vertexShader: simulationVertex,
            fragmentShader: updateFragment,
        });

        this._dropMesh = new THREE.Mesh(this._geometry, dropMaterial);
        this._normalMesh = new THREE.Mesh(this._geometry, normalMaterial);
        this._updateMesh = new THREE.Mesh(this._geometry, updateMaterial);
    }

    // Add a drop of water at the (x, y) coordinate (in the range [-1, 1])
    addDrop(renderer, x, y, radius, strength) {
        this._dropMesh.material.uniforms['center'].value = [x, y];
        this._dropMesh.material.uniforms['radius'].value = radius;
        this._dropMesh.material.uniforms['strength'].value = strength;

        this._render(renderer, this._dropMesh);
    }

    stepSimulation(renderer) {
        this._render(renderer, this._updateMesh);
    }

    updateNormals(renderer) {
        this._render(renderer, this._normalMesh);
    }

    _render(renderer, mesh) {
        // Swap textures
        const oldTexture = this.texture;
        const newTexture = this.texture === this._textureA ? this._textureB : this._textureA;

        mesh.material.uniforms['texture'].value = oldTexture.texture;

        renderer.setRenderTarget(newTexture);

        // TODO Camera is useless here, what should be done?
        renderer.render(mesh, this._camera);

        this.texture = newTexture;
    }

}

// 水
class Water {

    constructor(base) {
        this.base = base;
        this.geometry = new THREE.PlaneGeometry(2, 2, 200, 200);

        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                light: {value: this.base.light},
                tiles: {value: this.base.tilesTexture},
                sky: {value: this.base.cubeTexture},
                water: {value: null},
                causticTex: {value: null},
                underwater: {value: false},
            },
            vertexShader: waterVertex,
            fragmentShader: waterFragment,
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    draw(renderer, waterTexture, causticsTexture) {
        this.material.uniforms['water'].value = waterTexture;
        this.material.uniforms['causticTex'].value = causticsTexture;

        this.material.side = THREE.FrontSide;
        this.material.uniforms['underwater'].value = true;
        renderer.render(this.mesh, this.base.camera);

        this.material.side = THREE.BackSide;
        this.material.uniforms['underwater'].value = false;
        renderer.render(this.mesh, this.base.camera);
    }

}

// 焦散
class Caustics {

    constructor(base) {
        this.base = base;

        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 2000);

        this._geometry = this.base.water.geometry;

        this.texture = new THREE.WebGLRenderTarget(1024, 1024, {type: THREE.UnsignedByteType});

        const material = new THREE.RawShaderMaterial({
            uniforms: {
                light: {value: this.base.light},
                water: {value: null},
            },
            vertexShader: causticsVertex,
            fragmentShader: causticsFragment,
        });

        this._causticMesh = new THREE.Mesh(this._geometry, material);
    }

    update(renderer, waterTexture) {
        this._causticMesh.material.uniforms['water'].value = waterTexture;

        renderer.setRenderTarget(this.texture);
        renderer.setClearColor(this.base.black, 0);
        renderer.clear();

        // TODO Camera is useless here, what should be done?
        renderer.render(this._causticMesh, this._camera);
    }

}

// 泳池
class Pool {
    constructor(base) {
        this.base = base;
        this._geometry = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -1, -1, -1,
            -1, -1, 1,
            -1, 1, -1,
            -1, 1, 1,
            1, -1, -1,
            1, 1, -1,
            1, -1, 1,
            1, 1, 1,
            -1, -1, -1,
            1, -1, -1,
            -1, -1, 1,
            1, -1, 1,
            -1, 1, -1,
            -1, 1, 1,
            1, 1, -1,
            1, 1, 1,
            -1, -1, -1,
            -1, 1, -1,
            1, -1, -1,
            1, 1, -1,
            -1, -1, 1,
            1, -1, 1,
            -1, 1, 1,
            1, 1, 1
        ]);
        const indices = new Uint32Array([
            0, 1, 2,
            2, 1, 3,
            4, 5, 6,
            6, 5, 7,
            12, 13, 14,
            14, 13, 15,
            16, 17, 18,
            18, 17, 19,
            20, 21, 22,
            22, 21, 23
        ]);

        this._geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        this._geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        this._material = new THREE.RawShaderMaterial({
            uniforms: {
                light: {value: this.base.light},
                tiles: {value: this.base.tilesTexture},
                water: {value: null},
                causticTex: {value: null},
            },
            vertexShader: poolVertex,
            fragmentShader: poolFragment,
        });
        this._material.side = THREE.FrontSide;

        this._mesh = new THREE.Mesh(this._geometry, this._material);
    }

    draw(renderer, waterTexture, causticsTexture) {
        this._material.uniforms['water'].value = waterTexture;
        this._material.uniforms['causticTex'].value = causticsTexture;

        renderer.render(this._mesh, this.base.camera);
    }

}

class Debug {

    constructor() {
        this._camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0, 1);
        this._geometry = new THREE.PlaneGeometry();


        this._material = new THREE.RawShaderMaterial({
            uniforms: {
                texture: {value: null},
            },
            vertexShader: debugVertex,
            fragmentShader: debugFragment,
        });

        this._mesh = new THREE.Mesh(this._geometry, this._material);
    }

    draw(renderer, texture) {
        this._material.uniforms['texture'].value = texture;

        renderer.setRenderTarget(null);
        renderer.render(this._mesh, this._camera);
    }

}


export {WaterSimulation, Water, Caustics, Pool, Debug}
