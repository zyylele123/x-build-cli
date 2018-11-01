const os = require('os');
const cmd = require('node-cmd');

function cmdSystem(arr) {
  return new Promise((resolve, reject) => {
    let cmdStr = '';
    if(os.type() === 'Windows_NT') {
      arr.forEach((item, index) => {
        index === 0 ? cmdStr += item : cmdStr = cmdStr + ' & ' + item
      });
    } else {
      arr.forEach((item, index) => {
        index === 0 ? cmdStr += item : cmdStr = cmdStr + '\n' + item
      });
    }
    cmd.get(cmdStr, function (err, data, stderr) {
        if (!err) {
          resolve()
        } else {
          reject(err)
        }
      }
    );
  })
}

exports = module.exports = cmdSystem;