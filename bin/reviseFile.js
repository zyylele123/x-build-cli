const fs = require('fs');

// 修改文件
async function reviseFile(cli) {
  let url = `${process.cwd()}/${cli.answers_all.name}`;
  await revisePackage(url, cli);
  await reviseConfig(url, cli);
  if (!cli.answers_all.eslint) await removeEslintrc(url);
}

function revisePackage(url, cli) {
  return new Promise((resolve, reject) => {
    let _url = url + '/package.json';
    fs.readFile(_url, (err, data) => {
      if (err) reject(err);
      let _data = JSON.parse(data.toString());
      _data.name = cli.answers_all.name;
      _data.version = '0.0.0';
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_url, _data, error => (error ? reject(error) : resolve()));
    });
  });
}

function reviseConfig(url, cli) {
  return new Promise((resolve, reject) => {
    let _url = url + '/build/config.json';
    fs.readFile(_url, (err, data) => {
      if (err) reject(err);
      let _data = JSON.parse(data.toString());
      _data.eslint = cli.answers_all.eslint;
      _data.isRem = cli.answers_all.rem;
      _data.plugins = _data.plugins.concat(cli.answers_all.plugin);
      let extStr = '';
      switch (cli.answers_all.precss) {
        case 'Sass':
          extStr = 'scss';
          break;
        case 'Less':
          extStr = 'less';
          break;
        case 'Stylus':
          extStr = 'styl';
          break;
        default:
          extStr = 'css';
          break;
      }
      _data.files.push(`./src/style/index.${extStr}`);
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_url, _data, error => (error ? reject(error) : resolve()));
    });
  });
}

function removeEslintrc(url) {
  return new Promise(resolve => {
    let _url = url + '/.eslintrc.js';
    fs.unlink(_url, (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

module.exports = reviseFile;