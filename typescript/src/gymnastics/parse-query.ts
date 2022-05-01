/**
 * 将 url query string 转化成对应的对象类型
 *
 * 'a=1&b=2&c=3' ==> {a:1,b,2,c:3 }
 */

// {a:[1,2],b:1,c:5 }
type demo = ParseQuery<'a=1&b=1&a=3&c=5'>;

type ParseQuery<Str extends string> = Str extends `${infer Param}&${infer Rest}`
  ? MergeParams<ParseParma<Param>, ParseQuery<Rest>>
  : ParseParma<Str>;

// 转化 a=1 ==> {a:1}
type ParseParma<Param extends string> =
  Param extends `${infer Key}=${infer Value}`
    ? {
        [K in Key]: Value;
      }
    : never;

// 合并两个 Param: {a:1} {b:1}
type MergeParams<
  OneParam extends Record<string, any>,
  OtherParam extends Record<string, any>
> = {
  [Key in keyof OneParam | keyof OtherParam]: Key extends keyof OneParam
    ? Key extends keyof OtherParam
      ? MergeValue<OneParam[Key], OtherParam[Key]>
      : OneParam[Key]
    : Key extends keyof OtherParam
    ? OtherParam[Key]
    : never;
};

// 合并两个相同的 value: {a:1},{a:2} =>{a: [1,2]}
type MergeValue<One, Other> = One extends Other
  ? One
  : Other extends unknown[]
  ? [One, ...Other]
  : [One, Other];
