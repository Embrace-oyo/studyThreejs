/**
 * justThreeJs heroSection.js
 * @author kongjianqiu
 * @description
 * @created 2025/3/26 09:31:42
 */

import {easeInOutCubic} from 'easing-utils';
import {MathUtils} from "@/views/pages/hero/js/util/common.js";

export default class HeroSection {
    domContainer;
    activeFaceId = -1;
    scrollRatio = 0;
    subsectionContainerOffsetY = 0;
    subsectionContainerOffsetX = 0;
    RANGE_START_WAIT = 3.5;
    RANGE_PAGE_12 = 1.75;
    RANGE_PAGE_23 = 1.75;
    RANGE_PAGE_34 = 1.75;
    RANGE_END_WAIT = 2.5;
    PAGE_DISTANCE = 1.25;
    THRESHOLDS = [];
    MOBILE_THRESHOLDS = [];

    constructor(base) {
        this.base = base;
        this.math = new MathUtils;
        // this.domContainer = e.querySelector("#about-who")
        // this.domSubsectionContainer = e.querySelector("#about-who-subsection-container")
        // this.domCrosses = e.querySelector("#about-crosses ");
        let t = 0
        let r = 0;
        this.THRESHOLDS.push(t += this.RANGE_START_WAIT)
        this.THRESHOLDS.push(t += this.RANGE_PAGE_12)
        this.THRESHOLDS.push(t += this.RANGE_PAGE_23)
        r = t
        this.MOBILE_THRESHOLDS.push.apply(this.MOBILE_THRESHOLDS, this.THRESHOLDS)
        this.THRESHOLDS.push(t += this.RANGE_END_WAIT)
        this.MOBILE_THRESHOLDS.push(r += this.RANGE_PAGE_34)
        this.MOBILE_THRESHOLDS.push(r += this.RANGE_END_WAIT)
    }

    resize(e, t) {
        this.syncSubsectionContainerTransform()
    }

    getMoveRatio() {
        return -0 / this.base.width
    }

    getScrollRatio() {
        const thresholds = this.THRESHOLDS;
        const moveRatio = this.getMoveRatio();
        let scrollValue = 0;
        if (moveRatio < thresholds[0]) {
            scrollValue = 0;
        } else if (moveRatio < thresholds[1]) {
            scrollValue = this.math.fit(moveRatio, thresholds[0], thresholds[1], 0, 1, easeInOutCubic);
        } else {
            scrollValue = this.math.fit(moveRatio, thresholds[1], thresholds[2], 1, 2, easeInOutCubic);
        }

        this.scrollRatio = scrollValue;
        return this.scrollRatio;
    }

    syncSubsectionContainerTransform() {
        let e = this.THRESHOLDS
        let t = this.base.width;
        this.scrollableSize = e[e.length - 1] * t;
        let n = true
        let a = {
            screenX: 0,
            screenY: 0
        }
        let l = this.getScrollRatio() * this.PAGE_DISTANCE;
        // this.subsectionContainerOffsetY = this.math.fit(a.screenY, 0, -this.scrollableSize, 0, this.scrollableSize)
        // this.subsectionContainerOffsetX = l * -this.base.width;
        // this.domSubsectionContainer.style.transform = "translate3d(" + this.subsectionContainerOffsetX + "px," + this.subsectionContainerOffsetY + "px, 0)"
        // this.domCrosses.style.transform = "translate3d(" + -this.subsectionContainerOffsetX + "px,0, 0)"
    }

    update(e) {
        let t = this.THRESHOLDS
        let r = this.base.width;
        this.scrollableSize = t[t.length - 1] * r;
        let a = true
        let l = {
            screenX: 0,
            screenY: 0
        }
        this.syncSubsectionContainerTransform()
        if (a) {
            let c = this.getScrollRatio() * this.PAGE_DISTANCE
            c = 2
            let u = -l.screenY / this.base.width;
            this.base.hero.initialSplineRatio = this.math.fit(u, 0, t[1], 0, 1)
            this.base.hero.hudRatio = this.math.fit(u, t[1], t[1] + this.RANGE_PAGE_23 * .5, 0, 1)
            this.base.hero.outSectionRatio = this.math.fit(u / t[3], .9, 1, 0, 1)
            this.base.hero.properties.cameraViewportOffsetX = 0
            this.base.hero.properties.cameraViewportOffsetY = 0
            this.base.hero.scrollYRatio = 0
            this.base.hero.faceShowRatio = 0
            if (c < this.PAGE_DISTANCE) {
                this.base.hero.introRatio = u / (this.RANGE_START_WAIT + this.RANGE_PAGE_12)
            } else {
                this.base.hero.introRatio = 1
            }
            let f = this.getMoveRatio();
            f = 2
            this.base.hero.panningSplineRaito = this.math.fit(f, t[1], t[3], 0, 1);
            let p = this.math.fit(c - this.PAGE_DISTANCE * 2 - 0, -1, 0, 0, 1)
            // let g = Math.max(0, scrollManager.scrollPixel - l.top - t[t.length - 1] * r);
            let g = Math.max(0, 100 - l.top - t[t.length - 1] * r);
            if (c >= this.PAGE_DISTANCE) {
                this.base.hero.properties.cameraViewportOffsetY = g
                this.base.hero.scrollYRatio = g / r
            }
            this.base.hero.isActive = !0
        }
    }
}
