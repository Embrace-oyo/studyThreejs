/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/2/26 14:40:25
 */
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls.js";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {WaterSimulation, Water, Caustics, Pool, Debug} from '@/views/pages/water/js/class'

function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}

export default class PoolWater {
    constructor(config) {
        this.parent = config.parent;
        this.target = config.target;
        this.callback = config.callback;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;
        this.renderer = new THREE.WebGL1Renderer({
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
        this.scene.background = new THREE.Color('#646464')
        this.camera = new THREE.PerspectiveCamera(45, this.aspect, 0.01, 1000);
        this.camera.position.copy(new THREE.Vector3(2, 1, 2))
        this.camera.lookAt(new THREE.Vector3(0, 0, 0))
        this.camera.updateProjectionMatrix()
        this.scene.add(this.camera);
        this.clock = new THREE.Clock();
        this.paramsInit();
        this.controlsInit();
        this.rayCasterInit();
        this.assetsInit();
    }

    paramsInit() {
        // Light direction
        this.light = [0.7559289460184544, 0.7559289460184544, -0.3779644730092272];
        this.black = new THREE.Color('black');
        this.white = new THREE.Color('white');
    }

    controlsInit() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        /*this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.controls.screen.width = this.width;
        this.controls.screen.height = this.height;
        this.controls.rotateSpeed = 2.5;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.9;
        this.controls.dynamicDampingFactor = 0.9;*/
    }

    rayCasterInit() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.targetgeometry = new THREE.PlaneGeometry(2, 2);
        // 获取该几何体的顶点位置数据
        const positions = this.targetgeometry.attributes.position.array;
        // 遍历所有顶点并修改其位置
        for (let i = 0; i < positions.length; i += 3) {
            // positions 数组是按顺序存储的：x, y, z
            const y = positions[i + 1];
            // 修改顶点坐标
            positions[i + 2] = -y;  // 将 z 值设为 -y
            positions[i + 1] = 0;    // 将 y 值设为 0
        }
        // 通知 Three.js 顶点属性已经更新
        this.targetgeometry.attributes.position.needsUpdate = true;
        this.targetmesh = new THREE.Mesh(this.targetgeometry);
    }

    worldInit() {
        this.waterSimulation = new WaterSimulation();
        this.water = new Water(this);
        this.caustics = new Caustics(this);
        this.pool = new Pool(this);
        this.debug = new Debug();
    }

    assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.tilesTexture = (new THREE.TextureLoader(this.manager)).load(filePath('tiles.jpg'));
        this.cubeTexture = (new THREE.CubeTextureLoader(this.manager)).load([
            filePath('cubeMap/posx.png'),
            filePath('cubeMap/negx.png'),
            filePath('cubeMap/posy.png'),
            filePath('cubeMap/negy.png'),
            filePath('cubeMap/posz.png'),
            filePath('cubeMap/negz.png'),
        ]);
        this.manager.onLoad = () => {
            console.info("%c资源加载完成!✅", "color:#fff;background-color:red");
            this.scene.environment = this.cubeTexture;
            this.scene.background = this.cubeTexture;
            this.callback();
            this.worldInit();
            this.animation();
            this.paneInit();
            this.resize();
            this.target.addEventListener('mousemove', (event) => this.onMouseMove(event));
        }
    }

    onMouseMove(event) {
        const rect = this.target.getBoundingClientRect();

        this.mouse.x = (event.clientX - rect.left) * 2 / this.width - 1;
        this.mouse.y = -(event.clientY - rect.top) * 2 / this.height + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObject(this.targetmesh);

        for (let intersect of intersects) {
            this.waterSimulation.addDrop(this.renderer, intersect.point.x, intersect.point.z, 0.03, 0.04);
        }
    }


    animation() {
        this.controls.update();

        this.waterSimulation.stepSimulation(this.renderer);
        this.waterSimulation.updateNormals(this.renderer);

        const waterTexture = this.waterSimulation.texture.texture;

        this.caustics.update(this.renderer, waterTexture);

        const causticsTexture = this.caustics.texture.texture;

        this.debug.draw(this.renderer, causticsTexture);

        this.renderer.setRenderTarget(null);
        // this.renderer.setClearColor(this.white, 1);
        this.renderer.clear();

        this.water.draw(this.renderer, waterTexture, causticsTexture);
        this.pool.draw(this.renderer, waterTexture, causticsTexture);



        this.renderer.setAnimationLoop(() => this.animation());
    }

    paneInit() {
    }

    resize() {
    }

    destroy() {
    }


}
