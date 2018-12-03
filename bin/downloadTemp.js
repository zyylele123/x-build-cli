const download = require('download-git-repo');

const hint = require('../lib/hint');

// 下载模板文件
let downloadTemp = cli => {
  return new Promise(resolve => {
    hint.line()
    cli.spinner.start('正在下载最新模板文件...');
    download('codexu/x-build', cli.answers_all.name, function (err) {
      if (!err) {
        cli.spinner.succeed(['模板文件下载完成.']);
        cli.spinner.clear();
        resolve()
      } else {
        hint.fail(cli.spinner, '模板下载失败！请检查网络链接状况', err)
      }
    })
  })
}

exports = module.exports = downloadTemp;