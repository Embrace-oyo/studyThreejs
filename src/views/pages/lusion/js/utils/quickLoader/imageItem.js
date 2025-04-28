/**
 * justThreeJs imageItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 09:46:25
 */


import AbstractItem from '../quickLoader/AbstractItem.js'

function computedStyle(el, prop, getComputedStyle, style) {
    getComputedStyle = window.getComputedStyle;
    style =
        // If we have getComputedStyle
        getComputedStyle ?
            // Query it
            // TODO: From CSS-Query notes, we might need (node, null) for FF
            getComputedStyle(el) :

            // Otherwise, we are in IE and use currentStyle
            el.currentStyle;
    if (style) {
        return style
            [
            // Switch to camelCase for CSSOM
            // DEV: Grabbed from jQuery
            // https://github.com/jquery/jquery/blob/1.9-stable/src/css.js#L191-L194
            // https://github.com/jquery/jquery/blob/1.9-stable/src/core.js#L593-L597
            prop.replace(/-(\w)/gi, function (word, letter) {
                return letter.toUpperCase();
            })
            ];
    }
}

export default class ImageItem extends AbstractItem {
    static type = 'image'
    static extensions = ['jpg', 'gif', 'png']

    static retrieve(target) {
        if (target.nodeType && target.style) {
            const list = []

            if ((target.nodeName.toLowerCase() === 'img') && (target.src.indexOf(';') < 0)) {
                list.push(target.src)
            }

            computedStyle(target, 'background-image')
                .replace(/s?url\(\s*?['"]?([^;]*?)['"]?\s*?\)/g, (a, b) => {
                    list.push(b)
                })

            return list.filter(url => url.indexOf('data:') !== 0) || false
        } else if (typeof target === 'string') {
            return [target]
        } else {
            return false
        }
    }

    constructor(url, cfg, quickLoader) {
        if (!url) return

        super(url, cfg, quickLoader)

        this.content = this.content || new Image()

        if (this.crossOrigin) {
            this.content.crossOrigin = this.crossOrigin
        }

        // 绑定加载事件
        this.boundOnLoad = () => this._onLoad()
    }

    load() {
        super.load()
        const img = this.content
        img.onload = this.boundOnLoad
        img.src = this.url
    }

    _onLoad() {
        delete this.content.onload
        this.width = this.content.width
        this.height = this.content.height
        super._onLoad()
    }
}

