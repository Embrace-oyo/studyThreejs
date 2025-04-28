/**
 * justThreeJs common.js
 * @author kongjianqiu
 * @description
 * @created 2025/4/23 10:16:57
 */

import MinSignal from '../quickLoader/min-signal'

let undef

class QuickLoader {
    constructor(base) {
        this.base = base;
        this.isLoading = false
        this.totalWeight = 0
        this.loadedWeight = 0
        this.itemUrls = {}
        this.itemList = []
        this.loadingSignal = new MinSignal()
        this.crossOriginMap = {}
        this.queue = []
        this.activeItems = []
        this.maxActiveItems = 4
        this.addedItems = {}
        this.loadedItems = {}
        this.ITEM_CLASS_LIST = []
        this.ITEM_CLASSES = {}
    }

    setCrossOrigin(domain, value) {
        this.crossOriginMap[domain] = value
    }

    addChunk(target, type) {
        let i, j, len, itemsLength, retrievedTypeObj
        let retrievedTypeObjList = this.retrieveAll(target, type)
        for (i = 0, len = retrievedTypeObjList.length; i < len; i++) {
            retrievedTypeObj = retrievedTypeObjList[i]
            for (j = 0, itemsLength = retrievedTypeObj.items.length; j < itemsLength; j++) {
                this.add(retrievedTypeObj.items[j], {type: retrievedTypeObj.type})
            }
        }
        return retrievedTypeObjList
    }

    add(url, cfg) {
        let item = this.addedItems[url]
        if (!item) {
            item = this._createItem(url, (cfg && cfg.type) ? cfg.type : this.retrieve(url).type, cfg)
        }

        if (cfg && cfg.onLoad) item.onLoaded.addOnce(cfg.onLoad)

        if (!this.itemUrls[url]) {
            this.itemUrls[url] = item
            this.itemList.push(item)
            this.totalWeight += item.weight
        }

        return item
    }

    load(url, cfg) {
        let item = this.addedItems[url]
        if (!item) {
            item = this._createItem(url, (cfg && cfg.type) ? cfg.type : this.retrieve(url).type, cfg)
        }

        if (cfg && cfg.onLoad) item.onLoaded.addOnce(cfg.onLoad)

        if (this.loadedItems[url]) {
            item.dispatch()
        } else {
            if (!item.isStartLoaded) {
                item.load()
            }
        }

        return item
    }

    start(onLoading) {
        if (onLoading) this.loadingSignal.add(onLoading)
        this.isLoading = true
        let len = this.itemList.length
        if (len) {
            let itemList = this.itemList.splice(0, this.itemList.length)
            let item
            for (let url in this.itemUrls) {
                delete this.itemUrls[url];
            }
            for (let i = 0; i < len; i++) {
                item = itemList[i]
                let isAlreadyLoaded = !!this.loadedItems[item.url]
                item.onLoaded.addOnce(this._onItemLoad, this, -1024, item, itemList, isAlreadyLoaded)
                if (item.hasLoading) {
                    item.loadingSignal.add(this._onLoading, this, -1024, item, itemList, undef)
                }

                if (isAlreadyLoaded) {
                    item.dispatch(this._onItemLoad)
                } else {
                    if (!item.isStartLoaded) {
                        this.queue.push(item)
                    }
                }
            }
            if (this.queue.length) {
                this.loadNext()
            }
        } else {
            this._onItemLoad.call(this, undef, this.itemList)
        }
    }

    loadNext() {
        if (this.queue.length && (this.activeItems.length < this.maxActiveItems)) {
            let item = this.queue.shift()
            this.activeItems.push(item)
            this.loadNext()
            item.load()
        }
    }

    _onLoading(item, itemList, loadingSignal, itemPercent, percent) {
        // leave the onLoading triggered by the _onItemLoad() to prevent stacked call.
        if (item && !item.isLoaded && (item.getCombinedPercent(itemPercent) === 1)) return
        if (percent === undef) {
            this.loadedWeight = this._getLoadedWeight(itemList)
            percent = this.loadedWeight / this.totalWeight
        }

        loadingSignal = loadingSignal || this.loadingSignal
        loadingSignal.dispatch(percent, item)
    }

    _getLoadedWeight(itemList) {
        var loadedWeight = 0
        for (var i = 0, len = itemList.length; i < len; i++) {
            loadedWeight += itemList[i].loadedWeight
        }
        return loadedWeight
    }

    _onItemLoad(item, itemList, isAlreadyLoaded) {
        this.loadedWeight = this._getLoadedWeight(itemList)

        if (!isAlreadyLoaded) {
            let activeItems = this.activeItems
            let i = activeItems.length
            while (i--) {
                if (activeItems[i] === item) {
                    activeItems.splice(i, 1)
                    break
                }
            }
        }

        let loadingSignal = this.loadingSignal
        if (this.loadedWeight === this.totalWeight) {
            this.isLoading = false
            this.loadedWeight = 0
            this.totalWeight = 0
            this.loadingSignal = new MinSignal()
            this._onLoading(item, itemList, loadingSignal, 1, 1)
            if (item && item.noCache) this._removeItemCache(item)
        } else {
            this._onLoading(item, itemList, loadingSignal, 1, this.loadedWeight / this.totalWeight)
            if (item && item.noCache) this._removeItemCache(item)
            if (!isAlreadyLoaded) {
                this.loadNext()
            }
        }
    }

    _removeItemCache(item) {
        let url = item.url
        item.content = undef
        this.addedItems[url] = undef
        this.loadedItems[url] = undef
    }

    _createItem(url, type, cfg) {
        cfg = cfg || {}
        if (!cfg.crossOrigin) {
            for (let domain in this.crossOriginMap) {
                if (url.indexOf(domain) === 0) {
                    cfg.crossOrigin = this.crossOriginMap[domain]
                    break
                }
            }
        }
        return new this.ITEM_CLASSES[type](url, cfg, this)
    }

    register(ItemClass) {
        if (!this.ITEM_CLASSES[ItemClass.type]) {
            this.ITEM_CLASS_LIST.push(ItemClass)
            this.ITEM_CLASSES[ItemClass.type] = ItemClass
        }
    }

    retrieveAll(target, type) {
        let i, retrievedTypeObj
        let len = target.length
        let retrievedTypeObjList = []
        if (len && (typeof target !== 'string')) {
            for (i = 0; i < len; i++) {
                retrievedTypeObj = this.retrieve(target[i], type)
                if (retrievedTypeObj) {
                    retrievedTypeObjList = retrievedTypeObjList.concat(retrievedTypeObj)
                }
            }
        } else {
            retrievedTypeObj = this.retrieve(target, type)
            if (retrievedTypeObj) {
                retrievedTypeObjList = retrievedTypeObjList.concat(retrievedTypeObj)
            }
        }
        return retrievedTypeObjList
    }

    retrieve(target, type) {
        let i, len, items, ItemClass, guessedType
        if (type) {
            ItemClass = this.ITEM_CLASSES[type]
            items = ItemClass.retrieve(target)
        } else {
            for (i = 0, len = this.ITEM_CLASS_LIST.length; i < len; i++) {
                ItemClass = this.ITEM_CLASS_LIST[i]
                guessedType = ItemClass.type

                if (typeof target === 'string') {
                    if (this.testExtensions(target, ItemClass)) {
                        items = [target]
                        break
                    }
                } else {
                    items = ItemClass.retrieve(target)
                    if (items && items.length && (typeof items[0] === 'string') && this.testExtensions(items[0], ItemClass)) {
                        break
                    }
                }
                items = undef
                guessedType = undef
            }
        }
        if (items) {
            return {
                type: type || guessedType,
                items: items
            }
        }
        return
    }

    testExtensions(url, ItemClass) {
        if (!url) return
        let urlExtension = this._getExtension(url)
        let extensions = ItemClass.extensions
        let i = extensions.length
        while (i--) {
            if (urlExtension === extensions[i]) {
                return true
            }
        }
        return false
    }

    _getExtension(url) {
        return url.split('.').pop().split(/#|\?/)[0]
    }

    create() {
        return new QuickLoader()
    }

    check() {
        let addedUrl = []
        let notLoadedUrl = []
        for (let url in this.addedItems) {
            addedUrl.push(url)
            if (!this.loadedItems[url]) {
                notLoadedUrl.push(this.addedItems[url])
            }
        }
        console.log({
            added: addedUrl,
            notLoaded: notLoadedUrl
        })
    }
}

export default QuickLoader
