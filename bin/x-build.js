#!/usr/bin/env node

const commander = require('commander');
const ora = require('ora');

const package = require('../package.json');
const start = require('./start');
const questionList = require('./questionList');
const downloadTemp = require('./downloadTemp');
const installDev = require('./installDev');
const installPrecss = require('./installPrecss');
const installPlugin = require('./installPlugin');
const reviseFile = require('./reviseFile');
const final = require('./final');

let cli = {
  commander,
  spinner: new ora(),
  answers_all: {}
}
cli.commander
  .version(package.version)
  .option('-c, create <n>', '初始化x-build项目')
  .option('-n, noversion', '禁止版本检测，可能会导致项目无法正常运行！')

cli.commander.parse(process.argv);

async function actions() {
  // 清空控制台，查询CLI版本
  await start(cli);
  // 输入问题列表
  await questionList(cli);
  // 下载模板文件
  await downloadTemp(cli);
  // 修改JSON
  await reviseFile(cli);
  // 安装项目依赖
  await installDev(cli);
  // 安装css预处理器
  await installPrecss(cli);
  // 安装插件
  await installPlugin(cli);
  // 最终提示
  await final(cli);
}

actions();
  