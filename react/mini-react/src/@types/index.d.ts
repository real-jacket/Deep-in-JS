interface JSXElement {
  type: string;
  props: {
    [key: string]: any;
    children: JSXElement[];
  };
}

interface FiberNode<T = any> {
  type: string | Function;
  dom: HTMLElement | null;
  child?: FiberNode | null;
  parent: FiberNode | null;
  sibling?: FiberNode | null;
  alternate: FiberNode | null;
  effectTag?: 'PLACEMENT' | 'UPDATE' | 'DELETION';
  props: {
    [key: string]: any;
    children: FiberNode[];
  };

  hooks: Hook<T>[];
}

interface Hook<T> {
  state: T;
  queue: Action<T>[];
}

type Action<T> = (state: T) => T;
