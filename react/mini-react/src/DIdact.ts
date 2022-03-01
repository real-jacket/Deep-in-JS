const TEXT_ELEMENT = 'TEXT_ELEMENT';

function createElement(type: string, props: Object, ...children: JSXElement[]) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
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

function render(element: JSXElement, container: HTMLElement) {
  const dom =
    element.type === TEXT_ELEMENT
      ? document.createTextNode('')
      : document.createElement(element.type);

  if (typeof dom !== 'string') {
    const isProperty = (key: string) => key !== 'children';

    Object.keys(element.props)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = element.props[name];
      });

    element.props.children.forEach((child) => {
      render(child, dom);
    });
  }

  container.appendChild(dom);
}

const Didact = {
  createElement,
  createTextElement,
  render,
};
