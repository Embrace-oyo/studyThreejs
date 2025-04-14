/**
 * justThreeJs index.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/12 11:06:23
 */
import * as THREE from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {DRACOLoader, KTX2Loader, GLTFLoader} from "three-stdlib";
import BasRelief from "@/views/pages/plaster/js/basRelief.js";

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
        this.renderer.toneMapping = THREE.LinearToneMapping;
        this.target.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf7f7f7);
        this.camera = new THREE.PerspectiveCamera(75, this.aspect, 0.01, 10000);
        this.camera.position.copy(new THREE.Vector3(0, 0, 10))
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

    async assetsInit() {
        this.manager = new THREE.LoadingManager();
        this.ktx2Loader = (new KTX2Loader(this.manager)).setTranscoderPath('/basis/').detectSupport(this.renderer);
        this.textureLoader = new THREE.TextureLoader(this.manager);
        this.dracoLoader = (new DRACOLoader()).setDecoderPath('/draco/gltf/');
        this.glbLoader = new GLTFLoader(this.manager);
        this.glbLoader.setDRACOLoader(this.dracoLoader);
        this.maskNoise = this.textureLoader.load(filePath('img/mask-noise.png'));
        this.plasterTexture = this.textureLoader.load(filePath('img/plaster.jpg'));
        this.glbLoader.load(filePath('glb/reliefs_high_compressed.glb'), (model) => this.reliefsModel = model.scene)
        this.attenuation = this.textureLoader.load(filePath('img/rgb-attenuation-0,9.png'));
        // this.normal05 = this.ktx2Loader.load(filePath('ktx/normal_05.ktx2'));
        // this.normal06 = this.ktx2Loader.load(filePath('ktx/normal_06.ktx2'));
        // this.rocksNormal = this.ktx2Loader.load(filePath('ktx/rocks_normal.ktx2'));
        this.maskNoise2 = this.textureLoader.load(filePath('img/rgb-noise.jpg'));
        this.manager.onLoad = () => {
            this.callback();
            this.basRelief = new BasRelief(this);
            this.animation();
            this.resize();
        }
    }

    bufferToGeometry (buffer) {
        // 解析二进制文件头
        const headerView = new Uint32Array(buffer, 0, 1);
        const headerLength = headerView[0];

        // 解析JSON元数据
        const jsonData = JSON.parse(
            String.fromCharCode.apply(
                null,
                new Uint8Array(buffer, 4, headerLength)
            )
        );

        // 初始化几何体
        const geometry = new THREE.BufferGeometry();
        const vertexCount = jsonData.vertexCount;
        const indexCount = jsonData.indexCount;
        let dataOffset = 4 + headerLength;  // 数据起始偏移量
        const attributeOffsets = {};        // 记录各属性的原始偏移量
        let hasNormalAttribute = false;

        // 处理顶点属性
        for (let attributeIndex = 0; attributeIndex < jsonData.attributes.length; attributeIndex++) {
            const attributeInfo = jsonData.attributes[attributeIndex];
            const attributeName = attributeInfo.id;

            // 计算数据长度
            const elementCount = (attributeName === "indices") ? indexCount : vertexCount;
            const componentSize = attributeInfo.componentSize;

            // 创建对应类型的ArrayBuffer视图
            const TypedArray = window[attributeInfo.storageType];
            const rawData = new TypedArray(buffer, dataOffset, elementCount * componentSize);
            const elementBytes = TypedArray.BYTES_PER_ELEMENT;

            let processedData;

            // 处理需要解包的属性（如压缩的UV/颜色等）
            if (attributeInfo.needsPack) {
                processedData = new Float32Array(elementCount * componentSize);
                const packConfig = attributeInfo.packedComponents;
                const componentsCount = packConfig.length;
                const isIntegerType = attributeInfo.storageType.includes("Int");
                const maxValue = 1 << (elementBytes * 8);
                const halfRange = isIntegerType ? maxValue / 2 : 0;
                const normalizeFactor = 1 / maxValue;

                // 解包处理
                for (let i = 0, ptr = 0; i < elementCount; i++) {
                    for (let comp = 0; comp < componentsCount; comp++) {
                        const {delta, from} = packConfig[comp];
                        processedData[ptr] = (rawData[ptr] + halfRange) * normalizeFactor * delta + from;
                        ptr++;
                    }
                }
            } else {
                // 记录原始二进制偏移量
                attributeOffsets[attributeName] = dataOffset;
                processedData = rawData;
            }

            // 设置几何体属性
            if (attributeName === "indices") {
                geometry.setIndex(new THREE.BufferAttribute(processedData, 1));
            } else {
                geometry.setAttribute(
                    attributeName,
                    new THREE.BufferAttribute(processedData, componentSize)
                );
                if (attributeName === "normal") hasNormalAttribute = true;
            }

            dataOffset += elementCount * componentSize * elementBytes;
        }

        // 处理场景层级数据
        const meshes = [];
        if (jsonData.sceneData) {
            const sceneRoot = new THREE.Object3D();
            const meshType = jsonData.meshType;
            const drawModeMultiplier =
                meshType === "Mesh" ? 3 :       // 三角形网格
                    meshType === "LineSegments" ? 2 : // 线段
                        1;                              // 点

            // 遍历场景节点
            for (let nodeIndex = 0; nodeIndex < jsonData.sceneData.length; nodeIndex++) {
                const nodeData = jsonData.sceneData[nodeIndex];
                let meshObject;

                if (nodeData.vertexCount > 0) {
                    // 创建子几何体
                    const subGeometry = new THREE.BufferGeometry();

                    // 处理索引缓冲区
                    const baseIndexAttr = geometry.index;
                    const baseIndexArray = baseIndexAttr.array;
                    const IndexArrayType = baseIndexArray.constructor;
                    const indexBytes = IndexArrayType.BYTES_PER_ELEMENT;

                    subGeometry.setIndex(new THREE.BufferAttribute(
                        new IndexArrayType(
                            baseIndexArray.buffer,
                            nodeData.faceIndex * baseIndexAttr.itemSize * indexBytes * drawModeMultiplier + (attributeOffsets.indices || 0),
                            nodeData.faceCount * baseIndexAttr.itemSize * drawModeMultiplier
                        ),
                        baseIndexAttr.itemSize
                    ));

                    // 调整索引偏移
                    const indexArray = subGeometry.index.array;
                    for (let i = 0; i < indexArray.length; i++) {
                        indexArray[i] -= nodeData.vertexIndex;
                    }

                    // 处理顶点属性
                    for (const attrName in geometry.attributes) {
                        const baseAttr = geometry.attributes[attrName];
                        const baseArray = baseAttr.array;
                        const ArrayType = baseArray.constructor;
                        const attrBytes = ArrayType.BYTES_PER_ELEMENT;

                        subGeometry.setAttribute(
                            attrName,
                            new THREE.BufferAttribute(
                                new ArrayType(
                                    baseArray.buffer,
                                    nodeData.vertexIndex * baseAttr.itemSize * attrBytes + (attributeOffsets[attrName] || 0),
                                    nodeData.vertexCount * baseAttr.itemSize
                                ),
                                baseAttr.itemSize
                            )
                        );
                    }

                    // 创建对应类型的网格对象
                    switch (meshType) {
                        case "Mesh":
                            meshObject = new THREE.Mesh(
                                subGeometry,
                                new THREE.MeshNormalMaterial({flatShading: !hasNormalAttribute})
                            );
                            break;
                        case "LineSegments":
                            meshObject = new THREE.LineSegments(subGeometry, new THREE.LineBasicMaterial());
                            break;
                        default:
                            meshObject = new THREE.Points(
                                subGeometry,
                                new THREE.PointsMaterial({
                                    sizeAttenuation: false,
                                    size: 2
                                })
                            );
                    }
                    meshes.push(meshObject);
                } else {
                    meshObject = new THREE.Object3D();
                }

                // 构建场景层级
                if (nodeData.parentIndex > -1) {
                    meshes[nodeData.parentIndex].add(meshObject);
                } else {
                    sceneRoot.add(meshObject);
                }

                // 设置变换
                meshObject.position.fromArray(nodeData.position);
                meshObject.quaternion.fromArray(nodeData.quaternion);
                meshObject.scale.fromArray(nodeData.scale);
                meshObject.name = nodeData.name;
                meshObject.userData.material = nodeData.material;
                meshes[nodeIndex] = meshObject;
            }

            // 附加场景信息
            geometry.userData.meshList = meshes;
            geometry.userData.sceneObject = sceneRoot;
        }

        return geometry;
    }

    animation() {
        this.renderer.setAnimationLoop(() => this.animation());
        this.controls.update();
        this.basRelief.update(this.clock.getDelta(), this.clock.getElapsedTime())
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
