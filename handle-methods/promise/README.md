# mocha测试

## 安装

- `yarn global add mocha` 会找不到命令。环境变量 path 未设置，改用 `npm`方式全局安装
- 在本地是可行的
- 安装 `chai`
- 配合 ts 安装响应的类型包，`yarn global add @types/mocha @types/chai`

## 测试

mocha不支持ts，利用ts提供的模块进行测试
`mocha -r ts-node/register test/index.ts`
运行命令行`yarn test`

关于 sinon 测试函数的使用:

- `const fn = sinon.fake()` 制造一个假函数
- `fn.called` 函数是否调用，返回布尔值
- `fn.calledOnce` 函数仅调用一次
- `fn.calledAfter(f2)` 函数在 f2 调用之后才被调用
