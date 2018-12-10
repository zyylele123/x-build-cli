const chalk = require('chalk');

const cmdSystem = require('../lib/cmdSystem');

// 安装插件
let installPlugin = cli => {
  return new Promise(resolve => {
    if (cli.answers_all.plugin.length === 0) {
      resolve();
    } else {
      cli.progressCurrent++;
      let installStr = `[${cli.progressCurrent}/${cli.progress}] 正在使用${chalk.greenBright(cli.answers_all.package_manager)}安装插件...`;
      cli.spinner.start([installStr]);
      let plugin = cli.answers_all.plugin.join(' ');
      let type_install = null;
      switch (cli.answers_all.package_manager) {
        case 'npm':
          type_install = `npm install ${plugin} --save`;
          break;
        case 'cnpm':
          type_install = `cnpm install ${plugin} --save`;
          break;
        default:
          type_install = `yarn add ${plugin}`;
          break;
      }
      cmdSystem([`cd ${cli.answers_all.name}`, type_install]).then(() => {
        resolve();
      });
    }
  });
};

module.exports = installPlugin;