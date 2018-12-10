const inquirer = require('inquirer');

const hint = require('../lib/hint');
const question = require('../lib/question');
const hasYarn = require('../lib/hasYarn');

// 输入问题列表
let questionList = cli => {
  return new Promise(resolve => {
    if (cli.commander.create) {
      cli.answers_all.name = cli.commander.create;
      cli.answers_all.package_manager = hasYarn();
      if (cli.commander.quick) {
        cli.answers_all.eslint = false;
        cli.answers_all.rem = false;
        cli.answers_all.pug = false;
        cli.answers_all.precss = 'No';
        cli.answers_all.plugin = [];
        resolve();
        return;
      }
      inquirer.prompt([
        question.eslint,
        question.rem,
        question.pug,
        question.precss,
        question.plugin
      ]).then(function (answers) {
        cli.answers_all.eslint = answers.eslint;
        if (cli.answers_all.eslint) cli.progress++;

        cli.answers_all.rem = answers.rem;

        cli.answers_all.pug = answers.pug;
        if (cli.answers_all.pug) cli.progress++;
        
        cli.answers_all.precss = answers.precss;
        if (cli.answers_all.precss !== 'No') cli.progress++;
        
        cli.answers_all.plugin = answers.plugin;
        if (cli.answers_all.rem === true) {
          cli.answers_all.plugin.push('hotcss');
        }
        if (cli.answers_all.plugin.includes('x-animate') ||
            cli.answers_all.plugin.includes('x-fullpage')
        ){
          cli.answers_all.plugin.push('animate.css');
        }
        if (cli.answers_all.plugin.length > 0) cli.progress++;
        hint.line();
        resolve();
      });
    } else {
      hint.print('gray', `参数列表:`);
      hint.print('gray', `$ x-build create [name]`, 'bottom');
      hint.fail(cli.spinner, `请检查指令参数是否正确！`);
      process.exit();
    }
  });
};

module.exports = questionList;