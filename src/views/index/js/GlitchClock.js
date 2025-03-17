/**
 * justThreeJs GlitchClock.js
 * @author kongjianqiu
 * @description
 * @created 2025/1/22 16:48:25
 */
import gsap from "gsap";
import * as THREE from "three";
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import vert from '@/views/index/glsl/vert.glsl'
import frag from '@/views/index/glsl/frag.glsl'
import frag2 from '@/views/index/glsl/frag2.glsl'

export default class GlitchClock {
    constructor() {
        this.target = document.getElementById('time')
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.counter = 0.0;
        this.myEffect = {
            uniforms: {
                tDiffuse: {value: null},
                amount: {value: this.counter},
            },
            vertexShader: vert,
            fragmentShader: frag2,
        };
        this.state = {
            sec: {
                0: null,
                1: null,
            },
            min: {
                0: null,
                1: null,
            },
            hrs: {
                0: null,
                1: null,
            },
        };
        this.numImages = [
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/zero.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/one.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/two.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/three.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/four.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/five.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/six.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/seven.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/eight.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/numbers/nine.jpg",
            "https://raw.githubusercontent.com/pizza3/asset/master/curt.jpg",
        ]
        this.material = [];
        this.plane = [];
        this.textures = [];
        this.current = [1, 1, 1, 1, 1, 1];
        this.then = 0;
        this.init()
    }

    setTextures(cb) {
        const promises = [];
        this.numImages.forEach((url, i) => {
            let promise = new Promise((resolve) => {
                this.textures[i] = new THREE.TextureLoader().load(url, resolve);
            });
            promises.push(promise);
        });
        Promise.all(promises).then(() => {
            cb();
        });
    };

    init() {
        this.setTextures(() => {
            this.createScene()
            this.addPlane(2.25, "sec", true);
            this.addPlane(3.75, "sec");
            this.addPlane(-0.75, "min", true);
            this.addPlane(0.75, "min");
            this.addPlane(-3.75, "hrs", true);
            this.addPlane(-2.25, "hrs");
            this.resize();
            this.animation();
        })
    }


    createScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 1000);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        // this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;

        // this.renderer.antialias = true;
        // this.renderer.interpolateneMapping = THREE.ACESFilmicToneMapping;

        this.target.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.backgroundColor = 'transparent';
        this.composer = new EffectComposer(this.renderer);
        this.renderScene = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderScene);
        this.customPass = new ShaderPass(this.myEffect);
        // this.customPass.renderToScreen = true;
        // this.composer.addPass(this.customPass);
    }

    getDigit(type) {
        let oncedigit = '';
        let tensdigit = '';
        if (type === "sec") {
            let second = new Date().getSeconds();
            oncedigit =
                second.toString()[1] !== undefined
                    ? second.toString()[1]
                    : second.toString()[0];
            tensdigit = second.toString()[1] !== undefined ? second.toString()[0] : 0;
            return {0: Number(tensdigit), 1: Number(oncedigit)};
        } else if (type === "min") {
            let minutes = new Date().getMinutes();
            oncedigit =
                minutes.toString()[1] !== undefined
                    ? minutes.toString()[1]
                    : minutes.toString()[0];
            tensdigit = minutes.toString()[1] !== undefined ? minutes.toString()[0] : 0;
            return {0: Number(tensdigit), 1: Number(oncedigit)};
        } else {
            let hours = new Date().getHours();
            oncedigit =
                hours.toString()[1] !== undefined
                    ? hours.toString()[1]
                    : hours.toString()[0];
            tensdigit = hours.toString()[1] !== undefined ? hours.toString()[0] : 0;
            return {0: Number(tensdigit), 1: Number(oncedigit)};
        }
    };

    addPlane(x = 0.2, type = 'sec', tens = false) {
        let number = this.getDigit(type);
        let currentNumber = number[1];
        let nextNumber = number[1] + 1 > 9 ? 0 : number[1] + 1;
        if (tens) {
            currentNumber = number[0];
            if (type === "hrs") {
                if (number[0] === 2 && number[1] === 3) {
                    nextNumber = 0;
                } else {
                    nextNumber = number[0] + 1 > 9 ? 0 : number[0] + 1;
                }
            } else {
                nextNumber = number[0] + 1 > 5 ? 0 : number[0] + 1;
            }
        } else {
            if (type === "hrs") {
                if (number[0] === 2 && number[1] === 3) {
                    nextNumber = 0;
                }
            }
        }
        this.state[type][1] = number[0];
        this.state[type][0] = number[1];
        const uniforms = {
            time: {value: 1.0},
            progress: {value: 0},
            resolution: {value: new THREE.Vector2(400, 400)},
            intensity: {value: 1.0},
            texture1: {
                value: this.textures[currentNumber],
            },
            texture2: {
                value: this.textures[nextNumber],
            },
            displacement: {value: this.textures[10]},
            width: {value: 0.5, min: 0, max: 10},
            scaleX: {value: 40, min: 0.1, max: 60},
            scaleY: {value: 40, min: 0.1, max: 60},
        };
        const geometry = new THREE.PlaneGeometry(2, 2, 10, 10);
        this.material.push(
            new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vert,
                fragmentShader: frag,
            })
        );
        this.plane.push(new THREE.Mesh(geometry, this.material[this.material.length - 1]));
        this.plane[this.plane.length - 1].position.set(x, 0, 0);
        this.scene.add(this.plane[this.plane.length - 1]);
    }

    addColon() {
        const geometry = new THREE.PlaneGeometry(0.5, 2, 1, 1); // 调整冒号的大小
        const material = new THREE.MeshBasicMaterial({color: 0xffffff}); // 冒号的颜色，可以根据需要修改
        const colon = new THREE.Mesh(geometry, material);
        colon.position.set(1.5, 0, 0); // 调整冒号的位置
        this.scene.add(colon);
        this.plane.push(colon);
    }

    next(once, tens, onceIndex, tensIndex, updateTens = false, isHours = false) {
        let duration = 0.9;
        let tl = new gsap.timeline({});
        let forceUpdateHour = false;
        tl.to(this.material[once].uniforms.progress, duration, {
            value: this.current[once],
            ease: gsap.easeInOut,
            delay: 0,
            yoyo: true,
            onComplete: () => {
                let tex = this.textures[onceIndex + 1 > 9 ? 0 : onceIndex + 1];
                if (onceIndex === 2 && tensIndex === 3) {
                    tex = this.textures[0];
                }
                if (isHours && onceIndex + 1 > 5 && tensIndex === 2) {
                    tex = this.textures[0];
                    forceUpdateHour = true;
                }
                if (this.current[once] === 1) {
                    this.material[once].uniforms["texture1"].value = tex;
                } else {
                    this.material[once].uniforms["texture2"].value = tex;
                }
                this.current[once] = this.current[once] === 1 ? 0 : 1;
            },
        }, 0)
        if (updateTens || forceUpdateHour) {
            tl.to(
                this.material[tens].uniforms.progress,
                duration,
                {
                    value: this.current[tens],
                    ease: gsap.easeInOut,
                    delay: 0,
                    yoyo: true,
                    onComplete: () => {
                        let tex = this.textures[tensIndex + 1 > 5 ? 0 : tensIndex + 1];
                        if (isHours) {
                            if (onceIndex === 2 && tensIndex === 3) {
                                tex = this.textures[0];
                            }
                        }
                        if (this.current[tens] === 1) {
                            this.material[tens].uniforms["texture1"].value = tex;
                        } else {
                            this.material[tens].uniforms["texture2"].value = tex;
                        }
                        this.current[tens] = this.current[tens] === 1 ? 0 : 1;
                    },
                },
                0
            );
        }
    }

    animation(now = 0) {
        requestAnimationFrame((time) => this.animation(time))
        now *= 0.001; // convert to seconds
        const deltaTime = now - this.then;
        this.then = now;
        const second = this.getDigit("sec");
        const minute = this.getDigit("min");
        const hours = this.getDigit();

        if (this.state.sec[0] !== second[1]) {
            if (this.state.sec[1] !== second[0]) {
                this.next(1, 0, second[1], second[0], true);
                this.state.sec[1] = second[0];
            } else {
                this.next(1, 0, second[1], second[0]);
            }
            this.state.sec[0] = second[1];
        }
        // update min
        if (this.state.min[0] !== minute[1]) {
            if (this.state.min[1] !== minute[0]) {
                this.next(3, 2, minute[1], minute[0], true);
                this.state.min[1] = minute[0];
            } else {
                this.next(3, 2, minute[1], minute[0]);
            }
            this.state.min[0] = minute[1];
        }
        // update hrs
        if (this.state.hrs[0] !== hours[1]) {
            if (this.state.hrs[1] !== hours[0]) {
                this.next(5, 4, hours[1], hours[0], true, true);
                this.state.hrs[1] = hours[0];
            } else {
                this.next(5, 4, hours[1], hours[0], false, true);
            }
            this.state.hrs[0] = hours[1];
        }
        this.counter += 0.01;
        this.customPass.uniforms["amount"].value = this.counter;
        this.composer.render(deltaTime);
    }

    resize() {
        window.addEventListener('resize', () => {
            this.width = this.target.offsetWidth
            this.height = this.target.offsetHeight
            this.camera.aspect = this.width / this.height;
            if (this.width < 900) {
                this.camera.position.z = 13.4 - this.width / 100;
            } else {
                this.camera.position.z = 5;
            }
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        })
    }

}
