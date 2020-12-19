/* eslint-disable no-eval */

import * as Discord from 'discord.js'
import * as fs from 'fs'
import * as chalk from 'chalk'
import * as path from 'path'
import fetch from 'node-fetch'

import { DBCBotStorage, DBCBotActionCache } from './interfaces'

import actions from './actions'
import * as utils from './utils'

export default class DBCBot {
  storage: DBCBotStorage
  client: Discord.Client
  globalVariables: Map<string, any>

  constructor (storage: DBCBotStorage) {
    if (!storage.config.intents) {
      storage.config.intents = []
      storage.config.intents.push('GUILDS')
      storage.config.intents.push('GUILD_MESSAGES')
      fs.writeFileSync(
        './storage.json',
        JSON.stringify(storage, null, 2),
        'utf-8'
      )
    }

    if (!storage.config.intents.includes('GUILDS')) {
      storage.config.intents.push('GUILDS')
      fs.writeFileSync(
        './storage.json',
        JSON.stringify(storage, null, 2),
        'utf-8'
      )
    }

    if (!storage.config.intents.includes('GUILD_MESSAGES')) {
      storage.config.intents.push('GUILD_MESSAGES')
      fs.writeFileSync(
        './storage.json',
        JSON.stringify(storage, null, 2),
        'utf-8'
      )
    }

    this.storage = storage
    this.client = new Discord.Client({
      ws: {
        intents: this.storage.config.intents
      }
    })
    this.globalVariables = new Map()
  }

  get actions () {
    return actions
  }

  get utils () {
    return utils
  }

  get version () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf-8')).version
  }

  async checkForUpdates () {
    if (!fs.existsSync(path.join(__dirname, 'index.ts'))) {
      this.utils.log('info', 'Checking if your bot is up to date...')

      try {
        const latestDBCBotPackage = await (
          await fetch(
            'https://raw.githubusercontent.com/discord-bot-creator/bot/master/dist/package.json'
          )
        ).json()
        if (this.version !== latestDBCBotPackage.version) {
          this.utils.log('alert', 'Your bot is not up to date, updating...')

          try {
            const latestDBCBotFile = await (
              await fetch(
                'https://raw.githubusercontent.com/discord-bot-creator/bot/master/dist/bot.js'
              )
            ).text()
            fs.writeFileSync(
              './package.json',
              JSON.stringify(latestDBCBotPackage, null, 2),
              'utf-8'
            )
            fs.writeFileSync('./bot.js', latestDBCBotFile, 'utf-8')

            this.utils.log(
              'success',
              'Bot updated! Start your bot again.',
              true
            )
          } catch (err) {
            switch (err.code) {
              case 'ENOTFOUND':
                this.utils.log(
                  'error',
                  'Not was possible install the update, check your internet connection!',
                  true
                )
                break
              default:
                this.utils.log('error', 'Unknown error: ' + err, true)
                break
            }
          }
        }

        this.utils.log('info', 'Your bot is up to date.')
      } catch (err) {
        switch (err.code) {
          case 'ENOTFOUND':
            this.utils.log(
              'error',
              'Not was possible check if your bot is up to date, check your internet connection!',
              true
            )
            break
          default:
            this.utils.log('error', 'Unknown error: ' + err, true)
            break
        }
      }
    }
  }

  async setupEvents () {
    this.client.on('ready', () => this.utils.log('success', 'Bot started!'))
    this.client.on('message', (message) => {
      if (
        message.content.startsWith(this.storage.config.prefix) ||
        !message.author.bot
      ) {
        const commandArgs = message.content
          .slice(this.storage.config.prefix.length)
          .split(/ +/)
        const commandName = this.storage.config.caseSensitive
          ? commandArgs.shift().toLowerCase()
          : commandArgs.shift()
        const command =
          this.storage.commands.find((c) => c.name === commandName) ||
          this.storage.commands.find((c) => c.aliases.includes(commandName))
        if (command) {
          const actions = this.actions
          const action = actions.find((a) => a.name === command.actions[0].name)

          const log = this.utils.log

          const variables = new Map<string, any>()
          const globalVariables = this.globalVariables

          if (
            action.intents &&
            !this.storage.config.intents.includes(action.intents)
          ) {
            return log(
              'error',
              'Your bot config does not have the following intents to use some actions: ' +
                action.intents.join(', ')
            )
          }

          function getField (index: number, id: string) {
            const field = command.actions[index].fields.find((f) => f.id === id)
            if (field) {
              const result = eval(`
              function variable(name) {
                return variables.get(name) || 
                globalVariables.get(name);
              }
              const command = message;
              ${'`' + field.value + '`'}
            `)
              return result
            }
          }

          function throwActionError (index: number, error: string) {
            log(
              'error',
              `Ocurred on command ${commandName} on action ${index}: ${error}`,
              true
            )
          }

          function goToAction (cache: DBCBotActionCache) {
            cache.index++
            if (command.actions[cache.index]) {
              actions
                .find((a) => a.name === command.actions[cache.index].name)
                .run(cache)
            }
          }

          const cache = {
            client: this.client,
            message,
            index: 0,
            variables,
            globalVariables,
            getField,
            throwActionError,
            goToAction
          }

          action.run(cache)
        }
      }
    })

    for (const event of this.storage.events) {
      this.client.on(event.type, (output0, output1) => {
        const variables = new Map<string, any>()
        const globalVariables = this.globalVariables

        if (event.outputs) {
          let outputIndex = 0
          for (const output of event.outputs) {
            if (output1 && outputIndex === 1) {
              variables.set(output, output1)
            } else {
              variables.set(output, output0)
            }
            outputIndex++
          }
        }

        const actions = this.actions
        const action = actions.find((a) => a.name === event.actions[0].name)

        const log = this.utils.log

        function getField (index: number, id: string) {
          const field = event.actions[index].fields.find((f) => f.id === id)
          if (field) {
            const result = eval(`
              function variable(name) {
                return variables.get(name) || 
                globalVariables.get(name);
              }
              const command = message;
              ${'`' + field.value + '`'}
            `)
            return result
          }
        }

        function throwActionError (index: number, error: string) {
          log(
            'error',
            `Ocurred on event ${event.name} on action ${index}: ${error}`,
            true
          )
        }

        function goToAction (cache: DBCBotActionCache) {
          cache.index++
          if (event.actions[cache.index]) {
            actions
              .find((a) => a.name === event.actions[cache.index].name)
              .run(cache)
          }
        }

        const cache = {
          index: 0,
          variables,
          globalVariables,
          getField,
          throwActionError,
          client: this.client,
          goToAction
        }

        action.run(cache)
      })
    }
  }

  async start () {
    console.log(
      `\n  ${chalk.magenta('Discord Bot Creator')} Bot ${chalk.gray(
        'v' + this.version
      )}\n__________________________________\n`
    )

    if (process.argv.includes('--test')) {
      return this.utils.log('success', 'Everything ok.', true)
    }

    await this.checkForUpdates()
    await this.setupEvents()

    this.utils.log('info', 'Starting bot...')
    this.client.login(this.storage.config.token).catch((err) => {
      switch (err.code) {
        case 'TOKEN_INVALID':
          this.utils.log(
            'error',
            'You placed an invalid token in your bot config.',
            true
          )
          break
        default:
          this.utils.log('error', 'Unknown error: ' + err, true)
          break
      }
    })
  }
}
