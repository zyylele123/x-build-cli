const clearConsole = require('../lib/clearConsole');
const checkVersion = require('../lib/checkVersion');
const pkg = require('../package.json');
const hint = require('../lib/hint.js');

// 清空控制台，查询CLI版本
let start = cli => {
  return new Promise(resolve => {
    // 清空控制台，并输出版本信息
    clearConsole('magenta', `X-BUILD-CLI v${pkg.version}`);
    console.info(''); // eslint-disable-line
    // 检测是否为最新版本
    if (cli.commander.noversion){
      resolve();
    } else {
      cli.spinner.start('正在查询x-build-cli最新版本');
      checkVersion().then(() => {
        cli.spinner.stop();
        resolve();
      }, (version) => {
        hint.fail(cli.spinner, `请将x-build-cli更新到最新版本(v${version})`);
        process.exit();
      });
    }
  });
};

module.exports = start;