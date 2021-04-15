// 假设有一台本地机器，无法做加减乘除运算（包括位运算），因此无法执行 a + b、a+ = 1 这样的 JS 代码，然后我们提供一个服务器端的 HTTP API，可以传两个数字类型的参数，响应结果是这两个参数的和，这个 HTTP API 的 JS SDK（在本地机器上运行）的使用方法如下：

// asyncAdd(3, 5, (err, result) => {
//   console.log(result); // 8
// });

// SDK 的模拟实现：

function asyncAdd(a, b, cb) {
  setTimeout(() => {
    cb(null, a + b);
  }, Math.floor(Math.random() * 1000));
}

// promisify

function promisify(fn) {
  let that = this;
  return (...args) => {
    return new Promise((resolve, reject) => {
      fn.apply(that, [
        ...args,
        (err, data) => {
          if (err) return reject(err);
          resolve(data);
        },
      ]);
    });
  };
}

const _asyncAdd = promisify(asyncAdd);

// function sum(...args) {
//   return new Promise((resolve, reject) => {
//     if (args.length === 1) resolve(args[0]);
//     const resultArr = [];
//     let mid = (operateTime = Math.floor(args.length / 2));
//     const odd = args.length % 2 > 0;
//     for (let i = 0; i < operateTime; i++) {
//       _asyncAdd(args[i], args[args.length - i - 1])
//         .then((result) => {
//           operateTime--;
//           resultArr.push(result);
//         })
//         .then(async () => {
//           if (operateTime === 0) {
//             if (odd) {
//               resolve(sum(...[...resultArr, args[mid]]));
//               // 下面这个方式应该更快点，但是从代码逻辑上看，上面的写法更好
//               // const result = await sum(...resultArr);
//               // resolve(_asyncAdd(result, args[mid]));
//             } else {
//               resolve(sum(...resultArr));
//             }
//           }
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     }
//   });
// }

// 关于第二个方法优化的思考，鉴于第一个方法存在递归前套会造成性能损耗且逻辑有点绕，于是采用队列配合动态规划的方式去循环处理
function sum(...args) {
  let queue = [...args];
  return new Promise((resolve, reject) => {
    let taskNum = 0; // 记录任务线程
    let calculatedIndex = 0; // 已经计算的坐标
    function start() {
      taskNum++;
      _asyncAdd(queue[calculatedIndex], queue[calculatedIndex + 1])
        .then((data) => {
          queue.push(data);
          taskNum--;
        })
        .then(() => {
          // 每一次计算完后判断是否需要重新启动
          if (calculatedIndex === queue.length - 1 && taskNum === 0) {
            resolve(queue[calculatedIndex]);
          } else if (queue.length - 1 - calculatedIndex >= 1) {
            // 当大于或等于 2 个数时，重新启动计算
            start();
          }
          // 当只有一个数字时，且还有在执行的任务，此时什么都不做，交给下一个 promise 去处理
        })
        .catch((err) => {
          reject(err);
        });
      calculatedIndex += 2;
    }
    // 最开始并行最大次数，这里由于事件循环会导致 promise 在同步循环之后才开始处理，会启动多个任务
    while (calculatedIndex < queue.length - 1) {
      start();
    }
  });
}

// 现在要求在本地机器上实现一个 sum 函数，支持以下用法：

(async () => {
  const result1 = await sum(1, 4, 6, 9, 2, 4);
  // console.log(result1);
  const result2 = await sum(3, 4, 9, 2, 5, 3, 2, 1, 7);
  const result3 = await sum(1, 6, 0, 5);
  console.log([result1, result2, result3]); // [26, 36, 12]
})();

// 要求 sum 能在最短的时间里返回以上结果
