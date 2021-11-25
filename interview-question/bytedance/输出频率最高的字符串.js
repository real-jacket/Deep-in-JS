/**
 * 给出一个字符串，输出频率最高的字符，如果相同则输出最优出现的字符
 *
 */

function getMostCommonStr(str) {
  const obj = {};
  let max;

  for (let i = 0; i < str.length; i++) {
    const s = str[i];
    if (!s) return;
    if (!obj[s]) {
      obj[s] = 1;
    } else {
      obj[s] += 1;
      if (!max || obj[s] > obj[max]) {
        max = s;
      }
    }
  }

  return max;
}

var str = 'hellooo woord, every bodyyyyy';

console.log('target str: ', getMostCommonStr(str));
