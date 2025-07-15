const chalk = require('chalk');

const log = (text) => {
    console.log(chalk.green(text));
};

const error = (text) => {
    console.log(chalk.red(text));
};

const warn = (text) => {
    console.log(chalk.yellow(text));
}

module.exports = { log, error, warn };
