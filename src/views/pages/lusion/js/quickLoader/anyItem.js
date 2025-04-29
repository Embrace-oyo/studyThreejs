/**
 * justThreeJs anyItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 09:40:35
 */
import AbstractItem from './abstractItem'

export default class AnyItem extends AbstractItem {
    static type = 'any'
    static extensions = []

    static retrieve() {
        return false
    }

    constructor(url, cfg = {}, quickLoader) {
        super(url, cfg, quickLoader)
        this.quickLoader = quickLoader;
        this.loadFunc = cfg.loadFunc

        if (!this.loadFunc && console) {
            console[console.error ? 'error' : 'log']('require loadFunc in the config object.')
        }
    }

    load() {
        this.loadFunc(this.url, (content) => {
            this.content = content
            this._onLoad()

            // ✅ 手动标记为已加载
            if (this.quickLoader) {
                this.quickLoader.loadedItems[this.url] = this
            }
        }, this.loadingSignal)
    }
}
