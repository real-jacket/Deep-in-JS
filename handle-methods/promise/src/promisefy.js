function promisify(f, manyArgs = false) {
  return function (...args) {
    return Promise((resolve, reject) => {
      // 对 f 的回掉函数进行包装
      function callback(err, ...results) {
        if (err) {
          reject(err);
        } else {
          resolve(manyArgs ? results : results[0]);
        }
      }
      args.push(callback);
      f.call(this, ...args);
    });
  };
}
