/**
 * justThreeJs setting.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 09:19:22
 */

let CDN_PATH = "";
window.location.hostname == "lusion.co" && (CDN_PATH = "https://lusion.dev");
window.location.hostname == "lusion.dev" && (window.location.href = "https://lusion.co" + window.location.pathname + window.location.search);
function filePath(path) {
    return new URL(`../assets/${path}`, import.meta.url).href
}
export default class Settings {
    CDN_PATH = "";
    TEAM_PATH = "https://lusion.co/assets/team/";
    PROJECT_PATH = "https://lusion.co/assets/projects/";
    MODEL_PATH = "https://lusion.co/assets/models/";
    IMAGE_PATH = "https://lusion.co/assets/images/";
    TEXTURE_PATH = "https://lusion.co/assets/textures/";
    AUDIO_PATH = "https://lusion.co/assets/audios/";
    SPRITE_PATH = "https://lusion.co/assets/sprites/";
    RENDER_TARGET_FLOAT_TYPE = null;
    DATA_FLOAT_TYPE = null;
    USE_FLOAT_PACKING = !1;
    USE_WEBGL2 = !0;
    USE_PIXEL_LIMIT = !0;
    MAX_PIXEL_COUNT = 2560 * 1440;
    MOBILE_WIDTH = 812;
    JUMP_SECTION = "";
    JUMP_OFFSET = 0;
    USE_HD = !1;
    SHOW_DETAILS = "";
    CROSS_ORIGINS = {"https://lusion.dev/": "anonymous"};
    IS_DEV = !1;
    LOG = !1;
    SKIP_ANIMATION = !1;
    WEBGL_OFF = !1;
    LOOK_DEV_MODE = !1;
    TEST_TUNNEL = !1;
    HOME_TEST = !1;
    OPEN_CONTACT = !1;
    TEST_BALLOONS = !1;
    BALLOON_COLOR = "";

    constructor(base) {
        this.base = base;
        this.DPR = Math.min(1.5, this.base.browser.devicePixelRatio) || 1;
        this.USE_AUDIO = this.base.browser.isSupportOgg && !this.base.browser.isMobile;
        this.IS_SMALL_SCREEN = Math.min(this.base.width, this.base.height) <= 820;

        if (window.URLSearchParams) {
            // 将 URL 参数转换为对象，空字符串参数被解析为 true
            const queryParams = [...new URLSearchParams(window.location.search)]
                .reduce((acc, [key, value]) => {
                    acc[key] = value === "" ? true : value;
                    return acc;
                }, {});

            // 调用 override 方法进行参数覆盖
            this.override(queryParams);

            // 遍历当前实例的属性，将所有包含 "_PATH" 的属性替换为 CDN 路径版本，并缓存本地路径
            for (const key in this) {
                if (key.includes("_PATH")) {
                    this["LOCAL_" + key] = this[key];         // 缓存原始本地路径
                    this[key] = CDN_PATH + this[key];         // 替换为 CDN 路径
                }
            }
        }
    }

    override(e) {
        for (const t in e) if (this[t] !== void 0) {
            const r = e[t].toString();
            typeof this[t] == "boolean" ? this[t] = !(r === "0" || r === !1) : typeof this[t] == "number" ? this[t] = parseFloat(r) : typeof this[t] == "string" && (this[t] = r)
        }
        this.USE_HD && (this.USE_PIXEL_LIMIT = !1)
    }
}
