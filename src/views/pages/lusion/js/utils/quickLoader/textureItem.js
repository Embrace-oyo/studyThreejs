/**
 * justThreeJs textureItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 10:18:08
 */

import ImageItem from './ImageItem.js'
import {
    Texture, Vector2,
    NearestMipMapNearestFilter, NearestMipMapLinearFilter,
    LinearMipMapNearestFilter, LinearMipMapLinearFilter
} from 'three'

export default class TextureItem extends ImageItem {
    static type = 'texture'
    static extensions = []

    constructor(url, cfg = {}, quickLoader) {
        // 创建默认 Texture（如果未传入）
        const texture = cfg.content || new Texture(new Image())
        const image = texture.image
        cfg.content = image // 传给父类 ImageItem 处理

        texture.size = new Vector2()

        // 配置滤波器和 mipmap
        texture.minFilter = cfg.minFilter || LinearMipMapLinearFilter
        switch (texture.minFilter) {
            case NearestMipMapNearestFilter:
            case NearestMipMapLinearFilter:
            case LinearMipMapNearestFilter:
            case LinearMipMapLinearFilter:
                texture.generateMipmaps = true
                texture.anisotropy = cfg.anisotropy || quickLoader.base.properties.renderer.capabilities.getMaxAnisotropy()
                break
            default:
                texture.generateMipmaps = false
        }

        // flipY 设置
        texture.flipY = cfg.flipY !== undefined ? cfg.flipY : true

        // wrap 设置
        if (cfg.wrap) {
            texture.wrapS = texture.wrapT = cfg.wrap
        } else {
            if (cfg.wrapS) texture.wrapS = cfg.wrapS
            if (cfg.wrapT) texture.wrapT = cfg.wrapT
        }

        // 调用父构造
        super(url, cfg, quickLoader)
        this.quickLoader = quickLoader;
        this.content = texture
    }

    static retrieve() {
        return false
    }

    load() {
        this.isStartLoaded = true
        const img = this.content.image
        img.onload = this.boundOnLoad
        img.src = this.url
    }

    _onLoad() {
        const img = this.content.image
        delete img.onload

        this.width = img.width
        this.height = img.height

        this.content.size.set(this.width, this.height)
        this.content.needsUpdate = true

        // 加入任务队列
        this.quickLoader.base.taskManager.add(this.content)

        if (this.onPost) {
            this.onPost(this.content, this.onPostLoadingSignal)
        } else {
            this._onLoadComplete()
        }
    }
}

