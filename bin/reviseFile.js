const fs = require('fs');

// 修改文件
async function reviseFile() {
  let url = `${process.cwd()}/${this.name}`;
  await revisePackage.call(this, url);
  await reviseConfig.call(this, url);
  await addCss.call(this, url);
  if (!this.answers.eslint) await removeEslintrc(url);
  if (this.answers.pug) {
    await removeHtml(url);
  } else {
    await removePug(url);
  }
}

// 修改 package.json
function revisePackage(url) {
  return new Promise((resolve, reject) => {
    let _url = url + '/package.json';
    fs.readFile(_url, (err, data) => {
      if (err) reject(err);
      let _data = JSON.parse(data.toString());
      _data.name = this.name;
      _data.version = '0.0.0';
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_url, _data, error => (error ? reject(error) : resolve()));
    });
  });
}

// 修改 build/config.json
function reviseConfig(url) {
  return new Promise((resolve, reject) => {
    let _url = url + '/build/config.json';
    fs.readFile(_url, (err, data) => {
      if (err) reject(err);
      let _data = JSON.parse(data.toString());
      _data.eslint = this.answers.eslint;
      _data.isRem = this.answers.rem;
      _data.plugins = _data.plugins.concat(this.answers.plugin);
      if (this.answers.pug) {
        _data.template = './index.pug';
      }
      _data.files.push(`./src/style/index.${this.cssExt}`);
      _data = JSON.stringify(_data, null, 4);
      fs.writeFile(_url, _data, error => (error ? reject(error) : resolve()));
    });
  });
}

function addCss(url) {
  return new Promise(resolve => {
    let _url = `${url}/src/style/index.${this.cssExt}`;
    fs.writeFile(_url, '', (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

// 删除 eslint配置文件
function removeEslintrc(url) {
  return new Promise(resolve => {
    let _url = url + '/.eslintrc.js';
    fs.unlink(_url, (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

// 删除PUG模板文件
function removePug(url) {
  return new Promise(resolve => {
    let _url1 = url + '/index.pug';
    let _url2 = url + '/src/app.pug';
    fs.unlink(_url1, (err) => {
      if (err) throw err;
      resolve();
    });
    fs.unlink(_url2, (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

// 删除HTML入口文件
function removeHtml(url) {
  return new Promise(resolve => {
    let _url = url + '/src/index.html';
    fs.unlink(_url, (err) => {
      if (err) throw err;
      resolve();
    });
  });
}

module.exports = reviseFile;