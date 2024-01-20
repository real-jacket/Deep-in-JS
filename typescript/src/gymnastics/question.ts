/**
 * 给一个对象，深度扩展属性
 */

type DeepRecord<Obj extends Record<string, any>> = {
  [Key in keyof Obj]: Obj[Key] extends Record<string, any>
    ? DeepRecord<Obj[Key]>
    : Obj[Key];
} & Record<string, any>;

/**
 * {
 *  abc: 'desc'|'asc'
 *  bcd: false
 *  deg: false
 * }
 *
 * {
 *  bcd: 'desc'|'asc'
 *  abc: false
 *  deg: false
 * }
 * {
 *  deg: 'desc'|'asc'
 *  abc: false
 *  bcd: false
 * }
 */

type GenerateType<Keys extends string> = {
  [Key in Keys]: {
    [Key1 in Key]: 'desc' | 'asc';
  } & {
    [Key2 in Exclude<Keys, Key>]: false;
  };
}[Keys];

type XA = 'abc' | 'bcd' | 'deg';
type XB = GenerateType<XA>;

var a: XB = {
  abc: false,
  bcd: false,
  deg: 'asc',
};

/**
 * 给 zip 函数设置类型
 */

type Zip<One extends unknown[], Other extends unknown[]> = One extends [
  infer OneFirst,
  ...infer OneRest
]
  ? Other extends [infer OtherFirst, ...infer OtherRest]
    ? [[OneFirst, OtherFirst], ...Zip<OneRest, OtherRest>]
    : []
  : [];

type Mutable<Obj> = {
  -readonly [Key in keyof Obj]: Obj[Key];
};

function zip<
  Target extends readonly unknown[],
  Source extends readonly unknown[]
>(target: Target, source: Source): Zip<Mutable<Target>, Mutable<Source>>;

function zip(target: unknown[], source: unknown[]): unknown[];

function zip(target: unknown[], source: unknown[]) {
  if (!target.length || !source.length) return [];

  const [one, ...rest1] = target;
  const [other, ...rest2] = source;

  return [[one, other], ...zip(rest1, rest2)];
}

const res = zip([1, '2', 3] as const, [4, 5, 6] as const);

const aa = [1, 2, 3] as const;
const b = [4, 5, 6] as const;

const res2 = zip(aa, b);

/**
 * 实现一个 type 类型，用于约束时间格式的字符串
 * 例子：
 * FormatDate<"DD-MM-YY">
 * 允许的字符串为：
 * const date:FormatDate<"DD-MM-YY"> = "12-12-2024" | "12-02-2024"
 * 不允许的字符串为：
 * const date:FormatDate<"DD-MM-YY"> = "121-12-2024" | "12-02-22024"
 * 时间格式采用多种分隔符：”-“ ｜ “/” ｜ “.”
 */

type Separator = '-' | '.' | '/';

type Num = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type Num2 = Num | 0;

type YY = `19${Num2}${Num2}` | `20${Num2}${Num2}`;

type MM = `0${Num}` | `1${0 | 1 | 2}`;

type DD = `${0}${Num}` | `${1 | 2}${Num2}` | `3${0 | 1}`;

type GenStr<Type extends string> = Type extends 'YY'
  ? YY
  : Type extends 'MM'
  ? MM
  : DD;

type FormatDate<Str extends string> =
  Str extends `${infer DD}${Separator}${infer MM}${Separator}${infer YY}`
    ? Str extends `${DD}${infer Sep}${MM}${infer Sep}${YY}`
      ? `${GenStr<DD>}${Sep}${GenStr<MM>}${Sep}${GenStr<YY>}`
      : never
    : never;

const XA: FormatDate<'YY-MM-DD'> = '1900-01-06';
const XB: FormatDate<'DD/MM/YY'> = '01/01/1905';
const XC: FormatDate<'DD/MM/YY'> = '01/01/1901';
