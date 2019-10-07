import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
chai.use(sinonChai)

const aseert = chai.assert
import Promise from '../src/promise'

describe("Promise", () => {
  it("是一个类", () => {
    aseert.isFunction(Promise)
    aseert.isObject(Promise.prototype)
  })
  it("new Prmosie(fn) 必须接收一个函数", () => {
    aseert.throw(() => {
      //@ts-ignore
      new Promise()
    })
    aseert.throw(() => {
      //@ts-ignore
      new Promise(1)
    })
    aseert.throw(() => {
      //@ts-ignore
      new Promise(false)
    })
    aseert.throw(() => {
      //@ts-ignore
      new Promise([])
    })
  })
  it('new Promis(fn) 中的 fn 会立即执行', () => {
    const fn = sinon.fake()
    new Promise(fn)
    aseert(fn.called)
  })
  it('new Promise(fn) 会生成一个对象，里面有一个 then 方法', () => {
    aseert(new Promise(() => { }).then)
  })
  it("new Promise(fn) 中的 fn 接受一个 resolve 函数与一个 reject 函数", done => {
    new Promise((resolve, reject) => {
      aseert.isFunction(resolve)
      aseert.isFunction(reject)
      done()
    })
  })
  it("promise.then(success) 中的 success 会在 resolve 之后调用", done => {
    const success = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      aseert.isFalse(success.called)
      resolve()
      setTimeout(() => {
        aseert.isTrue(success.called)
        done()
      }, 0)
    })

    promise.then(success, () => { })
  })
})