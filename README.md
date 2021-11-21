# Deep-in-JS

## 宗旨

这是一个以实践为主的仓库，主要在于各种手写实现常见的 JS 相关 API，或者相关项目的最佳实践。

## 目录

### JS 手写系列

- [x] 手写 call、apply、bind
- [x] new、instance 实现
- [x] 实现深拷贝
- [x] 实现防抖节流
- [x] promise 简易版实现

### 一些常见 API 实现

- [x] flat 数组拍平
- [x] promise 的相关 API
  - [x] promise.all 实现
  - [x] promise.any 实现
  - [x] promise.settle 实现

### 常见设计模式

- [x] 发布订阅/手写 eventHub
- [x] 观察者模式
- [ ] 单列模式
- [ ] 职责链模式

### 常见框架原理实现

这部分重在理解其基本原理，只是一个简单的版本，后续会优化独立出来

- [x] vue 双向绑定
- [x] 简易 koa
- [x] 简易 redux
- [x] 简易 router
- [ ] webpack 相关
  - [x] 编译器实现
  - [ ] 打包器实现

### 一些场景实现

- [x] promise 实现一个限流器

## 收集的一些场景设计面试题

这部分对应题目均在 `interview-question` 目录下

- 字节
  - [x] 返回服务器计算求和所花费的最事件

## 常见工具的使用

- [x] webpack/react 使用
- [x] lerna 使用
- [x] rollup 使用
- [ ] vite 使用

## 未来计划

未来除来拓宽上述相关之外，还会加大在 Node 端的实现，比如下述：

- [ ] next ssr 项目最佳实践
- [ ] 大文件上传
- [x] 文件流转存服务（node-file-stream-archived）
- [ ] 文件系统，实现一个 tree 命令
- [ ] 实现一个完整的 CLI
- [ ] 实现一个 CI/CD 服务器
- [ ] 实现一个负载均衡服务
- [ ] 实现一个消息中间件

这些内容主要以后端相关知识为主，后期大概率会独立出一个仓库进行整理与记录

## 期待

后期整理完后，会利用 vuepress 搭建一个博客静态网站，方便大家学习与讨论
