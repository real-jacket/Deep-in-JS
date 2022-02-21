const TEXT_ELEMENT = 'TEXT_ELEMENT';

export function createElement(
  type: string,
  props: Object,
  ...children: JSXElement[]
) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

export function createTextElement(text: string): JSXElement {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
