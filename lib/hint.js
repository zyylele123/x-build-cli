const chalk = require('chalk');

const hint = {
  line: () => {
    console.info();
    console.info(chalk.gray('---------------------------------------'));
    console.info();
  },
  print: (chalk_string, text, br) => {
    if(br === 'top') {
      console.info();
    }
    console.info(chalk[chalk_string](text));
    if(br === 'bottom') {
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
    spinner.fail([chalk.bgRed(str)])
    console.info('')
    console.error(err)
    console.info('')
    console.info(chalk.blue('[问题留言] https://github.com/codexu/x-build/issues'));
    process.exit()
  }
}

exports = module.exports = hint;