const chalk = require('chalk');

// 问题选择
const question = {
  eslint: {
    type: 'confirm',
    message: `是否使用ESLint？`,
    name: 'eslint',
    default: true
  },
  rem: {
    type: 'confirm',
    message: `是否使用rem布局？`,
    name: 'rem',
    default: true
  },
  precss: {
    type: 'list',
    message: `选择CSS预处理器: `,
    name: 'precss',
    choices: ['No', 'Sass', 'Less', 'Stylus']
  },
  plugin: {
    type: 'checkbox',
    message: `选择安装插件: `,
    name: 'plugin',
    choices: [
      {
        value: 'x-load',
        name: `${chalk.green('x-load')}：${chalk.gray('图片加载控制')}`,
        short: 'x-load',
        checked: true
      },
      {
        value: 'x-touch',
        name: `${chalk.green('x-touch')}：${chalk.gray('原生DOM支持触控')}`,
        short: 'x-touch',
        checked: false
      },
      {
        value: 'x-animate',
        name: `${chalk.green('x-animate')}：${chalk.gray('滚动执行动画')}`,
        short: 'x-animate',
        checked: false
      },
      {
        value: 'x-fullpage',
        name: `${chalk.green('x-fullpage')}：${chalk.gray('整屏翻页')}`,
        short: 'x-fullpage',
        checked: false,
      }
    ]
  }
};

module.exports = question;