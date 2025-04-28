/**
 * justThreeJs xhrItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/25 10:12:27
 */

import AbstractItem from './AbstractItem.js'

const IS_SUPPORT_XML_HTTP_REQUEST = !!window.XMLHttpRequest

export default class XHRItem extends AbstractItem {
    static type = 'xhr'
    static extensions = []

    static retrieve() {
        return false
    }

    constructor(url, cfg, quickLoader) {
        if (!url) return

        super(url, cfg, quickLoader)

        this.responseType = this.responseType || ''
        this.method = this.method || 'GET'
    }

    load() {
        super.load()

        const self = this
        const xmlhttp = IS_SUPPORT_XML_HTTP_REQUEST
            ? new XMLHttpRequest()
            : new ActiveXObject('Microsoft.XMLHTTP')

        this.xmlhttp = xmlhttp

        if (this.hasLoading) {
            xmlhttp.onprogress = evt => self._onXmlHttpProgress(evt)
        }

        xmlhttp.onreadystatechange = () => self._onXmlHttpChange()

        xmlhttp.open(this.method, this.url, true)
        xmlhttp.responseType = this.responseType

        IS_SUPPORT_XML_HTTP_REQUEST ? xmlhttp.send(null) : xmlhttp.send()
    }

    _onXmlHttpProgress(evt) {
        if (evt.lengthComputable && this.loadingSignal) {
            this.loadingSignal.dispatch(evt.loaded / evt.total)
        }
    }

    _onXmlHttpChange() {
        if (this.xmlhttp.readyState === 4 && this.xmlhttp.status === 200) {
            this._onLoad(this.xmlhttp)
        }
    }

    _onLoad() {
        if (!this.content) {
            this.content = this.xmlhttp.response
        }
        this.xmlhttp = undefined
        super._onLoad()
    }
}

