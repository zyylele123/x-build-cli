const hint = require('../lib/hint.js');

// 最终提示
let final = cli => {
  return new Promise(resolve => {
    setTimeout(function () {
      hint.line()
      hint.print('green', `🎉  欢迎使用x-build,请继续完成以下操作:`, 'bottom')
      hint.print('cyan', ` $ cd ${cli.answers_all.name}`)
      hint.print('cyan', ` $ ${cli.answers_all.package_manager === 'yarn' ? 'yarn' : 'npm run'} serve`, 'bottom')
      hint.print('green', ` [文档] https://codexu.github.io/`)
      process.exit();
      resolve();
    }, 500)
  })
}

exports = module.exports = final;