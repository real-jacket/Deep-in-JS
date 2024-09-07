function parseQueryString(url) {
  const queryString = url.split('?')[1];
  const params = new URLSearchParams(queryString);
  const result = {};

  for (let [key, value] of params) {
    key = decodeURIComponent(key);
    value = decodeURIComponent(value);
    // 处理数组形式的参数
    if (key.endsWith('[]')) {
      // 去掉末尾的 '[]'
      key = key.slice(0, -2);
      if (!params[key]) {
        result[key] = value.split(',');
      }
    } else {
      // 处理布尔类型的参数
      if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
        result[key] = value.toLowerCase() === 'true';
      } else {
        result[key] = value;
      }
    }
  }

  return result;
}

function testParseQueryString(url, target) {
  const res = JSON.stringify(parseQueryString(url)) === JSON.stringify(target);
  console.log(`Test case ${url}: ${res ? 'Pass' : 'Fail'}`);
}

testParseQueryString(
  'https://coupang.com?name=coupang&isWow=true&regionIds[]=11,13,21',
  {
    name: 'coupang',
    isWow: true,
    regionIds: ['11', '13', '21'],
  }
);

testParseQueryString(
  'https://coupang.com?name=abcr&isWow=false&isWoxwr=fa1lse&regionIds[]=11,13,21',
  {
    name: 'abcr',
    isWow: false,
    isWoxwr: 'fa1lse',
    regionIds: ['11', '13', '21'],
  }
);

// Please implement a function to add two number arrays. The number array would only includes number type elements, value range 0~9.
// console.log(addArray([9], [2])) console.log(addArray([1, 9], [2])) console.log(addArray([1, 9, 9], [2, 2, 0, 2])) => [1, 1][2, 1][2, 4, 0, 1]

function addArray(a, b) {
  const res = BigInt(a.join('')) + BigInt(b.join(''));
  return res.toString().split('').map(Number);
}

console.log(addArray([1, 9, 9], [2, 2, 0, 2]));

// Please implement a function to calculate the days between two dates or today,
//   input date supports DateString / DateObject / timestamp

function daysFromToday(date) {
  const today = new Date();
  const inputDate = new Date(date);
  const diffTime = Math.abs(inputDate - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

console.log('1.date to now: ', daysFromToday('2024-1-30'));
console.log('2.date to now: ', daysFromToday(new Date('2024-1-1')));
console.log('3.date to now: ', daysFromToday(new Date('2024-1-1').getTime()));

// Please implement the Arrays intersection, union and subtract:

// eg:

// var a = [ 1, 2, 3, ]

// var b = [ 2, 3, 4 ]

// intersection(a, b) == [2, 3],

// union(a, b) = [1,2,3,4], substract(a, b) == [1]

function intersection(a, b) {
  return a.filter((item) => b.includes(item));
}

function union(a, b) {
  return [...new Set([...a, ...b])];
}

function subtract(a, b) {
  return a.filter((item) => !b.includes(item));
}

/* * Please create a function to achieve the question.

* Reverse the value of a number, * for example:

* given -123456789, you'll get -987654321.

* You should not convert number type to string.

* * Here is the fundamental way of analytic solution.

* 1. 通过整除获取数字各个分位的数字

* 2. 通过数字十进制进位累加获取最后的答案

* 3. 合并上述两个操作，在整除的同时去累加计算

* * please fill out all the test cases which can cover the function * revertNumber(123456789) */
function revertNumber(num) {
  const isNegative = num < 0;
  isNegative && (num = -num);
  let result = 0;
  while (num > 0) {
    const mod = num % 10;
    result = result * 10 + mod;
    num = Math.floor(num / 10);
  }

  return isNegative ? -result : result;
}

function testRevertNumber(num1, num2) {
  const res = revertNumber(num1);
  console.log(`Test case ${num1}: ${res === num2 ? 'Pass' : 'Fail'}`);
}

testRevertNumber(-123456789, -987654321);
testRevertNumber(123456789, 987654321);

const arr1 = [2, 3, 4, 55, 7, 8, 9, 9, 9, 11, 2, 0];

function uniqueArr(arr) {
  if (arr.length <= 1) return arr;
  let slow = 0;
  let fast = 0;
  const map = {};
  while (fast <= arr.length - 1) {
    if (!map[arr[fast]]) {
      map[arr[fast]] = true;
      arr[slow] = arr[fast];
      slow++;
    }
    fast++;
  }

  arr.length = slow;
}
const res = uniqueArr(arr1);
console.log('res: ', arr1);
