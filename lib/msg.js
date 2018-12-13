const chalk = require('chalk');

const msg = {
  line: () => {
    console.info();
    console.info(chalk.gray('-'.repeat(process.stdout.columns / 2)));
    console.info();
  },
  print: (color, text, br) => {
    if (br === 'top') {
      console.info();
    }
    console.info(chalk[color](text));
    if (br === 'bottom') {
      console.info();
    }
  },
  docs: () => {
    console.info(chalk.green(' [开发文档] https://codexu.github.io/'));
  },
  issues: () => {
    console.info(chalk.green('[问题留言] https://github.com/codexu/x-build/issues'));
  },
  fail: (spinner, str, err) => {
    spinner.fail([chalk.bgRed(str)]);
    console.info('');
    if (err) {
      console.error(err);
      console.info('');
    }
    console.info(chalk.blue('[问题留言] https://github.com/codexu/x-build/issues'));
    process.exit();
  }
};

module.exports = msg;