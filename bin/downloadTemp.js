const download = require('download-git-repo');
const msg = require('../lib/msg');

// 下载模板文件
function downloadTemp() {
  return new Promise(resolve => {
    this.progressCurrent++;
    this.spinner.start(`[${this.progressCurrent}/${this.progress}] 正在下载最新模板文件...`);
    download(this.git, this.name, err => {
      if (!err) {
        resolve();
      } else {
        msg.fail(this.spinner, '模板下载失败！请检查网络链接状况或查看错误信息', err);
        process.exit();
      }
    });
  });
}

module.exports = downloadTemp;