/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/30 15:55:44
 */
import * as THREE from 'three'

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
        this.camera.position.copy( new THREE.Vector3(0, 20, 50))
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        this.target.appendChild(this.renderer.domElement);
        this.scene.add(new THREE.AxesHelper(500))
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
        // 创建山脉地形几何体
        const width = 500;
        const height = 500;
        const segments = 256;
        const geometry = new THREE.PlaneGeometry(width, height, segments, segments);
        geometry.rotateX(-Math.PI / 2);

// Shader 材质
        const material = new THREE.ShaderMaterial({
            vertexShader: `
    uniform float time;
    varying vec3 vNormal;
    varying float vHeight;

    // 生成噪声函数（使用简单的正弦函数模拟山脉）
    float noise(float x, float z) {
      return sin(x * 0.1 + time) * 2.0 + cos(z * 0.1 + time) * 2.0;
    }

    void main() {
      vNormal = normal;
      vHeight = noise(position.x, position.z);  // 使用噪声控制高度
      vec3 newPosition = position + normal * vHeight;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
            fragmentShader: `
    varying vec3 vNormal;
    varying float vHeight;

    void main() {
      // 给山脉表面添加霓虹光效果
      vec3 color = vec3(0.1, 0.5, 0.1);  // 设置一个绿色的颜色（霓虹效果）
      if (vHeight > 2.0) {
        color = vec3(0.0, 1.0, 0.0);  // 高处区域亮绿色
      }
      
      // 模拟发光效果
      gl_FragColor = vec4(color, 1.0);
    }
  `,
            uniforms: {
                time: { value: 0 },
            },
            wireframe: true,
            side: THREE.DoubleSide,
        });
        this.mesh = new THREE.Mesh(geometry,material)
        this.scene.add(this.mesh)
    }
    start(){
        this.audio.setBuffer(this.buffer);
        this.audio.setLoop(true);
        this.audio.setVolume(0.5);
        this.audio.play();
    }
    update(){
        // 获取音频的频谱数据
        const data = this.analyser.getFrequencyData();


        // 更新时间
        this.mesh.material.uniforms.time.value += 0.05;
    }
    animation(){
        this.renderer.setAnimationLoop(() => this.animation())


        this.update()

        this.renderer.render(this.scene, this.camera)
    }
    resize(){}
    destroy(){}
}
