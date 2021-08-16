import { foo } from './module/foo';

// 基本类型
let num: number;
let str: string;
let bool: boolean;

num = 123;
str = '123';
bool = true;

let boolArray: boolean[];

boolArray = [false, true];

boolArray[2] = false;

// 内联类型
let name: {
  first: string;
  last: string;
};

name = {
  first: 'jack',
  last: 'te',
};

// 接口
interface Name {
  first: string;
  last: string;
  age: number;
}

const _name: Name = {
  first: 'ke',
  last: 'te',
  age: 27,
};

export default name;

// 泛型
function sort<T>(arr: T[]): T[] {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[i]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
  }
  return arr;
}

const demoArr = [2, 4, 5, 1, 3];

sort(demoArr);

console.log(demoArr);

function log<T>(text: T): T {
  return text;
}

console.log(log('ss'));
console.log(log(true));
console.log(log(1234));

// 联合类型

let or: string | number | boolean;
or = 'xxx';
or = true;
or = 123;

function formatCommandLine(command: string[] | string): string {
  let line = '';
  if (typeof command === 'string') {
    line = command.trim();
  } else {
    line = command.join(' ').trim();
  }
  return line;
}

// 交叉类型

function extend<T extends object, U extends object>(
  first: T,
  second: U
): T & U {
  const result = <T & U>{};
  for (let id in first) {
    (<T>result)[id] = first[id];
  }
  for (let id in second) {
    if (!result.hasOwnProperty(id)) {
      (<U>result)[id] = second[id];
    }
  }

  return result;
}

const x = extend({ a: 1 }, { b: '222' });

const a = x.a;
const b = x.b;

console.log(x);

// 元组
let nameNumber: [string, number];

nameNumber = ['x', 12];
// nameNumber = ['x', '12']
// nameNumber = ['x', 12, '2']

// 类型别名

type person =
  | string
  | {
      name: string;
      age: number;
      hobbies: string[];
    };

let jack: person = {
  name: 'jack',
  age: 14,
  hobbies: ['sing', 'jump', 'ruby'],
};

jack = 'jack';

console.log(jack);

// 类型保护

interface Foo {
  foo: number;
  common: string;
}

interface Bar {
  bar: number;
  common: string;
}

function isFoo(arg: Foo | Bar): arg is Foo {
  return (arg as Foo).foo !== undefined;
}

// readonly
const immutable: {
  readonly bar: number;
} = {
  bar: 123,
};

function iMuate(imu: { bar: number }) {
  imu.bar = 456;
}

// immutable 被传入这个函数中，这个函数定义的参数中的 bar 是可以修改的
iMuate(immutable);

console.log(immutable.bar);

// 改成下述样式
// 使用接口定义类型
interface FFoo {
  readonly bar: number;
}

let foo: FFoo = {
  bar: 123,
};

function iTakeFoo(foo: FFoo) {
  // foo.bar = 456 // Error: bar 只读属性
}

iTakeFoo(foo);
