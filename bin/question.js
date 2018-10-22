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
  }
}

exports = module.exports = question;