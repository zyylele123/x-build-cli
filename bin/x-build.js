#!/usr/bin/env node
const path = require('path');
const fs = require('fs');

const program = require('commander');
const co = require('co')
const prompt = require('co-prompt')
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');

program
  .version('0.1.0')
  .option('i, init', '初始化x-build项目')

program
  .parse(process.argv);

if (program.init) {

  co(function* () {
    console.info('');
    // 分步接收用户输入的参数
    let tplName = yield prompt(` - 请输入项目名${chalk.gray(`('x-build')`)}: `);
    let tplVersion = yield prompt(` - 请输入版本号${chalk.gray(`('0.0.1')`)}: `);
    let tplPort = yield prompt(` - 请输入端口号${chalk.gray(`('3000')`)}: `);
    tplName = tplName ? tplName : 'x-build';
    tplVersion = tplVersion ? tplVersion : '0.0.1';
    tplPort = tplPort ? tplPort : '3000';
    console.info('');
    const spinner = ora('正在从github下载x-build').start();
    download('codexu/x-build', tplName, function (err) {
      if (!err) {
        spinner.clear()
        console.info('');
        console.info(chalk.green('-----------------------------------------------------'));
        console.info('');
        spinner.succeed(['项目创建成功,请继续进行以下操作:'])
        console.info('');
        console.info(chalk.blueBright(` -  cd ${tplName}`));
        console.info(chalk.blueBright(` -  npm install`));
        console.info(chalk.blueBright(` -  npm run dev`));
        console.info('');
        console.info(chalk.gray(`devServer: http://localhost:${tplPort}`));
        console.info('');
        console.info(chalk.gray('参考文档: https://github.com/codexu/x-build'));
        console.info('');
        console.info(chalk.green('-----------------------------------------------------'));
        console.info('');

        fs.readFile(`${process.cwd()}/${tplName}/package.json`, (err, data) => {
          if (err) throw err;
          let _data = JSON.parse(data.toString())
          _data.name = tplName
          _data.version = tplVersion
          _data.port = tplPort
          let str = JSON.stringify(_data, null, 4);
          fs.writeFile(`${process.cwd()}/${tplName}/package.json`, str, function (err) {
            if (err) throw err;
            process.exit()
          })
        });
      } else {
        spinner.warn(['发生错误，请在https://github.com/codexu，Issues留言'])
        process.exit()
      }
    })

  })
}