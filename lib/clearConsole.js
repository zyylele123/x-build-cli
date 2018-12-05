const chalk = require('chalk');
const readline = require('readline');

const clearConsole = function (color, str) {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank); // eslint-disable-line
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
  console.info(chalk[color](str)); // eslint-disable-line
};

module.exports = clearConsole;