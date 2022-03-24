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

tom()
  .eat('apple')
  .eat('xxx')
  .sleep(5)
  .play('football')
  .play('basketball')
  .eat('banana');
