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

function effect(fn, options = {}) {
  const effectFn = () => {
    cleanup(effectFn);

    activeEffect = effectFn;
    effectStack.push(effectFn);

    const res = fn();

    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];

    return res;
  };

  effectFn.deps = [];
  effectFn.options = options;

  /**
   * FIXME: 等待修复
   * 这一步如果 lazy 则会丢失 activeEffect，因为 lazy 是在 effectFn 执行之前执行的，所以 activeEffect 就是 undefined
   */
  if (!options.lazy) {
    effectFn();
  }

  return effectFn;
}

const reactiveMap = new WeakMap();

// 搜集依赖
function track(targetObj, key) {
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
}

// 触发 effect
function trigger(targetObj, key) {
  const depsMap = reactiveMap.get(targetObj);

  if (!depsMap) return;

  const effects = depsMap.get(key);

  // 这里在执行 effectFn 的时候，访问了 obj.a 导致清除的 effectFn 被重新添加，使得 effect 长度始终新增1，导致了这个永远无法遍历结束导致死循环，解决办法是 copy 一份保持原有不变
  // effects && effects.forEach((fn) => fn());
  const effectToRun = new Set(effects);
  // 触发 effect 的执行
  effectToRun.forEach((effectFn) => {
    if (effectFn.option.scheduler) {
      effectFn.option.scheduler(effectFn);
    } else {
      effectFn();
    }
  });
}

const obj = new Proxy(data, {
  get(targetObj, key) {
    track(targetObj, key);
    return targetObj[key];
  },
  set(targetObj, key, newVal) {
    targetObj[key] = newVal;
    trigger(targetObj, key);
  },
});

// effect(() => {
//   console.log('log', obj.a ? obj.b : 'nothing');
// });

// effect(() => {
//   console.log('effect1');
//   effect(() => {
//     console.log('effect2');
//     obj.b;
//   });
//   obj.a;
// });

function computed(fn) {
  let value;
  let dirty = true;
  const effectFn = effect(fn, {
    lazy: true,
    scheduler(fn) {
      if (!dirty) {
        dirty = true;
        trigger(obj, 'value');
      }
    },
  });

  // computed 里创建一个对象，在 value 的 get 触发时调用该函数拿到最新的值
  const obj = {
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, 'value');
      return value;
    },
  };

  return obj;
}

const res = computed(() => {
  console.log('重新计算');
  return obj.a + obj.b;
});

effect(() => {
  console.log('res.value:', res.value);
});

console.log(res.value);
