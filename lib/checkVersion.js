const semver = require('semver');

const getVersion = require('./getVersion');
const packageVersion = require('../package.json').version;

function checkVersion(){
  return new Promise((resolve, reject) => {
    getVersion(`https://registry.npmjs.org/x-build-cli/latest`)
    .then(version => {
      let isNew = semver.lte(version, packageVersion);
      if (isNew) {
        resolve();
      } else {
        reject(version);
      }
    });
  });
}

module.exports = checkVersion;