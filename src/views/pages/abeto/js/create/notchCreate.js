/**
 * justThreeJs notchCreate.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/1 14:27:49
 */
import * as THREE from "three";

//glsl
import vertex from '@/views/pages/abeto/glsl/notch/vertex.glsl'
import fragment from '@/views/pages/abeto/glsl/notch/fragment.glsl'

THREE.PerspectiveCamera.prototype.getViewSize = function (distance, out = new THREE.Vector2()) {
    const fovInRad = this.fov * Math.PI / 180;
    const height = 2 * Math.tan(fovInRad / 2) * distance;
    const width = height * this.aspect;
    out.set(width, height);
    return out;
};

const boundingSphere = new THREE.Sphere();
const boundingBox = new THREE.Box3();
let EventType, PerformanceMode;
// Event enums
EventType = {
    TOUCH_START: 1,
    TOUCH_MOVE: 2,
    TOUCH_END: 3,
    CLICK: 4
};

PerformanceMode = {
    BOUNDING_SPHERE: 1,
    BOUNDING_BOX: 2
};

class MeshInteractor {
    constructor(base, {
        meshes = [],
        camera = null,
        onHover = null,
        onTouch = null,
        onMove = null,
        onDrag = null,
        onClick = null,
        ctx = null,
        performant = false,
        performantMode = "bounding_sphere",
        finger = 0,
        interactWhileTouching = false,
        hoverCursor = false,
        grabCursor = false
    } = {}) {
        if (!camera) throw new Error("mesh interaction needs a camera");
        this.base = base;
        this._meshes = Array.isArray(meshes) ? meshes : [meshes];
        this._camera = camera;

        this._onHover = onHover;
        this._onTouch = onTouch;
        this._onMove = onMove;
        this._onDrag = onDrag;
        this._onClick = onClick;

        this._ctx = ctx;
        this._performant = performant;
        this._performantMode = PerformanceMode[performantMode.toUpperCase()];
        this._finger = finger;

        this._eventsID = this._finger === 0 ? "touch" : `touch${this._finger + 1}`;
        this._interactWhileTouching = interactWhileTouching;

        this._touchPressed = false;
        this._hoverCursor = hoverCursor;
        this._grabCursor = grabCursor && !hoverCursor;

        this._raycaster = new THREE.Raycaster();
        this._enabled = false;

        this.hovering = false;
        this.hoveringElement = -1;
        this.hoveringInstance = -1;

        this.touching = false;
        this.touchingElement = -1;
        this.touchingInstance = -1;

        this.dragging = false;
    }

    _castRay(input, eventType) {
        this._raycaster.setFromCamera(input.position11, this._camera);

        if (!this._performant) {
            const hits = this._raycaster.intersectObjects(this._meshes, false);
            this._checkIntersections(eventType, hits);
            return;
        }

        const hits = [];
        const isSphere = this._performantMode === PerformanceMode.BOUNDING_SPHERE;

        const shape = isSphere ? boundingSphere : boundingBox;
        const shapeType = isSphere ? "Sphere" : "Box";
        const shapeProp = `bounding${shapeType}`;
        const computeMethod = `computeBounding${shapeType}`;
        const intersectMethod = `intersects${shapeType}`;

        for (const mesh of this._meshes) {
            if (!mesh.isMesh && !mesh.isSpecialCaseemptyMesh) continue;
            if (!mesh.layers.test(this._raycaster.layers)) continue;

            const boundSource = mesh[shapeProp] !== undefined ? mesh : mesh.geometry;
            if (boundSource[shapeProp] == null) boundSource[computeMethod]();

            if (this._raycaster.ray[intersectMethod](shape.copy(boundSource[shapeProp]).applyMatrix4(mesh.matrixWorld))) {
                hits.push({object: mesh});
            }
        }

        this._checkIntersections(eventType, hits);
    }

    _performHover(hits = [], type = "hover_out", index = null, instance = -1) {
        this.hovering = type === "hover_in";
        this.hoveringElement = index;
        this.hoveringInstance = instance;

        this._callBack(this._onHover, type, hits);

        if (this._hoverCursor) {
            this.base.base.target.style.cursor = this.hovering ? "pointer" : "";
        }

        if (this._grabCursor && !this.dragging) {
            this.base.base.target.style.cursor = this.hovering ? "grab" : "";
        }
    }

    _performTouch(hits = [], type = "touch_end", index = null, instance = -1) {
        this.touching = type === "touch_start";
        this.touchingElement = index;
        this.touchingInstance = instance;

        this._callBack(this._onTouch, type, hits);

        if (this._grabCursor) {
            const fallback = this.hovering ? "grab" : "";
            this.base.base.target.style.cursor = this.touching ? "grabbing" : fallback;
        }
    }

    _checkIntersections(eventType, hits) {
        const isTouching = eventType === EventType.TOUCH_START || eventType === EventType.TOUCH_MOVE;
        const isClick = eventType === EventType.CLICK;

        if (hits.length > 0) {
            const mesh = hits[0].object;
            const meshIndex = this._meshes.indexOf(mesh);
            const instanceId = typeof hits[0].instanceId === "number" ? hits[0].instanceId : -1;

            if (isTouching) {
                if (this.hovering && (this.hoveringElement !== meshIndex || this.hoveringInstance !== instanceId)) {
                    this._performHover(); // hover_out
                }

                if (!this.hovering && (this._interactWhileTouching || !this._touchPressed)) {
                    this._performHover(hits, "hover_in", meshIndex, instanceId);
                }

                if (eventType === EventType.TOUCH_START) {
                    if (this.touching && (this.touchingElement !== meshIndex || this.touchingInstance !== instanceId)) {
                        this._performTouch();
                    }

                    if (!this.touching && (this._interactWhileTouching || !this._touchPressed)) {
                        this._performTouch(hits, "touch_start", meshIndex, instanceId);
                        this.dragging = true;
                    }
                } else {
                    this._callBack(this._onMove, "move", hits);
                }
            } else if (isClick) {
                this._callBack(this._onClick, "click", hits);
            }
        } else {
            if (this.hovering) this._performHover();
        }

        if (eventType === EventType.TOUCH_END) {
            if (this.hovering && this.base.base.inputManager.get(this._finger).currentInput === "touch") {
                this._performHover();
            }
            if (this.touching) this._performTouch();
            this.dragging = false;
        }

        if (eventType === EventType.TOUCH_MOVE && this.dragging) {
            this._callBack(this._onDrag, "drag", hits);
        }
    }

    _callBack(fn, type, hits) {
        if (!fn) return;
        fn.call(this._ctx, {
            action: type,
            finger: this._finger,
            interactions: hits,
            event: this.base.base.inputManager.get(this._finger)
        });
    }

    _onTouchStart(e) {
        this._castRay(e, EventType.TOUCH_START);
        this._touchPressed = true;
    }

    _onTouchMove(e) {
        this._castRay(e, EventType.TOUCH_MOVE);
    }

    _onTouchEnd(e) {
        this._touchPressed = false;
        this._castRay(e, EventType.TOUCH_END);
    }

    _onTouchClick(e) {
        this._castRay(e, EventType.CLICK);
    }

    enable() {
        if (this._enabled) return;
        this._enabled = true;

        if (this._onTouch || this._onHover || this._onDrag) {
            this.base.base.eventManage.on(`${this._eventsID}_start`, this._onTouchStart.bind(this));
            this.base.base.eventManage.on(`${this._eventsID}_end`, this._onTouchEnd.bind(this));
        }

        if (this._onHover || this._onMove || this._onDrag) {
            this.base.base.eventManage.on(`${this._eventsID}_move`, this._onTouchMove.bind(this));
        }

        if (this._onClick) {
            this.base.base.eventManage.on(`${this._eventsID}_click`, this._onTouchClick.bind(this));
        }

        this._onTouchMove(this.base.base.inputManager.get(this._finger));
    }

    disable() {
        if (!this._enabled) return;
        this._enabled = false;
        this._touchPressed = false;

        this.base.base.eventManage.off(`${this._eventsID}_start`, this._onTouchStart, this);
        this.base.base.eventManage.off(`${this._eventsID}_move`, this._onTouchMove, this);
        this.base.base.eventManage.off(`${this._eventsID}_end`, this._onTouchEnd, this);
        this.base.base.eventManage.off(`${this._eventsID}_click`, this._onTouchClick, this);

        this._checkIntersections(EventType.TOUCH_END, []);
    }

    dispose() {
        this.disable();
    }
}


export default class NotchCreate {
    constructor(base, t = {}) {
        this.base = base;
        this.imageAspect = 1
        this.options = {...t}
        this.init()
    }

    init() {
        const geometry = new THREE.PlaneGeometry();
        geometry.translate(-.5, .5, 0);
        const material = new THREE.ShaderMaterial({
            uniformsGroups: [this.base.UBO],
            uniforms: {
                uColor1: {value: new THREE.Color("#ecc168")},
                uColor2: {value: new THREE.Color("#9f4a16")},
                tNoise: {value: this.base.noiseSimplexLayeredTexture},
                tMap: {value: this.base.emailTexture}
            },
            depthTest: !1,
            vertexShader: vertex,
            fragmentShader: fragment
        })
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.renderOrder = 3
        this.base.scene.add(this.mesh)
        this.interaction = new MeshInteractor(this, {
            camera: this.base.scene.camera,
            meshes: [this.mesh],
            hoverCursor: !0,
            onHover: n => {
            },
            onClick: n => {
                window.location.href = "mailto:hi@abeto.co"
            }
        })
        this.imageAspect = material.uniforms.tMap.value.image.width / material.uniforms.tMap.value.image.height
        this.base.scene.beforeRenderCbs.push(this.positionMesh.bind(this))
        this.interaction.enable()
    }

    positionUI({
                   camera = null,
                   mesh = null,
                   x = 0,
                   y = 0,
                   width = 1,
                   height = 1,
                   distance = null,
                   billboardCamera = true
               } = {}) {
        const Bm = new THREE.Vector3();
        const $r = new THREE.Vector2();
        const l = distance || Bm.subVectors(camera.position, camera.target).length();
        camera.getViewSize(l, $r);
        const c = $r.y / this.base.screen.height;
        mesh.scale.set(width * c, height * c, 1);
        const h = x / this.base.screen.width
        const u = y / this.base.screen.height;
        mesh.position.copy(camera.position).add(Bm.set($r.x * -.5 + $r.x * h, $r.y * .5 - $r.y * u, -l).applyQuaternion(camera.quaternion))
        billboardCamera && mesh.quaternion.copy(camera.quaternion)
        mesh.updateMatrixWorld()
    }

    positionMesh() {
        const t = 200 / this.imageAspect
        const n = 11
        const s = 15;
        this.positionUI({
            camera: this.base.scene.camera,
            mesh: this.mesh,
            x: this.base.screen.width - n,
            y: this.base.screen.height - s,
            width: 200,
            height: t
        })
    }
}
