import * as chalk from 'chalk'

export default function log (
  type: 'info' | 'success' | 'error' | 'alert',
  message: string,
  exit?: boolean
) {
  const dateNow = new Date()
  const logDate = `${dateNow.getMonth()}/${dateNow.getDate()}/${dateNow.getFullYear()} - ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`

  switch (type) {
    case 'info':
      console.log(
        `${chalk.gray('[' + logDate + ']')} ${chalk.blue('info')} ${message}`
      )
      break
    case 'success':
      console.log(
        `${chalk.gray('[' + logDate + ']')} ${chalk.green(
          'success'
        )} ${message}`
      )
      break
    case 'error':
      console.error(
        `${chalk.gray('[' + logDate + ']')} ${chalk.red('error')} ${message}`
      )
      break
    case 'alert':
      console.log(
        `${chalk.gray('[' + logDate + ']')} ${chalk.yellow('alert')} ${message}`
      )
      break
  }

  if (exit) process.exit()
}
