const inquirer = require('inquirer')

const hint = require('../lib/hint');
const question = require('../lib/question');

// 输入问题列表
let questionList = cli => {
  return new Promise(resolve => {
    if (cli.commander.create) {
      inquirer.prompt([
        question.package_manager,
        question.precss,
        question.rem,
        question.plugin
      ]).then(function (answers) {
        cli.answers_all.name = cli.commander.create
        cli.answers_all.rem = answers.rem
        cli.answers_all.package_manager = answers.package_manager
        cli.answers_all.precss = answers.precss
        cli.answers_all.plugin = answers.plugin
        if (cli.answers_all.rem === true) {
          cli.answers_all.plugin.push('hotcss')
        }
        if (cli.answers_all.plugin.includes('x-animate') ||
            cli.answers_all.plugin.includes('x-fullpage') 
        ){
          cli.answers_all.plugin.push('animate.css')
        }
        console.log(cli.answers_all.plugin)
        resolve();
      });
    } else {
      hint.print('gray', `参数列表:`)
      hint.print('gray', `$ x-build create [name]`, 'bottom')
      hint.fail(cli.spinner, `请检查指令参数是否正确！`)
      process.exit();
    }
  })
}

exports = module.exports = questionList;