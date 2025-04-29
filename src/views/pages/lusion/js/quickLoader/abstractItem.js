/**
 * justThreeJs abstractItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 09:21:40
 */

import MinSignal from '@/views/pages/lusion/js/utils/min-signal'

export default class AbstractItem {
    static extensions = []

    static retrieve() {
        return false
    }

    constructor(url, cfg = {}, quickLoader) {
        if (!url) return
        this.quickLoader = quickLoader;
        this.url = url
        this.loadedWeight = 0
        this.weight = cfg.weight || 1
        this.postPercent = 0
        this.type = cfg.type || this.constructor.type
        this.crossOrigin = cfg.crossOrigin
        this.onLoaded = new MinSignal()

        Object.assign(this, cfg)

        // 加载中处理
        if (this.hasLoading) {
            this.loadingSignal = new MinSignal()
            this.loadingSignal.add(this._onLoading, this)
            if (this.onLoading) {
                this.loadingSignal.add(this.onLoading)
            }
        }

        // 后处理处理
        if (this.onPost) {
            this.onPostLoadingSignal = new MinSignal()
            this.onPostLoadingSignal.add(this._onPostLoading, this)
            this.postWeightRatio = this.postWeightRatio || 0.1
        } else {
            this.postWeightRatio = 0
        }

        this.boundOnLoad = () => {
            this._onLoad()
        }

        this.quickLoader.addedItems[url] = this
    }

    load() {
        this.isStartLoaded = true
        // 留空，供子类实现实际加载逻辑
    }

    _onLoad() {
        if (this.onPost) {
            this.onPost.call(this, this.content, this.onPostLoadingSignal)
        } else {
            this._onLoadComplete()
        }
    }

    _onPostLoading(percent) {
        this.postPercent = percent
        if (this.hasLoading) {
            this.loadingSignal.dispatch(1)
        }
        if (percent === 1) {
            this._onLoadComplete()
        }
    }

    _onLoadComplete() {
        this.isLoaded = true
        this.loadedWeight = this.weight
        this.quickLoader.loadedItems[this.url] = this
        this.onLoaded.dispatch(this.content)
    }

    getCombinedPercent(percent) {
        return percent * (1 - this.postWeightRatio) + (this.postWeightRatio * this.postPercent)
    }

    _onLoading(percent) {
        this.loadedWeight = this.weight * this.getCombinedPercent(percent)
    }

    dispatch() {
        if (this.hasLoading) {
            this.loadingSignal.remove()
        }
        this.onLoaded.dispatch(this.content)
    }
}
