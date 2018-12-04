const child_process = require('child_process')

function hasYarn() {
  let _hasYarn = '';
  try {
    child_process.execSync('yarnpkg --version', { stdio: 'ignore' })
    return (_hasYarn = 'yarn')
  } catch (e) {
    try {
      child_process.execSync('cnpm --version', { stdio: 'ignore' })
      return (_hasYarn = 'cnpm')
    } catch (e) {
      return (_hasYarn = 'npm')
    }
  }
}

exports = module.exports = hasYarn;