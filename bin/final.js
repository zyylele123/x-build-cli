const chalk = require('chalk');
const child_process = require('child_process');

const hint = require('../lib/hint.js');
const cmdSystem = require('../lib/cmdSystem');

// 最终提示
let final = cli => {
  return new Promise(resolve => {
    cmdSystem([`cd ${cli.answers_all.name}`, isGit()]).then(() => {
      cli.spinner.succeed([chalk.green('全部依赖安装完成。')]);
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

function isGit() {
  try {
    child_process.execSync('git init', { stdio: 'ignore' });
    return 'git init';
  } catch (e) {
    return '';
  }
}

module.exports = final;