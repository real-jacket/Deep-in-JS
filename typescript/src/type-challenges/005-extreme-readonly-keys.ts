interface TodoRead {
  readonly title: string;
  readonly description: string;
  completed: boolean;
}

type KeysRead = GetReadonlyKeys<TodoRead>; // expected to be "title" | "description"

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type GetReadonlyKeys<T> = keyof {
  [K in keyof T as Equal<Pick<T, K>, Readonly<Pick<T, K>>> extends true
    ? K
    : never]: T[K];
};
