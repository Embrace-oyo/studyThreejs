/**
 * justThreeJs aboutHeroLines.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/28 15:20:14
 */

import * as THREE from "three";
// glsl
import vert$7 from '@/views/pages/lusion/glsl/about/vert$7.glsl'
import frag$a from '@/views/pages/lusion/glsl/about/frag$a.glsl'

function filePath(path) {
    return new URL(`../../../../../assets/${path}`, import.meta.url).href
}

let SEGMENT_COUNT = 3
let THREHSOLDS = [60, 245, 806, 966, 991, 1026, 1191, 1853, 2061, 3111, 4279, 4309, 4338, 5265, 5316, 5447, 5475, 6407, 6445, 7116, 7235, 7349, 7934, 8555, 8583, 8614, 9154, 9640, 9688, 10163, 10420, 10645, 10895, 11074, 11286, 11453, 11596, 11628, 11740, 11799, 11832]
let tempVec0 = new THREE.Vector3;

export default class AboutHeroLines {
    // 3D容器对象
    container = new THREE.Object3D;
    // 时间计数器
    time = 0;
    // 共享uniform变量
    shaderUniforms = {};

    constructor(base) {
        this.parent = base;
        this.base = base.base;
    }

    // 预初始化方法 - 加载线条模型数据
    preInit() {
        this.base.properties.loader.add(
            filePath("buf/terrain_lines.buf"),
            {
                onLoad: this._onLineLoad.bind(this) // 加载完成回调
            }
        );
    }

    // 线条模型加载完成回调
    _onLineLoad(bufferData) {
        // 获取原始顶点数据
        const positions = bufferData.attributes.position.array;
        const thresholdCount = THREHSOLDS.length; // 阈值数量
        const pointCount = positions.length / 3;  // 顶点数量

        // 创建缓冲区数据
        const vertices = new Float32Array(pointCount * SEGMENT_COUNT * 3); // 顶点坐标
        const normals = new Float32Array(pointCount * SEGMENT_COUNT * 3);  // 法线向量
        const tValues = new Float32Array(pointCount * SEGMENT_COUNT);      // t值(沿线条长度)
        const totalLengths = new Float32Array(pointCount * SEGMENT_COUNT); // 总长度
        const lineIds = new Uint8Array(pointCount * SEGMENT_COUNT);       // 线条ID
        const indices = new Uint16Array((pointCount - thresholdCount) * 6 * SEGMENT_COUNT); // 索引

        // 临时变量
        const tempVec1 = new THREE.Vector3();
        const tempVec2 = new THREE.Vector3();
        const tempVec3 = new THREE.Vector3();
        const tempVec4 = new THREE.Vector3();
        const tempVec5 = new THREE.Vector3();
        const tempVec6 = new THREE.Vector3();
        const tempQuat = new THREE.Quaternion();
        const tempNormal = new THREE.Vector3();

        let vertexIndex = 0;
        let indexOffset = 0;
        let tValueOffset = 0;

        // 处理每个阈值段
        for (let k = 0; k < THREHSOLDS.length; k++) {
            const segmentStart = k === 0 ? 0 : THREHSOLDS[k - 1];
            const segmentEnd = THREHSOLDS[k];

            // 初始化起点和方向
            tempVec3.fromArray(positions, segmentStart * 3);
            tempVec2.copy(tempVec3);
            tempVec5.set(0, 1, 0); // 初始法线

            let segmentLength = 0;

            // 处理段内每个点
            for (let pointIdx = segmentStart; pointIdx < segmentEnd; pointIdx++) {
                const pointOffset = pointIdx * 3;

                // 计算方向和法线
                tempVec1.copy(tempVec2);
                tempVec2.copy(tempVec3);

                if (pointIdx < segmentEnd - 1) {
                    tempVec3.fromArray(positions, pointOffset + 3);
                }

                tempVec4.subVectors(tempVec3, tempVec1).normalize(); // 方向向量
                tempVec6.crossVectors(tempVec5, tempVec4).normalize(); // 副法线

                // 创建旋转四元数
                tempQuat.setFromAxisAngle(tempVec4, Math.PI * 2 / SEGMENT_COUNT);
                tempNormal.copy(tempVec5);

                // 计算段长度
                segmentLength += tempVec0.copy(tempVec2).sub(tempVec1).length();

                // 生成环形顶点
                for (let segmentIdx = 0; segmentIdx < SEGMENT_COUNT; segmentIdx++) {
                    // 应用旋转
                    tempNormal.applyQuaternion(tempQuat);

                    // 设置顶点位置
                    vertices[vertexIndex + 0] = tempVec2.x;
                    vertices[vertexIndex + 1] = tempVec2.y;
                    vertices[vertexIndex + 2] = tempVec2.z;

                    // 设置法线
                    normals[vertexIndex + 0] = tempNormal.x;
                    normals[vertexIndex + 1] = tempNormal.y;
                    normals[vertexIndex + 2] = tempNormal.z;

                    // 设置t值和线ID
                    tValues[tValueOffset] = segmentLength;
                    lineIds[tValueOffset] = k;

                    // 生成三角形索引
                    if (pointIdx < segmentEnd - 1) {
                        const nextSegmentOffset = segmentIdx === SEGMENT_COUNT - 1
                            ? 1 - SEGMENT_COUNT
                            : 1;

                        indices[indexOffset++] = tValueOffset;
                        indices[indexOffset++] = tValueOffset + nextSegmentOffset;
                        indices[indexOffset++] = tValueOffset + SEGMENT_COUNT;

                        indices[indexOffset++] = tValueOffset + nextSegmentOffset;
                        indices[indexOffset++] = tValueOffset + SEGMENT_COUNT + nextSegmentOffset;
                        indices[indexOffset++] = tValueOffset + SEGMENT_COUNT;
                    }

                    tValueOffset++;
                    vertexIndex += 3;
                }
            }

            // 回填总长度
            const segmentVertexCount = SEGMENT_COUNT * (segmentEnd - segmentStart);
            tValueOffset -= segmentVertexCount;
            const segmentEndOffset = tValueOffset + segmentVertexCount;

            while (tValueOffset < segmentEndOffset) {
                totalLengths[tValueOffset] = segmentLength;
                tValueOffset++;
            }
        }

        // 创建几何体
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
        geometry.setAttribute("normal", new THREE.BufferAttribute(normals, 3));
        geometry.setAttribute("t", new THREE.BufferAttribute(tValues, 1));
        geometry.setAttribute("totalLength", new THREE.BufferAttribute(totalLengths, 1));
        geometry.setAttribute("lineId", new THREE.BufferAttribute(lineIds, 1));
        geometry.setIndex(new THREE.BufferAttribute(indices, 1));

        // 创建着色器材质
        const material = new THREE.ShaderMaterial({
            uniforms: Object.assign(
                {u_time: this.base.properties.shaderUniforms.u_time},
                this.parent.shaderUniforms
            ),
            vertexShader: vert$7,  // 顶点着色器
            fragmentShader: frag$a, // 片段着色器
            blending: THREE.CustomBlending,
            blendEquation: THREE.MaxEquation,
            blendSrc: THREE.OneFactor,
            blendDst: THREE.OneFactor,
            blendEquationAlpha: THREE.AddEquation,
            blendSrcAlpha: THREE.OneFactor,
            blendDstAlpha: THREE.OneFactor
        });

        // 启用导数扩展(用于某些着色器效果)
        material.extensions.derivatives = true;

        // 创建网格对象
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 15; // 设置渲染顺序
        this.container.add(this.mesh); // 添加到容器
    }

    // 初始化方法(空实现)
    init() {
    }

    // 更新方法(空实现)
    update(deltaTime) {
    }
}
