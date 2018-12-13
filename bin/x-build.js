#!/usr/bin/env node

const commander = require('commander');
const Ora = require('ora');

const pkg = require('../package.json');
const start = require('./start');
const questionList = require('./questionList');
const downloadTemp = require('./downloadTemp');
const reviseFile = require('./reviseFile');
const install = require('../lib/install');
const final = require('./final');

// 默认git仓库模板
this.git = 'codexu/x-build';
// 命令行
this.commander = commander;
// 安装进度提示工具
this.spinner = new Ora();
// 安装进度 默认2 github模板、devDependencies
this.progress = 2;
// 当前进去 默认0 从拉取模板开始增加
this.progressCurrent = 0;
// 全部选项答案
this.answers = {};
this.installBaseType = '';
this.installType = '';
this.installDevType = '';
// 依赖
this.dependencies = [];
this.devDependencies = [];
this.cssExt = '';

// 初始化指令
this.commander
  .version(pkg.version)
  .option('-c, create <n>', '初始化x-build项目')
  .option('-n, noversion', '禁止版本检测，可能会导致项目无法正常运行！')
  .option('-q, quick', '快速创建一个项目')
  .parse(process.argv);

// 完整安装流程
(async function actions() {
  // 清空控制台，查询CLI版本
  await start.call(this);
  // 输入问题列表
  await questionList.call(this);
  // 下载模板文件
  await downloadTemp.call(this);
  // 修改JSON
  await reviseFile.call(this);
  // 安装项目依赖
  await install.call(this, this.installBaseType, null);
  // 安装 dependencies
  await install.call(this, this.installType, this.dependencies);
  // 安装 devDependencies
  await install.call(this, this.installDevType, this.devDependencies);
  // 初始化git和输出继续操作提示
  final.call(this);
}).call(this);