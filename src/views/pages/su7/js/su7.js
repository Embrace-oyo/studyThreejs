/**
 * justThreeJs su7.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/18 14:34:07
 */
import * as THREE from 'three';
import Stats from "three/examples/jsm/libs/stats.module";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min.js';
import * as POSTPROCESSING from "postprocessing";
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import {DRACOLoader, GLTFLoader, RGBELoader, MeshoptDecoder} from "three-stdlib";
import gsap from "gsap";
import {PackedMipMapGenerator} from '@/views/pages/su7/js/mipmap/PackedMipMapGenerator'
// GLSL
import dynamicEnvVertex from '@/views/pages/su7/glsl/dynamicEnvVertex.glsl'
import dynamicEnvFragment from '@/views/pages/su7/glsl/dynamicEnvFragment.glsl'
import reflecFloorVertex from '@/views/pages/su7/glsl/reflecFloorVertex.glsl'
import reflecFloorFragment from '@/views/pages/su7/glsl/reflecFloorFragment.glsl'
import speedupVertex from '@/views/pages/su7/glsl/speedupVertex.glsl'
import speedupFragment from '@/views/pages/su7/glsl/speedupFragment.glsl'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class Su7 {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.devicePixelRatio = window.devicePixelRatio;
        this.width = this.target.offsetWidth * this.devicePixelRatio;
        this.height = this.target.offsetHeight * this.devicePixelRatio;
        this.callback = config.callback;
        this.clock = new THREE.Clock();
        this.option = {
            scene: {
                background: new THREE.Color("black"),
                fogBackground: 0xa0a0a0,
                fogNear: 0.1,
                fogFar: 10000,
            },
            camera: {
                cameraFov: 33.4,
                cameraNear: 0.1,
                cameraFar: 1000,
                x: 0,
                y: 0.8,
                z: -11,
                lookAtX: 0,
                lookAtY: 0.8,
                lookAtZ: 0,
            },
            axesHelper: {
                open: false,
                size: 150,
            },
            controls: {
                open: true,
                enablePan: false,
                enableZoom: true,
                minPolarAngle: 0,
                maxPolarAngle: Math.PI,
                enableDamping: true,
                dampingFactor: 0.05,
                autoRotate: false,
                atoRotateSpeed: 2.0,
                setX: 0,
                setY: 0.8,
                setZ: 0,
            },
            stats: true,
            progressCallback: null,
            params: {
                disableInteract: false,
                envWeight: 0,
                envIntensity: 0,
                isCameraMoving: false,
                lightAlpha: 0,
                lightIntensity: 0,
                reflectIntensity: 0,
                bloomLuminanceSmoothing: 1.6,
                bloomIntensity: 1,
                carBodyEnvIntensity: 1,
                speed: 0,
                speedUpOpacity: 0,
                isRushing: false,
                lightOpacity: 1,
                floorLerpColor: 0,
                furinaLerpColor: 0,
                cameraFov: 33.4,
            },
            uj: {
                iGlobalTime: {
                    value: 0,
                },
                iTime: {
                    value: 0,
                },
                iTimeDelta: {
                    value: 0,
                },
                iResolution: {
                    value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1),
                },
                iMouse: {
                    value: new THREE.Vector4(0, 0, 0, 0),
                },
                iFrame: {
                    value: 0,
                },
                iDate: {
                    value: new THREE.Vector4(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours()),
                },
                iSampleRate: {
                    value: 44100,
                },
                iChannelTime: {
                    value: [0, 0, 0, 0],
                },
            }
        }
        // 基础配置
        this.baseInit();
        // 资源加载管理器
        this.assetsManageInit();
    }

    baseInit() {
        // 创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            powerPreference: "high-performance",
            antialias: false,
            stencil: false,
            depth: false,
            preserveDrawingBuffer: true
        });
        // 渲染器创建
        this.renderer.setPixelRatio(this.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.target.appendChild(this.renderer.domElement);
        // 创建场景
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("black");
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(33.4, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, 0.8, -11);
        this.camera.lookAt(0, 0.8, 0)
        this.camera.updateProjectionMatrix();
        // this.camera.addEventListener()
    }

    assetsManageInit() {
        this.manager = new THREE.LoadingManager();
        this.dracoLoader = new DRACOLoader(this.manager);
        this.dracoLoader.setDecoderPath('./draco/gltf/');
        this.textureLoader = new THREE.TextureLoader(this.manager)
        // 环境贴图
        this.rgbeLoader1 = new RGBELoader(this.manager).setDataType(THREE.HalfFloatType).load(filePath('texture/t_env_night.hdr'));
        this.rgbeLoader2 = new RGBELoader(this.manager).setDataType(THREE.HalfFloatType).load(filePath('texture/t_env_light.hdr'));
        // 装饰贴图
        this.textureLoader1 = this.textureLoader.load(filePath('texture/t_startroom_ao.raw.jpg'))
        this.textureLoader1.channel = 1;
        this.textureLoader1.flipY = false;
        this.textureLoader1.colorSpace = THREE.LinearSRGBColorSpace;
        this.textureLoader2 = this.textureLoader.load(filePath('texture/t_startroom_light.raw.jpg'))
        this.textureLoader2.channel = 1;
        this.textureLoader2.flipY = false
        this.textureLoader2.colorSpace = THREE.SRGBColorSpace;
        this.textureLoader3 = this.textureLoader.load(filePath('texture/t_floor_normal.webp'))
        this.textureLoader3.flipY = false
        this.textureLoader3.colorSpace = THREE.LinearSRGBColorSpace;
        this.textureLoader3.wrapS = THREE.RepeatWrapping;
        this.textureLoader3.wrapT = THREE.RepeatWrapping;
        this.textureLoader4 = this.textureLoader.load(filePath('texture/t_floor_roughness.webp'))
        this.textureLoader4.flipY = false
        this.textureLoader4.colorSpace = THREE.LinearSRGBColorSpace;
        this.textureLoader4.wrapS = THREE.RepeatWrapping;
        this.textureLoader4.wrapT = THREE.RepeatWrapping;
        this.textureLoader5 = this.textureLoader.load(filePath('texture/t_car_body_AO.raw.jpg'))
        this.textureLoader5.flipY = false
        this.textureLoader5.colorSpace = THREE.LinearSRGBColorSpace;
        this.textureLoader5.minFilter = THREE.NearestFilter;
        this.textureLoader5.magFilter = THREE.NearestFilter;
        this.textureLoader5.channel = 1;
        // 装饰模型
        const startLoader = new GLTFLoader(this.manager).setDRACOLoader(this.dracoLoader);
        this.startRoomLoader = startLoader.loadAsync(filePath('model/sm_startroom.raw.gltf'));
        // 汽车模型
        const meshoptDecoder = MeshoptDecoder();
        const carLoader = new GLTFLoader(this.manager).setDRACOLoader(this.dracoLoader).setMeshoptDecoder(meshoptDecoder);
        this.carLoader = carLoader.loadAsync(filePath('model/sm_car.gltf'));
        // 车轮模型
        const speedupLoader = new GLTFLoader(this.manager).setDRACOLoader(this.dracoLoader).setMeshoptDecoder(meshoptDecoder);
        this.speedupLoader = speedupLoader.loadAsync(filePath('model/sm_speedup.gltf'))

        // 加载完成
        this.manager.onLoad = async () => {
            console.log('资源加载完成!');
            this.callback();
            this.FBOInit()
            this.QUADInit()
            await this.startRoom()
            await this.carLoad()
            await this.createEnvironment()
            await this.speedupLoad()
            await this.enter()

            // 后期处理
            this.postEA()
            // 工具
            if (this.option.axesHelper.open) this.axesHelperInit()
            if (this.option.controls.open) this.controlsInit()
            if (this.option.stats) this.statsInit()
            // 窗口重置
            this.resize()
            // 事件管理
            this.eventManage()

            this.animate()
        }
    }


    /** 事件处理 **/
    eventManage() {
        this.eventTime = 0;
        this.eventTimer = null;
        window.addEventListener('mousedown', () => {
            this.eventTime = 0
            this.eventTimer = setInterval(() => {
                this.eventTime += 0.1
            }, 10)
        })
        window.addEventListener('mouseup', (event) => {
            clearInterval(this.eventTimer)
            // console.log(this.eventTime)
            if (this.eventTime > 2) {
                // console.log('拖拽')
            } else {
                // console.log('点击')
                // 获取点击位置的二维坐标
                const mouse = new THREE.Vector2();
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
                // 通过点击位置获取场景中的对象
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, this.camera);
                const intersects = raycaster.intersectObjects(this.scene.children);
                // 如果有对象被点击到
                if (intersects.length > 0) {
                    const object = intersects[0].object
                    object.dispatchEvent({type: 'click', object})
                }
            }
        }, false);
    }

    /** 从HDR贴图中获取环境贴图 **/
    getEnvmapFromHDRTexture(texture) {
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        const envmap = pmremGenerator.fromEquirectangular(texture).texture;
        pmremGenerator.dispose();
        return envmap;
    }

    /** FBO **/
    FBOInit() {
        this.envMap1 = this.getEnvmapFromHDRTexture(this.rgbeLoader1)
        this.envMap2 = this.getEnvmapFromHDRTexture(this.rgbeLoader2)
        const envData = this.envMap1?.source.data;
        const width = envData.width || window.innerWidth * window.devicePixelRatio
        const height = envData.height || window.innerHeight * window.devicePixelRatio
        this.FBO = new THREE.WebGLRenderTarget(width, height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: THREE.HalfFloatType,
        })
        this.FBO.texture.mapping = THREE.CubeUVReflectionMapping;
        this.scene.environment = this.FBO.texture;
    }

    /** FullScreenQuad - QUAD **/
    QUADInit() {
        this.QUADCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        this.QUADGeometry = new THREE.PlaneGeometry(2, 2, 1, 1)
        this.QUADMaterial = new THREE.ShaderMaterial({
            vertexShader: dynamicEnvVertex,
            fragmentShader: dynamicEnvFragment,
            uniforms: {
                uEnvmap1: {
                    value: this.envMap1,
                },
                uEnvmap2: {
                    value: this.envMap2,
                },
                uWeight: {
                    value: 0,
                },
                uIntensity: {
                    value: 1,
                },
            },
        });
        this.QUADMesh = new THREE.Mesh(this.QUADGeometry, this.QUADMaterial)
    }

    /** FBO QUAD 渲染 **/
    QUADRender() {
        this.renderer.setRenderTarget(this.FBO);
        this.renderer.render(this.QUADMesh, this.QUADCamera);
        this.renderer.setRenderTarget(null);
    }

    /** 开始房间 **/
    async startRoom() {
        const model = await this.startRoomLoader
        const modelParts = []
        model.scene.traverse((obj) => modelParts.push(obj))
        // 灯垫
        this.light001 = modelParts[1];
        const lightMat = this.light001.material;
        lightMat.emissive = new THREE.Color("white");
        lightMat.emissiveIntensity = 1;
        lightMat.toneMapped = false;
        lightMat.transparent = true;
        lightMat.alphaTest = 0.1;
        this.lightMat = lightMat;
        // 反射地板
        this.reflectFloor = modelParts[2]
        this.reflectFloor.material = new THREE.MeshPhysicalMaterial()
        this.reflectFloor.material.aoMap = this.textureLoader1;
        this.reflectFloor.material.lightMap = this.textureLoader2;
        this.reflectFloor.material.normalMap = this.textureLoader3;
        this.reflectFloor.material.roughnessMap = this.textureLoader4;
        this.reflectFloor.material.envMapIntensity = 0;
        this.reflectFloor.material = new CustomShaderMaterial({
            baseMaterial: this.reflectFloor.material,
            vertexShader: reflecFloorVertex,
            fragmentShader: reflecFloorFragment,
            uniforms: {
                ...this.option.uj,
                uColor: {
                    value: new THREE.Color("#ffffff"),
                },
                uSpeed: {
                    value: this.option.params.speed,
                },
                uReflectMatrix: {
                    value: new THREE.Matrix4(),
                },
                uReflectTexture: {
                    value: null,
                },
                uReflectIntensity: {
                    value: 25,
                },
                uMipmapTextureSize: {
                    value: new THREE.Vector2(window.innerWidth, window.innerHeight),
                },
                iGlobalTime: {
                    value: 0
                },
                iTime: {
                    value: 0
                },
                iTimeDelta: {
                    value: 0
                },
                iResolution: {
                    value: new THREE.Vector3(window.innerWidth, window.innerHeight, 1)
                },
                iMouse: {
                    value: new THREE.Vector4(0, 0, 0, 0)
                },
                iFrame: {
                    value: 0
                },
                iSampleRate: {
                    value: 44100
                },
                iChannelTime: {
                    value: [0, 0, 0, 0]
                }
            }
        })
        this.reflection()
        this.reflectFloor.material.uniforms.uReflectMatrix.value = this._reflectMatrix;
        this.reflectFloor.material.uniforms.uReflectTexture.value = this.mipmapFBO.texture;
        // 放入场景
        this.scene.add(model.scene)
    }

    reflection() {
        const resolution = 1024
        this.mipMapIgnoreObjects = [this.light001, this.reflectFloor]
        this._camera = new THREE.PerspectiveCamera();
        this.reflectPlane = new THREE.Plane();
        this._reflectMatrix = new THREE.Matrix4();
        this.reflectionTarget = new THREE.WebGLRenderTarget(resolution, resolution, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: THREE.UnsignedByteType,
        })
        this.reflectionTarget2 = new THREE.WebGLRenderTarget(this.width, this.height, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            type: THREE.HalfFloatType,
        })
        this.mipMapGenerator()
    }

    mipMapGenerator() {
        this.mipmapper = new PackedMipMapGenerator();
        this.mirrorFBO = this.reflectionTarget;
        this.mipmapFBO = this.reflectionTarget2;
    }

    beforeRender() {
        this.reflectPlane.set(new THREE.Vector3(0, 1, 0), 0);
        this.reflectPlane.applyMatrix4(this.reflectFloor.matrixWorld);
        // @ts-ignore
        this._camera.copy(this.camera);
        const r = new THREE.Vector3(0, 0, 1).clone().negate();
        const o = this.camera.getWorldPosition(new THREE.Vector3());
        r.reflect(this.reflectPlane.normal);
        const p = new THREE.Vector3();
        this.reflectPlane.projectPoint(o, p);
        const y = p.clone();
        y.sub(o), y.add(p), this._camera.position.copy(y);
        const d = new THREE.Vector3(0, 0, -1);
        d.applyQuaternion(
            this.camera.getWorldQuaternion(new THREE.Quaternion())
        );
        d.add(o);
        const E = new THREE.Vector3();
        this.reflectFloor.getWorldPosition(E);
        E.sub(d);
        E.reflect(this.reflectPlane.normal).negate();
        E.add(this.reflectFloor.getWorldPosition(new THREE.Vector3()));
        this._camera.up.set(0, 1, 0);
        this._camera.applyQuaternion(
            this.camera.getWorldQuaternion(new THREE.Quaternion())
        );
        this._camera.up.reflect(this.reflectPlane.normal);
        this._camera.lookAt(E);
        this._camera.updateMatrixWorld();
        const L = new THREE.Matrix4();
        L.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
        L.multiply(this._camera.projectionMatrix);
        L.multiply(this._camera.matrixWorldInverse);
        this._reflectMatrix.copy(L);
        this.reflectPlane.applyMatrix4(this._camera.matrixWorldInverse);
        const k = new THREE.Vector4(
            this.reflectPlane.normal.x,
            this.reflectPlane.normal.y,
            this.reflectPlane.normal.z,
            this.reflectPlane.constant
        );
        const X = this._camera.projectionMatrix;
        const $ = new THREE.Vector4();
        $.x = (Math.sign(k.x) + X.elements[8]) / X.elements[0];
        $.y = (Math.sign(k.y) + X.elements[9]) / X.elements[5];
        $.z = -1;
        $.w = (1 + X.elements[10]) / X.elements[14];
        k.multiplyScalar(2 / k.dot($));
        X.elements[2] = k.x;
        X.elements[6] = k.y;
        X.elements[10] = k.z + 1;
        X.elements[14] = k.w;
        const Z = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(this.reflectionTarget);
        this.renderer.state.buffers.depth.setMask(true);
        this.renderer.autoClear === false && this.renderer.clear();
        this.mipMapIgnoreObjects.forEach((be) => (be.visible = false));
        this.renderer.render(this.scene, this._camera);
        this.mipMapIgnoreObjects.forEach((be) => (be.visible = true));
        this.renderer.setRenderTarget(Z);
    }

    startRoomUpdate() {
        this.updateUniforms(this.reflectFloor.material.uniforms)
        this.reflectFloor.material.uniforms.uSpeed.value = this.option.params.speed;
        this.beforeRender();
        this.mipmapper.update(
            this.mirrorFBO.texture,
            this.mipmapFBO,
            this.renderer
        );
    }

    /** 模型加载 **/
    async carLoad() {
        const model = await this.carLoader
        const modelParts = []
        model.scene.traverse((obj) => modelParts.push(obj))
        model.scene.name = 'carModel'
        const body = modelParts[2]
        this.bodyMat = body.material
        this.bodyMat.color = new THREE.Color("#4a6527");
        modelParts.forEach((item) => {
            if (item.isMesh) {
                const mat = item.material;
                mat.aoMap = this.textureLoader5
                item.addEventListener('click', () => {
                    this.rush()
                })
            }
        });
        this.bodyMat.envMapIntensity = 1;
        this.carModel = model.scene;
        this.whellModel = modelParts[35]
        this.scene.add(this.carModel)
    }

    wheelUpdate() {
        this.whellModel?.children.forEach((item) => {
            item.rotateZ(-this.option.params.speed * 0.03);
        });
    }

    async speedupLoad() {

        const model = await this.speedupLoader
        const modelParts = []
        model.scene.traverse((obj) => modelParts.push(obj))
        const speed = modelParts[1]
        speed.material = new THREE.ShaderMaterial({
            vertexShader: speedupVertex,
            fragmentShader: speedupFragment,
            transparent: true,
            depthWrite: false,
            uniforms: {
                ...this.option.uj,
                uSpeed: {
                    value: this.option.params.speed,
                },
                uOpacity: {
                    value: this.option.params.speedUpOpacity,
                },
            },
        });
        this.speedMaterial = speed.material
        this.scene.add(model.scene)
    }

    /** speed更新 **/
    speedUpdate() {
        this.updateUniforms(this.speedMaterial.uniforms);
        this.speedMaterial.uniforms.uSpeed.value = this.option.params.speed;
    }

    /** 更新uniform **/
    updateUniforms(uniforms) {
        const t = this.clock.getElapsedTime();
        uniforms.iGlobalTime.value = t;
        uniforms.iTime.value = t;
        const delta = this.clock.getDelta();
        uniforms.iTimeDelta.value = delta;
        uniforms.iResolution.value = new THREE.Vector3(window.innerWidth, window.innerHeight, 1);
        // const { x, y } = this.option.iMouse.mouse;
        // uniforms.iMouse.value = new THREE.Vector4(x, y, 0, 0);
        uniforms.iDate.value = new THREE.Vector4(new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate(), new Date().getHours());
        uniforms.iChannelTime.value = [t, t, t, t];
        uniforms.iFrame.value += 1;
    }

    /** 进入 **/
    enter() {
        this.option.params.disableInteract = true;
        this.QUADMesh.material.uniforms.uIntensity.value = 0
        this.QUADMesh.material.uniforms.uWeight.value = 0
        this.lightMat.emissive = new THREE.Color("#000000");
        this.lightMat.emissiveIntensity = 0;
        this.reflectFloor.material.uniforms.uColor.value.set(new THREE.Color("#000000"));
        this.option.params.isCameraMoving = true
        const lightColor = new THREE.Color();
        const blackColor = new THREE.Color("#000000");
        const whiteColor = new THREE.Color("#ffffff");
        this.t1 = gsap.timeline()
        this.t2 = gsap.timeline()
        this.t3 = gsap.timeline()
        this.t4 = gsap.timeline()
        this.t5 = gsap.timeline()
        this.t6 = gsap.timeline()
        this.t7 = gsap.timeline()
        this.t8 = gsap.timeline()
        this.t9 = gsap.timeline()
        this.t1.to(this.option.camera, {
            x: 0,
            y: 0.8,
            z: -7,
            duration: 4,
            ease: "power2.inOut",
            onUpdate: () => {
                this.camera.position.set(this.option.camera.x, this.option.camera.y, this.option.camera.z)
            },
            onComplete: () => {
                this.option.params.isCameraMoving = false
                this.option.params.disableInteract = false;
            }
        })
        this.t2.to(this.option.params, {
            lightAlpha: 1,
            lightIntensity: 1,
            reflectIntensity: 25,
            // furinaLerpColor: 1,
            duration: 4,
            delay: 1,
            ease: "power2.inOut",
            onUpdate: () => {
                lightColor.copy(blackColor).lerp(whiteColor, this.option.params.lightAlpha);
                this.lightMat.emissive.set(lightColor);
                this.lightMat.emissiveIntensity = this.option.params.lightIntensity;
                this.reflectFloor.material.uniforms.uColor.value.set(lightColor);
                this.reflectFloor.material.uniforms.uReflectIntensity.value = this.option.params.reflectIntensity;
            }
        })
        this.t3.to(this.option.params, {
            envIntensity: 1,
            duration: 4,
            delay: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {
                this.QUADMesh.material.uniforms.uIntensity.value = this.option.params.envIntensity
            },
        }).to(this.option.params, {
            envWeight: 1,
            duration: 4,
            ease: "power2.inOut",
            onUpdate: () => {
                this.QUADMesh.material.uniforms.uWeight.value = this.option.params.envWeight
            },
        }, "-=2.5");
    }

    /** 清除动画 **/
    clearAllTweens() {
        this.t1.clear();
        this.t2.clear();
        this.t3.clear();
        this.t4.clear();
        this.t5.clear();
        this.t6.clear();
        this.t7.clear();
        this.t8.clear();
        this.t9.clear();
    }

    /** 跑起来的环境贴图 **/
    createEnvironment(config = {}) {
        const {
            resolution = 512,
            near = 1,
            far = 1e3,
            scene = this.scene,
            options = {
                minFilter: THREE.LinearMipMapLinearFilter,
                anisotropy: 0,
                depthBuffer: false,
                generateMipmaps: true,
            },
            textureType = THREE.UnsignedByteType,
            ignoreObjects = [this.carModel]
        } = config;
        this.ignoreObjects = ignoreObjects;
        const fbo = new THREE.WebGLCubeRenderTarget(resolution, options);
        fbo.texture.type = textureType;
        this.virtualFbo = fbo;
        const cubeCamera = new THREE.CubeCamera(near, far, fbo);
        const virtualScene = scene;
        this.cubeCamera = cubeCamera;
        this.virtualScene = virtualScene;
    }

    /** 更新车子的环境映照 **/
    environmentUpdate() {
        this.ignoreObjects.forEach((item) => {
            item.visible = false;
        });
        this.cubeCamera.update(this.renderer, this.virtualScene);
        this.ignoreObjects.forEach((item) => {
            item.visible = true;
        });
    }

    /** 停止 **/
    sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

    /** 跑起来 **/
    rush() {
        if (this.option.params.isRushing) {
            this.rushDone();
            return;
        }
        if (this.option.params.disableInteract) {
            return;
        }
        this.option.params.disableInteract = true;
        this.clearAllTweens()
        const floorColor = new THREE.Color();
        const blackColor = new THREE.Color("#000000");
        const furinaColor = new THREE.Color();
        const furinaFadeColor = new THREE.Color("#666666");
        this.t4.to(this.option.params, {
            speed: 4,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                this.option.params.isRushing = true;
                this.option.params.disableInteract = false;
            },
        }).to(this.option.params, {
            speed: 10,
            duration: 4,
            ease: "power2.out",
        });
        this.t5.to(this.option.params, {
            lightOpacity: 0,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                this.lightMat.opacity = this.option.params.lightOpacity;
            },
        });
        this.t6.fromTo(this.option.params,
            {
                floorLerpColor: 0,
                furinaLerpColor: 0,
            },
            {
                floorLerpColor: 1,
                furinaLerpColor: 1,
                duration: 4,
                ease: "none",
                onUpdate: () => {
                    floorColor.lerp(blackColor, this.option.params.floorLerpColor);
                    this.reflectFloor.material.uniforms.uColor.value.set(floorColor);

                    // furinaColor.lerp(furinaFadeColor, this.option.params.furinaLerpColor);
                    // this.furina?.setColor(furinaColor);
                },
            }
        );
        this.t7.to(this.option.params, {
            envIntensity: 0.01,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                this.QUADMesh.material.uniforms.uIntensity.value = this.option.params.envIntensity
            },
        });
        this.t8.to(this.option.params, {
            speedUpOpacity: 1,
            cameraFov: 36,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                this.speedMaterial.uniforms.uOpacity.value = this.option.params.speedUpOpacity;
                this.camera.fov = this.option.params.cameraFov;
                this.camera.updateProjectionMatrix();
            },
        });
        this.sleep(1000)
        this.scene.environment = this.virtualFbo.texture;
        this.t9.to(this.option.params, {
            carBodyEnvIntensity: 5,
            cameraShakeIntensity: 1,
            bloomLuminanceSmoothing: 0.4,
            bloomIntensity: 2,
            duration: 4,
            ease: "power2.out",
            onUpdate: () => {
                this.bodyMat.envMapIntensity = this.option.params.carBodyEnvIntensity
                // this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
                this.bloom.luminanceMaterial.smoothing = this.option.params.bloomLuminanceSmoothing
                this.bloom.intensity = this.option.params.bloomIntensity
            },
        });
    }

    /** 停下来 **/
    rushDone() {
        if (this.option.params.disableInteract) {
            return;
        }
        console.log('停下来')
        this.option.params.disableInteract = true;
        this.clearAllTweens();
        const floorColor = new THREE.Color();
        const whiteColor = new THREE.Color("#ffffff");
        this.t4.to(this.option.params, {
            speed: 0,
            duration: 2,
            ease: "power2.out",
            onComplete: () => {
                this.option.params.isRushing = false;
                this.option.params.disableInteract = false;
            },
        });
        this.t5.to(this.option.params, {
            lightOpacity: 1,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                this.lightMat.opacity = this.option.params.lightOpacity;
            },
        });
        this.t6.fromTo(
            this.option.params,
            {floorLerpColor: 0, furinaLerpColor: 0},
            {
                floorLerpColor: 1,
                furinaLerpColor: 1,
                duration: 4,
                ease: "none",
                onUpdate: () => {
                    floorColor.lerp(whiteColor, this.option.params.floorLerpColor);
                    this.reflectFloor.material.uniforms.uColor.value.set(floorColor);

                    /*furinaColor.lerp(
                        furinaOriginalColor,
                        this.base.params.furinaLerpColor
                    );
                    this.furina?.setColor(furinaColor);*/
                },
            }
        );
        this.t7.to(this.option.params, {
            envIntensity: 1,
            duration: 1,
            ease: "power2.out",
            onUpdate: () => {
                this.QUADMesh.material.uniforms.uIntensity.value = this.option.params.envIntensity
            },
        });
        this.t8.to(this.option.params, {
            speedUpOpacity: 0,
            cameraFov: 33.4,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                this.speedMaterial.uniforms.uOpacity.value = this.option.params.speedUpOpacity;
                this.camera.fov = this.option.params.cameraFov;
                this.camera.updateProjectionMatrix();
            },
        });
        this.t9.to(this.option.params, {
            carBodyEnvIntensity: 1,
            cameraShakeIntensity: 0,
            bloomLuminanceSmoothing: 1.6,
            bloomIntensity: 1,
            duration: 4,
            ease: "power2.out",
            onUpdate: () => {
                this.bodyMat.envMapIntensity = this.option.params.carBodyEnvIntensity
                // this.cameraShake.setIntensity(this.base.params.cameraShakeIntensity);
                this.bloom.luminanceMaterial.smoothing = this.option.params.bloomLuminanceSmoothing
                this.bloom.intensity = this.option.params.bloomIntensity
            },
        });
        this.scene.environment = this.FBO.texture;
    }

    /** 后期处理 **/
    postEA() {
        this.composer = new POSTPROCESSING.EffectComposer(this.renderer, {
            frameBufferType: THREE.HalfFloatType
        });
        this.rederPass = new POSTPROCESSING.RenderPass(this.scene, this.camera)
        this.composer.addPass(this.rederPass)
        this.bloom = new POSTPROCESSING.BloomEffect({
            blendFunction: POSTPROCESSING.BlendFunction.ADD,
            mipmapBlur: true,
            luminanceThreshold: 0,
            luminanceSmoothing: this.option.params.bloomLuminanceSmoothing,
            bloomIntensity: this.option.params.bloomIntensity
        });
        this.composer.addPass(new POSTPROCESSING.EffectPass(this.camera, this.bloom));
        /*    const chromaticAberrationEffect = new POSTPROCESSING.ChromaticAberrationEffect();
            const glitchEffect = new POSTPROCESSING.GlitchEffect();
            const glitchPass = new POSTPROCESSING.EffectPass(this.camera, glitchEffect);
            const chromaticAberrationPass = new POSTPROCESSING.EffectPass(this.camera, chromaticAberrationEffect);
            this.composer.addPass(glitchPass);
            this.composer.addPass(chromaticAberrationPass);*/
    }

    /** 辅助观察坐标系初始化 **/
    axesHelperInit() {
        // 坐标轴颜色红R、绿G、蓝B分别对应坐标系的x、y、z轴
        this.axesHelper = new THREE.AxesHelper(this.option.axesHelper.size);
        this.scene.add(this.axesHelper)
    }

    /** 状态窗口初始化 **/
    statsInit() {
        this.stats = new Stats();
        this.stats.dom.style.position = 'absolute'
        this.parent.appendChild(this.stats.dom);
    }

    /** 轨道控制器初始化 **/
    controlsInit() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enablePan = this.option.controls.enablePan;
        this.controls.enableZoom = this.option.controls.enableZoom;
        this.controls.minPolarAngle = this.option.controls.minPolarAngle;
        this.controls.maxPolarAngle = this.option.controls.maxPolarAngle;
        //阻尼 惯性
        this.controls.enableDamping = this.option.controls.enableDamping;
        //阻尼系数
        this.controls.dampingFactor = this.option.controls.dampingFactor;
        // 是否字段围绕旋转
        this.controls.autoRotate = this.option.controls.autoRotate;
        this.controls.autoRotateSpeed = this.option.controls.atoRotateSpeed;
        this.controls.target.set(this.option.controls.setX, this.option.controls.setY, this.option.controls.setZ);
        this.controls.update();
    }

    /** 监听窗口改变 **/
    resize() {
        window.onresize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.reflectionTarget.setSize(width, height);
            this.reflectionTarget2.setSize(width, height);
            this.reflectFloor.material.uniforms.uMipmapTextureSize.value = new THREE.Vector2(width, height);
            this.camera.aspect = width / height;
            this.renderer.setSize(width, height);
            this.composer.setSize(width, height);
        }
    }

    /** 更新动画 **/
    animate() {
        requestAnimationFrame(() => this.animate())
        if (this.option.stats) this.stats.update();
        if (this.option.controls.open) this.controls.update();
        if (this.option.params.isCameraMoving) {
            this.controls.enabled = false;
        } else {
            this.controls.enabled = true;
        }
        this.QUADRender()
        this.startRoomUpdate()
        this.wheelUpdate()
        this.speedUpdate()
        this.environmentUpdate()
        this.composer.render(this.scene, this.camera)
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
        this.composer.dispose()
        this.renderer.dispose();
    }
}
