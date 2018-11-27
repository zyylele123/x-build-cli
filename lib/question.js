const chalk = require('chalk');

// 问题选择
const question = {
  name: {
    type: 'input',
    message: `项目名称: `,
    name: 'name',
    default: 'x-build'
  },
  version: {
    type: 'input',
    message: `初始版本: `,
    name: 'version',
    default: '0.0.1'
  },
  port: {
    type: 'input',
    message: `默认端口: `,
    name: 'port',
    default: '8080'
  },
  rem: {
    type: 'confirm',
    message: `使用rem布局:`,
    name: 'rem',
    default: true
  },
  package_manager: {
    type: 'list',
    message: `选择包管理器: `,
    name: 'package_manager',
    choices: ['yarn', 'npm', 'cnpm']
  },
  plugin: {
    type: 'checkbox',
    message: `选择安装插件: `,
    name: 'plugin',
    choices: [
      {
        value: 'x-fullpage',
        name: `${chalk.green('x-fullpage')}：${chalk.gray('适用于移动端的全屏滚动插件。')}`,
        short: 'x-fullpage',
        checked: false,
      },
      {
        value: 'x-load',
        name: `${chalk.green('x-load')}：${chalk.gray('多种控制图片的加载方式，创建Loading效果。')}`,
        short: 'x-load',
        checked: false
      },
      {
        value: 'x-animate',
        name: `${chalk.green('x-animate')}：${chalk.gray('屏幕滚动执行相应动画，支持动画组和生命周期回调。')}`,
        short: 'x-animate',
        checked: false
      },
      {
        value: 'x-touch',
        name: `${chalk.green('x-touch')}：${chalk.gray('使原生DOM支持轻触和滑动事件。')}`,
        short: 'x-touch',
        checked: false
      }
    ]
  }
}

exports = module.exports = question;