/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/30 15:55:44
 */
import * as THREE from 'three'
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import vert from '@/views/example/music/glsl/vert.glsl'
import frag from '@/views/example/music/glsl/frag.glsl'
export default class Main{
    constructor(config) {
        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;

        this.isPlay = false


        this.renderer = new THREE.WebGLRenderer({})
        this.renderer.setSize(this.width, this.height)
        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color('#ccc');
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 1000)
        this.camera.position.copy( new THREE.Vector3(0, 0.2, 0.5))
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        this.target.appendChild(this.renderer.domElement);
        this.scene.add(new THREE.AxesHelper(500))

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;


        this.audioInit()
        this.meshInit()
        this.animation.bind(this)
        this.animation()
    }
    audioInit(){
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);
        this.audio = new THREE.Audio(this.listener);
        this.audioLoader = new THREE.AudioLoader();
        this.audioLoader.load('./music/悬溺.mp3', (buffer) => {
            this.buffer = buffer
            console.log('audio complete')
        });
        // 创建音频分析器
        this.analyser = new THREE.AudioAnalyser(this.audio, 256);
    }
    meshInit(){
        this.geometry = new THREE.PlaneGeometry(100, 100, 256, 256);
        this.material = new THREE.ShaderMaterial({
            uniforms:{
                iTime:{value: 0},
                audioData: { value: new Float32Array(256) }
            },
            vertexShader: vert,
            fragmentShader: frag,
            wireframe: true // 可选的线框模式
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.mesh.rotateX(-Math.PI / 2)
        this.scene.add(this.mesh)
    }
    start(){
        this.audio.setBuffer(this.buffer);
        this.audio.setLoop(true);
        this.audio.setVolume(0.5);
        this.audio.play();
    }
    update(){
        const data = this.analyser.getFrequencyData()
        const audioData = new Float32Array(data.length);
        // 将频率数据归一化到 0 到 1 的范围，并传递给 shader
        for (let i = 0; i < data.length; i++) {
            audioData[i] = data[i] / 256.0;
        }
        // 更新 uniform 数据
        this.mesh.material.uniforms.audioData.value = audioData;
    }
    animation(){
        this.renderer.setAnimationLoop(() => this.animation())

        this.controls.update();

        this.update()

        this.renderer.render(this.scene, this.camera)
    }
    resize(){}
    destroy(){}
}
