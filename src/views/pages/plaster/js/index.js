/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/12 11:06:23
 */
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {DRACOLoader, KTX2Loader, GLTFLoader} from "three-stdlib";
import HomeRelief from "@/views/pages/plaster/js/homeRelief.js";
import FlowMap from "@/views/pages/plaster/js/flowMap.js";
import gsap from "gsap";
import flowMapVertex from "@/views/pages/plaster/glsl/flowMap/vertex.glsl";
import flowMapFragment from "@/views/pages/plaster/glsl/flowMap/fragment.glsl";

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Plaster {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            preserveDrawingBuffer: true
        })
        this.renderer.setSize(this.width, this.height);
        this.renderer.autoClear = false;
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf7f7f7);
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 10000);
        this.camera.position.copy(new THREE.Vector3(10, 5, 10))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;
        this.clock = new THREE.Clock();
        this.dateTime = performance.now()
        this.assetsInit();
    }

    mouseInit() {
        this.pixel = new THREE.Vector2()
        this.normal = new THREE.Vector2(.5, .5)
        this.normalFlip = new THREE.Vector2(-1, -1)
        this.tilt = new THREE.Vector2();
        this.velocity = new THREE.Vector2();
        this.velocity2 = new THREE.Vector2();
        this.mouse = new THREE.Vector2();
        this.mouse2 = new THREE.Vector2();
        this.lastNormalFlip = new THREE.Vector2(-1, -1);
        this.target.addEventListener('mousemove', (i) => {
            this.pixel.set(i.x, i.y)
            this.normal.x = this.pixel.x / this.width
            this.normal.y = this.pixel.y / this.height
            this.normalFlip.x = this.normal.x
            this.normalFlip.y = 1 - this.normal.y
            this.tilt.x = this.normalFlip.x * 2 - 1
            this.tilt.y = this.normalFlip.y * 2 - 1
        })
    }

    mouseUpdate(e) {
        this.lastNormalFlip.x === -1 && this.lastNormalFlip.copy(this.normalFlip);
        const t = this.normalFlip.x - this.lastNormalFlip.x
        const s = this.normalFlip.y - this.lastNormalFlip.y;
        this.lastNormalFlip.copy(this.normalFlip);
        const o = Math.min(32, e) / 16;
        this.velocity.x = t * o
        this.velocity.y = s * o
    }

    randomMath(t, l, a) {
        return (1 - a) * t + a * l
    }

    loopRandomMouse() {
        this.randomMouseMovementTimeline = null
        let i;
        (i = this.randomMouseMovementTimeline) == null || i.kill()
        this.randomMouseMovementTimeline = this.triggerRandomMouseMovement()
        this.randomMouseMovementTimeline.call(() => {
            this.loopRandomMouse()
        }, null, "+=" + ((1 - Math.random()) * 1 + Math.random() * 3).toFixed(2))
    }

    createRandomDirections(i = null) {
        const e = i || new THREE.Vector2((Math.random() - .5) * 2, (Math.random() - .5) * 2)
        const t = e.angleTo(new THREE.Vector2()) + (Math.random() - .5) * 2 * Math.PI * .8
        const s = this.randomMath(.7, .9, Math.random())
        const o = new THREE.Vector2(Math.cos(t) * s, Math.sin(t) * s);
        return {
            start: e,
            end: o
        }
    }

    triggerRandomMouseMovement() {
        this.velocity2.x = 1
        this.velocity2.y = 1;
        const i = Math.floor(Math.random() * 3) + 1;
        let e = null;
        const t = gsap.timeline();
        for (let s = 0; s < i; s++) {
            const n = !(s === i - 1) && Math.random() < .7
            const a = n ? this.randomMath(.8, 1, Math.random()) : this.randomMath(.7, .8, Math.random())
            const r = this.createRandomDirections(e)
            const l = {
                duration: a,
                ease: `rough({
					strength: ${n ? 3 : 2},
					points: ${Math.floor(a * 12)},
					template: ${n ? "power2.out" : "none"},
					taper: none,
					randomize: true,
					clamp: true
				})`
            };
            t.fromTo(this.mouse2, {
                x: r.start.x / 2 + .5
            }, {
                x: r.end.x / 2 + .5,
                ...l
            })
            t.fromTo(this.mouse2, {
                y: r.start.y / 2 + .5
            }, {
                y: r.end.y / 2 + .5,
                ...l
            })
            e = r.end
        }
        t.set(this.mouse2, {
            x: -1,
            y: -1
        })
        return t
    }

    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.ktx2Loader = (new KTX2Loader(this.manager)).setTranscoderPath('/basis/').detectSupport(this.renderer);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.dracoLoader = (new DRACOLoader()).setDecoderPath('/draco/gltf/');
        this.glbLoader = new GLTFLoader(this.manager);
        this.glbLoader.setDRACOLoader(this.dracoLoader);
        this.normal05 = this.ktx2Loader.load(filePath('ktx/normal_05.ktx2'));
        this.normal06 = this.ktx2Loader.load(filePath('ktx/normal_06.ktx2'));
        this.rocksNormal = this.ktx2Loader.load(filePath('ktx/rocks_normal.ktx2'));
        this.maskNoise = this.textureLoader.load(filePath('img/mask-noise.png'));
        this.maskNoise2 = this.textureLoader.load(filePath('img/rgb-noise.jpg'));
        this.plasterImg = this.textureLoader.load(filePath('img/plaster.jpg'));
        this.rgbAtt09 = this.textureLoader.load(filePath('img/rgb-attenuation-0,9.png'));
        this.glbLoader.load(filePath('glb/reliefs_high_compressed.glb'), (model) => this.reliefsModel = model.scene)
        this.maskNoise.wrapS = this.maskNoise.wrapT = THREE.RepeatWrapping
        this.plasterImg.wrapS = this.plasterImg.wrapT = THREE.RepeatWrapping
        this.manager.onLoad = () => {
            this.callback();
            this.mouseInit();
            this.loopRandomMouse();
            this.flowMapInit();
            this.worldInit();
            this.animation();
            this.resize();
        }
    }

    worldInit() {
        const light = new THREE.DirectionalLight(0xffffff, 3);
        light.position.set(1, 1, 1);
        this.scene.add(new THREE.AmbientLight(0xcccccc));
        this.scene.add(light);
        const geometry = new THREE.PlaneGeometry(10, 10);
        const material = new THREE.MeshBasicMaterial({color: 0xc1c1c1, map: this.uniform.value});
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);
    }

    flowMapInit() {
        this.flowMapCamera = new THREE.Camera();
        this.flowMapScene = new THREE.Scene();
        this.uniform = {
            value: null
        }
        this.mask = {
            read: new THREE.WebGLRenderTarget(256, 256, {
                type: THREE.FloatType,
                depthBuffer: !1
            }),
            write: new THREE.WebGLRenderTarget(256, 256, {
                type: THREE.FloatType,
                depthBuffer: !1
            }),
            swap: () => {
                const m = this.mask.read;
                this.mask.read = this.mask.write
                this.mask.write = m
                this.uniform.value = this.mask.read.texture
            }
        }
        this.mask.swap();
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3))
        geometry.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2))
        const material = new THREE.RawShaderMaterial({
            vertexShader: flowMapVertex,
            fragmentShader: flowMapFragment,
            uniforms: {
                tMap: this.uniform,
                uFalloff: {
                    value: 0.38 * 0.5
                },
                uAlpha: {
                    value: 1.0
                },
                uDissipation: {
                    value: 0.953
                },
                uDeltaMult: {
                    value: 1
                },
                tNoise: {
                    value: this.maskNoise
                },
                uTime: {
                    value: 0
                },
                uAspect: {
                    value: 1
                },
                uMouse: {
                    value: this.mouse
                },
                uVelocity: {
                    value: this.velocity
                },
                uMouse2: {
                    value: this.mouse2
                },
                uVelocity2: {
                    value: this.velocity2
                },
                uOffset: {
                    value: 0
                }
            },
            depthTest: !1
        })
        this.flowMap = new THREE.Mesh(geometry, material);
        this.flowMapScene.add(this.flowMap);
    }

    flowMapUpdate(time, tick) {
        this.flowMap.material.uniforms.uDeltaMult.value = Math.min(tick, 32) / 16;
        this.mouse.lerp(this.normalFlip, 0.4);
        this.velocity.lerp(this.velocity, this.velocity.length() ? .1 : .04);
        this.flowMap.material.uniforms.uAspect.value = this.width / this.height;
        this.flowMap.material.uniforms.uOffset.value = time;
        this.renderer.setRenderTarget(this.mask.write)
        this.renderer.render(this.flowMapScene, this.flowMapCamera)
        this.renderer.setRenderTarget(null)
        this.mask.swap()
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        this.controls.update();
        const time = this.clock.getDelta();
        let a = performance.now()
        let e = (a - this.dateTime) / 1000;
        this.dateTime = a
        this.mouseUpdate(e);
        this.flowMapUpdate(time, e);


        this.renderer.render(this.scene, this.camera);
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth;
            this.height = this.target.offsetHeight;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
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
        // renderer
        this.renderer.dispose();
    }
}
