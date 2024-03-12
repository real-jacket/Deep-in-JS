type State = 'pending' | 'fulfilled' | 'rejected';

type CallBack = [((value: any) => any)?, ((reason: any) => any)?];

class PromiseT<T = any> {
  state: State = 'pending';
  callList: CallBack[] = [];
  resolve(result) {
    if (this.state !== 'pending') return;
    this.state = 'fulfilled';
    setTimeout(() => {
      this.callList.forEach((handle) => {
        if (typeof handle[0] === 'function') {
          handle[0].call(undefined, result);
        }
      });
    }, 0);
  }
  reject(reason) {
    if (this.state !== 'pending') return;
    this.state = 'rejected';
    setTimeout(() => {
      this.callList.forEach((handle) => {
        if (typeof handle[1] === 'function') {
          handle[1].call(undefined, reason);
        }
      });
    }, 0);
  }
  constructor(fn?) {
    if (typeof fn !== 'function') {
      throw new Error('只接收函数');
    }
    this.state = 'pending';
    fn(this.resolve.bind(this), this.reject.bind(this));
  }
  then(onFulfilled?, onRejected?) {
    const handle: CallBack = [];
    if (typeof onFulfilled === 'function') {
      handle[0] = onFulfilled;
    }
    if (typeof onRejected === 'function') {
      handle[1] = onRejected;
    }
    this.callList.push(handle);
    return this;
  }

  resolveWithPromise(x: PromiseT) {
    x.then(
      (result) => {
        this.resolve(result);
      },
      (reason) => {
        this.reject(reason);
      }
    );
  }
}

export default PromiseT;
