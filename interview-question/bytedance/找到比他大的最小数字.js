/**
 * 给定一个数字，以它的各位为元素，组合出下一个比它大的最小数字；
 * 比如1234，输出1243；
 * 比如12431，输出13124；
 */

/**
 * 获取比给定数字大的最小数字
 * @param {number} n - 给定的数字
 * @returns {number} - 比给定数字大的最小数字
 */
/**
 * 获取比给定数字大的最小数字
 * @param {number} n - 给定的数字
 * @returns {number} - 比给定数字大的最小数字
 */
function getLargerNum(n) {
  // 将数字转换为字符串，并分割为字符数组
  const arr = n.toString().split('');

  // 如果输入数字是一个字符，则直接返回该数字
  if (arr.length === 1) return n;
  let target = null;

  // 查找从右往左第一个递增的数对的位置
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[i - 1] < arr[i]) {
      target = i - 1;
      break;
    }
  }

  // 如果没有找到递增的数对，则返回原数字
  if (target === null) return n;

  // 将target位置的数与右边第一个比它大的数交换
  for (let i = arr.length - 1; i > 0; i--) {
    if (arr[target] < arr[i]) {
      [arr[target], arr[i]] = [arr[i], arr[target]];
      break;
    }
  }

  // 将target位置后的所有数字按递减顺序排列
  if (target < arr.length - 2) {
    let i = target + 1,
      j = arr.length - 1;
    while (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
      j--;
    }
  }

  // 将字符数组转换回数字并返回
  return +arr.join('');
}

const res = getLargerNum(1243);
console.log('res: ', res);
console.log('new res: ', getLargerNum(12431));
