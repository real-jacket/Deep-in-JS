/**
 * 给定一个数字，以它的各位为元素，组合出下一个比它大的最小数字；
 * 比如1234，输出1243；
 * 比如1243，输出1324；
 */

function getLargerNum(n) {
  const arr = n.toString().split('');

  if (arr.length === 1) return n;
  let target = null;

  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[i - 1] < arr[i]) {
      target = i - 1;
      break;
    }
  }

  if (target === null) return n;

  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[target] < arr[i]) {
      [arr[target], arr[i]] = [arr[i], arr[target]];
      break;
    }
  }

  // 后面应该是递减的顺序,直接倒序即可
  if (target < arr.length - 2) {
    let i = target + 1,
      j = arr.length - 1;
    while (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }

  return +arr.join('');
}

const res = getLargerNum(1243);
console.log('res: ', res);
