/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/18 15:25:31
 */
import * as THREE from "three";
import {DRACOLoader, GLTFLoader} from "three-stdlib";
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {RenderTransitionPass} from '@/views/example/ablate/js/RenderTransitionPass';
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import CreateScene from '@/views/example/ablate/js/createScene'


export default class Main {
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;

        this.params = {
            sceneAnimate: true,
            transitionAnimate: true,
            transition: 0,
            useTexture: true,
            texture: 0,
            cycle: true,
            threshold: 0.1,
        }

        this.setBase()
        this.setAssets()
    }

    setAssets() {
        this.manager = new THREE.LoadingManager();
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.textureLoader.load('./texture/3GDlwcvehqQjTPH.jpg', (texture) => this.texture = texture)
        this.textureLoader.load('https://threejs.org/examples/textures/transition/transition1.png', (texture) => this.texture1 = texture)
        this.textureLoader.load('https://threejs.org/examples/textures/transition/transition2.png', (texture) => this.texture2 = texture)
        this.textureLoader.load('https://threejs.org/examples/textures/transition/transition3.png', (texture) => this.texture3 = texture)
        this.textureLoader.load('https://threejs.org/examples/textures/transition/transition4.png', (texture) => this.texture4 = texture)
        this.textureLoader.load('https://threejs.org/examples/textures/transition/transition5.png', (texture) => this.texture5 = texture)
        this.textureLoader.load('https://threejs.org/examples/textures/transition/transition6.png', (texture) => this.texture6 = texture)
        this.dracoLoader = new DRACOLoader(this.manager);
        this.dracoLoader.setDecoderPath('./draco/gltf/');
        this.loader = new GLTFLoader(this.manager).setDRACOLoader(this.dracoLoader);
        this.loader.load('https://threejs.org/examples/models/gltf/LittlestTokyo.glb', (GLTF) => this.tokyo = GLTF.scene);
        this.manager.onLoad = () => {
            this.createScene();
            this.setPostprocessing();
            this.setGui();
            this.animation();
            window.addEventListener('resize', () => this.resize());
        }
    }

    setBase() {
        this.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true, preserveDrawingBuffer: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.target.appendChild(this.renderer.domElement);
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    }


    createScene() {
        this.tokyo.position.set(1, 1, 0);
        this.tokyo.scale.set(0.01, 0.01, 0.01);
        this.sceneA = new CreateScene({
            target: this.target,
            renderer: this.renderer,
            controls: true,
            camera: {
                fov: 40,
                near: 0.1,
                far: 100,
                x: 5,
                y: 2,
                z: 8
            },
            model: this.tokyo,
            backgroundColor: 0xbfe3dd,
            environment: this.pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture
        })


        const object = new THREE.Object3D();
        const geometry = new THREE.SphereGeometry(200, 4, 4);
        for (let i = 0; i < 200; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: 0xffffff * Math.random(),
                flatShading: true,
            });
            const mesh = new THREE.Mesh(geometry, material);

            let x = (Math.random() - 0.5) * 100;
            let y = (Math.random() - 0.5) * 100;
            let z = (Math.random() - 0.5) * 100;

            mesh.position.set(x, y, z).normalize();
            mesh.position.multiplyScalar(Math.random() * 0.8 * 100 );
            mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 0.05;
            object.add(mesh);
        }
        this.geo1 = object
        this.sceneB = new CreateScene({
            target: this.target,
            renderer: this.renderer,
            controls: true,
            camera: {
                fov: 40,
                near: 0.1,
                far: 1000,
                x: 0,
                y: 0,
                z: 300
            },
            mesh: this.geo1,
            backgroundColor: 0xcccccc
        })

    }

    setPostprocessing() {
        this.composer = new EffectComposer(this.renderer);

        this.renderTransitionPass = new RenderTransitionPass([this.sceneA, this.sceneB], this.aspect, this.texture, this.texture1, this.texture2,this.texture3,this.texture4,this.texture5,this.texture6);

        this.outPass = new OutputPass();

        this.composer.addPass(this.renderTransitionPass);
        this.composer.addPass(this.outPass);
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());


        if ( this.params.transitionAnimate ) this.tween.update();

        this.sceneA.animation()
        this.sceneB.animation()

        this.composer.render();
    }

    setGui() {
        this.tween = new TWEEN.Tween(this.params);
        this.tween.to({transition: 1}, 1500);
        this.tween.onUpdate(() => {

            this.renderTransitionPass.setTransition( this.params.transition );

            if ( this.params.cycle ) {

                if ( this.params.transition == 0 || this.params.transition == 1 ) {

                    // this.params.texture = ( this.params.texture + 1 ) % textures.length;
                    // this.renderTransitionPass.setTexture( textures[ params.texture ] );

                }

            }
        })
        this.tween.repeat( Infinity ).delay( 2000 ).yoyo( true ).start();

        this.gui = new GUI({container: this.target});
        this.gui.domElement.style.position = 'absolute'
        this.gui.domElement.style.right = '0'
        this.gui.domElement.style.top = '0'
        this.gui.domElement.style.zIndex = '999'
        this.gui.add(this.params, 'transition', 0, 1, 0.01).onChange((value) =>  this.renderTransitionPass.setTransition(value)).listen();
        this.gui.add( this.params, 'texture', {
            '淡出淡入转场': 0,
            '滑动转场': 1,
            '遮罩转场': 2,
            '置换转场': 3,
            '柏林噪声转场': 9,
            '分形布朗噪声转场': 10,
            '贴图转场1': 4,
            '贴图转场2': 5 ,
            '贴图转场3': 6 ,
            '贴图转场4': 7 ,
            '贴图转场5': 8 ,
            '贴图转场6': 11 ,
        } ).onChange(  ( value ) => this.renderTransitionPass.setFragment(value)).listen();
        this.gui.add( this.params, 'threshold', 0, 1, 0.01 ).onChange(  ( value ) => this.renderTransitionPass.setTextureThreshold( value ) ).listen();
    }

    resize() {
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;

        this.sceneA.resize()
        this.sceneB.resize()

        this.renderer.setSize(this.width, this.height);
        if (this.composer) this.composer.setSize(this.width, this.height)
    }

    destroy() {
        this.sceneA.destroy();
        this.sceneB.destroy();
        // renderer
        this.renderer.dispose();
    }


}
