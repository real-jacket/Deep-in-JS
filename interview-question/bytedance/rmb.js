class RMB {
  constructor(num) {
    this.num = num;
  }

  static add(...rmb) {
    const res = rmb.reduce((prev, cur) => prev + cur, 0);
    return new RMB(res);
  }

  add(rmb) {
    const res = this.num + rmb;
    return new RMB(res);
  }

  valueOf() {
    return this.num;
  }

  toString() {
    const str = this.num.toString();
    return (
      (str.slice(0, str.length - 2) || 0) +
      '元' +
      (str.slice(str.length - 2, str.length - 1) || 0) +
      '角' +
      str.slice(str.length - 1, str.length) +
      '分'
    );
  }
}

const cash1 = new RMB(101);
const cash2 = new RMB(87);
const cash3 = cash1.add(cash2);
const cash4 = RMB.add(cash1, cash2);
const cash5 = new RMB(cash1 + cash2);

console.log(`${cash3}`, `${cash4}`, `${cash5}`);
/**
 * 分别打印出 1元8角7分
 */
