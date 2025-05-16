/**
 * justThreeJs jsonItem.js
 * @author kongjianqiu
 * @description
 * @created 2025/5/7 09:34:49
 */
import TextItem from "@/views/pages/lusion/js/quickLoader/textItem.js";

/**
 * JSON 资源加载器，继承自 TextItem
 */
export default class JSONItem extends TextItem {

    // 设置静态属性
    static type = 'json';
    static extensions = ['json'];

    constructor(url, cfg = {}, quickLoader) {
        super(url, cfg, quickLoader); // 调用父类构造函数
    }

    /**
     * 资源加载完成后的处理方法
     * 如果 content 未设置，则从响应文本中解析 JSON 对象
     */
    _onLoad() {
        if (!this.content) {
            try {
                this.content = JSON.parse(this.xmlhttp.responseText.toString());
            } catch (e) {
                // fallback（极端情况）使用 eval
                this.content = eval(this.xmlhttp.responseText.toString());
            }
        }
        super._onLoad();
    }

    /**
     * 禁用静态 retrieve 方法（本类不需要额外获取逻辑）
     */
    retrieve() {
        return false;
    }
}
