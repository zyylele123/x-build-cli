const chalk = require('chalk');
const cmd = require('./cmd');

// 安装项目依赖
function install(type, dependencies) {
  return new Promise(resolve => {
    if ((dependencies instanceof Array && dependencies.length > 0) || dependencies === null) {
      this.progressCurrent++;
      let installStr = `[${this.progressCurrent}/${this.progress}] 正在使用${chalk.greenBright(this.answers.package_manager)}安装${dependencies ? dependencies.join(' ') : null || 'x-build基础依赖'}`;
      this.spinner.start([installStr]);
      const cmdStr = type + (dependencies ? dependencies.join(' ') : '');
      cmd([`cd ${this.name}`, cmdStr]).then(() => {
        resolve();
      });
    } else {
      resolve();
    }
  });
}

module.exports = install;