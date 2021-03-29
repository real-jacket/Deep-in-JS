// 交叉类型
type LeftType = {
  id: number;
  left: string;
};

type RightType = {
  id: number;
  right: string;
};

type IntersectionTy = LeftType & RightType;

function showType(args: IntersectionTy) {
  console.log(args);
}

showType({
  id: 1,
  left: 'test',
  right: 'test',
});

// 联合类型
type UnionType = string | number;
function showUnionType(arg: UnionType) {
  console.log(arg);
}

showUnionType('test');
showUnionType(7);

//  范型
interface GenericType<U, T> {
  id: U;
  name: T;
}
function showParadigmType(args: GenericType<string, string[]>) {
  console.log(args);
}

showParadigmType({ id: '2', name: ['this', 'is', 'a', 'test'] });

function showParadigmTypeTwo(args: GenericType<number, number>) {
  console.log(args);
}
showParadigmTypeTwo({ id: 2, name: 12 });

// Partial 允许将 T 的所有类型设置为可选

interface PartialType {
  id: number;
  firstName: string;
  lastName: string;
}

function showPartialType(args: Partial<PartialType>) {
  console.log(args);
}

showPartialType({ id: 1 });
showPartialType({ id: 1, firstName: 'jack' });
showPartialType({ firstName: 'jack', lastName: 'ke' });

// Required T 所有的类型都为必须
interface RequiredType {
  id: number;
  firstName?: string;
  lastName?: string;
}

function showRequiredType(args: Required<RequiredType>) {
  console.log(args);
}

showRequiredType({ id: 12, firstName: 'jack', lastName: 'ke' });

// ReadOnly 将 T 所有的类型变为只读

interface ReadonlyType {
  id: number;
  name: string;
}

function showReadonlyType(args: Readonly<ReadonlyType>) {
  // args.id = 4; error
  // args.name = 'ke'; error
  console.log(args);
}

showReadonlyType({ id: 2, name: 'ke' });

// Pick 从 T 中取出 K 中指定的属性

interface PickType {
  id: number;
  firstName: string;
  lastName: string;
}

function showPickType(args: Pick<PickType, 'firstName' | 'lastName'>) {
  console.log(args);
}
showPickType({
  firstName: 'jack',
  lastName: 'ke',
});

// Omit 与 Pick 相反，不是选择元素，而是从类型 T 中剔除 K 属性
interface OmitType {
  id: number;
  firstName: string;
  lastName: string;
}

function showOmitType(args: Omit<OmitType, 'firstName' | 'lastName'>) {
  console.log(args);
}

showOmitType({ id: 7 });

// Extract 从 T 中提取所有可以分配给 U 的类型,就相当于从 T，U 中提取公共的类型

interface FirstType {
  id: number;
  firstName: string;
  lastName: string;
}

interface SecondType {
  id: number;
  address: string;
  city: string;
}

type ExtractType = Extract<keyof FirstType, keyof SecondType>;

// Exclude 从 T 中剔除所有可以分配给 U 的类型，就是提取 T，U 中不同的类型

type ExcludeType = Exclude<keyof FirstType, keyof SecondType>;

// Record <K,T> 构造具有给定类型 T 的一组 K 的类型。在将一个类型的属性映射到另一个类型的属性时， Record 非常方便

interface EmployeeType {
  id: number;
  fullName: string;
  role: string;
}

let employees: Record<number, EmployeeType> = {
  0: { id: 1, fullName: 'John Doe', role: 'Designer' },
  1: { id: 2, fullName: 'Ibrahima Fall', role: 'Developer' },
  2: { id: 3, fullName: 'Jack', role: 'Developer' },
};

// NonNullable 从类型中剔除 null 和 undefeated

type NonNullableType = string | number | null | undefined;

function showNonNullType(args: NonNullable<NonNullableType>) {
  console.log(args);
}

showNonNullType(1);
// showNonNullType(undefined);
// showNonNullType(null);

// Mapped types 允许你采用现有模型并将每个属性转换为新类型
type StringMap<T> = {
  [P in keyof T]: string;
};

function showMapType(arg: StringMap<{ id: number; name: string }>) {
  console.log(arg);
}

showMapType({ id: '1', name: 'jack' });
showMapType({ id: '2', name: 'John' });

// 类型保护

// typeof
// instanceof
// in

// 条件类型 测试两种类型，根据测试的结果选择其中一种
type NonString<T> = T extends string ? never : T;

type NoStringType = string | number | null | undefined;

function showNoStringType(args: NonString<NoStringType>) {
  console.log(args);
}

// showNoStringType('x'); error
showNoStringType(1);
showNoStringType(null);
showNoStringType(undefined);
