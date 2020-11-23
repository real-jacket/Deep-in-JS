const arr = [1, 3, 5, [2, [4, [5]], [6]], 0, 9]

// 递归的方法 --- 存在性能问题
function flatRecursion(arr) {
    let result = []
    if (!arr || arr.length === 0) {
        return result
    }
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (Array.isArray(item)) {
            result = result.concat(flat(item))
        } else {
            result = result.concat(item)
        }
    }

    return result
}
// 上述思路的简化版
const _flatRecursion = (arr) => [].concat(...arr.map((item) => (Array.isArray(item) ? _flatRecursion(item) : item)))

/**
 *
 * 迭代的思路 -- 利用深度优先搜索
 *
 * 通过一个栈缓存要处理的值，当栈不为空时首先清空栈
 *
 */

// 第一次方案
function flatIteration(arr) {
    const result = []
    if (!arr || arr.length === 0) {
        return []
    }

    let stack = []

    for (let i = 0; i < arr.length; i++) {
        const item = arr[i]
        if (Array.isArray(item)) {
            stack.push(item)
        } else {
            result.push(item)
        }

        let node
        while (stack.length > 0) {
            const currentNode = stack.shift()
            if (Array.isArray(currentNode)) {
                for (let i = 0; i < currentNode.length; i++) {
                    const item = currentNode[i]
                    if (node) {
                        node = node.concat(item)
                    } else {
                        if (Array.isArray(item)) {
                            node = item
                        } else {
                            result.push(item)
                        }
                    }
                }
                if (node) {
                    stack.unshift(node)
                    node = null
                }
            } else {
                result.push(currentNode)
            }
        }
    }

    return result
}

// 第二种方法 这个不算深度优先
function flatIteration2(arr) {
    const result = []
    if (!arr || arr.length === 0) {
        return []
    }
    let _arr = arr.slice()
    while (_arr.length > 0) {
        const currentNode = _arr.shift()
        if (Array.isArray(currentNode)) {
            _arr = currentNode.concat(_arr)
        } else {
            result.push(currentNode)
        }
    }

    return result
}

console.log(flatIteration2(arr))