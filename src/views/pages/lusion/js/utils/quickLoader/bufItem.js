/**
 * justThreeJs bufItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 10:33:33
 */
import * as THREE from "three";
import XHRItem from "../quickLoader/xhrItem.js";

export default class BufItem extends XHRItem {
    static type = 'buf'
    static extensions = ['buf']
    static responseType = "arraybuffer";

    constructor(url, options, quickLoader) {
        super(url, {...options, responseType: "arraybuffer"}, quickLoader);
    }

    retrieve() {
        return false;
    }

    _onLoad() {
        if (!this.content) {
            const buffer = this.xmlhttp.response;

            // 解析头部 JSON 元信息
            const jsonLength = new Uint32Array(buffer, 0, 1)[0];
            const jsonString = String.fromCharCode.apply(null, new Uint8Array(buffer, 4, jsonLength));
            const meta = JSON.parse(jsonString);

            const vertexCount = meta.vertexCount;
            const indexCount = meta.indexCount;

            let offset = 4 + jsonLength;
            const geometry = new THREE.BufferGeometry();
            const attributes = meta.attributes;

            const attributeOffsets = {};
            let hasNormals = false;

            for (const attr of attributes) {
                const {
                    id,
                    componentSize,
                    storageType,
                    needsPack,
                    packedComponents
                } = attr;

                const count = id === "indices" ? indexCount : vertexCount;
                const TypedArray = window[storageType];
                const byteStride = TypedArray.BYTES_PER_ELEMENT;

                const rawData = new TypedArray(buffer, offset, count * componentSize);
                let data;

                if (needsPack) {
                    const numComponents = packedComponents.length;
                    const isSigned = storageType.startsWith("Int");
                    const maxVal = 1 << (byteStride * 8);
                    const offsetVal = isSigned ? maxVal * 0.5 : 0;
                    const normalizeFactor = 1 / maxVal;

                    data = new Float32Array(count * componentSize);
                    let dstIndex = 0;

                    for (let i = 0; i < count; i++) {
                        for (let j = 0; j < numComponents; j++) {
                            const {delta, from} = packedComponents[j];
                            data[dstIndex] = (rawData[dstIndex] + offsetVal) * normalizeFactor * delta + from;
                            dstIndex++;
                        }
                    }
                } else {
                    data = rawData;
                }

                if (id === "normal") hasNormals = true;
                if (id === "indices") {
                    geometry.setIndex(new THREE.BufferAttribute(data, 1));
                } else {
                    geometry.setAttribute(id, new THREE.BufferAttribute(data, componentSize));
                    attributeOffsets[id] = offset;
                }

                offset += count * componentSize * byteStride;
                if (id === "indices") attributeOffsets.indices = offset - count * componentSize * byteStride;
            }

            // 创建场景结构
            const meshType = meta.meshType;
            const scene = new THREE.Object3D();
            const subMeshList = [];
            const nodeMap = [];

            if (meta.sceneData) {
                const {sceneData} = meta;

                const mode =
                    meshType === "Mesh" ? 3 :
                        meshType === "LineSegments" ? 2 : 1;

                for (let i = 0; i < sceneData.length; i++) {
                    const node = sceneData[i];
                    let object;

                    if (node.vertexCount === 0) {
                        object = new THREE.Object3D();
                    } else {
                        const subGeometry = new THREE.BufferGeometry();
                        const baseIndex = geometry.index.array;
                        const IndexArray = baseIndex.constructor;
                        const indexStride = IndexArray.BYTES_PER_ELEMENT;

                        subGeometry.setIndex(new THREE.BufferAttribute(
                            new IndexArray(
                                baseIndex.buffer,
                                node.faceIndex * mode * indexStride + (attributeOffsets.indices || 0),
                                node.faceCount * mode
                            ),
                            geometry.index.itemSize
                        ));

                        // 修正 index 偏移
                        for (let j = 0; j < subGeometry.index.array.length; j++) {
                            subGeometry.index.array[j] -= node.vertexIndex;
                        }

                        for (const key in geometry.attributes) {
                            const attr = geometry.attributes[key];
                            const TypedArray = attr.array.constructor;
                            const attrStride = TypedArray.BYTES_PER_ELEMENT;

                            subGeometry.setAttribute(key, new THREE.BufferAttribute(
                                new TypedArray(
                                    attr.array.buffer,
                                    node.vertexIndex * attr.itemSize * attrStride + (attributeOffsets[key] || 0),
                                    node.vertexCount * attr.itemSize
                                ),
                                attr.itemSize
                            ));
                        }

                        // 创建渲染对象
                        if (meshType === "Mesh") {
                            object = new THREE.Mesh(
                                subGeometry,
                                new THREE.MeshNormalMaterial({flatShading: !hasNormals})
                            );
                        } else if (meshType === "LineSegments") {
                            object = new THREE.LineSegments(subGeometry, new THREE.LineBasicMaterial());
                        } else {
                            object = new THREE.Points(subGeometry, new THREE.PointsMaterial({
                                size: 2,
                                sizeAttenuation: false
                            }));
                        }

                        subMeshList.push(object);
                    }

                    // 设置 transform 与用户数据
                    object.position.fromArray(node.position);
                    object.quaternion.fromArray(node.quaternion);
                    object.scale.fromArray(node.scale);
                    object.name = node.name;
                    object.userData.material = node.material;

                    node.parentIndex > -1
                        ? nodeMap[node.parentIndex].add(object)
                        : scene.add(object);

                    nodeMap[i] = object;
                }

                geometry.userData.meshList = subMeshList;
                geometry.userData.sceneObject = scene;
            }

            this.content = geometry;
        }

        this.xmlhttp = undefined;
        super._onLoad(this);
    }
}

