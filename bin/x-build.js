#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const commander = require('commander');
const inquirer = require('inquirer')
const download = require('download-git-repo');
// const chalk = require('chalk');
const ora = require('ora');

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
    question.rem
  ]).then(function (answers) {
    hint.line()
    const spinner = ora('Downloading from GitHub').start();
    download('codexu/x-build', answers.name, function (err) {
      if (!err) {
        spinner.clear()
        spinner.succeed(['项目初始化完成，请继续进行以下操作:'])
        hint.print('cyan', ` $ cd ${answers.name}`, 'top')
        hint.print('cyan', ` $ yarn / npm install`)
        hint.print('cyan', ` $ npm run dev`, 'bottom')
        hint.print('greenBright', `Server: http://localhost:${answers.port}`)
        hint.print('greenBright', `Docs: https://codexu.github.io/`)
        hint.line()
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
            process.exit()
          })
        });
      } else {
        spinner.warn(['warning！ 请在 https://github.com/codexu/x-build 留言'])
        process.exit()
      }
    })
  });
}