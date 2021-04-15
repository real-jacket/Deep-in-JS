/**
 * @file 视屏下载缓冲区
 */

class BufferCache {
  constructor(cutSize = 1024) {
    this._cache = Buffer.alloc(0);
    this.cutSize = cutSize;
    this.readyCache = []; // 缓冲区
  }

  pushBuf(buf) {
    let cacheLength = this._cache.length;
    let bufLength = buf.length;
    this._cache = Buffer.concat([this._cache, buf], cacheLength + bufLength);
    this.cut();
  }

  cut() {
    if (this._cache.length >= this.cutSize) {
      let totalLen = this._cache.length;
      let cutCount = Math.floor(totalLen / this.cutSize);
      for (let i = 0; i < cutCount; i++) {
        let newBuf = Buffer.alloc(this.cutSize);
        this._cache.copy(newBuf, 0, i * this.cutSize, (i + 1) * this.cutSize);
        this.readyCache.push(newBuf);
      }
      this._cache = this._cache.slice(cutCount * this.cutSize);
    }
  }

  getChunks() {
    return this.readyCache;
  }

  getRemainChunks() {
    if (this._cache.length <= this.cutSize) {
      return this._cache;
    } else {
      this.cut();
      return this.getRemainChunks();
    }
  }
}

module.exports = BufferCache;
