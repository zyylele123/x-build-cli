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

commander
  .version(package.version)
  .option('-i, init', '初始化x-build项目')

commander
  .parse(process.argv);

if (commander.init) {
  console.info('');
  inquirer.prompt([
    question.name,
    question.version,
    question.port,
    question.rem,
    question.package_manager,
    question.plugin
  ]).then(function (answers) {
    hint.line()
    const spinner = ora('正在下载最新模板...').start();
    download('codexu/x-build', answers.name, function (err) {
      if (!err) {
        // 修改package.json
        fs.readFile(`${process.cwd()}/${answers.name}/package.json`, (err, data) => { 
          if (err) throw err;
          let _data = JSON.parse(data.toString())
          _data.name = answers.name
          _data.version = answers.version
          _data.port = answers.port
          _data.rem = answers.rem
          let str = JSON.stringify(_data, null, 4);
          fs.writeFile(`${process.cwd()}/${answers.name}/package.json`, str, function (err) {
            if (err) throw err;
          })
        });
        let package_manager = null;
        switch (answers.package_manager) {
          case 'npm':
            package_manager = 'npm install'
            break;
          case 'cnpm':
            package_manager = 'cnpm install'
            break;
          default:
            package_manager = 'yarn'
            break;
        }
        spinner.succeed(['模板下载完成.'])
        spinner.clear()
        spinner.start([`正在使用${chalk.greenBright(answers.package_manager)}安装项目依赖...`])
        cmd.get(
          `
           cd ${answers.name}
           ${package_manager}
          `, 
          function(err, data, stderr){
            spinner.succeed(['项目依赖安装完成.'])
            spinner.clear()
            spinner.start([`正在使用${chalk.greenBright(answers.package_manager)}安装插件...`])
            if(answers.rem === true){
              answers.plugin.push('hotcss')
            }
            let plugin = answers.plugin.join(' ')
            switch (answers.package_manager) {
              case 'npm':
                package_manager = `npm install ${plugin} --save`
                break;
              case 'cnpm':
                package_manager = `cnpm install ${plugin} --save`
                break;
              default:
                package_manager = `yarn add ${plugin}`
                break;
            }
            cmd.get(
              `
                cd ${answers.name}
                ${package_manager}
              `, 
              function() {
                spinner.succeed([`插件安装完成.`])
                spinner.clear()
                hint.line()
                setTimeout(function(){
                  hint.print('green', ` 欢迎使用x-build,请继续完成以下操作:`, 'bottom')
                  hint.print('cyan', ` $ cd ${answers.name}`)
                  hint.print('cyan', ` $ npm run dev`, 'bottom')
                  hint.print('green', ` [开发文档] https://codexu.github.io/`)
                  hint.line()
                  process.exit()
                  }, 500)
              }
            )
          }
        );
      } else {
        spinner.warn(['warning！ 请在 https://github.com/codexu/x-build 留言'])
        process.exit()
      }
    })
  });
}