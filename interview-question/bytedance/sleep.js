function tom() {
  const obj = {
    promise: Promise.resolve(),
    eat: (str) => {
      obj.promise.then(() => {
        console.log('eat', str);
      });
      return obj;
    },
    // 主要在于 sleep 的实现
    sleep: (timer) => {
      obj.promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, timer * 1000);
      });
      return obj;
    },
    play: (str) => {
      obj.promise.then(() => {
        console.log('play', str);
      });
      return obj;
    },
  };
  return obj;
}

// tom()
//   .eat('apple')
//   .eat('xxx')
//   .sleep(5)
//   .play('football')
//   .play('basketball')
//   .eat('banana')
//   .sleep(5)
//   .eat('banana');

// let a = tom();

// for (var i = 0; i < 6; i++) {
//   a = a.sleep(1).eat('banana');
// }

let p = Promise.resolve();

function sleep(cb) {
  p = p.then(() => {
    let _p = new Promise((resolve, reject) => {
      setTimeout(() => {
        cb();
        resolve();
      }, 2000);
    });
    return _p;
  });
}

for (let i = 0; i < 6; i++) {
  sleep(() => {
    console.log(i);
  });
}

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
