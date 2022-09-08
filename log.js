import chalk from 'chalk'

export default {
    success(msg) {
        console.log(chalk.green(`>> ${msg}`))
    },
    err(msg) {
        console.log(chalk.red(`>> ${msg}`))
    }
}