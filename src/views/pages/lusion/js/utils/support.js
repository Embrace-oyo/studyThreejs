/**
 * justThreeJs support.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 14:39:29
 */
import * as THREE from "three";

export default class Support {
    constructor(base) {
        this.base = base;
    }

    isSupported() {
        // 标记设备支持
        this.base.properties._isSupportedDevice = true;

        // 检查是否为主流浏览器（非 IE）
        this.base.properties._isSupportedBrowser =
            (this.base.browser.isChrome || this.base.browser.isSafari || this.base.browser.isEdge || this.base.browser.isFirefox || this.base.browser.isOpera) &&
            !this.base.browser.isIE;

        // 检查 WebGL 支持（包含上下文和扩展）
        this.base.properties._isSupportedWebGL = this.checkSupportWebGL();

        // 最终是否支持 WebGL
        return this.base.properties._isSupportedWebGL;
    }

    checkSupportWebGL() {
        // 无有效 canvas 元素
        if (!(this.base.properties.canvas instanceof HTMLCanvasElement)) return false;

        // 优先尝试 WebGL2
        if (this.base.settings.USE_WEBGL2 && window.WebGL2RenderingContext) {
            try {
                this.base.properties.gl = this.base.properties.canvas.getContext("webgl2", this.base.properties.webglOpts);
                this.base.settings.RENDER_TARGET_FLOAT_TYPE = THREE.HalfFloatType;
                this.base.settings.DATA_FLOAT_TYPE = THREE.FloatType;
                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        }

        // 回退到 WebGL1
        this.base.settings.USE_WEBGL2 = false;

        if (window.WebGLRenderingContext) {
            try {
                let gl =
                    this.base.properties.canvas.getContext("webgl", this.base.properties.webglOpts) ||
                    this.base.properties.canvas.getContext("experimental-webgl", this.base.properties.webglOpts);

                this.base.properties.gl = gl;

                // 判断是否支持 float/half-float 纹理和顶点纹理支持
                let hasFloatExt = gl.getExtension("OES_texture_float");
                let hasHalfFloatExt = gl.getExtension("OES_texture_half_float");
                let hasVertexTextureSupport = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;

                if ((hasFloatExt || hasHalfFloatExt) && hasVertexTextureSupport) {
                    this.base.settings.RENDER_TARGET_FLOAT_TYPE = (this.base.browser.isIOS || hasHalfFloatExt)
                        ? THREE.HalfFloatType
                        : THREE.FloatType;
                    this.base.settings.DATA_FLOAT_TYPE = THREE.FloatType;
                } else {
                    // 启用浮点打包模式（兼容性方案）
                    this.base.settings.USE_FLOAT_PACKING = true;
                    this.base.settings.RENDER_TARGET_FLOAT_TYPE = THREE.UnsignedByteType;
                    this.base.settings.DATA_FLOAT_TYPE = THREE.UnsignedByteType;
                    return false;
                }

                return true;
            } catch (e) {
                console.error(e);
                return false;
            }
        }

        // 浏览器不支持 WebGL
        return false;
    }
}
