const clearConsole = require('../lib/clearConsole');
const checkVersion = require('../lib/checkVersion');
const pkg = require('../package.json');
const msg = require('../lib/msg.js');

// 清空控制台，查询CLI版本
function start() {
  return new Promise(resolve => {
    // 清空控制台，并输出版本信息
    clearConsole('magenta', `X-BUILD-CLI v${pkg.version}`);
    console.info(''); // eslint-disable-line
    // 检测是否为最新版本
    if (this.commander.noversion){
      resolve();
    } else {
      this.spinner.start('正在查询x-build-cli最新版本');
      checkVersion().then(() => {
        this.spinner.stop();
        resolve();
      }, (version) => {
        msg.fail(this.spinner, `请将x-build-cli更新到最新版本(v${version})`);
        process.exit();
      });
    }
  });
}

module.exports = start;