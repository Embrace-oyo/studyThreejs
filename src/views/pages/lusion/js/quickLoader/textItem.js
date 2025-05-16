/**
 * justThreeJs textItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/5/7 09:32:53
 */
import XHRItem from "./xhrItem.js";

/**
 * 文本资源加载器，继承自 XHRItem
 */
export default class TextItem extends XHRItem {
    static type = 'text'
    static extensions = ['html', 'txt', 'svg']
    static responseType = 'text'

    constructor(url, cfg = {}, quickLoader) {
        super(url, {...cfg, responseType: 'text'}, quickLoader);           // 调用父类构造函数
    }

    /**
     * 资源加载完成后的处理方法
     * 若内容未设置，则从 XMLHttpRequest 中提取文本
     */
    _onLoad() {
        if (!this.content) {
            this.content = this.xmlhttp.responseText;
        }
        super._onLoad(); // 调用父类的 _onLoad 方法
    }

    /**
     * 禁用静态 retrieve 方法（本类不需要额外获取逻辑）
     */
    retrieve() {
        return false;
    }
}

