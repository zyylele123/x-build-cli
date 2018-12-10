const hint = require('../lib/hint.js');
const chalk = require('chalk');
const cmdSystem = require('../lib/cmdSystem');

// 最终提示
let final = cli => {
  return new Promise(resolve => {
    cmdSystem([`cd ${cli.answers_all.name}`]).then(() => {
      cli.spinner.succeed([chalk.green('全部依赖安装完成，Git已初始化。')]);
      setTimeout(function () {
        hint.line();
        hint.print('green', `🎉  欢迎使用x-build,请继续完成以下操作:`, 'bottom');
        hint.print('cyan', ` $ cd ${cli.answers_all.name}`);
        hint.print('cyan', ` $ ${cli.answers_all.package_manager === 'yarn' ? 'yarn' : 'npm run'} serve`, 'bottom');
        hint.print('green', ` [文档] https://codexu.github.io/`);
        process.exit();
        resolve();
      }, 500);
    });
  });
};

module.exports = final;