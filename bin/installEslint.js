const chalk = require('chalk');

const cmdSystem = require('../lib/cmdSystem');

// 安装项目依赖
let installEslint = cli => {
  return new Promise(resolve => {
    if (!cli.answers_all.eslint) {
      resolve();
      return;
    }
    let installStr = `正在使用${chalk.greenBright(cli.answers_all.package_manager)}安装ESLint...`;
    cli.spinner.start([installStr]);
    // 根据不同的选项选择安装方式
    let type_install = '';
    switch (cli.answers_all.package_manager) {
      case 'npm':
        type_install = 'npm install --save-dev ';
        break;
      case 'cnpm':
        type_install = 'cnpm install --save-dev ';
        break;
      default:
        type_install = 'yarn add -D ';
        break;
    }
    let devs = `babel-eslint eslint-loader eslint`;
    cmdSystem([`cd ${cli.answers_all.name}`, type_install + devs]).then(() => {
      cli.spinner.succeed(['ESLint安装完成.']);
      cli.spinner.clear();
      resolve();
    });
  });
};

module.exports = installEslint;