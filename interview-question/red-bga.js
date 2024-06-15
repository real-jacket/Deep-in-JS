// 微信分红包，每个人不得分 0，且需要两位小数

function septateBag(total, num) {
  const base = total / num;

  let remain = 0;

  const resArr = [];

  for (let i = 0; i < num; i++) {
    let res = 0;
    while (!res) {
      res = Math.floor(Math.random() * base * 100);
    }
    remain += base * 100 - res;
    resArr[i] = res;
  }
  while (remain > 0) {
    const randomIndex = Math.floor(Math.random() * num);
    let randomPlus = 0;
    if (remain > 1) {
      randomPlus = Math.floor(Math.random() * remain);
    } else {
      randomPlus = remain;
    }

    resArr[randomIndex] += randomPlus;
    remain -= randomPlus;
  }

  for (let i = 0; i < resArr.length; i++) {
    resArr[i] = resArr[i] / 100;
  }
  return resArr;
}

const res1 = septateBag(100, 10);
console.log('res1:', res1);
const test1Total = res1.reduce((prev, curr) => prev + curr * 100, 0);
if (test1Total !== 100 * 100) {
  console.error('test1Total error');
} else {
  console.log('test1Total success');
}
