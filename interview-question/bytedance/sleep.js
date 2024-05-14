/**
 * 解法1:
 * 通过 promise 来维护一个队列
 * 注意点：
 * 需要全局维护一个 promise 不断更新 promise 的值，保证每次 promise 链的顺序
 *
 */
function tom() {
  let promise = Promise.resolve();
  const obj = {
    eat(str) {
      promise = promise.then(() => {
        console.log('eat', str);
      });
      return this;
    },
    // 主要在于 sleep 的实现
    sleep(timer) {
      promise = promise.then(() => {
        return new Promise((resolve, reject) => {
          console.log(`sleep: ${timer}s`);
          setTimeout(() => {
            resolve();
          }, timer * 1000);
        });
      });
      return obj;
    },
    play(str) {
      promise = promise.then(() => {
        console.log('play', str);
      });
      return obj;
    },
  };
  return obj;
}

tom()
  .eat('apple')
  .eat('xxx')
  .sleep(5)
  .play('football')
  .play('basketball')
  .eat('banana')
  .sleep(5)
  .eat('banana');

// let a = tom();

// for (var i = 0; i < 6; i++) {
//   a = a.sleep(1).eat('banana');
// }

// let p = Promise.resolve();

// function sleep(cb) {
//   p = p.then(() => {
//     let _p = new Promise((resolve, reject) => {
//       setTimeout(() => {
//         cb();
//         resolve();
//       }, 2000);
//     });
//     return _p;
//   });
// }

// for (let i = 0; i < 6; i++) {
//   sleep(() => {
//     console.log(i);
//   });
// }

/**
 * 链式调用
 * 1. 任务队列
 * 2. next 执行器
 * 3. 异步调用
 */

class LazyMan {
  name = 'no-name';
  tasks = [];

  constructor(name) {
    this.name = name;
    setTimeout(() => {
      this.next();
    });
  }

  next() {
    const task = this.tasks.shift();
    task?.();
  }

  eat(fruit) {
    const task = () => {
      console.log(`Eat ${fruit}`);
      this.next();
    };

    this.tasks.push(task);

    return this;
  }
  sleep(second) {
    const task = () => {
      console.log(`sleep ${second}s`);
      setTimeout(() => {
        this.next();
      }, second * 1000);
    };

    this.tasks.push(task);

    return this;
  }
}

const jack = new LazyMan('kk');

jack.eat('apple').eat('banana').sleep(1).eat('orange').sleep(2).eat('grape');

/**
 * 上面这种实现的非类写法
 */

function lazyMan(name) {
  console.log('name: ', name);

  let tasks = [];
  const next = () => {
    const task = tasks.shift();
    task?.();
  };

  const obj = {
    eat(fruit) {
      const task = () => {
        console.log(`Eat ${fruit}`);
        next();
      };

      tasks.push(task);
      return this;
    },
    sleep(second) {
      const task = () => {
        console.log(`sleep ${second}s`);
        setTimeout(() => {
          next();
        }, second * 1000);
      };
      tasks.push(task);
      return this;
    },
  };

  setTimeout(() => {
    next();
  });
  return obj;
}

const man = lazyMan('kk')
  .eat('apple')
  .eat('banana')
  .sleep(5)
  .eat('orange')
  .sleep(5)
  .eat('grape');
