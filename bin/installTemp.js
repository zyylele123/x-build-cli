const chalk = require('chalk');

const cmdSystem = require('../lib/cmdSystem');

// 安装项目依赖
let installTemp = cli => {
  return new Promise(resolve => {
    if (!cli.answers_all.pug) {
      resolve();
      return;
    }
    let installStr = `正在使用${chalk.greenBright(cli.answers_all.package_manager)}安装Pug模板引擎...`;
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
    let devs = 'pug pug-loader';
    cmdSystem([`cd ${cli.answers_all.name}`, type_install + devs]).then(() => {
      cli.spinner.succeed([`Pug模板引擎安装完成.`]);
      cli.spinner.clear();
      resolve();
    });
  });
};

module.exports = installTemp;