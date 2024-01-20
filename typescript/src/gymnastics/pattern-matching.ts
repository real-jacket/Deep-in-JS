/** 数组类型 */

type arr = [1, 2, 3];

type GetFirst<Arr extends [...unknown[]]> = Arr extends [infer A, ...unknown[]]
  ? A
  : any;

type first = GetFirst<arr>;

type GetLast<Arr extends [...unknown[]]> = Arr extends [...unknown[], infer A]
  ? A
  : any;

type last = GetLast<arr>;

type PopArr<Arr extends [...unknown[]]> = Arr extends []
  ? []
  : Arr extends [...infer Rest, unknown]
  ? Rest
  : never;

type pop = PopArr<arr>;

type ShiftArr<Arr extends [...unknown[]]> = Arr extends []
  ? []
  : Arr extends [unknown, ...infer Rest]
  ? Rest
  : never;

type shift = ShiftArr<arr>;

/** 字符串类型 */

type str = 'kesunshine';

type StartWith<
  Str extends string,
  Prefix extends string
> = Str extends `${Prefix}${string}` ? true : false;

type isStart = StartWith<str, 'ke'>;

type Replace<
  Str extends string,
  From extends string,
  To extends string
> = Str extends `${infer Prefix}${From}${infer Suffix}`
  ? `${Prefix}${To}${Suffix}`
  : Str;

type replaceSun = Replace<Replace<str, 'shine', 'blink'>, 'sun', 'moon'>;

type Trim<Str extends string> = Str extends `${
  | ' '
  | '\n'
  | '\t'}${infer Content}${' ' | '\n' | '\t'}`
  ? `${Content}`
  : Str;

type TrimIn<Str extends string> = Str extends `${infer ContentA}${
  | ' '
  | '\n'
  | '\t'}${infer ContentB}`
  ? `${ContentA}${ContentB}`
  : Str;

type TrimAll<Str extends string> = TrimIn<Trim<Str>>;

type noTrim = TrimAll<' ab cd '>;

/** 函数 */

type GetParams<Func extends Function> = Func extends (
  ...args: infer Args
) => any
  ? Args
  : never;

type FnPa = GetParams<(...args: [number, string]) => void>;

type GetReturnType<Func extends Function> = Func extends (
  ...args: unknown[]
) => infer ReturnType
  ? ReturnType
  : never;

type FnReturn = GetReturnType<(...args: any[]) => 'xx'>;
