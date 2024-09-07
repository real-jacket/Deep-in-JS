/**
 * 在一片网格中，存在若干红色的格子。存在一个包含所有红色格子坐标的数组现在需要将该数组拆分成多个子数组，
 * 具有相邻关系(上下左右相邻)的格子需要分配到同一个子数组中。
 */

const input = [
  [1, 1],
  [2, 1],
  [2, 4],
  [2, 5],
  [3, 2],
  [3, 4],
  [4, 4],
  [4, 5],
  [4, 6],
  [4, 7],
  [5, 3],
  [6, 3],
  [6, 4],
  [6, 5],
];

/**
 * 返回结果：
 * 
 res：[
  [ [ 1, 1 ], [ 2, 1 ] ],
  [
    [ 2, 4 ], [ 2, 5 ],
    [ 3, 4 ], [ 4, 4 ],
    [ 4, 5 ], [ 4, 6 ],
    [ 4, 7 ]
  ],
  [ [ 3, 2 ] ],
  [ [ 5, 3 ], [ 6, 3 ], [ 6, 4 ], [ 6, 5 ] ]
]
 */

// 使用 dfs + 递归
function groupPoint1(input) {
  // 缓存记录已经处理过的节点
  const cache = [];
  function check(point, group) {
    // 相邻节点坐标
    const [x, y] = point;
    const targetX1 = x - 1;
    const targetX2 = x + 1;
    const targetY1 = y - 1;
    const targetY2 = y + 1;
    const target = [];
    // x 最小边界
    if (targetX1 >= 0) {
      target.push([targetX1, y]);
    }
    // 没有最大边界条件
    target.push([targetX2, y]);
    // y 最小边界
    if (targetY1 >= 0) {
      target.push([x, targetY1]);
    }
    // y 没有最大边界条件
    target.push([x, targetY2]);

    for (let i = 0; i < input.length; i++) {
      if (cache[i]) continue;
      const item = input[i];
      const [x2, y2] = item;

      for (let j = 0; j < target.length; j++) {
        if (x2 === target[j][0] && y2 === target[j][1]) {
          group.push(item);
          // 处理过的节点记录
          cache[i] = true;
          check(item, group);
        }
      }
    }
  }

  const res = [];
  for (let i = 0; i < input.length; i++) {
    if (cache[i]) continue;
    const target = input[i];
    const group = [target];
    // 第一个节点已经处理过
    cache[i] = true;
    check(target, group);
    res.push(group);
  }

  return res;
}

const res = groupPoint1(input);
console.log('res: ', res);

// 由于递归有栈溢出的风险，所以推荐更优解法，通过队列实现的 bfs 广度优先
function groupPoint2(input) {
  const res = [];
  const cache = [];
  for (let i = 0; i < input.length; i++) {
    if (cache[i]) continue;
    const item = input[i];
    const group = [];
    const queue = [item];
    // 推入队列的标记为处理过的
    cache[i] = true;
    while (queue.length) {
      const point = queue.shift();
      // 队列里的节点依次推出并添加到group中，同时遍历其相邻节点
      group.push(point);
      const [x, y] = point;
      const targetX1 = x - 1;
      const targetX2 = x + 1;
      const targetY1 = y - 1;
      const targetY2 = y + 1;
      const target = [];
      // x 最小边界
      if (targetX1 >= 0) {
        target.push([targetX1, y]);
      }
      // 没有最大边界条件
      target.push([targetX2, y]);
      // y 最小边界
      if (targetY1 >= 0) {
        target.push([x, targetY1]);
      }
      // 没有最大边界条件
      target.push([x, targetY2]);

      // 重新遍历剩余节点，找到相邻节点
      for (let i = 0; i < input.length; i++) {
        if (cache[i]) continue;
        const item = input[i];
        const [x2, y2] = item;
        for (let j = 0; j < target.length; j++) {
          if (x2 === target[j][0] && y2 === target[j][1]) {
            // 推入队列中
            queue.push(item);
            // 标记为处理
            cache[i] = true;
          }
        }
      }
    }

    // 一次 bfs 处理完成，推入结果中
    res.push(group);
  }

  return res;
}
