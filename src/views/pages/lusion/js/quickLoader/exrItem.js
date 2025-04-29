/**
 * justThreeJs exrItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 10:15:26
 */

import AnyItem from './anyItem.js' // 如果 AnyItem$2 是别名，请用实际路径
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader.js'

export default class EXRItem extends AnyItem {
    static type = 'exr'
    static extensions = ['exr']

    constructor(url, cfg = {}, quickLoader) {
        super(url, {...cfg, responseType: 'type'}, quickLoader)
        this.EXRLoader = new EXRLoader()
    }

    static retrieve() {
        return false
    }

    loadFunc() {
        this.EXRLoader.load(
            this.url,
            this._onLoad.bind(this),
            this._onGLTFLoading.bind(this)
        )
    }

    _onGLTFLoading(event) {
        if (this.hasLoading && this.loadingSignal) {
            this.loadingSignal.dispatch(event.loaded / event.total)
        }
    }

    _onLoad(result) {
        this.content = result
        super._onLoad(this)
    }
}
