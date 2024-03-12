interface Executor {
  (resolved: Resolved, rejected: Rejected): any;
}

interface Resolved {
  (value: any): any;
}

interface Rejected {
  (error: any): any;
}

class MyPromiseB {
  private static PENDING = 'pending';
  private static RESOLVED = 'fulfilled';
  private static REJECT = 'rejected';
  state: string = MyPromiseB.PENDING;
  value: any;
  reason: any;

  resolveCallback: Resolved[] = [];
  rejectCallback: Rejected[] = [];

  constructor(executor: Executor) {
    if (typeof executor !== 'function') {
      throw Error('必须是一个函数');
    }

    const resolveHandler = (result) => {
      nextTick(() => {
        if (this.state === MyPromiseB.PENDING) {
          this.state = MyPromiseB.RESOLVED;
          this.value = result;
          this.resolveCallback.forEach((fn) => fn(this.value));
        }
      });
    };
    const rejectHandler = (reason) => {
      nextTick(() => {
        if (this.state === MyPromiseB.PENDING) {
          this.state = MyPromiseB.REJECT;
          this.reason = reason;
          this.rejectCallback.forEach((fn) => fn(this.reason));
        }
      });
    };

    try {
      executor(resolveHandler, rejectHandler);
    } catch (error) {
      rejectHandler(error);
    }
  }

  then(_resolve?: Resolved | null, _reject?: Rejected | null) {
    _resolve = typeof _resolve === 'function' ? _resolve : (v) => v;
    _reject = typeof _reject === 'function' ? _reject : (v) => v;

    if (this.state === MyPromiseB.PENDING) {
      const p0 = new MyPromiseB((resolve, reject) => {
        this.resolveCallback.push(() => {
          try {
            const newValue = _resolve!(this.value);
            if (newValue instanceof MyPromiseB) {
              //@ts-ignore
              newValue.then(
                (res) => {
                  resolve(res);
                },
                (err) => {
                  reject(err);
                }
              );
            } else {
              resolve(newValue);
            }
          } catch (error) {
            reject(error);
          }
        });

        this.rejectCallback.push(() => {
          try {
            const newReason = _reject!(this.reason);
            if (newReason instanceof MyPromiseB) {
              //@ts-ignore
              newReason.then(
                (res) => {
                  resolve(res);
                },
                (err) => {
                  reject(err);
                }
              );
            } else {
              reject(newReason);
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      return p0;
    }

    if (this.state === MyPromiseB.RESOLVED) {
      const p1 = new MyPromiseB((resolve, reject) => {
        try {
          const newValue = _resolve!(this.value);
          if (newValue instanceof MyPromiseB) {
            //@ts-ignore
            newValue.then(
              (res) => {
                resolve(res);
              },
              (err) => {
                reject(err);
              }
            );
          } else {
            resolve(newValue);
          }
        } catch (error) {
          reject(error);
        }
      });

      return p1;
    }

    if (this.state === MyPromiseB.REJECT) {
      const p2 = new MyPromiseB((resolve, reject) => {
        try {
          const newReason = _reject!(this.reason);
          resolve(newReason);
        } catch (error) {
          reject(error);
        }
      });

      return p2;
    }
  }

  catch(fn) {
    return this.then(null, fn);
  }
}

function nextTick(fn): any {
  if (process !== undefined && typeof process.nextTick === 'function') {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true,
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}

export default MyPromiseB;
