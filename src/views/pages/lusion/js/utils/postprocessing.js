/**
 * justThreeJs postprocessing.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 16:54:29
 */
import * as THREE from "three";
import MinSignal from '@/views/pages/lusion/js/utils/quickLoader/min-signal'

let _geom;
export default class Postprocessing {
    width = 1;
    height = 1;
    scene = null;
    camera = null;
    resolution = new THREE.Vector2(0, 0);
    texelSize = new THREE.Vector2(0, 0);
    aspect = new THREE.Vector2(1, 1);

    onBeforeSceneRendered = new MinSignal();
    onAfterSceneRendered = new MinSignal();
    onAfterRendered = new MinSignal();

    sceneRenderTarget = null;
    sceneFlatRenderTarget = null;
    sceneMsRenderTarget = null;
    fromRenderTarget = null;
    toRenderTarget = null;
    useDepthTexture = true;
    depthTexture = null;

    fromTexture = null;
    toTexture = null;
    sceneTexture = null;

    mesh = null;
    queue = [];
    shaderUniforms = {};

    geom = null;
    hasSizeChanged = true;

    constructor(base) {
        this.base = base;
    }

    init(options) {
        Object.assign(this, options);

        // 初始化几何体（全屏三角形）
        if (_geom) {
            this.geom = _geom;
        } else {
            this.geom = _geom = new THREE.BufferGeometry();
            this.geom.setAttribute(
                "position",
                new THREE.BufferAttribute(new Float32Array([
                    -1, -1, 0,
                    4, -1, 0,
                    -1, 4, 0
                ]), 3)
            );
            this.geom.setAttribute(
                "a_uvClamp",
                new THREE.BufferAttribute(new Float32Array([
                    0, 0, 1, 1, 0,
                    0, 1, 1, 0, 0,
                    1, 1, 0, 0, 1
                ]), 4)
            );
        }

        // 创建 RenderTargets
        this.sceneFlatRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);
        this.sceneFlatRenderTarget.depthBuffer = true;

        this.sceneMsRenderTarget = this.base.fboHelper.createMultisampleRenderTarget(1, 1);
        this.sceneMsRenderTarget.depthBuffer = true;

        this.fromRenderTarget = this.base.fboHelper.createRenderTarget(1, 1);
        this.toRenderTarget = this.fromRenderTarget.clone();

        // 是否使用 DepthTexture
        this.useDepthTexture = !!this.useDepthTexture &&
            this.base.fboHelper.renderer &&
            (this.base.fboHelper.renderer.capabilities.isWebGL2 ||
                this.base.fboHelper.renderer.extensions.get("WEBGL_depth_texture"));

        this.fromTexture = this.fromRenderTarget.texture;
        this.toTexture = this.toRenderTarget.texture;

        this.sceneRenderTarget = this.sceneMsRenderTarget;
        this.sceneTexture = this.sceneMsRenderTarget.texture;

        this.mesh = new THREE.Mesh();

        // 公用 uniform
        Object.assign(this.shaderUniforms, {
            u_sceneTexture: {value: this.sceneTexture},
            u_fromTexture: {value: null},
            u_toTexture: {value: null},
            u_sceneDepthTexture: {value: null},
            u_cameraNear: {value: 0},
            u_cameraFar: {value: 1},
            u_cameraFovRad: {value: 1},
            u_resolution: {value: this.resolution},
            u_texelSize: {value: this.texelSize},
            u_aspect: {value: this.aspect}
        });

        // 配置 DepthTexture
        if (this.useDepthTexture && this.base.fboHelper.renderer) {
            const depthTex = new THREE.DepthTexture(this.resolution.width, this.resolution.height);
            if (this.base.fboHelper.renderer.capabilities.isWebGL2) {
                depthTex.type = THREE.UnsignedIntType;
            } else {
                depthTex.format = THREE.DepthStencilFormat;
                depthTex.type = THREE.UnsignedInt248Type;
            }
            depthTex.minFilter = THREE.NearestFilter;
            depthTex.magFilter = THREE.NearestFilter;

            this.sceneFlatRenderTarget.depthTexture = depthTex;
            this.sceneMsRenderTarget.depthTexture = depthTex;
            this.depthTexture = this.shaderUniforms.u_sceneDepthTexture.value = depthTex;
        }
    }

    swap() {
        const temp = this.fromRenderTarget;
        this.fromRenderTarget = this.toRenderTarget;
        this.toRenderTarget = temp;

        this.fromTexture = this.fromRenderTarget.texture;
        this.toTexture = this.toRenderTarget.texture;

        this.shaderUniforms.u_fromTexture.value = this.fromTexture;
        this.shaderUniforms.u_toTexture.value = this.toTexture;
    }

    setSize(width, height) {
        if (this.width !== width || this.height !== height) {
            this.hasSizeChanged = true;

            this.width = width;
            this.height = height;

            this.resolution.set(width, height);
            this.texelSize.set(1 / width, 1 / height);

            const aspectRatio = height / Math.sqrt(width * width + height * height) * 2;
            this.aspect.set((width / height) * aspectRatio, aspectRatio);

            this.sceneFlatRenderTarget.setSize(width, height);
            this.sceneMsRenderTarget.setSize(width, height);
            this.fromRenderTarget.setSize(width, height);
            this.toRenderTarget.setSize(width, height);
        }
    }

    dispose() {
        this.fromRenderTarget?.dispose();
        this.toRenderTarget?.dispose();
        this.sceneMsRenderTarget?.dispose();
        this.sceneFlatRenderTarget?.dispose();
    }

    _filterQueue(item) {
        return item.enabled && item.needsRender();
    }

    renderMaterial(material, target) {
        this.mesh.material = material;
        this.base.fboHelper.renderMesh(this.mesh, target);
    }

    checkSceneRt() {
        this.sceneRenderTarget = this.base.properties.isSmaaEnabled
            ? this.sceneFlatRenderTarget
            : this.sceneMsRenderTarget;

        this.sceneTexture = this.sceneRenderTarget.texture;
        this.shaderUniforms.u_sceneTexture.value = this.sceneTexture;
    }

    render(scene, camera, finalPass = false) {
        if (!this.base.fboHelper.renderer) return;

        this.scene = scene;
        this.camera = camera;
        this.mesh.geometry = this.geom;

        const passes = this.queue.filter(this._filterQueue);
        const uniforms = this.shaderUniforms;
        passes.sort((a, b) => a.renderOrder - b.renderOrder);

        this.checkSceneRt();

        uniforms.u_cameraNear.value = camera.near;
        uniforms.u_cameraFar.value = camera.far;
        uniforms.u_cameraFovRad.value = (camera.fov / 180) * Math.PI;

        this.onBeforeSceneRendered.dispatch();

        if (passes.length) {
            this.base.fboHelper.renderer.setRenderTarget(this.sceneRenderTarget);
            this.base.fboHelper.renderer.render(scene, camera);
            this.base.fboHelper.renderer.setRenderTarget(null);

            this.base.fboHelper.copy(this.sceneRenderTarget.texture, this.fromRenderTarget);

            this.onAfterSceneRendered.dispatch(this.sceneRenderTarget);

            const colorState = this.base.fboHelper.getColorState();
            this.base.fboHelper.renderer.autoClear = false;

            for (let i = 0; i < passes.length; i++) {
                const isFinal = (i === passes.length - 1) && finalPass;
                const pass = passes[i];
                pass.setPostprocessing(this);
                pass.render(this, isFinal);
            }

            this.base.fboHelper.setColorState(colorState);
        } else {
            this.base.fboHelper.renderer.render(scene, camera);
            this.onAfterSceneRendered.dispatch();
        }

        this.onAfterRendered.dispatch();
        this.hasSizeChanged = false;
    }
}

