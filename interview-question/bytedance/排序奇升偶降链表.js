// 给定一个奇数位升序，偶数位降序的链表，将其重新排序。
// 输入: 1 -> 8 -> 3 -> 6 -> 5 -> 4 -> 7 -> 2 -> NULL
// 输出: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> NULL

function sort(node) {
  let curNode = node;
  let curIndex = 1;
  let odd = {
    next: null,
  };
  let even = null;
  const head = odd;
  while (curNode) {
    const next = curNode.next;
    if (curIndex % 2) {
      curNode.next = even;
      even = curNode;
    } else {
      odd.next = curNode;
      odd = curNode;
    }
    if (!next) {
      odd.next = even;
      break;
    }
    curNode = next;
    curIndex++;
  }

  return head.next;
}
