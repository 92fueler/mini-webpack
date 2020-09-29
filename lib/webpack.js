const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require("@babel/traverse").default;
const { transformFromAst } = require("@babel/core");

module.exports = class webpack {
  constructor(options) {
    // console.log(options);
    this.entry = options.entry;
    this.output = options.output;
    this.modules = [];
  }

  run() {
    const info = this.parse(this.entry);
    // 递归处理所有依赖
    // console.log(info);
    this.modules.push(info);
    for (let i = 0; i < this.modules.length; i++) {
      const item = this.modules[i];
      const { dependencies } = item;
      if (dependencies) {
        for (let j in dependencies) {
          this.modules.push(this.parse(dependencies[j]));
        }
      }
    }
    // 修改数据结构 数组转对象
    const obj = {};
    this.modules.forEach((item) => {
      obj[item.entryFile] = {
        dependencies: item.dependencies,
        code: item.code,
      };
    });
    console.log(obj);
    // 代码生成，文件生成
    this.file(obj);
  }

  parse(entryFile) {
    // 读取模块的内容
    const content = fs.readFileSync(entryFile, "utf-8");
    const ast = parser.parse(content, {
      sourceType: "module",
    });
    const dependencies = {};
    traverse(ast, {
      ImportDeclaration({ node }) {
        path.dirname(entryFile);
        const newPathName = './' + path.join(path.dirname(entryFile), node.source.value);
        dependencies[node.source.value] = newPathName;
      }
    });
    // console.log(dependencies);
    const { code } = transformFromAst(ast, null, {
      presets: ["@babel/preset-env"],
    });
    return {
      entryFile,
      dependencies,
      code,
    };
    // console.log(code);
  }
}