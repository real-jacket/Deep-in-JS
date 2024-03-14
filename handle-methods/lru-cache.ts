class LRUCache {
  private maxSize: number;
  private data: Map<any, any> = new Map();

  constructor(maxSize: number) {
    if (maxSize <= 0) throw new Error('Max size must be greater than 0');
    this.maxSize = maxSize;
  }

  set(key: any, value: any) {
    const data = this.data;

    if (data.has(key)) {
      data.delete(key);
    }

    data.set(key, value);

    if (data.size > this.maxSize) {
      const deleteKey = data.keys().next().value;
      data.delete(deleteKey);
    }
  }

  get(key: any): any {
    const data = this.data;
    if (!data.has(key)) return null;

    const value = data.get(key);

    data.delete(key);
    data.set(key, value);

    return value;
  }
}

const lruCache = new LRUCache(2);

lruCache.set('a', 1);
console.log('lruCache', lruCache);
lruCache.set('b', 2);
console.log('lruCache', lruCache);
console.info(lruCache.get('a')); // 输出 1
console.log('lruCache', lruCache);
lruCache.set('c', 3);
console.log('lruCache', lruCache);
console.log(lruCache.get('b')); // 输出 null，因为最近被访问的是 'c'

/**
 * 不使用 Map 去实现，通过双向链表实现
 */

interface IListNode {
  key: string;
  pre?: IListNode;
  next?: IListNode;
  value: any;
}

class LruNoMapCache {
  private maxSize: number = 0;
  private length: number = 0;
  private listHead: IListNode | null = null;
  private listTail: IListNode | null = null;
  private data: { [key: string]: IListNode } = {};

  private moveTail(node: IListNode) {
    const tail = this.listTail;
    if (tail === node) return;

    // 1. 先断开 preNode nextNode 链接
    const preNode = node.pre;
    const nextNode = node.next;
    if (preNode) {
      if (nextNode) {
        preNode.next = nextNode;
      } else {
        delete preNode.next;
      }
    }

    if (nextNode) {
      if (preNode) {
        nextNode.pre = preNode;
      } else {
        delete nextNode.pre;
      }

      if (this.listHead === node) this.listHead = nextNode;
    }

    //2. 断开 node 与前后的链接
    delete node.pre;
    delete node.next;

    //3. 重新构建链接
    if (tail) {
      tail.next = node;
      node.pre = tail;
    }

    this.listTail = node;
  }

  private tryClean() {
    while (this.length > this.maxSize) {
      const head = this.listHead;
      if (!head) throw new Error('head is null');
      const headNext = head.next;
      if (!headNext) throw new Error('head.next is null');

      //1.断绝 head 和 nex 的关系
      delete headNext.pre;
      delete head.next;

      // 2. 重新复制 listHead
      this.listHead = headNext;

      //3. 清理 data 并重新计数
      delete this.data[head.key];
      this.length--;
    }
  }

  constructor(maxSize: number) {
    if (maxSize <= 0) throw new Error('Max size must be greater than 0');
    this.maxSize = maxSize;
  }

  set(key: string, value: any) {
    const data = this.data;
    let curNode = data[key];
    if (!curNode) {
      // 新增数据
      curNode = {
        key: key,
        value,
      };
      data[key] = curNode;

      if (!this.length) {
        this.listHead = curNode;
      }
      this.length++;
    } else {
      // 修改现有数据
      curNode.value = value;
    }
    // 移动到末尾
    this.moveTail(curNode);
    // 尝试清理
    this.tryClean();
  }
  get(key: string): any {
    const data = this.data;
    const curNode = data[key];
    // 不存在
    if (!curNode) return null;

    //   本身在末尾
    if (curNode === this.listTail) {
      return curNode.value;
    }

    // 移动到末尾
    this.moveTail(curNode);

    return curNode.value;
  }
}

const lruCache2 = new LruNoMapCache(2);

lruCache2.set('a', 1);
console.log('lruCache2 -- a', lruCache2);
lruCache2.set('b', 2);
console.log('lruCache2 -- b', lruCache2);
console.info(lruCache2.get('a')); // 输出 1
console.log('lruCache2 --- g-a', lruCache2);
lruCache2.set('c', 3);
console.log('lruCache2 -- c', lruCache2);
console.log(lruCache2.get('b')); // 输出 null，因为最近被访问的是 'c'
