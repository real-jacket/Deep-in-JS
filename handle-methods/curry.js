const _curry = function (fn) {
  return function (x) {
    return function (y) {
      return fn(x, y);
    };
  };
};

const _fn = (x, y) => x + y;

let _myfn = _curry(_fn);

console.log(_myfn(1)(2));

// 多参数柯里化；
const curry = function (fn) {
  return function curriedFn(...args) {
    // fn.length 表示的是函数的形参个数
    if (args.length < fn.length) {
      return function (...args2) {
        return curriedFn(...args, ...args2);
      };
    }

    return fn(...args);
  };
};
const fn = (x, y, z) => x + y + z;
const myfn = curry(fn);
console.log(myfn(1)(2)(3));

const s_curry = function (fn) {
  let args = [];
  function calc(..._args) {
    args = [...args, ..._args];

    if (args.length < fn.length) {
      return calc;
    } else {
      return fn.apply(this, args);
    }
  }

  return calc;
};

const s_fn = (x, y, z) => x + y + z;
const s_myfn = curry(fn);
console.log(s_myfn(1)(2)(3));
