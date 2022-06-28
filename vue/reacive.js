const data = {
  a: 1,
  b: 2,
};

let activeEffect;
// 通过一个执行栈记录 effect 执行上下文
const effectStack = [];

function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i];
    deps.delete(effectFn);
  }

  effectFn.deps.length = 0;
}

function effect(fn) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;

    effectStack.push(effectFn);
    fn();

    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
  };

  effectFn.deps = [];
  effectFn();
}

const reactiveMap = new WeakMap();

const obj = new Proxy(data, {
  get(targetObj, key) {
    let depsMap = reactiveMap.get(targetObj);

    if (!depsMap) {
      reactiveMap.set(targetObj, (depsMap = new Map()));
    }

    let deps = depsMap.get(key);

    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }

    // 在这一步搜集 effect ，形成一个数组
    deps.add(activeEffect);

    activeEffect.deps.push(deps);

    return targetObj[key];
  },
  set(targetObj, key, newVal) {
    targetObj[key] = newVal;

    const depsMap = reactiveMap.get(targetObj);

    if (!depsMap) return;

    const effects = depsMap.get(key);

    // 这里在执行 effectFn 的时候，访问了 obj.a 导致清除的 effectFn 被重新添加，使得 effect 长度始终新增1，导致了这个永远无法遍历结束导致死循环，解决办法是 copy 一份保持原有不变
    // effects && effects.forEach((fn) => fn());
    const effectToRun = new Set(effects);
    // 触发 effecet 的执行
    effectToRun.forEach((effectFn) => effectFn());
  },
});

effect(() => {
  console.log('log', obj.a ? obj.b : 'nothing');
});

effect(() => {
  console.log('effect1');
  effect(() => {
    console.log('effect2');
    obj.b;
  });
  obj.a;
});
