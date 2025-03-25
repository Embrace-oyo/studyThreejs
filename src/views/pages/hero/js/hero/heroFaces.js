/**
 * justThreeJs heroFaces.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/25 17:55:17
 */


class AboutHeroFaces {
    container = new Object3D;
    faceContainer = new Object3D;
    isActive = !1;
    hasStartedLoads = {};
    teamPosDataTextures = {};
    teamNShadeDataTextures = {};
    sharedUniforms = {
        u_mouse: {value: new Vector3},
        u_glitchOffset: {value: 0},
        u_glitchStrength: {value: 0},
        u_showRatio: {value: 0}
    };
    currId = "";
    nextId = "";
    transitionRatio = 0;
    showRatio = 0;
    activeRatio = 1;
    hideRatio = 0;
    meshArray = [];

    preInit() {
    }

    load(e) {
        this.hasStartedLoads[e] || (this.hasStartedLoads[e] = !0, properties.loader[properties.hasInitialized ? "load" : "add"](settings.TEAM_PATH + e + ".buf", {
            onLoad: t => {
                this._onModelLoaded(e, t)
            }
        }))
    }

    _onModelLoaded(e, t) {
        let r = t.attributes.position.array, n = new Float32Array(PARTICLE_COUNT * 4);
        for (let a = 0, l = 0, c = 0; a < PARTICLE_COUNT; a++, l += 3, c += 4) n[c] = r[l], n[c + 1] = r[l + 1], n[c + 2] = r[l + 2], n[c + 3] = 1 / PARTICLE_COUNT;
        this.teamPosDataTextures[e] = fboHelper.createDataTexture(n, SIM_TEXTURE_WIDTH, SIM_TEXTURE_HEIGHT, !0, !0), this.teamNShadeDataTextures[e] = fboHelper.createDataTexture(t.attributes.nShade.array, SIM_TEXTURE_WIDTH, SIM_TEXTURE_HEIGHT, !1, !0)
    }

    init() {
        this.container.add(this.faceContainer), this.container.scale.set(27.5, 27.5, 16), this.container.rotation.y = Math.PI + .2, this.container.rotation.x = .1, this.container.position.y = 34, this.container.position.z = 25, this.container.updateMatrixWorld(!0);
        let e = new PlaneGeometry(1, 1), t = new InstancedBufferGeometry;
        for (let l in e.attributes) t.attributes[l] = e.attributes[l];
        t.index = e.index;
        let r = new Float32Array(PARTICLE_COUNT * 2), n = new Float32Array(PARTICLE_COUNT * 4),
            a = new Float32Array(PARTICLE_COUNT * 4);
        for (let l = 0, c = 0, u = 0; l < PARTICLE_COUNT; l++, c += 2, u += 4) r[c] = (l % SIM_TEXTURE_WIDTH + .5) / SIM_TEXTURE_WIDTH, r[c + 1] = (~~(l / SIM_TEXTURE_WIDTH) + .5) / SIM_TEXTURE_HEIGHT, n[u] = Math.random(), n[u + 1] = Math.random(), n[u + 2] = Math.random(), n[u + 3] = Math.random(), a[u] = Math.random(), a[u + 1] = Math.random(), a[u + 2] = Math.random(), a[u + 3] = Math.random();
        t.setAttribute("a_simUv", new InstancedBufferAttribute(r, 2)), t.setAttribute("a_rands1", new InstancedBufferAttribute(n, 4)), t.setAttribute("a_rands2", new InstancedBufferAttribute(a, 4));
        for (let l = 0; l < MAX_FACE_NUM; l++) {
            const c = new ShaderMaterial({
                uniforms: {
                    u_time: properties.sharedUniforms.u_time,
                    u_resolution: properties.sharedUniforms.u_resolution,
                    u_mouse: this.sharedUniforms.u_mouse,
                    u_glitchOffset: this.sharedUniforms.u_glitchOffset,
                    u_glitchStrength: this.sharedUniforms.u_glitchStrength,
                    u_glitchThreshold: {value: 0},
                    u_activeRatio: {value: 0},
                    u_showRatio: this.sharedUniforms.u_showRatio,
                    u_positionTexture: {value: null},
                    u_norShadeTexture: {value: null}
                },
                vertexShader: vert$3,
                fragmentShader: frag$6,
                depthTest: !1,
                depthWrite: !1,
                transparent: !0,
                blending: CustomBlending,
                blendEquation: AddEquation,
                blendSrc: OneFactor,
                blendDst: OneFactor,
                blendEquationAlpha: AddEquation,
                blendSrcAlpha: OneFactor,
                blendDstAlpha: OneFactor
            });
            c.extensions.derivatives = !0;
            const u = new Mesh(t, c);
            u.frustumCulled = !1, u.visible = !1, this.meshArray.push(u), this.faceContainer.add(u)
        }
    }

    resize(e, t) {
    }

    update(e) {
        if (this.meshArray.length > 0) {
            let t = this.transitionRatio;
            this.sharedUniforms.u_showRatio.value = this.showRatio;
            let r = input.easedMouseDynamics.default.value;
            _v1$1.set(r.x, r.y, .5).unproject(cameraControls._camera).sub(cameraControls._camera.position).normalize(), _v1$1.multiplyScalar(75 / _v1$1.z).add(cameraControls._camera.position), _m.copy(this.faceContainer.matrixWorld).invert(), _v1$1.applyMatrix4(_m);
            let n = math.clamp(_v1$1.y * .03, -.05, .05), a = math.clamp(_v1$1.x * .03, -.05, .05);
            _v1$1.applyMatrix4(this.faceContainer.matrixWorld), this.sharedUniforms.u_mouse.value.copy(_v1$1);
            let l = this.meshArray[0];
            l.material.uniforms.u_positionTexture.value = this.teamPosDataTextures[this.currId], l.material.uniforms.u_norShadeTexture.value = this.teamNShadeDataTextures[this.currId], l.material.uniforms.u_activeRatio.value = 1 - t, l.material.uniforms.u_glitchThreshold.value = math.fit(l.material.uniforms.u_activeRatio.value, .4, 1, 0, .9), l.material.uniforms.u_activeRatio.value *= this.activeRatio, l.position.x = t * -1.5, l.position.z = -t * 2 - (1 - this.activeRatio) * 2, l.rotation.y = t * -.3 + a, l.rotation.x = t * .4 + n, l.visible = !0;
            let c = this.meshArray[1];
            c.material.uniforms.u_positionTexture.value = this.teamPosDataTextures[this.nextId], c.material.uniforms.u_norShadeTexture.value = this.teamNShadeDataTextures[this.nextId], c.material.uniforms.u_activeRatio.value = t, c.material.uniforms.u_glitchThreshold.value = math.fit(c.material.uniforms.u_activeRatio.value, .4, 1, 0, .9), c.material.uniforms.u_activeRatio.value *= this.activeRatio, c.position.x = (t - 1) * -1.5, c.position.z = (t - 1) * 2 - (1 - this.activeRatio) * 2, c.rotation.y = (t - 1) * -.3 + a, c.rotation.x = (t - 1) * -.4 + n, c.visible = !0, this.sharedUniforms.u_glitchOffset.value = Math.random() * 1e3, this.sharedUniforms.u_glitchStrength.value = Math.random(), this.container.visible = this.isActive
        }
    }
}
