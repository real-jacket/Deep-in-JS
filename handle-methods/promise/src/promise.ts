class PromiseT {
  state = null
  callList = []
  resolve(result) {
    if (this.state !== "pending") return
    this.state = "fulfilled"
    setTimeout(() => {
      this.callList.forEach(handle => {
        if (typeof handle[0] === "function") {
          handle[0].call(undefined, result)
        }
      });
    }, 0
    )
  }
  reject(reason) {
    if (this.state !== "pending") return
    this.state = "rejected"
    setTimeout(() => {
      this.callList.forEach(handle => {
        if (typeof handle[1] === "function") {
          handle[1].call(undefined, reason)
        }
      });
    }, 0)
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接收函数")
    }
    this.state = "pending"
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(onFulfilled?, onRejected?) {
    const handle = []
    handle[0] = onFulfilled
    handle[1] = onRejected
    this.callList.push(handle)
    return undefined
  }
}

export default PromiseT