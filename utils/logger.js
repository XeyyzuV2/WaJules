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

const info = (text) => {
    console.log(chalk.blue(text));
}

module.exports = { log, error, warn, info };
