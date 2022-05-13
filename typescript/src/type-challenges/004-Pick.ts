interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPick = MyPick<Todo, 'title' | 'completed'>;

const todoPick: TodoPick = {
  title: 'Clean room',
  completed: false,
};

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
