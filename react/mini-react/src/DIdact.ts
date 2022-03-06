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

const isEvent = (key: string) => key.startsWith('on');
const isProperty = (key: string) => key !== 'children' && !isEvent(key);

function createDom(fiber: FiberNode) {
  console.log('createDom: ');

  const dom =
    fiber.type == 'TEXT_ELEMENT'
      ? document.createTextNode('')
      : document.createElement(fiber.type as string);

  // @ts-ignore
  updateDom(dom, {}, fiber.props);

  return dom;
}

type FiberProps = FiberNode['props'];

const isNew = (prev: FiberProps, next: FiberProps) => (key: string) =>
  prev[key] !== next[key];
const isGone = (prev: FiberProps, next: FiberProps) => (key: string) =>
  !(key in next);

function updateDom(
  dom: HTMLElement,
  prevProps: FiberProps,
  nextProps: FiberProps
) {
  // remove old or change listener
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      //@ts-ignore
      dom[name] = '';
    });

  // set new or changed properties
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      //@ts-ignore
      dom[name] = nextProps[name];
    });

  // add event listener
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot?.child);
  currentRoot = wipRoot;
  console.log('currentRoot: ', currentRoot);
  wipRoot = null;
}

function commitWork(fiber: FiberNode | null | undefined) {
  console.log('commitWork: ', fiber);
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent!;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent!;
  }

  const domParent = domParentFiber.dom;
  console.log('domParent: ', domParent);

  if (fiber.effectTag === 'PLACEMENT' && fiber.dom !== null) {
    domParent.appendChild(fiber.dom);
    console.log('domParent: in', domParent);
  } else if (fiber.effectTag === 'UPDATE' && fiber.dom !== null) {
    updateDom(fiber.dom, fiber.alternate!.props, fiber.props);
  } else if (fiber.effectTag === 'DELETION') {
    commitDeletion(fiber, domParent);
  }

  commitWork(fiber.child!);
  commitWork(fiber.sibling!);
}

function commitDeletion(fiber: FiberNode, domParent: HTMLElement) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child!, domParent);
  }
}

function render(element: FiberNode, container: HTMLElement) {
  wipRoot = {
    type: '',
    parent: null,
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
    hooks: [],
  };
  deletions = [];
  nextUnitWork = wipRoot;
}

let nextUnitWork: FiberNode | null = null;
let currentRoot: FiberNode | null = null;
let wipRoot: FiberNode | null = null;
let deletions: FiberNode[] = [];

function workLoop(deadline: IdleDeadline) {
  console.log('workLoop: ');
  let shouldYield = false;
  while (nextUnitWork && !shouldYield) {
    console.log('nextUnitWork: ', nextUnitWork);
    nextUnitWork = performUnitOfWork(nextUnitWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function performUnitOfWork(fiber: FiberNode): FiberNode | null {
  console.log('performUnitOfWork - fiber: ', fiber);
  // TODO add dom node
  // TODO create new fibers
  // TODO return next unit of work
  const isFunctionComponent = fiber.type instanceof Function;

  if (isFunctionComponent) {
    console.log('isFunctionComponent: true');
    updateFunctionComponent(fiber);
  } else {
    console.log('isFunctionComponent: false');
    updateHostComponent(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }

    nextFiber = nextFiber.parent!;
  }

  return null;
}

let wipFiber: FiberNode | null = null;
let hookIndex: number | null = null;

function updateFunctionComponent(fiber: FiberNode) {
  console.log('function fiber: ', fiber);
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [(fiber.type as Function)(fiber.props)];
  reconcileChildren(fiber, children);
}

function useState<T>(initial: T) {
  const oldHook =
    wipFiber!.alternate &&
    wipFiber!.alternate.hooks &&
    wipFiber!.alternate.hooks[hookIndex || 0];
  const hook: Hook<T> = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];

  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action: Action<T> | T) => {
    let _action: Action<T>;
    if (typeof action !== 'function') {
      _action = (action) => action;
    } else {
      //@ts-ignore
      _action = action;
    }
    hook.queue.push(_action);
    wipRoot = {
      type: '',
      dom: currentRoot!.dom,
      props: currentRoot!.props,
      alternate: currentRoot!.alternate,
      parent: null,
      hooks: [],
    };

    nextUnitWork = wipRoot;
    deletions = [];
  };

  wipFiber?.hooks.push(hook);
  hookIndex!++;
  return [hook.state, setState];
}
function updateHostComponent(fiber: FiberNode) {
  console.log('updateHostComponent: in');
  console.log('fiber: ', fiber);

  if (!fiber.dom) {
    // @ts-ignore
    fiber.dom = createDom(fiber);
  }

  reconcileChildren(fiber, fiber.props.children);
}

function reconcileChildren(wipFiber: FiberNode, elements: FiberNode[]) {
  console.log('reconcileChildren: in');
  let index = 0;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;
  let prevSibling = null;

  console.log('index: ', index);
  console.log('elements.length: ', elements.length);
  while (index < elements.length || oldFiber !== null) {
    console.log('element in');
    const element = elements[index];
    let newFiber: FiberNode | null = null;

    const sameType = oldFiber && element && oldFiber.type === element.type;

    if (sameType) {
      newFiber = {
        type: oldFiber!.type,
        props: element.props,
        dom: oldFiber!.dom,
        parent: wipFiber,
        alternate: oldFiber!,
        effectTag: 'UPDATE',
        hooks: [],
      };
    }

    console.log('reconcileChildren:');
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: 'PLACEMENT',
        hooks: [],
      };
    }

    if (oldFiber && !sameType) {
      oldFiber.effectTag = 'DELETION';
      deletions.push(oldFiber);
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    console.log(' newFiber: ', newFiber);

    if (index === 0) {
      wipFiber.child = newFiber;
    } else {
      prevSibling!.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

const Didact = {
  createElement,
  createTextElement,
  render,
  useState,
};
