/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/27 09:02:46
 */

import * as THREE from "three";
import MathEx from '@/views/pages/fireBall/js/MathEx';
// glsl-background
import backgroundVertex from '@/views/pages/fireBall/glsl/background/vertex.glsl'
import backgroundFragment from '@/views/pages/fireBall/glsl/background/fragment.glsl'
// glsl-core
import coreVertex from '@/views/pages/fireBall/glsl/core/vertex.glsl'
import coreFragment from '@/views/pages/fireBall/glsl/core/fragment.glsl'
// glsl-coreLight
import coreLightVertex from '@/views/pages/fireBall/glsl/coreLight/vertex.glsl'
import coreLightFragment from '@/views/pages/fireBall/glsl/coreLight/fragment.glsl'
// glsl-aura
import auraVertex from '@/views/pages/fireBall/glsl/aura/vertex.glsl'
import auraFragment from '@/views/pages/fireBall/glsl/aura/fragment.glsl'
// glsl-sparks
import sparksVertex from '@/views/pages/fireBall/glsl/sparks/vertex.glsl'
import sparksFragment from '@/views/pages/fireBall/glsl/sparks/fragment.glsl'
// glsl-trail
import trailVertex from '@/views/pages/fireBall/glsl/trail/vertex.glsl'
import trailFragment from '@/views/pages/fireBall/glsl/trail/fragment.glsl'
// glsl-bright
import brightVertex from '@/views/pages/fireBall/glsl/bright/vertex.glsl'
import brightFragment from '@/views/pages/fireBall/glsl/bright/fragment.glsl'
// glsl-blur
import blurVertex from '@/views/pages/fireBall/glsl/blur/vertex.glsl'
import blurFragment from '@/views/pages/fireBall/glsl/blur/fragment.glsl'
// glsl-bloom
import bloomVertex from '@/views/pages/fireBall/glsl/bloom/vertex.glsl'
import bloomFragment from '@/views/pages/fireBall/glsl/bloom/fragment.glsl'


function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class FireBall {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.devicePixelRatio = window.devicePixelRatio;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.resolution = new THREE.Vector2(this.width, this.height);
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
            preserveDrawingBuffer: !0
        });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0x0e0e0e, 1.0);
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(50, this.aspect, 0.1, 5000);
        this.clock = new THREE.Clock();
        this.vTouch = new THREE.Vector2();
        this.acceleration = new THREE.Vector3();
        this.anchor = new THREE.Vector3();
        this.isTouched = false;
        this.assetsInit();
    }

    cameraStart() {
        this.camera.far = 5000;
        this.camera.setFocalLength(50);
        this.camera.position.set(0, 0, 130);
        this.camera.lookAt(new THREE.Vector3());
    }

    cameraUpdate(time) {
        this.camera.time += time;
    }

    cameraResize() {
        this.camera.aspect = this.resolution.x / this.resolution.y;
        this.camera.updateProjectionMatrix();
        this.camera.position.z = this.aspect < 1 ? 150 : 120;
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.noiseTexture = (new THREE.TextureLoader(this.manager)).load(filePath('texture/noise.jpg'));
        this.noiseTexture.wrapS = THREE.RepeatWrapping;
        this.noiseTexture.wrapT = THREE.RepeatWrapping;
        this.noiseTexture.format = THREE.RGBAFormat;
        this.noiseTexture.type = THREE.FloatType;
        this.noiseTexture.minFilter = THREE.NearestFilter;
        this.noiseTexture.magFilter = THREE.NearestFilter;
        this.manager.onLoad = () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red",);
            this.callback();
            this.backgroundInit();
            this.coreInit();
            this.coreLightInit();
            this.auraInit();
            this.sparksInit();
            this.trailInit();
            this.cameraStart();
            this.postEffectInit();
            this.postEffectBrightInit();
            this.postEffectBlurInit();
            this.postEffectBloomInit();
            this.animation();
            this.resize();
            this.addEventListener();
            this.play();
        }
    }

    backgroundInit() {
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                resolution: {
                    value: this.resolution
                },
                noiseTex: {
                    value: this.noiseTexture
                }
            },
            vertexShader: backgroundVertex,
            fragmentShader: backgroundFragment
        });
        this.background = new THREE.Mesh(geometry, material);
        this.background.name = 'Background';
        this.background.position.z = -1000;
        this.scene.add(this.background);
        this.backgroundResize();
    }

    backgroundUpdate(time) {
        this.background.material.uniforms.time.value += time;
    }

    backgroundResize() {
        const height = Math.abs(
            (this.camera.position.z - this.background.position.z) *
            Math.tan(MathEx.radians(this.camera.fov) / 2) *
            2
        );
        const width = height * this.camera.aspect;

        this.background.scale.set(width, height, 1);
        this.background.material.uniforms.resolution.value.copy(this.resolution);
    }

    coreInit() {
        const geometry = new THREE.OctahedronGeometry(10, 6);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                noiseTex: {
                    value: this.noiseTexture
                }
            },
            vertexShader: coreVertex,
            fragmentShader: coreFragment,
        });
        this.core = new THREE.Mesh(geometry, material)
        this.core.name = 'Core';
        this.scene.add(this.core);
    }

    applyDrag(value) {
        const force = this.acceleration.clone();
        force.multiplyScalar(-1);
        force.normalize();
        force.multiplyScalar(this.acceleration.length() * value);
        this.acceleration.add(force);
    }

    applyHook(restLength, k) {
        const force = this.core.position.clone().sub(this.anchor);
        const distance = force.length() - restLength;
        force.normalize();
        force.multiplyScalar(-1 * k * distance);
        this.acceleration.add(force);
    }

    coreUpdate(time) {
        this.core.material.uniforms.time.value += time;
        this.applyHook(0, 0.2);
        this.applyDrag(0.6);
        this.core.position.add(this.acceleration);
        this.core.lookAt(this.camera.position);
    }

    coreLightInit() {
        const geometry = new THREE.PlaneGeometry(30, 30);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                noiseTex: {
                    value: this.noiseTexture
                },
                acceleration: {
                    value: new THREE.Vector3()
                }
            },
            vertexShader: coreLightVertex,
            fragmentShader: coreLightFragment,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        this.coreLight = new THREE.Mesh(geometry, material);
        this.coreLight.name = 'CoreLight';
        this.scene.add(this.coreLight);
    }

    coreLightUpdate(time) {
        this.coreLight.material.uniforms.time.value += time;
        this.coreLight.material.uniforms.acceleration.value.copy(this.acceleration);
        this.coreLight.position.copy(this.core.position);
    }

    auraInit() {
        // Define Geometry
        const geometry = new THREE.OctahedronGeometry(10.1, 10);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                noiseTex: {
                    value: this.noiseTexture
                },
                acceleration: {
                    value: new THREE.Vector3()
                }
            },
            vertexShader: auraVertex,
            fragmentShader: auraFragment,
            side: THREE.DoubleSide
        });
        this.aura = new THREE.Mesh(geometry, material);
        this.aura.name = 'Aura';
        this.scene.add(this.aura);
    }

    auraUpdate(time) {
        this.aura.material.uniforms.time.value += time;
        this.aura.material.uniforms.acceleration.value.copy(this.acceleration);
        this.aura.position.copy(this.core.position);
    }

    sparksInit() {
        this.COUNT = 400;
        // Define Geometries
        const geometry = new THREE.InstancedBufferGeometry();
        const baseGeometry = new THREE.PlaneGeometry(1, 1);
        // Copy attributes of the base Geometry to the instancing Geometry
        geometry.copy(baseGeometry);
        // Define attributes of the instancing geometry
        const ibaPositions = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT * 3), 3);
        const ibaDirections = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT * 3), 3);
        const ibaTimes = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT), 1);
        const ibaDurations = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT), 1);
        const ibaDistances = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT), 1);
        const ibaScales = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT), 1);
        const ibaRotates = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT * 3), 3);
        const ibaUvDiffs = new THREE.InstancedBufferAttribute(new Float32Array(this.COUNT * 2), 2);
        for (let i = 0, ul = this.COUNT; i < ul; i++) {
            const radian1 = MathEx.radians((Math.random() * 2 - 1) * 75);
            const radian2 = MathEx.radians(Math.random() * 360);
            const radius = 1;
            const spherical = MathEx.spherical(radian1, radian2, radius);

            ibaPositions.setXYZ(i, spherical[0] * 5, spherical[1] * 5, spherical[2] * 5);
            ibaDirections.setXYZ(i, spherical[0], spherical[1], spherical[2]);
            ibaTimes.setXYZ(i, 0 - Math.random() * 5);
            ibaDurations.setXYZ(i, 2 + Math.random() * 4);
            ibaDistances.setXYZ(i, 20 + Math.random() * 15);
            ibaScales.setXYZ(i, 1 + Math.random() * 1);
            ibaRotates.setXYZ(i, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
            ibaUvDiffs.setXYZ(i, Math.random() * 2 - 1, Math.random() * 2 - 1);
        }
        geometry.setAttribute('iPosition', ibaPositions);
        geometry.setAttribute('iDirection', ibaDirections);
        geometry.setAttribute('iTime', ibaTimes);
        geometry.setAttribute('iDuration', ibaDurations);
        geometry.setAttribute('iDistance', ibaDistances);
        geometry.setAttribute('iScale', ibaScales);
        geometry.setAttribute('iRotate', ibaRotates);
        geometry.setAttribute('iUvDiff', ibaUvDiffs);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                noiseTex: {
                    value: this.noiseTexture
                }
            },
            vertexShader: sparksVertex,
            fragmentShader: sparksFragment,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });

        this.sparks = new THREE.InstancedMesh(geometry, material, this.COUNT)
        this.sparks.name = 'Sparks';
        this.sparks.frustumCulled = false;
        this.scene.add(this.sparks)
    }

    sparksUpdate(time) {
        const {iPosition, iDirection, iTime, iDuration} = this.sparks.geometry.attributes;
        this.sparks.material.uniforms.time.value += time;
        for (let i = 0; i < iTime.count; i++) {
            const duration = iDuration.getX(i);
            let prevTime = iTime.getX(i);
            if (prevTime > duration || prevTime < 0 && prevTime + time > 0) {
                prevTime %= duration;
                iPosition.setXYZ(
                    i,
                    iDirection.getX(i) * 5 + this.core.position.x,
                    iDirection.getY(i) * 5 + this.core.position.y,
                    iDirection.getZ(i) * 5 + this.core.position.z
                );
            }
            iTime.setX(i, prevTime + time);
        }
        iPosition.needsUpdate = true;
        iTime.needsUpdate = true;
    }

    trailInit() {
        const SEGMENT_HEIGHT = 2;
        const SEGMENT_COUNT = 20;
        const HEIGHT = SEGMENT_HEIGHT * SEGMENT_COUNT;

        const hookes = [];

        // Define Geometry
        const geometry = new THREE.CylinderGeometry(5, 10, HEIGHT, 24, SEGMENT_COUNT * 3, true);
        const {position} = geometry.attributes;
        const vertex = new THREE.Vector3();
        const skinIndices = [];
        const skinWeights = [];
        this.bones = [];
        let prevBone = new THREE.Bone();

        for (let i = 0; i < position.count; i++) {
            vertex.fromBufferAttribute(position, i);

            const y = (vertex.y + HEIGHT / 2);
            const skinIndex = Math.floor(y / SEGMENT_HEIGHT);
            const skinWeight = (y % SEGMENT_HEIGHT) / SEGMENT_HEIGHT;

            skinIndices.push(skinIndex, skinIndex + 1, 0, 0);
            skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
        }

        for (let j = 0; j <= SEGMENT_COUNT; j++) {
            if (j === 0) {
                prevBone.position.y = HEIGHT / -2;
                this.bones.push(prevBone);
            } else {
                const bone = new THREE.Bone();
                bone.position.y = SEGMENT_HEIGHT;
                this.bones.push(bone);
                prevBone.add(bone);
                prevBone = bone;
            }

            hookes.push({
                velocity: new THREE.Vector3(),
                acceleration: new THREE.Vector3()
            });
        }
        geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
        geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
        // Define Skelton
        this.skeleton = new THREE.Skeleton(this.bones);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                time: {
                    value: 0
                },
                noiseTex: {
                    value: this.noiseTexture
                },
                acceleration: {
                    value: new THREE.Vector3()
                },
                boneMatrices: {
                    value: []  // 用来存储所有骨骼矩阵
                }
            },
            vertexShader: trailVertex,
            fragmentShader: trailFragment,
            // skinning: true,
            side: THREE.DoubleSide
        });

        // Create Object3D
        this.trail = new THREE.SkinnedMesh(geometry, material);
        this.trailTop = new THREE.Vector3(0, 1, 0);
        this.trailHookes = hookes;
        this.trailTime = 0;
        this.trail.add(this.bones[0]);
        this.trail.bind(this.skeleton);
        this.scene.add(this.trail);
    }

    trialApplyDrag(acceleration, value) {
        const force = acceleration.clone();
        force.multiplyScalar(-1);
        force.normalize();
        force.multiplyScalar(acceleration.length() * value);
        acceleration.add(force);
    };

    trialApplyHook(position, acceleration, anchor, restLength, k) {
        const force = position.clone().sub(anchor);
        const distance = force.length() - restLength;

        force.normalize();
        force.multiplyScalar(-1 * k * distance);
        acceleration.add(force);
    };

    trailUpdate(time) {
        const q1 = new THREE.Quaternion();
        const q2 = new THREE.Quaternion();
        this.trailTime += time;
        this.trail.material.uniforms.time.value += time;
        this.trail.material.uniforms.boneMatrices.value = this.trail.skeleton.boneMatrices;

        for (let i = 0; i < this.trailHookes.length; i++) {
            const {velocity, acceleration} = this.trailHookes[i];

            if (i === 0) {
                velocity.copy(this.core.position);
            } else {
                const anchor = this.trailHookes[i - 1].velocity;

                this.trialApplyHook(velocity, acceleration, anchor, 0, 1);
                this.trialApplyDrag(acceleration, 0.7);
                velocity.add(acceleration);
            }
        }
        this.trail.material.uniforms.acceleration.value.copy(this.acceleration);
        for (let i = 0; i < this.bones.length; i++) {
            const bone = this.bones[i];
            const {velocity} = this.trailHookes[i];

            if (i === 0) {
                const nextVelocity = this.trailHookes[i + 1].velocity;
                const dir = nextVelocity.clone().sub(velocity).normalize();
                const axis = new THREE.Vector3().crossVectors(this.trailTop, dir).normalize();
                const angle = Math.acos(this.trailTop.clone().dot(dir));
                q1.setFromAxisAngle(axis, angle);

                bone.rotation.setFromQuaternion(q1);
                bone.position.copy(this.core.position);
            } else if (i < this.bones.length - 1) {
                const prevVelocity = this.trailHookes[i - 1].velocity;
                const dir1 = velocity.clone().sub(prevVelocity).normalize();
                const axis1 = new THREE.Vector3().crossVectors(this.trailTop, dir1).normalize();
                const angle1 = Math.acos(this.trailTop.clone().dot(dir1));

                const nextVelocity = this.trailHookes[i + 1].velocity;
                const dir2 = nextVelocity.clone().sub(velocity).normalize();
                const axis2 = new THREE.Vector3().crossVectors(this.trailTop, dir2).normalize();
                const angle2 = Math.acos(this.trailTop.clone().dot(dir2));

                q1.setFromAxisAngle(axis1, angle1);
                q2.setFromAxisAngle(axis2, angle2);
                q1.conjugate().multiply(q2);
                bone.rotation.setFromQuaternion(q1);
                bone.position.y = velocity.distanceTo(prevVelocity);
            }
        }
    }

    postEffectInit() {
        this.renderTarget1 = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y);
        this.renderTarget2 = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y);
        this.renderTarget3 = new THREE.WebGLRenderTarget(this.resolution.x, this.resolution.y);
        this.scenePE = new THREE.Scene();
        this.cameraPE = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);
    }

    postEffectBrightInit() {
        // Define Geometry
        const geometry = new THREE.PlaneGeometry(2, 2);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                minBright: {
                    value: 0.5
                },
                texture: {
                    value: this.renderTarget1.texture
                },
            },
            vertexShader: brightVertex,
            fragmentShader: brightFragment,
        });
        this.postEffectBright = new THREE.Mesh(geometry, material);
        this.postEffectBright.name = 'PostEffectBright';
    }

    postEffectBlurInit() {
        // Define Geometry
        const geometry = new THREE.PlaneGeometry(2, 2);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                resolution: {
                    value: new THREE.Vector2()
                },
                direction: {
                    value: new THREE.Vector2()
                },
                texture: {
                    value: null
                },
            },
            vertexShader: blurVertex,
            fragmentShader: blurFragment,
        });
        // Create Object3D
        this.postEffectBlurX = new THREE.Mesh(geometry, material);
        this.postEffectBlurX.material.uniforms.resolution.value.set(this.resolution);
        this.postEffectBlurX.material.uniforms.direction.value.set(1, 0);
        this.postEffectBlurX.material.uniforms.texture.value = this.renderTarget2.texture;
        this.postEffectBlurX.name = 'PostEffectBlurX';

        this.postEffectBlurY = new THREE.Mesh(geometry, material);
        this.postEffectBlurY.material.uniforms.resolution.value.set(this.resolution);
        this.postEffectBlurY.material.uniforms.direction.value.set(0, 1);
        this.postEffectBlurY.material.uniforms.texture.value = this.renderTarget3.texture;
        this.postEffectBlurY.name = 'PostEffectBlurY';
    }

    postEffectBlurResize() {
        this.postEffectBlurX.material.uniforms.resolution.value.set(this.resolution);
        this.postEffectBlurY.material.uniforms.resolution.value.set(this.resolution);
    }

    postEffectBloomInit() {
        // Define Geometry
        const geometry = new THREE.PlaneGeometry(2, 2);
        // Define Material
        const material = new THREE.RawShaderMaterial({
            uniforms: {
                texture1: {
                    value: this.renderTarget1.texture
                },
                texture2: {
                    value: this.renderTarget2.texture
                },
            },
            vertexShader: bloomVertex,
            fragmentShader: bloomFragment,
        });

        // Create Object3D
        this.postEffectBloom = new THREE.Mesh(geometry, material);
        this.postEffectBloom.name = 'PostEffectBloom';
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        if (this.clock.running === false) return;
        const time = this.clock.getDelta();

        this.cameraUpdate(time);
        // Update each objects.
        this.backgroundUpdate(time);
        this.coreUpdate(time);
        this.coreLightUpdate(time);
        this.auraUpdate(time);
        this.sparksUpdate(time);
        this.trailUpdate(time);

        // Render the main scene to frame buffer.
        this.renderer.setRenderTarget(this.renderTarget1);
        this.renderer.render(this.scene, this.camera);

        // Render the post effect.
        this.scenePE.add(this.postEffectBright);
        this.renderer.setRenderTarget(this.renderTarget2);
        this.renderer.render(this.scenePE, this.cameraPE);
        this.scenePE.remove(this.postEffectBright);

        this.scenePE.add(this.postEffectBlurX);
        this.renderer.setRenderTarget(this.renderTarget2);
        this.renderer.render(this.scenePE, this.cameraPE);
        this.scenePE.remove(this.postEffectBlurX);

        this.scenePE.add(this.postEffectBlurY);
        this.renderer.setRenderTarget(this.renderTarget2);
        this.renderer.render(this.scenePE, this.cameraPE);
        this.scenePE.remove(this.postEffectBlurY);

        this.scenePE.add(this.postEffectBloom);
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scenePE, this.cameraPE);
        this.scenePE.remove(this.postEffectBloom);

    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.resolution.set(this.width, this.height);
            this.aspect = this.width / this.height;
            this.renderer.setSize(this.width, this.height);
            this.cameraResize();
            this.backgroundResize();
            this.postEffectBlurResize();
        })
    }

    play() {
        this.clock.start();
    }

    pause() {
        this.clock.stop();
    }

    setCoreAnchor() {
        const corePositionZ = (this.vTouch.y / this.resolution.y * 2.0 - 1.0) * 70;
        const height = Math.abs(
            (this.camera.position.z - corePositionZ) *
            Math.tan(MathEx.radians(this.camera.fov) / 2) *
            2
        );
        const width = height * this.camera.aspect;
        this.anchor.set(
            (this.vTouch.x / this.resolution.x - 0.5) * width,
            -(this.vTouch.y / this.resolution.y - 0.5) * height,
            corePositionZ
        );
    }

    addEventListener() {
        this.target.addEventListener('mousedown', (e) => {
            if (!e.touches) e.preventDefault();
            this.vTouch.set(
                (e.touches) ? e.touches[0].clientX : e.clientX,
                (e.touches) ? e.touches[0].clientY : e.clientY
            );
            this.isTouched = true;
            this.setCoreAnchor();
        });
        this.target.addEventListener('mousemove', (e) => {
            if (!e.touches) e.preventDefault();
            if (this.isTouched === true) {
                this.vTouch.set(
                    (e.touches) ? e.touches[0].clientX : e.clientX,
                    (e.touches) ? e.touches[0].clientY : e.clientY
                );
                this.setCoreAnchor();
            }
        })
        this.target.addEventListener('mouseup', () => {
            this.isTouched = false;
        })

    }

    destroy() {
        // scene
        this.scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                Object.values(child.material).forEach((value) => {
                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                });
            }
        });
        // scene
        this.scenePE.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry?.dispose();
                Object.values(child.material).forEach((value) => {
                    if (value && typeof value.dispose === "function") {
                        value.dispose();
                    }
                });
            }
        });
        // renderer
        this.renderer.dispose();
        this.renderTarget1.dispose();
        this.renderTarget2.dispose();
        this.renderTarget3.dispose();
    }

}
