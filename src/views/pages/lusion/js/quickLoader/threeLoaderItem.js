/**
 * justThreeJs threeLoaderItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 10:29:06
 */

import AnyItem from './anyItem.js'

export default class ThreeLoaderItem extends AnyItem {
    static type = 'three-loader'
    static extensions = []

    constructor(url, cfg = {}, quickLoader) {
        // 设置默认 loadFunc 和 hasLoading
        cfg.loadFunc = () => {
        }
        cfg.hasLoading = cfg.hasLoading !== undefined ? cfg.hasLoading : true

        super(url, cfg, quickLoader)

        if (!cfg.loader && console) {
            (console.error || console.log)('loader is required.')
        }

        this.loadFunc = this._loadFunc.bind(this)
        this.loader = cfg.loader
    }

    _loadFunc(url, onComplete, loadingSignal) {
        this.loader.load(
            url,
            this._onLoaderLoad.bind(this, onComplete),
            this._onLoaderLoading.bind(this, loadingSignal)
        )
    }

    _onLoaderLoad(onComplete, content) {
        this.content = content
        onComplete(content)
    }

    _onLoaderLoading(loadingSignal, progressEvent) {
        loadingSignal.dispatch(progressEvent.loaded / progressEvent.total)
    }
}
