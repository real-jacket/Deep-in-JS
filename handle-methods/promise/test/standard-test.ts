import * as PromisesAplusTests from 'promises-aplus-tests';

// 这个是 实现的 Promise/A+ 代码
import MyPromise from '../src/promise-js';

//@ts-ignore
MyPromise.defer = MyPromise.deferred = function () {
  const result: any = {};
  result.promise = new MyPromise((resolve: any, reject: any) => {
    result.resolve = resolve;
    result.reject = reject;
  });
  return result;
};

// mocha 运行 promises-aplus-tests 测试用例
describe('Promises/A+ Tests', function () {
  PromisesAplusTests.mocha(MyPromise);
});
