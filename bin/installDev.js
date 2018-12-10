const chalk = require('chalk');

const cmdSystem = require('../lib/cmdSystem');

// 安装项目依赖
let installDev = cli => {
  return new Promise(resolve => {
    cli.progressCurrent++;
    let installStr = `[${cli.progressCurrent}/${cli.progress}] 正在使用${chalk.greenBright(cli.answers_all.package_manager)}安装项目依赖...`;
    cli.spinner.start([installStr]);
    // 根据不同的选项选择安装方式
    let type_install = '';
    switch (cli.answers_all.package_manager) {
      case 'npm':
        type_install = 'npm install';
        break;
      case 'cnpm':
        type_install = 'cnpm install';
        break;
      default:
        type_install = 'yarn';
        break;
    }
    
    cmdSystem([`cd ${cli.answers_all.name}`, type_install]).then(() => {
      resolve();
    });
  });
};

module.exports = installDev;