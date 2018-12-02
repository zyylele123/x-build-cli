#!/usr/bin/env node

const commander = require('commander');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs');

const package = require('../package.json');
const question = require('../lib/question.js');
const hint = require('../lib/hint.js');
const clearConsole = require('../lib/clearConsole');
const checkVersion = require('../lib/checkVersion');
const cmdSystem = require('../lib/cmdSystem');
const writeJSON = require('../lib/writeJSON');

const spinner = new ora();

let config = {
  commander,
  spinner,
  answers_all: {}
}


config.commander
  .version(package.version)
  .option('-c, create <n>', '初始化x-build项目')
  .option('-n, noversion', '禁止版本检测，可能会导致项目无法正常运行！')

config.commander
  .parse(process.argv);

// 清空控制台，查询CLI版本
function start() {
  return new Promise(function (resolve, reject) {
    // 清空控制台，并输出版本信息
    clearConsole('magenta', `X-BUILD-CLI v${package.version}`)
    console.info('');
    // 检测是否为最新版本
    if(commander.noversion){
      resolve()
    } else {
      config.spinner.start('正在查询x-build-cli最新版本');
      checkVersion().then(() => {
        config.spinner.stop();
        resolve()
      }, (version) => {
        hint.fail(config.spinner, `请将x-build-cli更新到最新版本(v${version})`)
        process.exit();
        reject();
      })
    }
  })
}

// 输入问题列表
function questionList() {
  return new Promise(resolve => {
    if (commander.create) {
      inquirer.prompt([
        question.package_manager,
        question.precss,
        question.rem,
        question.plugin
      ]).then(function (answers) {
        config.answers_all.name = config.commander.create
        config.answers_all.rem = answers.rem
        config.answers_all.package_manager = answers.package_manager
        config.answers_all.precss = answers.precss
        config.answers_all.plugin = answers.plugin
        if (config.answers_all.rem === true) {
          config.answers_all.plugin.push('hotcss')
        }
        if (config.answers_all.plugin.indexOf('x-animate') ||
            config.answers_all.plugin.indexOf('x-fullpage') 
        ) {
          config.answers_all.plugin.push('animate.css')
        }
        resolve();
      });
    } else {
      hint.print('gray', `参数列表:`)
      hint.print('gray', `$ x-build create [name]`, 'bottom')
      hint.fail(config.spinner, `请检查指令参数是否正确！`)
      process.exit();
    }
  })
}

// 下载模板文件
function downloadTemp() {
  return new Promise(resolve => {
    hint.line()
    config.spinner.start('正在下载最新模板文件...');
    download('codexu/x-build', config.answers_all.name, function (err) {
      if (!err) {
        config.spinner.succeed(['模板文件下载完成.']);
        config.spinner.clear();
        resolve()
      } else {
        hint.fail(config.spinner, '模板下载失败！请检查网络链接状况', err)
      }
    })
  })
}

// 修改文件
function reviseFile() {
  return new Promise((resolve, reject) => {
    let url = `${process.cwd()}/${config.answers_all.name}`
    writeJSON(url, config.answers_all, config.spinner).then(() => {
      resolve();
    })
  })
}

// 安装项目依赖
function installDev () {
  return new Promise((resolve, reject) => {
    let installStr = `正在使用${chalk.greenBright(config.answers_all.package_manager)}安装项目依赖...`
    config.spinner.start([installStr])
    // 根据不同的选项选择安装方式
    let type_install = '';
    switch (config.answers_all.package_manager) {
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
    cmdSystem([`cd ${config.answers_all.name}`, type_install], config.spinner, installStr).then(() => {
      config.spinner.succeed(['项目依赖安装完成.'])
      config.spinner.clear()
      resolve()
    })
  })
}

// 安装css预处理器
function installPrecss() {
  return new Promise(resolve => {
    let type_install = null;
    let loaders = '';
    let extStr = ''
    switch (config.answers_all.precss) {
      case 'sass':
        loaders = `sass-loader node-sass`
        extStr = 'scss'
        break;
      case 'less':
        loaders = `less-loader less`
        extStr = 'less'
        break;
      case 'stylus':
        loaders = `stylus-loader stylus`
        loaders = `styl`
        break;
      default:
        extStr = 'css'
        break;
    }
    let fileUrl = `${process.cwd()}/${config.answers_all.name}/src/style/index.${extStr}`
    fs.writeFile(fileUrl, '', (err) => {
      if (err) throw err;
    });
    if (config.answers_all.precss === 'No use') {
      resolve()
    } else {
      let installStr = `正在使用${chalk.greenBright(config.answers_all.package_manager)}安装${chalk.greenBright(config.answers_all.precss + '-loader...')}`
      config.spinner.start([installStr])
      switch (config.answers_all.package_manager) {
        case 'npm':
          type_install = `npm install ${loaders} --save-dev`
          break;
        case 'cnpm':
          type_install = `cnpm install ${loaders} --save-dev`
          break;
        default:
          type_install = `yarn add ${loaders} -D`
          break;
      }
      cmdSystem([`cd ${config.answers_all.name}`, type_install], config.spinner, installStr).then(() => {
        config.spinner.succeed([`${config.answers_all.precss}-loader安装完成.`])
        config.spinner.clear()
        resolve()
      })
    }
  })
}

// 安装插件
function installPlugin() {
  return new Promise(resolve => {
    let installStr = `正在使用${chalk.greenBright(config.answers_all.package_manager)}安装插件...`
    config.spinner.start([installStr])
    let plugin = config.answers_all.plugin.join(' ')
    let type_install = null;
    switch (config.answers_all.package_manager) {
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
    cmdSystem([`cd ${config.answers_all.name}`, type_install], config.spinner, installStr).then(() => {
      config.spinner.succeed(['插件安装完成.'])
      config.spinner.clear()
      resolve()
    })
  })
}

// 最终提示
function final() {
  return new Promise(resolve => {
    setTimeout(function () {
      hint.line()
      hint.print('green', `🎉  欢迎使用x-build,请继续完成以下操作:`, 'bottom')
      hint.print('cyan', ` $ cd ${config.answers_all.name}`)
      hint.print('cyan', ` $ ${config.answers_all.package_manager === 'yarn' ? 'yarn' : 'npm run'} serve`, 'bottom')
      hint.print('green', ` [使用手册] https://codexu.github.io/`)
      process.exit();
      resolve();
    }, 500)
  })
}

async function actions() {
  // 清空控制台，查询CLI版本
  await start();
  // 输入问题列表
  await questionList();
  // 下载模板文件
  await downloadTemp();
  // 修改JSON
  await reviseFile();
  // 安装项目依赖
  await installDev();
  // 安装css预处理器
  await installPrecss();
  // 安装插件
  await installPlugin();
  // 最终提示
  await final();
}

actions();
  