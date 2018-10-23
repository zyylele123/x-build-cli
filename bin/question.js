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
    message: `是否使用px2rem布局?`,
    name: 'rem',
    default: true
  },
  package_manager: {
    type: 'list',
    message: `包管理器: `,
    name: 'package_manager',
    choices: ['yarn', 'npm', 'cnpm']
  },
  plugin: {
    type: 'checkbox',
    message: `插件: `,
    name: 'plugin',
    choices: [
      {
        name: 'normalize.css',
        checked: true
      },
      {
        name: 'x-load',
        checked: false
      },
      {
        name: 'x-animate',
        checked: false
      },
      {
        name: 'animate.css',
        checked: false
      }
    ]
  }
}

exports = module.exports = question;