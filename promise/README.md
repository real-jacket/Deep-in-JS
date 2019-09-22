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
