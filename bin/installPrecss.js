const fs = require('fs');
const chalk = require('chalk');

const cmdSystem = require('../lib/cmdSystem');

// 安装css预处理器
let installPrecss = cli => {
  return new Promise(resolve => {
    let type_install = '';
    let loaders = '';
    let extStr = '';
    switch (cli.answers_all.precss) {
      case 'Sass':
        loaders = `sass-loader node-sass`
        extStr = 'scss'
        break;
      case 'Less':
        loaders = `less-loader less`
        extStr = 'less'
        break;
      case 'Stylus':
        loaders = `stylus-loader stylus`
        loaders = `styl`
        break;
      default:
        extStr = 'css'
        break;
    }
    let _url = `${process.cwd()}/${cli.answers_all.name}/src/style/index.${extStr}`
    fs.writeFile(_url, '', (err) => {
      if (err) throw err
    });

    if (cli.answers_all.precss === 'No use') {
      resolve()
    } else {
      let installStr = `正在使用${chalk.greenBright(cli.answers_all.package_manager)}安装${chalk.greenBright(cli.answers_all.precss + '-loader...')}`
      cli.spinner.start([installStr])
      switch (cli.answers_all.package_manager) {
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
      cmdSystem([`cd ${cli.answers_all.name}`, type_install]).then(() => {
        cli.spinner.succeed([`${cli.answers_all.precss}-loader安装完成.`])
        cli.spinner.clear()
        resolve()
      })
    }
  })
}

exports = module.exports = installPrecss;