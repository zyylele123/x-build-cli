const chalk = require('chalk');

const cmdSystem = require('../lib/cmdSystem');

// 安装插件
let installPlugin = cli => {
  return new Promise(resolve => {
    let installStr = `正在使用${chalk.greenBright(cli.answers_all.package_manager)}安装插件...`
    cli.spinner.start([installStr])
    let plugin = cli.answers_all.plugin.join(' ')
    let type_install = null;
    switch (cli.answers_all.package_manager) {
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
    cmdSystem([`cd ${cli.answers_all.name}`, type_install]).then(() => {
      cli.spinner.succeed(['插件安装完成.'])
      cli.spinner.clear()
      resolve()
    })
  })
}

exports = module.exports = installPlugin;