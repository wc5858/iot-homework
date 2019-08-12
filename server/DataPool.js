class DataPool {
    constructor(size) {
        this.size = size
        this._data = new Array(size)
        this._cursor = 0
        this.hook = null
    }
    setHook(hook) {
        this.hook = hook
    }
    write(data) {
        this._data[this._cursor] = data
        this._cursor++
        if (this._cursor >= this.size) {
            this._cursor %= this.size
        }
        if(this.hook) {
            this.hook(data)
        }
    }
    read() {
        return this._data.slice(this._cursor).concat(this._data.slice(0, this._cursor))
    }
    reset() {
        this._data = new Array(this.size)
        this._cursor = 0
    }
}

module.exports = DataPool