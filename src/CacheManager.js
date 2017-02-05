
export default class CacheManager {
    _cache = {}

    getCacheOrPorcess (key, processing) {
        if (true || !this._cache[key]) {
            this._cache[key] = processing.call()
        }
            
        return this._cache[key]
    }
    
    clearCache (key = null, sure = false) {
        if (key !== null) {
            delete this._cache[key]
        } else if (sure === true) {
            this._cache = {}
        }
    }
} 