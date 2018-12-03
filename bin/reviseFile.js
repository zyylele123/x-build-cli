const fs = require('fs');

// 修改文件
async function reviseFile(cli) {
  let url = `${process.cwd()}/${cli.answers_all.name}`;
  await revisePackage(url, cli);
  await reviseConfig(url, cli);
}

function revisePackage(url, cli) {
  return new Promise((resolve, reject) => {
    let _url = url + '/package.json';
    fs.readFile(_url, (err, data) => {
      if (err) reject();
      let _data = JSON.parse(data.toString())
      _data.name = cli.answers_all.name
      _data.version = '0.0.0'
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_url, _data, err => err ? reject(): resolve())
    })
  })
}

function reviseConfig(url, cli) {
  return new Promise((resolve, reject) => {
    let _url = url + '/build/config.json';
    fs.readFile(_url, (err, data) => {
      if (err) reject();
      let _data = JSON.parse(data.toString())
      _data.port = cli.answers_all.port
      _data.isRem = cli.answers_all.rem
      _data.plugins = _data.plugins.concat(cli.answers_all.plugin)
      let extStr = '';
      switch (cli.answers_all.precss) {
        case 'Sass':
          extStr = 'scss'
          break;
        case 'Less':
          extStr = 'less'
          break;
        case 'Stylus':
          extStr = 'styl'
          break;
        default:
          extStr = 'css'
          break;
      }
      _data.files.push(`./src/style/index.${extStr}`);
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_url, _data, err => err ? reject(): resolve())
    });
  })
}

exports = module.exports = reviseFile;