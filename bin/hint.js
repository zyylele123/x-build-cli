const chalk = require('chalk');

const hint = {
  line: function() {
    console.info();
    console.info(chalk.gray('--------------------------------------------------'));
    console.info();
  },
  print: function(chalk_string, text, br) {
    if(br === 'top') {
      console.info();
    }
    console.info(chalk[chalk_string](text));
    if(br === 'bottom') {
      console.info();
    }
  }
}

exports = module.exports = hint;