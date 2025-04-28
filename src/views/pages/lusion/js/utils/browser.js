/**
 * justThreeJs browser.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 09:21:24
 */
const isSSR = typeof window > "u";

class DetectUA {
    constructor(userAgent) {
        this.userAgent =
            userAgent ||
            (!isSSR && window.navigator ? window.navigator.userAgent : "");

        this.isAndroidDevice =
            !/like android/i.test(this.userAgent) &&
            /android/i.test(this.userAgent);

        this.iOSDevice = this.match(1, /(iphone|ipod|ipad)/i).toLowerCase();

        // 识别 iPadOS
        if (
            !isSSR &&
            navigator.platform === "MacIntel" &&
            navigator.maxTouchPoints > 2 &&
            !window.MSStream
        ) {
            this.iOSDevice = "ipad";
        }
    }

    match(index, regex) {
        const result = this.userAgent.match(regex);
        return (result && result.length > index && result[index]) || "";
    }

    get isMobile() {
        return (
            !this.isTablet &&
            (/[^-]mobi/i.test(this.userAgent) ||
                this.iOSDevice === "iphone" ||
                this.iOSDevice === "ipod" ||
                this.isAndroidDevice ||
                /nexus\s*[0-6]\s*/i.test(this.userAgent))
        );
    }

    get isTablet() {
        return (
            (/tablet/i.test(this.userAgent) && !/tablet pc/i.test(this.userAgent)) ||
            this.iOSDevice === "ipad" ||
            (this.isAndroidDevice && !/[^-]mobi/i.test(this.userAgent)) ||
            (!/nexus\s*[0-6]\s*/i.test(this.userAgent) &&
                /nexus\s*[0-9]+/i.test(this.userAgent))
        );
    }

    get isDesktop() {
        return !this.isMobile && !this.isTablet;
    }

    get isMacOS() {
        if (/macintosh/i.test(this.userAgent)) {
            const version = this.match(1, /mac os x (\d+([._]?\d+)+)/i)
                .replace(/[_\s]/g, ".")
                .split(".")[1];
            return {version};
        }
        return false;
    }

    get isWindows() {
        if (/windows /i.test(this.userAgent)) {
            return {
                version: this.match(1, /Windows ((NT|XP)( \d\d?.\d)?)/i),
            };
        }
        return false;
    }

    get isiOS() {
        if (this.iOSDevice) {
            const version =
                this.match(1, /os (\d+([_\s]\d+)*) like mac os x/i).replace(/[_\s]/g, ".") ||
                this.match(1, /version\/(\d+(\.\d+)?)/i);
            return {version};
        }
        return false;
    }

    get isAndroid() {
        if (this.isAndroidDevice) {
            return {
                version: this.match(1, /android[ \/-](\d+(\.\d+)*)/i),
            };
        }
        return false;
    }

    get browser() {
        const version = this.match(1, /version\/(\d+(\.\d+)?)/i);

        if (/opera/i.test(this.userAgent)) {
            return {
                name: "Opera",
                version: version || this.match(1, /(?:opera|opr|opios)[\s\/](\d+(\.\d+)?)/i),
            };
        }

        if (/opr\/|opios/i.test(this.userAgent)) {
            return {
                name: "Opera",
                version: this.match(1, /(?:opr|opios)[\s\/](\d+(\.\d+)?)/i) || version,
            };
        }

        if (/SamsungBrowser/i.test(this.userAgent)) {
            return {
                name: "Samsung Internet for Android",
                version: version || this.match(1, /(?:SamsungBrowser)[\s\/](\d+(\.\d+)?)/i),
            };
        }

        if (/yabrowser/i.test(this.userAgent)) {
            return {
                name: "Yandex Browser",
                version: version || this.match(1, /(?:yabrowser)[\s\/](\d+(\.\d+)?)/i),
            };
        }

        if (/ucbrowser/i.test(this.userAgent)) {
            return {
                name: "UC Browser",
                version: this.match(1, /(?:ucbrowser)[\s\/](\d+(\.\d+)?)/i),
            };
        }

        if (/msie|trident/i.test(this.userAgent)) {
            return {
                name: "Internet Explorer",
                version: this.match(1, /(?:msie |rv:)(\d+(\.\d+)?)/i),
            };
        }

        if (/(edge|edgios|edga|edg)/i.test(this.userAgent)) {
            return {
                name: "Microsoft Edge",
                version: this.match(2, /(edge|edgios|edga|edg)\/(\d+(\.\d+)?)/i),
            };
        }

        if (/firefox|iceweasel|fxios/i.test(this.userAgent)) {
            return {
                name: "Firefox",
                version: this.match(1, /(?:firefox|iceweasel|fxios)[ \/](\d+(\.\d+)?)/i),
            };
        }

        if (/chromium/i.test(this.userAgent)) {
            return {
                name: "Chromium",
                version: this.match(1, /(?:chromium)[\s\/](\d+(?:\.\d+)?)/i) || version,
            };
        }

        if (/chrome|crios|crmo/i.test(this.userAgent)) {
            return {
                name: "Chrome",
                version: this.match(1, /(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i),
            };
        }

        if (/safari|applewebkit/i.test(this.userAgent)) {
            return {
                name: "Safari",
                version,
            };
        }

        return {
            name: this.match(1, /^(.*)\/(.*) /),
            version: this.match(2, /^(.*)\/(.*) /),
        };
    }
}

let detectUA = new DetectUA;
let userAgent = (navigator.userAgent || navigator.vendor).toLowerCase();
let browserName = detectUA.browser.name
let audioElem = document.createElement("audio")
export default class Browser {
    isMobile = detectUA.isMobile || detectUA.isTablet;
    isDesktop = detectUA.isDesktop;
    device = this.isMobile ? "mobile" : "desktop";
    isAndroid = !!detectUA.isAndroid;
    isIOS = !!detectUA.isiOS;
    isMacOS = !!detectUA.isMacOS;
    isWindows = detectUA.isWindows.version !== null;
    isLinux = userAgent.indexOf("linux") != -1;
    ua = userAgent;
    isEdge = browserName === "Microsoft Edge";
    isIE = browserName === "Internet Explorer";
    isFirefox = browserName === "Firefox";
    isChrome = browserName === "Chrome";
    isOpera = browserName === "Opera";
    isSafari = browserName === "Safari";
    isSupportMSAA = !userAgent.match("version/15.4 ");
    isSupportOgg = !!audioElem.canPlayType("audio/ogg");
    isRetina = window.devicePixelRatio && window.devicePixelRatio >= 1.5;
    devicePixelRatio = window.devicePixelRatio || 1;
    cpuCoreCount = navigator.hardwareConcurrency || 1;
    baseUrl = document.location.origin;
    isIFrame = window.self !== window.top;

    constructor() {
    }
}
