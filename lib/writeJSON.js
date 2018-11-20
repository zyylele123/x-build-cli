const fs = require('fs');

const hint = require('./hint.js');

// 读取package.json
function writeJSON(path, answers_all,spinner) {
  let promise = new Promise((resolve, reject) => {
    let src = `${path}/package.json`;
    fs.readFile(src, (err, data) => {
      if (err) {
        hint.fail(spinner, `package.json读取失败！`, err)
      }
      let _data = JSON.parse(data.toString())
      _data.name = answers_all.name
      _data.version = '0.0.0'
      let str = JSON.stringify(_data, null, 4);
      // 写入
      fs.writeFile(src, str, function (err) {
        if (!err) {
          resolve();
        } else {
          hint.fail(spinner, `package.json写入失败！`, err)
          reject();
        }
      })
    });
  })

  promise.then(() => {
    return new Promise((resolve, reject) => {
      let src = `${path}/build/config.json`;
      fs.readFile(src, (err, data) => {
        if (err) {
          hint.fail(spinner, `config.json读取失败！`, err)
        }
        let _data = JSON.parse(data.toString())
        _data.port = answers_all.port
        _data.isRem = answers_all.rem
        _data.plugins = _data.plugins.concat(answers_all.plugin)
        let str = JSON.stringify(_data, null, 4);
        // 写入
        fs.writeFile(src, str, function (err) {
          if (!err) {
            spinner.succeed(['模板文件下载完成.']);
            spinner.clear();
            resolve();
          } else {
            hint.fail(spinner, `config.json写入失败！`, err)
            reject();
          }
        })
      });
    })
  })

  return promise
  
}

exports = module.exports = writeJSON;