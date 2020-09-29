// 分析 入口模块
// 内容：依赖模块（目的是模块的路径）
// 内容：借助babel 处理代码，生成代码片段
// node 
import { str } from "./a";
import { str2 } from "./b";

console.log(`${str}, what's up? This is ${str2}`);