interface JSXElement {
  type: string;
  props: {
    [key: string]: any;
    children: JSXElement[];
  };
}

interface FiberNode {
  type: string;
  dom: HTMLElement;
  child: FiberNode;
  parent: FiberNode;
  sibling: FiberNode;
  props: {
    children: FiberNode[];
  };
}
