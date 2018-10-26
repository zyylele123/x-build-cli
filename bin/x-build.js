#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const commander = require('commander');
const inquirer = require('inquirer')
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const cmd = require('node-cmd');

// const deleteFolder = require('./deleteFolder.js');
const package = require('../package.json');
const question = require('./question.js');
const hint = require('./hint.js');

const spinner = ora();

let answers_all = new Object();

commander
  .version(package.version)
  .option('-i, init', '初始化x-build项目')

commander
  .parse(process.argv);

let promist = new Promise(function (resolve, reject) {
    // commander init ( x-build init )
    // 清理屏幕
    process.stdout.write(process.platform === 'win32' ? '\x1Bc' : '\x1B[2J\x1B[3J\x1B[H')
    hint.print('magenta', `✨  X-BUILD-CLI v${package.version}`)
    if (commander.init) {
      console.info('');
      inquirer.prompt([
        question.name,
        question.port,
        question.rem,
        question.package_manager,
        question.plugin
      ]).then(function (answers) {
        answers_all.name = answers.name
        answers_all.port = answers.port
        answers_all.rem = answers.rem
        answers_all.package_manager = answers.package_manager
        answers_all.plugin = answers.plugin
        resolve();
      });
    }
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

  // 修改package.json
  .then(function () {
    return new Promise((resolve, reject) => {
      // 读取package.json
      fs.readFile(`${process.cwd()}/${answers_all.name}/package.json`, (err, data) => {
        if (err) {
          hint.fail(spinner, `package.json读取失败！`, err)
        }
        let _data = JSON.parse(data.toString())
        _data.name = answers_all.name
        _data.version = '0.0.0'
        _data.port = answers_all.port
        _data.rem = answers_all.rem
        let str = JSON.stringify(_data, null, 4);
        // 写入
        fs.writeFile(`${process.cwd()}/${answers_all.name}/package.json`, str, function (err) {
          if (!err) {
            spinner.succeed(['模板文件下载完成.']);
            spinner.clear();
            resolve();
          } else {
            hint.fail(spinner, `package.json写入失败！`, err)
          }
        })
      });
    })
  })
  // 安装项目依赖
  .then(function () {
    // 根据不同的选项选择安装方式
    let type_install = null;
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
    spinner.start([`正在使用${chalk.greenBright(answers_all.package_manager)}安装项目依赖...`])
    return new Promise((resolve, reject) => {
      cmd.get(
        `
      cd ${answers_all.name}
      ${type_install}
    `,
        function (err, data, stderr) {
          spinner.succeed(['项目依赖安装完成.'])
          spinner.clear()
          resolve()
        }
      );
    })
  })
  // 安装插件
  .then(function () {
    spinner.start([`正在使用${chalk.greenBright(answers_all.package_manager)}安装插件...`])
    if (answers_all.rem === true) {
      answers_all.plugin.push('hotcss')
    }
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
    return new Promise((resolve, reject) => {
      cmd.get(
        `
        cd ${answers_all.name}
        ${type_install}
      `,
        function () {
          spinner.succeed([`插件安装完成.`])
          spinner.clear()
          hint.line()
          resolve()
        }
      )
    })
  })
  // 最后一步提示信息
  .then(function () {
    setTimeout(function () {
      hint.print('green', `🎉  欢迎使用x-build,请继续完成以下操作:`, 'bottom')
      hint.print('cyan', ` $ cd ${answers_all.name}`)
      hint.print('cyan', ` $ npm run dev`, 'bottom')
      hint.print('green', ` [使用手册] https://codexu.github.io/`)
      process.exit()
    }, 500)
  })