const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type: string, props: Object, ...children: JSXElement[]) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

function createTextElement(text: string): JSXElement {
  return {
    type: TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

const Didact = {
  createElement,
  createTextElement,
};
