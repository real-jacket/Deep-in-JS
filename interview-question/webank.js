// 给定两个数组，写一个函数来计算它们的交集。
// 示例：
// 输入：
var a = [
  123,
  'webank',
  [1, 2, 3],
  '123',
  { a: 1 },
  'tencent',
  123,
  [1, 2, 3],
  { a: 1 },
];
var b = [123, '123455', { a: 2 }, [1, 2, 3], [1, 2, 3], 'hello', 'webank'];

// 输出：
// [123, [1, 2, 3], "webank"]

/**
 * 利用 json.stringfy 来快速对比
 * 时间复杂度为：O(m + n)
 */
function intersection(arr1, arr2) {
  const temp = new Set();
  const res = [];
  const cache = {};
  arr1.forEach((item) => {
    const key = JSON.stringify(item);
    if (!cache[key]) {
      cache[key] = true;
    }
  });
  arr2.forEach((item) => {
    const key = JSON.stringify(item);
    if (cache[key] && !temp.has(key)) {
      temp.add(key);
      res.push(item);
    }
  });

  return res;
}

console.log(intersection(a, b));

// 问题: 5个人分100颗宝石，
// 规则如下：由第一个人来提议分配方案（即每个人分别分得多少个），所有人投票表决。
// 当票数大于50 % 时，投票通过，按此分配方案执行。
// 当票数小于等于50 % 时，投票不通过，第一个人出局不再参与分配，由第二个人来继续提议分配方案，依次类推。
// 假设每个人都足够聪明，都希望自己的利益最大化，此时，第一个人应该提议什么样的分配方案对自己最有利。

/**
 * 思路是贪心 + 动态规划
 * 先考虑两人的方案，然后由局部推导到全局
 */

// 只有两个人的时候，即第 4 人与第 5人
// 4，5
// 由于无论如何 5 反对，则 5 可以获得所有的，此时 4 分配无意义，4 拿不到，所以结果为：
// 100，0

// 当有三人的时候，即 3、4、5人
// 3，4，5
// 由于由 3 分配，如果 3 分配通过，则 4、5 均拿不到，所以 4 为了拿到则必反对，所以 3 分配应该争取 5 的同意，
// 如何分配，只要保证 5 反对，由 4 分配给她的多就行，根据上一轮的分配可知 5 拿到的是 0 ，故分配给 5 多一个
// 99，0，1

// 当有四人时，即：
// 2、3、4、5
// 同理分析，由 2 分配，3 必反对，然后应该争取 4、5 的同意，同样对比上一轮的分配，确保 4、5 获得的多 1 就行
// 97，0，1，2

// 当有五人时，即：
// 1、2、3、4、5
// 1 分配，2 必反对，争取 3、4、5 中两人同意，为获取最大利益，则应该分配给 3、4、5 的最少，根据上一轮分配结果对比。
// 应该给 3、4 分配足够。
// 97，0，1，2，0

// 用代码计算
// n > 3
function getMaxBenefit(n, total) {
  const dp = new Array(n).fill(0);
  dp[n - 1] = total;
  for (let i = 2; i <= total; i++) {
    // i + 1 表示此时参与分配的人数，从后往前算
    // 先判断当前参与人数的奇偶性，如果为奇数，则需要获得除去当前人数外剩余人数一半的支持，如果为偶数，则需要获得剩余人数一半+1的支持
    const isOdd = (i + 1) % 2 === 1;
    if (isOdd) {
      // 需要获得剩余人数一半的支持
      const support = i / 2;
      for (let j = n - 1; j >= support; j--) {}
    }
  }
}

// 获取数组里最小的 n 个值，并在其基础上 + 1，其余设置为 0
function setMinN(arr, n) {
  const temp = [];
  arr.forEach((item, index) => {
    temp[index] = {
      value: item,
      index,
    };
  });

  temp.sort((a, b) => a.value - b.value);
  const minArr = [];
  const minMap = {};
  for (let i = 0; i < n; i++) {
    const index = temp[i].index;
    if (!minMap[index]) {
      minArr.push(index);
      minMap[index] = temp[i].value + 1;
    }
  }

  for (let i = 0; i < arr.length; i++) {
    if (minArr.includes(i)) {
      arr[i] = minMap[i];
    } else {
      arr[i] = 0;
    }
  }
}
