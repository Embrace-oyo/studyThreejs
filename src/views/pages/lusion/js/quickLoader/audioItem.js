/**
 * justThreeJs audioItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 09:44:12
 */

import AbstractItem from './abstractItem'

export default class AudioItem extends AbstractItem {
    static type = 'audio'
    static extensions = ['mp3', 'ogg']

    static retrieve(target) {
        // TODO add dom audios support
        return false
    }

    constructor(url, cfg = {}, quickLoader) {
        if (!url) return

        // 如果 cfg.loadThrough 是 undefined（undef）
        const loadThrough = cfg.loadThrough === undefined ? true : cfg.loadThrough

        super(url, cfg, quickLoader)

        this.loadThrough = loadThrough

        try {
            this.content = this.content || new Audio()
        } catch (e) {
            this.content = this.content || document.createElement('audio')
        }

        if (this.crossOrigin) {
            this.content.crossOrigin = this.crossOrigin
        }

        // 绑定回调
        this.boundOnLoad = () => this._onLoad()
    }

    load() {
        super.load()
        const audio = this.content
        audio.src = this.url
        if (this.loadThrough) {
            audio.addEventListener('canplaythrough', this.boundOnLoad, false)
        } else {
            audio.addEventListener('canplay', this.boundOnLoad, false)
        }
        audio.load()
    }

    _onLoad() {
        const audio = this.content
        audio.removeEventListener('canplaythrough', this.boundOnLoad, false)
        audio.removeEventListener('canplay', this.boundOnLoad, false)

        if (this.isLoaded) return

        super._onLoad()
    }
}


