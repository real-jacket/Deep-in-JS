interface JSXElement {
  type: string;
  props: {
    [key: string]: any;
    children: Element | any;
  };
}
