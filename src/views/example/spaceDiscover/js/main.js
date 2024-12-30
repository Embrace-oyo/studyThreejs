/**
 * justThreeJs main.js
 * @author kongjianqiu
 * @description
 * @created 2024/12/26 16:25:10
 */
import * as THREE from "three";
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {GLTFLoader} from "three-stdlib";

const options = {
    radius: 0.65,
    directionLocal: new CANNON.Vec3(0, -1.1, 0),
    suspensionStiffness: 30,
    suspensionRestLength: 0.3,
    frictionSlip: 5,
    dampingRelaxation: 2.3,
    dampingCompression: 4.4,
    // maxSuspensionForce: 100000,
    rollInfluence: 0.01,
    axleLocal: new CANNON.Vec3(-1, 0, 0),
    // chassisConnectionPointLocal: new CANNON.Vec3(1, 1, 0),
    maxSuspensionTravel: 0.3,
    customSlidingRotationalSpeed: -30,
    useCustomSlidingRotationalSpeed: true,

    // radius: 0.65,  // 轮胎半径
    // suspensionRestLength: 0.3,  // 悬挂休息长度（悬挂的初始距离）
    // suspensionStiffness: 50,  // 悬挂刚度（弹簧硬度）
    suspensionDamping: 1,  // 悬挂阻尼
    // frictionSlip: 5,  // 轮胎的摩擦力
    maxSuspensionForce: 10000,  // 最大悬挂力
    engineForce: 0,  // 引擎力
    brakeForce: 5,  // 刹车力
    steering: 0  // 转向角度
};
const colors = [
    {
        stop: 0,
        color: new THREE.Color("#B0E0E6")
    },
    {
        stop: 0.25,
        color: new THREE.Color("#CD853F")
    },
    {
        stop: 0.5,
        color: new THREE.Color("#EEE8AA")
    },
    {
        stop: 0.75,
        color: new THREE.Color("#bf8040")
    },
    {
        stop: 1,
        color: new THREE.Color("#666")
    }
];
const solidMaterial = new THREE.MeshLambertMaterial( { color: 0xdddddd } )
const wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0xffffff, wireframe: true } );
export default class Main{
    constructor(config) {

        this.target = config.target;
        this.width = this.target.offsetWidth;
        this.height = this.target.offsetHeight;
        this.aspect = this.width / this.height;


        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.1, 100000);
        this.camera.position.set(0,5,-10);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color('#222')
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.target.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(0, 0, 0);
        this.controls.update();
        this.controls.enablePan = true;
        this.controls.enableDamping = true;

        // this.scene.add(new THREE.AxesHelper(300));

        this.clock = new THREE.Clock();

        this.maxSteerVal = 0.6;
        this.maxForce = 600;
        this.brakeForce = 5;

        this.assetsInit()

    }

    assetsInit(){
        this.manager = new THREE.LoadingManager();
        this.loader = new GLTFLoader(this.manager);
        this.loader.load('https://raw.githubusercontent.com/Data-Bee38/models/main/space_discoverer.glb', (gltf) => {
            this.discover = gltf.scene;
            this.discover.traverse( (node) => {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.side = THREE.DoubleSide;
                }
            });
            this.discover.scale.set(1, 1, 1);
            this.discover.position.set(0, -1.5, 0);


        })
        this.loader.load('https://raw.githubusercontent.com/Data-Bee38/models/main/space_discoverer_wheel.glb', (gltf) => {
            this.discoverWheel = gltf.scene
            const box = new THREE.Box3().setFromObject(this.discoverWheel);
            const center = new THREE.Vector3();
            box.getCenter(center);
            this.discoverWheel.position.sub(center);
            this.discoverWheel.scale.set(1, 1, 1);
            this.discoverWheel.traverse( (node) => {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material.side = THREE.DoubleSide;
                }
            });
        })

        this.manager.onLoad = () => {
            console.log('complete')
            this.lightInit()
            this.particleInit()
            this.initWorld()
            this.chassisBodyInit()
            this.wheelBodyInit()
            this.groundInit()
            this.followCameraInit();
            this.animation()
        }
    }
    lightInit(){
        const light = new THREE.DirectionalLight(0xefefff, 1.5);
        light.position.set(1, 0, 1).normalize();
        this.scene.add(light);
        const light1 = new THREE.DirectionalLight(0xffefef, 1.5);
        light1.position.set(-1, 0, -1).normalize();
        this.scene.add(light1);
        const light2 = new THREE.DirectionalLight(0xdddddd);
        light2.position.set(3, 10, 4);
        light2.target.position.set(0, 0, 0);
        light2.castShadow = true;
        this.sun = light2;
        this.scene.add(light2);
    }
    initWorld(){
        this.world = new CANNON.World()
        this.debug = new CannonDebugger(this.scene, this.world);
        this.world.broadphase = new CANNON.SAPBroadphase(this.world);
        this.world.gravity.set(0,-9.8,0)
        this.world.defaultContactMaterial.friction = 0;
        this.groundMaterial = new CANNON.Material("groundMaterial");
        this.wheelMaterial = new CANNON.Material("wheelMaterial");
        this.wheelGroundContactMaterial = new CANNON.ContactMaterial(this.wheelMaterial, this.groundMaterial, {
            friction: 0.3,
            restitution: 0,
            contactEquationStiffness: 1000
        });
        this.world.addContactMaterial(this.wheelGroundContactMaterial);
        this.currentMaterial = solidMaterial
        this.handler = this.handler.bind(this)
        document.onkeydown = this.handler;
        document.onkeyup = this.handler;
    }
    particleInit(){
        let numParticles = 2000
        let width = 500
        let height = 100
        let depth = 500
        let parameters = {
            color: 0xffffff,
            // color: 0xcccccc,
            height: 100,
            radiusX: 2.5,
            radiusZ: 2.5,
            size: 100,
            scale: 0.25
        }
        // 创建 BufferGeometry
        const particlePositions = [];
        const particleColors = [];

        // 随机生成粒子的位置和颜色
        for (let i = 0; i < numParticles; i++) {
            const vertex = new THREE.Vector3(
                (Math.random() - 0.5) * width,
                Math.random() * height,
                (Math.random() - 0.5) * depth
            );
            particlePositions.push(vertex.x, vertex.y, vertex.z);
            // 设置粒子的颜色（这里可以设置不同的颜色变化）
            const color = new THREE.Color(parameters.color);
            particleColors.push(color.r, color.g, color.b);
        }

        // 创建 BufferGeometry 对象并添加顶点位置和颜色属性
        const systemGeometry = new THREE.BufferGeometry();
        systemGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlePositions, 3));
        systemGeometry.setAttribute('color', new THREE.Float32BufferAttribute(particleColors, 3));
        const systemMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(parameters.color) },
                height: {  value: parameters.height },
                elapsedTime: {  value: 0 },
                radiusX: {  value: parameters.radiusX },
                radiusZ: { value: parameters.radiusZ },
                size: {  value: parameters.size },
                scale: { value: parameters.scale }
            },
            vertexShader: `
            uniform float radiusX;
            uniform float radiusZ;
            uniform float size;
            uniform float scale;
            uniform float height;
            uniform float elapsedTime;

            void main() {
              vec3 pos = position;
              pos.x += cos((elapsedTime + position.z) * 0.25) * radiusX;
              pos.y = mod(pos.y - elapsedTime, height);
              pos.z += sin((elapsedTime + position.x) * 0.25) * radiusZ;

              vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );

              gl_PointSize = size * ( scale / length( mvPosition.xyz ) );

              gl_Position = projectionMatrix * mvPosition;
            }
          `,
            fragmentShader: `
            uniform vec3 color;

            void main() {
              gl_FragColor = vec4( color, 1.0 );
            }
          `
        })
        this.particleSystem = new THREE.Points(systemGeometry, systemMaterial)
        this.particleSystem.position.y = -height / 2;
        this.scene.add(this.particleSystem)
    }
    chassisBodyInit(){
        this.chassisShape = new CANNON.Box(new CANNON.Vec3(1.25, 1, 3));
        this.chassisBody = new CANNON.Body({ mass: 150 });
        this.chassisBody.addShape(this.chassisShape);
        this.chassisBody.position.set(0, 40, 0);
        this.chassisBody.angularVelocity.set(0, 0, 0);
        this.chassisBody.initPosition = new CANNON.Vec3(0, 40, 0);
        const Object3d = new THREE.Object3D()
        Object3d.add(this.discover)
        Object3d.castShadow = false;
        Object3d.receiveShadow = true;
        this.chassisBody.threemesh = Object3d;
        this.scene.add(Object3d);
    }
    wheelBodyInit(){
        const axlewidth = 2;
        const backwheel = -0.95;
        const frontwheel = 2.35;
        const wheelheight = -0.65;
        this.vehicle = new CANNON.RaycastVehicle({
            chassisBody: this.chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 1,
            indexForwardAxis: 2
        });

        options.chassisConnectionPointLocal = new CANNON.Vec3(axlewidth, wheelheight, backwheel);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-axlewidth, wheelheight, backwheel);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(axlewidth, wheelheight, frontwheel);
        this.vehicle.addWheel(options);

        options.chassisConnectionPointLocal.set(-axlewidth, wheelheight, frontwheel);
        this.vehicle.addWheel(options);

        this.vehicle.addToWorld(this.world);

        this.wheelBodies = [];

        this.vehicle.wheelInfos.forEach( (wheel, i) => {
            const radius = wheel.radius;
            const cylinderShape = new CANNON.Cylinder(radius, radius, radius / 2, 20);
            const wheelBody = new CANNON.Body({ mass: 1, material: this.wheelMaterial });
            const q = new CANNON.Quaternion();
            q.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), Math.PI / 2);
            wheelBody.addShape(cylinderShape, new CANNON.Vec3(), q);
            const Object3d = new THREE.Object3D()
            const model = this.discoverWheel.clone()
            Object3d.add(model)
            if (i == 1 || i == 3) model.rotateY(Math.PI);
            Object3d.castShadow = false;
            Object3d.receiveShadow = true;
            wheelBody.threemesh = Object3d
            this.scene.add(Object3d)
            this.wheelBodies.push(wheelBody)
            this.world.addBody(wheelBody)
        });


        this.vehicle.setBrake(5, 0);
        this.vehicle.setBrake(5, 1);
        this.vehicle.setBrake(5, 2);
        this.vehicle.setBrake(5, 3);
        this.vehicle.setSteeringValue(0, 2);
        this.vehicle.setSteeringValue(0, 3);
    }
    groundInit(){
        let image = new Image()
        image.crossOrigin = "anonymous";
        image.src = './texture/terrain1.png'
        image.onload = () => {
            const width = 128;
            const height = 128;
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d");
            let imgData, pixel, heightData;
            let matrix = []
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(image, 0, 0, width, height);
            imgData = ctx.getImageData(0, 0, width, height).data;
            for (let i = 0; i < height; i = (i + 1)) {
                matrix.push([]);
                for (let j = 0; j < width; j = (j + 1)) {
                    pixel = i * height + j;
                    heightData = (imgData[pixel * 4] / 255) * 80;
                    matrix[i].push(heightData);
                }
            }
            const terrainShape = new CANNON.Heightfield(matrix, {elementSize: 10});
            this.terrainBody = new CANNON.Body({mass: 0});
            this.terrainBody.addShape(terrainShape);
            this.terrainBody.position.set(-width * terrainShape.elementSize / 2, -10, width * terrainShape.elementSize / 2);
            this.terrainBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
            this.world.addBody(this.terrainBody);
            this.addVisual(this.terrainBody, 'landscape')
        }
    }
    followCameraInit(){
        this.cameraOffset = new THREE.Vector3(0, 5, -10);
        this.carPosition = new THREE.Vector3();  // 车辆的位置
        this.carRotation = new THREE.Quaternion();  // 车辆的旋转
        this.carPosition.copy(this.vehicle.chassisBody.position);
        this.carRotation.copy(this.vehicle.chassisBody.quaternion);
        // 计算相机的目标位置
        this.targetPosition = this.carPosition.clone().add(this.cameraOffset);
        // 更新相机的位置
        this.camera.position.copy(this.targetPosition);

        // 使相机朝向车辆
        this.camera.lookAt(this.carPosition);
        this.sun.target = this.vehicle.chassisBody.threemesh
    }
    handler(event){
        let up = (event.type == 'keyup'); // 是否是松开键盘

        if (!up && event.type !== 'keydown') {
            return;
        }

        // 清除所有刹车
        this.vehicle.setBrake(0, 0);
        this.vehicle.setBrake(0, 1);
        this.vehicle.setBrake(0, 2);
        this.vehicle.setBrake(0, 3);

        switch (event.keyCode) {
            case 38: // 上箭头 - 前进
                this.vehicle.applyEngineForce(up ? 0 : -this.maxForce, 2); // 2 代表后轮
                this.vehicle.applyEngineForce(up ? 0 : -this.maxForce, 3); // 3 代表后轮
                break;
            case 40: // 下箭头 - 后退
                this.vehicle.applyEngineForce(up ? 0 : this.maxForce, 2); // 2 代表后轮
                this.vehicle.applyEngineForce(up ? 0 : this.maxForce, 3); // 3 代表后轮
                break;
            case 66: // B 键 - 刹车
                this.vehicle.setBrake(this.brakeForce, 0); // 0, 1, 2, 3 代表四个轮子
                this.vehicle.setBrake(this.brakeForce, 1);
                this.vehicle.setBrake(this.brakeForce, 2);
                this.vehicle.setBrake(this.brakeForce, 3);
                break;
            case 39: // 右箭头 - 右转
                this.vehicle.setSteeringValue(up ? 0 : -this.maxSteerVal, 2); // 0 代表左前轮
                this.vehicle.setSteeringValue(up ? 0 : -this.maxSteerVal, 3); // 1 代表右前轮
                break;
            case 37: // 左箭头 - 左转
                this.vehicle.setSteeringValue(up ? 0 : this.maxSteerVal, 2); // 0 代表左前轮
                this.vehicle.setSteeringValue(up ? 0 : this.maxSteerVal, 3); // 1 代表右前轮
                break;
        }
    }
    updateWheel(){
        for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i);
            let t = this.vehicle.wheelInfos[i].worldTransform;
            this.wheelBodies[i].position.copy(t.position);
            this.wheelBodies[i].quaternion.copy(t.quaternion);
        }

        const upVector = new CANNON.Vec3(0, 1, 0);
        const vehicleUp = new CANNON.Vec3();
        this.chassisBody.quaternion.vmult(upVector, vehicleUp);

        if (vehicleUp.y < 0.05) {
            this.chassisBody.position.set(
                this.chassisBody.initPosition.x,
                this.chassisBody.initPosition.y,
                this.chassisBody.initPosition.z
            );
            this.chassisBody.velocity.set(0, 0, 0); // Stop velocity
            this.chassisBody.angularVelocity.set(0, 0, 0); // Stop rotation
            this.chassisBody.quaternion.set(0, 0, 0, 1); // Reset orientation
        }
    }
    updateBodies() {
        this.world.bodies.forEach( (body) => {
            if (body.threemesh != undefined) {
                body.threemesh.position.copy(body.position);
                body.threemesh.quaternion.copy(body.quaternion);
            }
        });
    }
    updateCamera() {
        // 获取车辆的位置和旋转
        this.carPosition.copy(this.vehicle.chassisBody.position);
        this.carRotation.copy(this.vehicle.chassisBody.quaternion);

        // 计算相机的目标位置
        let targetPosition = this.carPosition.clone().add(this.cameraOffset);

        // 平滑地过渡相机的位置
        this.camera.position.lerp(targetPosition, 0.1); // 0.1 是插值的系数

        // 平滑地过渡相机的朝向
        let targetRotation = new THREE.Quaternion().setFromEuler(
            new THREE.Euler(0, this.carRotation.y, 0) // 只跟随Y轴旋转
        );
        this.camera.quaternion.slerp(targetRotation, 0.1); // 使用球形插值平滑旋转

        // 使相机朝向车辆
        this.camera.lookAt(this.carPosition);

        this.sun.position.copy(this.camera.position);
        this.sun.position.y += 10;
    }
    updateCarPosition() {
        if(!this.chassisBody || !this.terrainBody) return
        let closestIntersection = null;
        const raycaster = new THREE.Raycaster(this.chassisBody.position, new THREE.Vector3(0, -1, 0));
        const intersects = raycaster.intersectObject(this.terrainBody.threemesh);
        if (intersects.length > 0) {
            if (!closestIntersection || intersects[0].distance < closestIntersection.distance) {
                closestIntersection = intersects[0];
            }
        }
        if (closestIntersection) {
            // Position the cube on top of the terrain
            this.chassisBody.position.y = closestIntersection.point.y + 0.5; // Offset slightly above terrain
        } else {
            // Default height if no intersection
            this.chassisBody.threemesh.position.y = 40;
        }
    }
    animation(){
        // 循环
        this.renderer.setAnimationLoop(() => this.animation())
        // 动画时间
        const elapsedTime = this.clock.getElapsedTime()
        // 更新粒子
        this.particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 1.5;


        this.controls.update();
        this.camera.updateProjectionMatrix()

        // 物理世界
        this.world.step(1 / 60);
        this.updateWheel()
        this.updateBodies()
        // this.updateCarPosition()
        this.updateCamera()
        // this.debug.update();


        // 渲染
        this.renderer.render(this.scene, this.camera)
    }
    addVisual(body, name, castShadow = false, receiveShadow = true){
        let mesh;
        if (body instanceof CANNON.Body) mesh = this.shape2Mesh(body, castShadow, receiveShadow);

        if (mesh) {
            body.threemesh = mesh;
            mesh.castShadow = castShadow;
            mesh.receiveShadow = receiveShadow;
            this.scene.add(mesh);
        }
    }
    shape2Mesh(body, castShadow, receiveShadow){
        const object3D = new THREE.Object3D();
        body.shapes.forEach((shape, index) => {
            let mesh;
            let geometry = new THREE.BufferGeometry();
            let vertices = [];
            let faces = [];
            let positions = [];
            let vertexColors = [];
            let v0 = new CANNON.Vec3();
            let v1 = new CANNON.Vec3();
            let v2 = new CANNON.Vec3();
            let reverse = true;
            let bbox;
            let size;
            let copyMaterial = this.currentMaterial.clone()
            copyMaterial.vertexColors = true
            switch (shape.type) {
                case CANNON.Shape.types.BOX:
                    mesh = new THREE.Mesh(new THREE.BoxGeometry(
                        shape.halfExtents.x * 2,
                        shape.halfExtents.y * 2,
                        shape.halfExtents.z * 2
                    ), this.currentMaterial);
                    break;
                case CANNON.Shape.types.CYLINDER:
                    shape.vertices.map(item => vertices.push(item.x, item.y, item.z))
                    shape.faces.forEach( (face) => {
                        const a = face[0];
                        for (let j = 1; j < face.length - 1; j++) {
                            const b = face[j];
                            const c = face[j + 1];
                            faces.push(a,b,c)
                        }
                    });
                    // 设置顶点位置
                    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices),3));
                    // 设置面索引
                    geometry.setIndex(faces);
                    geometry.computeBoundingSphere();
                    geometry.computeVertexNormals();
                    mesh = new THREE.Mesh(geometry, this.currentMaterial);
                    break;
                case CANNON.Shape.types.HEIGHTFIELD:
                    for (let xi = 0; xi < shape.data.length - 1; xi++) {
                        for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
                            for (let k = 0; k < 2; k++) {
                                shape.getConvexTrianglePillar(xi, yi, k === 0);
                                v0.copy(shape.pillarConvex.vertices[0]);
                                v1.copy(shape.pillarConvex.vertices[1]);
                                v2.copy(shape.pillarConvex.vertices[2]);
                                v0.vadd(shape.pillarOffset, v0);
                                v1.vadd(shape.pillarOffset, v1);
                                v2.vadd(shape.pillarOffset, v2);
                                // 将顶点数据存储到 vertices 数组中
                                vertices.push(v0.x, v0.y, v0.z);
                                vertices.push(v1.x, v1.y, v1.z);
                                vertices.push(v2.x, v2.y, v2.z);
                                // 创建面（索引三角形）
                                const i = vertices.length / 3 - 3;
                                faces.push(i, i + 1, i + 2);
                            }
                        }
                    }
                    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                    geometry.setIndex(faces);
                    geometry.computeBoundingSphere();
                    geometry.computeVertexNormals();
                    geometry.computeBoundingBox();
                    bbox = geometry.boundingBox;
                    size = new THREE.Vector3().subVectors(bbox.max, bbox.min);
                    positions = geometry.attributes.position.array;
                    for (let i = 0; i < positions.length; i += 9) { // 每个面由3个顶点，每个顶点由3个坐标值(x, y, z)
                        for (let j = 0; j < 3; j++) {  // 遍历每个面的3个顶点
                            // 获取当前顶点的 xyz 坐标
                            const x = positions[i + j * 3];
                            const y = positions[i + j * 3 + 1];
                            const z = positions[i + j * 3 + 2];

                            // 归一化位置，计算 z 轴上的位置
                            const normalizedAxis = new THREE.Vector3(x, y, z).sub(bbox.min).divide(size)['z'];

                            // 如果 reverse 为 true，则反转归一化值
                            let normalizedValue = reverse ? 1 - normalizedAxis : normalizedAxis;

                            // 遍历颜色区间，应用颜色插值
                            for (let c = 0; c < colors.length - 1; c++) {
                                const colorDiff = colors[c + 1].stop - colors[c].stop;

                                if (normalizedValue >= colors[c].stop && normalizedValue <= colors[c + 1].stop) {
                                    // 计算当前归一化值在颜色区间内的插值
                                    const localNormalizedValue = (normalizedValue - colors[c].stop) / colorDiff;
                                    const color = colors[c].color.clone().lerp(colors[c + 1].color, localNormalizedValue);

                                    // 存储颜色
                                    vertexColors.push(color.r, color.g, color.b);
                                    break;
                                }
                            }
                        }
                    }
                    // 设置 BufferGeometry 的颜色属性
                    geometry.setAttribute('color', new THREE.Float32BufferAttribute(vertexColors, 3));
                    mesh = new THREE.Mesh(geometry, copyMaterial);
                    break;
                default:
                    throw "Visual type not recognized: " + shape.type;
            }
            mesh.receiveShadow = receiveShadow;
            mesh.castShadow = castShadow;
            mesh.traverse( (child) => {
                if (child.isMesh) {
                    child.castShadow = castShadow;
                    child.receiveShadow = receiveShadow;
                }
            });
            let o = body.shapeOffsets[index];
            let q = body.shapeOrientations[index++];
            mesh.position.set(o.x, o.y, o.z);
            mesh.quaternion.set(q.x, q.y, q.z, q.w);
            object3D.add(mesh);
        })

        return object3D;
    }

    destroy(){}

}
