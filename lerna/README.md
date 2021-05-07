# Lerna

## 基本概念

Lerna 是一个用来优化托管在 `git\npm` 上的多 package 代码库的工作流的一个管理工具,可以让你在主项目下管理多个子项目，从而解决了多个包互相依赖，且发布时需要手动维护多个包的问题。

## 解决了什么痛点

### 资源浪费

通常情况下，一个公司的业务项目只有一个主干，多 `git repo` 的方式，这样 `node_module` 会出现大量的冗余，比如它们可能都会安装 `React`、`React-dom` 等包，浪费了大量存储空间。

### 调试繁琐

很多公共的包通过 `npm` 安装，想要调试依赖的包时，需要通过 `npm link` 的方式进行调试。

### 资源包升级问题

一个项目依赖了多个 `npm` 包，当某一个子 `npm` 包代码修改升级时，都要对主干项目包进行升级修改。(这个问题感觉是最烦的，可能一个版本号就要去更新一下代码并发布)

## lerna 核心原理

未使用 `lerna` 之前，想要调试一个本地的 `npm` 模块包，需要使用 `npm link` 来进行调试，但是在 `lerna` 中可以直接进行模块的引入和调试，这种动态创建软链是如何实现的？

### Node.js 中实现软连接

lerna 通过 `fs.symlinkSync(target,path,type)`

```js
fs.symlinkSync(target,path,type)
target <string> | <Buffer> | <URL>   // 目标文件
path <string> | <Buffer> | <URL>  // 创建软链对应的地址
type <string>
```

它会创建名为 path 的链接，该链接指向 target。`type` 参数仅在 Windows 上可用，在其他平台上则会被忽略。它可以被设置为 `dir`、 `file` 或 `junction`。如果未设置 `type` 参数，则 Node.js 将会自动检测 target 的类型并使用 `file` 或 `dir`。如果 target 不存在，则将会使用 `file`。Windows 上的连接点要求目标路径是绝对路径。当使用 `junction` 时， target 参数将会自动地标准化为绝对路径。

- 基本使用

```js
const res = fs.symlinkSync('./target/a.js', './b.js');
```

这段代码的意思是为 创建一个软链接 `b.js` 指向了文件 `./targert/a.js`,当 `a.js` 中的内容发生变化时，`b.js` 文件也会发生相同的改变。

## lerna 基本使用

使用前全局安装

```bash
npm install lerna -g
```

### 初始化项目

```bash
mkdir lerna-repo
cd lerna-repo
// 初始化
lerna init
```

目标目录下会自动初始化生成如下文件：

```bash
.
├── lerna.json    # 包目录
├── package.json  # 配置文件
└── packages      # 工程描述文件
```

### lerna 常用命令

1. 初始化项目

```bash
lerna init
```

2. 创建一个由 `lerna` 管理的包

创建有两种方式：

- 通过 lerna 创建

```bash
lerna create <name>
```

这个命令会在 packages 下创建一个基本包结构的 npm 包，基本文件组织结构如下：

```bash
packages/<name>
├── README.md
├── __tests__
│   └── <name>.test.js
├── lib
│   └── <name>.js
└── package.json
```

- 手动创建

在 packages 目录下自行手动创建相关包，然后整合到 lerna 中管理

```bash
lerna clean // 清除子包目录下的 node_modules

lerna bootstrop --hoist // 安装依赖，并将 packages 目录下的公共包抽离到最顶层
```

> 注意：通过这种方式有一个问题，不同版本号的同一个包只会保留使用最多的版本，如果依赖老版本的话则会出问题。建议配合 `yarn workspace` 使用

3. 安装所有依赖项并连接所有的交叉依赖

```bash
lerna bootstrap
```

4. 增加模块包到最外层的公共 node_modules 中

```bash
lerna add axios
```

5. 增加模块包到 packages 中指定项目，下面是将 ui-web 模块增加到 example-web 项目中

```bash
lerna add ui-web --scope=example-web
```

6. 执行命令

- 在 packages 中对应包下的执行任意命令

```bash
lerna exec --scope example-web -- yarn start
```

- 在所有包下面执行命令, 去除掉 `--scope example-web`

```bash
lerna exec -- rm -rf ./node_modules
```

7. 显示所有的看包

```bash
lerna list // 等同于 lerna ls
```

8. 从所有包中删除 `node_modules`

```bash
lerna clean
```

## 配合 yarn workspace 使用

之前有提到过，lerna 提取公共包的时候，对不同版本的同一个包处理不够友好，这方面 `yarn workspace` 做的比较好，所以搭配 yarn workspace 使用，yarn 负责包资源，lerna 负责发布管理包。

### yarn workspace 开启

在 lerna.json 中增加配置

```json
{
  "npmClient": "yarn", // 指定 npmClent 为 yarn
  "useWorkspaces": true // 将 useWorkspaces 设置为 true
}
```

并且在顶层的 package.json 中增加配置

```json
// 顶层的 package.json
{
  "workspaces": ["packages/*"], // 声明包目录
  "private": true
}
```

增加上述两项后，包管理将使用 yarn workspace 管理资源

### 使用 yarn 管理资源包

1. 安装所有依赖

安装所有依赖，包含子 package 依赖，如果子 package 之间存在相互依赖会通过创建软链的方式引用，而非 npm 下载，这里可能会影响 webpack 配置中使用 node_modules 做路径判断的地方。

```bash
yarn install
```

2. 增加模块包到最外层的公共 node_modules 中

```bash
# root package 安装 commitizen
yarn add -W -D commitizen

# root package 移除 commitizen
yarn remove -W commitizen
```

3. 增加模块包到 packages 中指定项目

```bash
# packageA 安装 axios
yarn workspace packageA add axios

# packageA 移除 axios
yarn workspace packageA remove axios
```

4. 执行命令

- 在 packages 中对应包下的执行任意命令

```bash
# 运行packageA 的dev命令
yarn workspace packageA dev
```

- 在所有包下面执行命令, 使用 `run`

```bash
# 这里是在每个工作区运行 run build 命令
yarn workspaces run build
```

> 这里运行命令的时候不会检测依赖树关系，只是 package.json 文件 workspaces 配置工作区逐个运行，这里推荐使用 lerna build 。

## 参考文章

- [现代前端工程化-彻底搞懂基于 Monorepo 的 lerna 模块(从原理到实战)](https://mp.weixin.qq.com/s/bRbEhMKRVKO3oAyMaUfVYA)
- [基于 Lerna 管理 packages 的 Monorepo 项目最佳实践](https://mp.weixin.qq.com/s/m3nmiYH2rJr5_dygd4UcCg)
- [结合 lerna 和 yarn workspace 管理多项目工作流](https://segmentfault.com/a/1190000025173538)
