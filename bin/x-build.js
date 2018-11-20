#!/usr/bin/env node


const commander = require('commander');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');

const package = require('../package.json');
const question = require('../lib/question.js');
const hint = require('../lib/hint.js');
const clearConsole = require('../lib/clearConsole');
const checkVersion = require('../lib/checkVersion');
const cmdSystem = require('../lib/cmdSystem');
const writeJSON = require('../lib/writeJSON');

const spinner = new ora();

let answers_all = new Object();

commander
  .version(package.version)
  .option('-c, create <n>', '初始化x-build项目')
  .option('-n', '禁止版本检测，可能会导致项目无法正常运行！')

commander
  .parse(process.argv);

new Promise(function (resolve, reject) {
    // 清空控制台，并输出版本信息
    clearConsole('magenta', `X-BUILD-CLI v${package.version}`)
    console.info('');
    // 检测是否为最新版本
    if(commander.noversion){
      resolve()
    } else {
      spinner.start('正在查询x-build-cli最新版本');
      checkVersion().then(() => {
        spinner.stop();
        resolve()
      }, (version) => {
        hint.fail(spinner, `请将x-build-cli更新到最新版本(v${version})`)
        process.exit();
      })
    }
  })
  // commander init ( x-build init )
  .then(function () {
    return new Promise(resolve => {
      if (commander.create) {
        inquirer.prompt([
          question.port,
          question.rem,
          question.package_manager,
          question.plugin
        ]).then(function (answers) {
          answers_all.name = commander.create
          answers_all.port = answers.port
          answers_all.rem = answers.rem
          answers_all.package_manager = answers.package_manager
          answers_all.plugin = answers.plugin
          if (answers_all.rem === true) {
            answers_all.plugin.push('hotcss')
          }
          if (answers_all.plugin.indexOf('x-animate')) {
            answers_all.plugin.push('animate.css')
          }
          resolve();
        });
      } else {
        hint.print('gray', `参数列表:`)
        hint.print('gray', `$ x-build create [name]`, 'bottom')
        hint.fail(spinner, `请检查指令参数是否正确！`)
        process.exit();
      }
    })
  })
  // 通过download-git-repo下载x-build
  .then(function () {
    hint.line()
    spinner.start('正在下载最新模板文件...');
    return new Promise(resolve => {
      download('codexu/x-build', answers_all.name, function (err) {
        if (!err) {
          resolve()
        } else {
          hint.fail(spinner, '模板下载失败！请检查网络链接状况', err)
        }
      })
    })
  })
  // 修改JSON
  .then(function () {
    return new Promise((resolve, reject) => {
      writeJSON(`${process.cwd()}/${answers_all.name}`, answers_all, spinner).then(() => {
        resolve();
      })
    })
  })
  // 安装项目依赖
  .then(function () {
    return new Promise((resolve, reject) => {
      let installStr = `正在使用${chalk.greenBright(answers_all.package_manager)}安装插件...`
      spinner.start([installStr])
      // 根据不同的选项选择安装方式
      let type_install = '';
      switch (answers_all.package_manager) {
        case 'npm':
          type_install = 'npm install'
          break;
        case 'cnpm':
          type_install = 'cnpm install'
          break;
        default:
          type_install = 'yarn'
          break;
      }
      cmdSystem([`cd ${answers_all.name}`, type_install], spinner, installStr)
        .then(() => {
          spinner.succeed(['项目依赖安装完成.'])
          spinner.clear()
          resolve()
        })
    })
  })
  // 安装插件
  .then(function () {
    return new Promise(resolve => {
      let installStr = `正在使用${chalk.greenBright(answers_all.package_manager)}安装插件...`
      spinner.start([installStr])
      let plugin = answers_all.plugin.join(' ')
      let type_install = null;
      switch (answers_all.package_manager) {
        case 'npm':
          type_install = `npm install ${plugin} --save`
          break;
        case 'cnpm':
          type_install = `cnpm install ${plugin} --save`
          break;
        default:
          type_install = `yarn add ${plugin}`
          break;
      }
      cmdSystem([`cd ${answers_all.name}`, type_install], spinner, installStr)
        .then(() => {
          spinner.succeed(['插件安装完成.'])
          spinner.clear()
          resolve()
        })
    })
  })
  // 最后一步提示信息
  .then(function () {
    setTimeout(function () {
      hint.line()
      hint.print('green', `🎉  欢迎使用x-build,请继续完成以下操作:`, 'bottom')
      hint.print('cyan', ` $ cd ${answers_all.name}`)
      hint.print('cyan', ` $ ${answers_all.package_manager === 'yarn' ? 'yarn' : 'npm run'} serve`, 'bottom')
      hint.print('green', ` [使用手册] https://codexu.github.io/`)
      process.exit()
    }, 500)
  })