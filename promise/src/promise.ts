class PromiseT {
  success = null
  fail = null
  resolve() {
    setTimeout(() => {
      this.success()
    }, 0
    )
  }
  reject() {
    this.fail()
  }
  constructor(fn) {
    if (typeof fn !== "function") {
      throw new Error("只接收函数")
    }
    fn(this.resolve.bind(this), this.resolve.bind(this))
  }
  then(success, fail) {
    this.success = success
    this.fail = fail
  }
}

export default PromiseT