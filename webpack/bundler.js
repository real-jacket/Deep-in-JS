const fs = require('fs')
const path = require('path')

// 把JS代码转为AST（抽象语法树，可以简单google一下概念，先不用太深入）
const parser = require('@babel/parser')
// 帮助我们解析AST的内容，最直接的就是通过 ImportDeclaration 点位找到文件的依赖入口
const traverse = require('@babel/traverse').default
// babel.transformFromAst(AST, code, options) 可以帮助我们把AST转换成能ES5代码
const babel = require('@babel/core')

const moduleAnalyse = filename => {
    const content = fs.readFileSync(filename, 'utf-8')
    // 得到语法树
    const ast = parser.parse(content, {
        sourceType: 'module'
    })

    // 找到该文件的依赖
    const dependencies = {}
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename)
            // node.source.value就是获取到的模块路径名，带有相对于当前文件的路径
            // 比如import sleep from './utils/sleep.js'里面的'./utils/sleep.js'
            dependencies[node.source.value] = `./${path.join(dirname, node.source.value)}`
        }
    })

    // babel 翻译 AST 为浏览器可以识别的代码
    const { code } = babel.transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })

    return {
        filename,
        dependencies,
        code
    }
}

const moduleInfo = moduleAnalyse('./src/index.js')
console.log('moduleInfo', moduleInfo)