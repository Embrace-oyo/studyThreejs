/**
 * justThreeJs trail.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/14 14:47:25
 */
import {
    Scene,
    PlaneGeometry,
    Mesh,
    OrthographicCamera,
    ShaderMaterial,
    Vector2,
    WebGLRenderTarget,
    RGBAFormat,
    FloatType,
    HalfFloatType,
    MeshBasicMaterial
} from 'three';
import gsap from 'gsap';
import {damp, clamp, norm} from "@/views/pages/oil/js/math.js";

// glsl
import trailVertex from '@/views/pages/oil/glsl/trail/vertex.glsl'
import trailFragment from '@/views/pages/oil/glsl/trail/fragment.glsl'

export default class TrailBuffer {
    constructor(base) {
        this.base = base;
        this.renderer = this.base.renderer;
        this.width = this.base.planeWidth;
        this.height = this.base.planeHeight;

        this.isTouchCapable = 'ontouchstart' in window;
        this.isAvailable = this.isAvailable();

        this.maxRadius = 19;
        this.radiusScale = 1.2;

        this.mouse = new Vector2(0.5, 0.5);
        this.smoothedMouse = new Vector2(0.5, 0.5);
        this.mouseSmoothRatio = 0.25;

        this.scene = new Scene();
        this.bufferScene = new Scene();

        this.camera = new OrthographicCamera(
            this.width / -2,
            this.width / 2,
            this.height / 2,
            this.height / -2,
            -10000,
            10000
        );

        this.camera.position.z = 100;

        //important as we need precise coordinates (not ints)
        const type = this.renderer.getContext().getExtension('OES_texture_float')
            ? FloatType
            : HalfFloatType;

        const options = {
            format: RGBAFormat,
            type
        };

        this.renderTargetA = new WebGLRenderTarget(
            this.width,
            this.height,
            options
        );
        this.renderTargetB = new WebGLRenderTarget(
            this.width,
            this.height,
            options
        );


        this.scene.add(this.createQuad());
        this.bindEvents();
        this.initGUI();
    }

    initGUI() {
        this.settings = {
            strength: this.bufferMaterial.uniforms.uStrength.value,
            length: this.bufferMaterial.uniforms.uLength.value
        };

        const update = () => {
            this.bufferMaterial.uniforms.uStrength.value = this.settings.strength;
            this.bufferMaterial.uniforms.uLength.value = this.settings.length;
        };
        const folder = this.base.gui.addFolder('Trail');

        folder
            .add(this, 'radiusScale', 0.5, 2.0)
            .onChange(update)
            .name('radius')
            .step(0.01);
        folder.add(this.settings, 'strength', 0.1, 2.0).onChange(update);
        folder.add(this.settings, 'length', 0.001, 0.1).onChange(update);

        folder.close();

        // Update if settings are provided by localStorage
        update();
    }

    createQuad() {
        const plane = new PlaneGeometry(this.width, this.height);
        // Pass renderTargetA to shader
        this.bufferMaterial = new ShaderMaterial({
            uniforms: {
                uMousePosition: {
                    value: this.smoothedMouse
                },
                bufferTrail: {
                    value: this.renderTargetA.texture
                },
                uRadius: {
                    value: 0.1
                },
                uStrength: {
                    value: 1.6
                },
                uLength: {
                    value: 0.02
                },
                uAspect: {
                    // this is the size of the texture
                    value: this.width / this.height
                }
            },
            vertexShader: trailVertex,
            fragmentShader: trailFragment
        });

        this.renderMaterial = new MeshBasicMaterial({
            map: this.renderTargetB.texture
        });

        const bufferQuad = new Mesh(plane, this.bufferMaterial);
        this.bufferScene.add(bufferQuad);

        const quad = new Mesh(plane, this.renderMaterial);

        return quad;
    }

    render() {
        this.renderer.setRenderTarget(this.renderTargetB);
        this.renderer.clear();
        this.renderer.render(this.bufferScene, this.camera);

        // Here i swap the frame buffer
        // AKA "Ping-Pong FBO"
        [this.renderTargetA, this.renderTargetB] = [
            this.renderTargetB,
            this.renderTargetA
        ];

        this.renderMaterial.map = this.renderTargetB.texture;
        this.bufferMaterial.uniforms.bufferTrail.value = this.renderTargetA.texture;
    }

    update() {
       /* if (!this.isAvailable) {
            return;
        }*/

        this.render();
        this.updateMouse();

        this.bufferMaterial.uniforms.uLength.value = this.settings.length;
    }

    updateMouse() {
        this.smoothedMouse.set(
            damp(this.smoothedMouse.x, this.mouse.x, this.mouseSmoothRatio),
            damp(this.smoothedMouse.y, this.mouse.y, this.mouseSmoothRatio)
        );

        const deltaMouse = clamp(this.mouse.distanceTo(this.smoothedMouse), 0.0, 1.0) * 100;

        // const normDeltaMouse = norm(deltaMouse, 0.0, this.maxRadius);
        // const easeDeltaMouse = Circ.easeOut.getRatio(normDeltaMouse);
        const normDeltaMouse = norm(deltaMouse, 0.0, this.maxRadius);
        const easeDeltaMouse = gsap.parseEase("circ.out")(normDeltaMouse);

        this.bufferMaterial.uniforms.uRadius.value =
            damp(0, 0.25, easeDeltaMouse) * this.radiusScale;

        // Strength
        this.bufferMaterial.uniforms.uStrength.value = this.getStrength(
            easeDeltaMouse
        );
    }

    getStrength(deltaMouse) {
        const maxStrength = this.settings.strength;
        const minStrength = maxStrength - 0.4;

        const strength = damp(minStrength, maxStrength, deltaMouse);

        return strength;
    }

    bindEvents() {
        if (this.isTouchCapable) {
            window.addEventListener('touchstart', e => this.onMouseMove(e), false);
            window.addEventListener('touchmove', e => this.onMouseMove(e), false);
        } else {
            window.addEventListener('mousemove', e => this.onMouseMove(e), false);
        }
    }

    isAvailable() {
        const gl = this.renderer.getContext();

        if (!gl.getExtension('OES_texture_float')) {
            return false;
        }

        if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) === 0) {
            return false;
        }

        return true;
    }

    onMouseMove(e) {
        let x;
        let y;

        if (e.changedTouches && e.changedTouches.length) {
            x = e.changedTouches[0].clientX;
            y = e.changedTouches[0].clientY;
        }
        if (x === undefined) {
            x = e.clientX;
            y = e.clientY;
        }

        // world is larger than screen
        // crop mouse to stay into screen space
        const mouseX = x - (window.innerWidth - this.width) * 0.5;
        const mouseY = y - (window.innerHeight - this.height) * 0.5;

        this.mouse.x = mouseX / this.width;
        this.mouse.y = -(mouseY / this.height) + 1;
    }
}
