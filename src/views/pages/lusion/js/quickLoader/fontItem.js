/**
 * justThreeJs fontItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 10:31:17
 */

import AnyItem from './anyItem.js'

export default class FontItem extends AnyItem {
    static type = 'font'
    static extensions = []
    static dom = null

    constructor(url, cfg = {}, quickLoader) {
        // 初始化隐藏 DOM 元素
        if (!FontItem.dom) FontItem.initDom()

        // 默认参数设置
        cfg.loadFunc = () => {
        }
        cfg.hasLoading = cfg.hasLoading !== undefined ? cfg.hasLoading : true
        cfg.refText = cfg.refText || 'refing something...'
        cfg.refFontSize = cfg.refFontSize || 120
        cfg.refFont = cfg.refFont || 'Helvetica, Arial, FreeSans, Garuda, sans-serif'
        cfg.interval = cfg.interval || 20
        cfg.refTextWidth = 0

        super(url, cfg, quickLoader)

        this.loadFunc = this._loadFunc.bind(this)
    }

    static initDom() {
        const el = document.createElement('div')
        el.style.position = 'fixed'
        el.style.left = '0'
        el.style.top = '0'
        el.style.visibility = 'hidden'
        el.style.fontSize = '120px'
        el.style.lineHeight = 'normal'
        document.body.appendChild(el)
        FontItem.dom = el
    }

    _loadFunc(fontListStr, onComplete, loadingSignal) {
        const fontList = fontListStr.split(',').map(f => f.trim())
        const reference = this.refFont.split(':')
        const referenceFont = reference[0]
        const fontWeight = reference[1] || 'normal'
        const fontStyle = reference[2] || 'normal'
        const total = fontList.length
        let remainingFonts = [...fontList]

        const intervalId = setInterval(() => {
            const current = remainingFonts[0].split(':')
            const testFont = current[0]
            const weight = current[1] || 'normal'
            const style = current[2] || 'normal'

            const testWidth = this._getTextWidth(testFont, weight, style, referenceFont)
            const refWidth = this._getTextWidth(referenceFont, weight, style, referenceFont)

            if (testWidth !== refWidth) {
                remainingFonts.shift()
                loadingSignal.dispatch((total - remainingFonts.length) / total)

                if (remainingFonts.length === 0) {
                    clearInterval(intervalId)
                    onComplete()
                }
            }
        }, this.interval)
    }

    _getTextWidth(fontFamily, fontWeight, fontStyle, fallbackFont) {
        const el = FontItem.dom
        el.style.fontFamily = `"${fontFamily}"${fallbackFont ? ', ' + fallbackFont : ''}`
        el.style.fontWeight = fontWeight
        el.style.fontStyle = fontStyle
        el.textContent = this.refText
        return el.getBoundingClientRect().width
    }
}
