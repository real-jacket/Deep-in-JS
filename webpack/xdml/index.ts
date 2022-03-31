import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as babel from '@babel/core';
import * as fs from 'fs';
import * as path from 'path';

type DepRelation = {
  key: string;
  deps: string[];
  code: string;
}[];

const depRelation: DepRelation = [];

analysisModule('./project1/index.js');

// console.log(depRelation);

function analysisModule(filepath: string): void {
  // 利用 hash 对比,判断是否存在循环引入
  if (depRelation.find((item) => item.key === filepath)) {
    console.log(`duplicated dependency: ${filepath}`);
    return;
  }

  const absolutePath = path.resolve(__dirname, filepath);
  const code = fs.readFileSync(absolutePath, 'utf-8').toString();

  const dep = {
    key: filepath,
    deps: [],
    code,
  };
  depRelation.push(dep);
  const ast = parse(code, { sourceType: 'module' });
  traverse(ast, {
    enter: function (fileObj) {
      if (fileObj.node.type === 'ImportDeclaration') {
        // 将当前依赖模块路径推入
        const depPath = fileObj.node.source.value;
        dep.deps.push(depPath);

        // 获取当前目录
        const dirName = path.dirname(filepath);
        // 拼接依赖路径，递归处理依赖模块
        const depRelativePath = `./${path.join(dirName, depPath)}`;
        analysisModule(depRelativePath);
      }
    },
  });

  const { code: _code } = babel.transformFromAstSync(ast, undefined, {
    presets: ['@babel/preset-env'],
  });
  dep.code = _code;
}

function generateCode(key: string) {
  const result = `
    var graph = ${JSON.stringify(depRelation)};
    var modules = {};

    require(${JSON.stringify(key)})
   
    function require(key) {
      if (modules[key]){ return modules[key]};
      var item = graph.find((item) => item.key === key);
      if(!item){throw new Error(\`\${item} is not found\`)}
      var pathToKey = (path) => {
        var dirname = key.substring(0,key.lastIndexOf('/') + 1)
        var projectPath = dirname + path.replace(\/\\.\\\/\/g, '').replace(\/\\\/\\\/\/, '/')
        return projectPath
      }

      var localRequire = (path) => {
        return require(pathToKey(path))
      }
      modules[key] = { __esModule: true }
      var module = { exports: modules[key] };
      (function (require, module, exports) {
        eval(item.code)
      })(localRequire, module, module.exports);
      return modules[key]
    };
  `;

  fs.writeFileSync(path.resolve(__dirname, './dist.js'), result);
}

generateCode('./project1/index.js');
