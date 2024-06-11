import * as THREE from "three";
import Component from "@/util/common/component";
import UniformInjector from "@/util/common/uniformInjector";

const defaultVertexShader = /* glsl */ `
varying vec2 vUv;

void main(){
    vec3 p=position;
    gl_Position=vec4(p,1.);
    
    vUv=uv;
}
`;
const defaultFragmentShader = /* glsl */ `
uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

varying vec2 vUv;

void main(){
    vec2 p=vUv;
    vec3 color=vec3(p,0.);
    gl_FragColor=vec4(color,1.);
}
`;
const shadertoyPrepend = /* glsl */ `
uniform float iGlobalTime;
uniform float iTime;
uniform float iTimeDelta;
uniform vec3 iResolution;
uniform vec4 iMouse;
uniform int iFrame;
uniform vec4 iDate;
uniform float iSampleRate;

uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform sampler2D iChannel2;
uniform sampler2D iChannel3;
uniform samplerCube iChannel0Cube;
uniform samplerCube iChannel1Cube;
uniform samplerCube iChannel2Cube;
uniform samplerCube iChannel3Cube;

uniform float iChannelTime[4];
`;
const shadertoyAppend = /* glsl */ `
varying vec2 vUv;

void main(){
    mainImage(gl_FragColor,vUv*iResolution.xy);
}
`;

/**
 * A fullsceen plane with which you can create fullscreen effects such as raymarching.
 * By default, it has almost all the uniforms that [shadertoy](https://www.shadertoy.com/) has: `iTime`, `iResolution`, `iMouse`, etc
 * If you just want to run your shadertoy shader locally, you can turn on `shadertoyMode`, which will inject all the shadertoy uniforms into the fragment shader as well as `main()` function for three.js. Thus, you can just copy & paste your shadertoy shader and run!
 *
 * Demo: https://kokomi-js.vercel.app/examples/#screenQuad
 */
export default class ScreenQuad extends Component {
    material;
    mesh;
    uniformInjector;

    constructor(base, config = {}) {
        super(base);
        const {
            vertexShader = defaultVertexShader,
            fragmentShader = defaultFragmentShader,
            uniforms = {},
            shadertoyMode = false,
        } = config;
        const finalFragmentShader = shadertoyMode ? `
    ${shadertoyPrepend}

    ${fragmentShader}

    ${shadertoyAppend}
    `
            : fragmentShader;
        const uniformInjector = new UniformInjector(base);
        this.uniformInjector = uniformInjector;
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: finalFragmentShader,
            uniforms: {
                ...uniformInjector.shadertoyUniforms,
                ...uniforms,
            },
            side: THREE.DoubleSide,
        });
        this.material = material;
        const mesh = new THREE.Mesh(geometry, material);
        this.mesh = mesh;
    }

    addExisting() {
        this.container.add(this.mesh);
    }

    update(time) {
        const uniforms = this.material.uniforms;
        this.uniformInjector.injectShadertoyUniforms(uniforms);
    }
}

