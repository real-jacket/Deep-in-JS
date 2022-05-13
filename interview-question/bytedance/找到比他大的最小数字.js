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
  console.log('target: ', target);

  if (target === null) return n;

  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[target] < arr[i]) {
      [arr[target], arr[i]] = [arr[i], arr[target]];
      break;
    }
  }

  if (target < arr.length - 2) {
    for (let i = target + 1; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j] < arr[i]) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }
  }

  return +arr.join('');
}

const res = getLargerNum(1234321);
console.log('res: ', res);
