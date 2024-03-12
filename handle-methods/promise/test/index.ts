//@ts-nocheck
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';
import Promise from '../src/promise-b';

chai.use(sinonChai);

const assert: Chai.AssertStatic = chai.assert;

describe('Promise', () => {
  it('是一个类', () => {
    assert.isFunction(Promise);
    assert.isObject(Promise.prototype);
  });
  it('new Promise(fn) 必须接收一个函数', () => {
    assert.throw(() => {
      new Promise();
    });
    assert.throw(() => {
      new Promise(1);
    });
    assert.throw(() => {
      new Promise(false);
    });
    assert.throw(() => {
      new Promise([]);
    });
  });
  it('new Promise(fn) 中的 fn 会立即执行', () => {
    const fn = sinon.fake();
    new Promise(fn);
    assert(fn.called);
  });
  it('new Promise(fn) 会生成一个对象，里面有一个 then 方法', () => {
    assert(new Promise(() => {}).then);
  });
  it('new Promise(fn) 中的 fn 接受一个 onFulfilled 函数与一个 onRejected 函数', (done) => {
    new Promise((onFulfilled, onRejected) => {
      assert.isFunction(onFulfilled);
      assert.isFunction(onRejected);
      done();
    });
  });
  it('promise.then(success) 中的 success 会在 resolve 之后调用', (done) => {
    const success = sinon.fake();
    const promise = new Promise((resolve, onRejected) => {
      assert.isFalse(success.called);
      resolve();
      setTimeout(() => {
        assert.isTrue(success.called);
        done();
      }, 0);
    });

    promise.then(success, () => {});
  });

  it('promise.then(fail) 中的 fail 会在 reject 之后调用', (done) => {
    const fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called);
      reject();
      setTimeout(() => {
        assert.isTrue(fail.called);
        done();
      }, 0);
    });

    promise.then(() => {}, fail);
  });

  it('2.2.1 promise 中 onFulfilled 和 onRejected 都是可选的参数，如果不是函数必须忽略', () => {
    const promise = new Promise((resolve, reject) => {
      resolve();
    });
    promise.then(false, null);
    assert(1 === 1);
  });

  it('2.2.2 promise 中 如果onFulfilled是函数', (done) => {
    const success = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(success.called);
      resolve(333);
      resolve(2222);
      setTimeout(() => {
        assert(promise.state === 'fulfilled');
        assert.isTrue(success.calledOnce);
        assert(success.calledWith(333));
        done();
      }, 0);
    });

    promise.then(success, null);
  });

  it('2.2.3 promise 中 如果onRejected是函数', (done) => {
    const fail = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(fail.called);
      reject(333);
      reject(2222);
      setTimeout(() => {
        assert(promise.state === 'rejected');
        assert.isTrue(fail.calledOnce);
        assert(fail.calledWith(333));
        done();
      }, 0);
    });

    promise.then(null, fail);
  });

  it('2.2.5 onFulfilled和onRejected必须被当做函数调用', (done) => {
    const promise = new Promise((resolve) => {
      resolve();
    });
    promise.then(function () {
      'use strict';
      assert(this === undefined);
      done();
    });
  });

  it('2.2.6.1 promise 中 then可以在同一个promise里被多次调用,且 onFulfilled 按顺序调用', (done) => {
    const f1 = sinon.fake();
    const f2 = sinon.fake();
    const f3 = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(f1.called);
      assert.isFalse(f2.called);
      assert.isFalse(f3.called);
      resolve();
      setTimeout(() => {
        assert.isTrue(f1.called);
        assert.isTrue(f2.called);
        assert.isTrue(f3.called);
        assert(f2.calledAfter(f1));
        assert(f3.calledAfter(f2));
        done();
      }, 0);
    });

    promise.then(f1);
    promise.then(f2);
    promise.then(f3);
  });

  it('2.2.6.2 promise 中 then可以在同一个promise里被多次调用,且 onFulfilled 按顺序调用', (done) => {
    const f1 = sinon.fake();
    const f2 = sinon.fake();
    const f3 = sinon.fake();
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(f1.called);
      assert.isFalse(f2.called);
      assert.isFalse(f3.called);
      reject();
      setTimeout(() => {
        assert.isTrue(f1.called);
        assert.isTrue(f2.called);
        assert.isTrue(f3.called);
        assert(f2.calledAfter(f1));
        assert(f3.calledAfter(f2));
        done();
      }, 0);
    });

    promise.then(null, f1);
    promise.then(null, f2);
    promise.then(null, f3);
  });

  it('2.2.7 then必须返回一个promise', () => {
    const promise = new Promise((resolve) => {
      resolve();
    });
    const promise2 = promise.then(
      () => {},
      () => {}
    );
    assert(promise2 instanceof Promise);
  });
  it('2.2.7.1 如果 then(success, fail) 中的 success 返回一个值x, 运行 [[Resolve]](promise2, x) ', (done) => {
    const promise1 = new Promise((resolve) => {
      resolve();
    });
    promise1
      .then(
        () => '成功',
        () => {}
      )
      .then((result) => {
        assert.equal(result, '成功');
        done();
      });
  });
  it('2.2.7.1.2 success 的返回值是一个 Promise 实例', (done) => {
    const promise1 = new Promise((resolve) => {
      resolve();
    });
    const fn = sinon.fake();
    const promise2 = promise1.then(
      /*s1 */ () => new Promise((resolve) => resolve())
    );
    promise2.then(fn);
    setTimeout(() => {
      assert(fn.called);
      done();
    });
  });
  it('2.2.7.1.2 success 的返回值是一个 Promise 实例，且失败了', (done) => {
    const promise1 = new Promise((resolve) => {
      resolve();
    });
    const fn = sinon.fake();
    const promise2 = promise1.then(
      /*s1 */ () => new Promise((resolve, reject) => reject())
    );
    promise2.then(null, fn);
    setTimeout(() => {
      assert(fn.called);
      done();
    });
  });
  it('2.2.7.1.2 fail 的返回值是一个 Promise 实例', (done) => {
    const promise1 = new Promise((resolve, reject) => {
      reject();
    });
    const fn = sinon.fake();
    const promise2 = promise1.then(
      null,
      () => new Promise((resolve) => resolve())
    );
    promise2.then(fn, null);
    setTimeout(() => {
      assert(fn.called);
      done();
    });
  });
  it('2.2.7.1.2 fail 的返回值是一个 Promise 实例，且失败了', (done) => {
    const promise1 = new Promise((resolve, reject) => {
      reject();
    });
    const fn = sinon.fake();
    const promise2 = promise1.then(
      null,
      () => new Promise((resolve, reject) => reject())
    );
    promise2.then(null, fn);
    setTimeout(() => {
      assert(fn.called);
      done();
    });
  });
  it('2.2.7.2 如果success抛出一个异常e,promise2 必须被拒绝', (done) => {
    const promise1 = new Promise((resolve, reject) => {
      resolve();
    });
    const fn = sinon.fake();
    const error = new Error();
    const promise2 = promise1.then(() => {
      throw error;
    });
    promise2.then(null, fn);
    setTimeout(() => {
      assert(fn.called);
      assert(fn.calledWith(error));
      done();
    });
  });
  it('2.2.7.2 如果fail抛出一个异常e,promise2 必须被拒绝', (done) => {
    const promise1 = new Promise((resolve, reject) => {
      reject();
    });
    const fn = sinon.fake();
    const error = new Error();
    const promise2 = promise1.then(null, () => {
      throw error;
    });
    promise2.then(null, fn);
    setTimeout(() => {
      assert(fn.called);
      assert(fn.calledWith(error));
      done();
    });
  });
});
