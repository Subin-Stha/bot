/**
 * Copyright (c) Discord Bot Creator.
 * 
 * This source code is licensed under the GPL-3.0.
 * 
 * @license
 */

/** 
 * DBC bot storage, include commands, 
 * events and configs. 
 */
const DBCBotStorage = require('./storage.json');

/** 
 * DBC bot actions, delimit
 * what the bot can do. 
 */
const DBCBotActions = [
  /** Messages */
  {
    name: 'Send Message',
    description: 'Send messages to channels, users and bot logs.',
    category: 'Messages',
    html(isCommand) {
      return `
        <div>
          <div>
            <label id="send-to">Send to</label>
            <select id="send-to" isDBCField>
              ${isCommand ? `
                <option value="command-channel">
                  Command Channel
                </option>
                <option value="command-author">
                  Command Author
                </option>
              ` : ''}
              <option value="bot-logs">Bot Logs</option>
              <option value="channel-user-variable">
                Channel/User Variable
              </option>
              <option value="channel-user-global-variable">
                Channel/User Global Variable
              </option>
            </select>
          </div>
          <div id="variable-name-container" style="display: none;">
            <label id="variable-name">Variable Name</label>
            <input id="variable-name" type="text" isDBCField>
          </div>
        </div>
        <div>
          <label id="message">Message</label>
          <textarea id="message" isDBCField></textarea>
        </div>
        <script>
          const messageSendTo = document
            .getElementById('message-send-to');
          const variableNameContainer = document
            .getElementById('variable-name-container');

          messageSendTo.addEventListener('select', e => {
            if (
              e.target.value === 'channel-user-variable' || 
              e.target.value === 'channel-user-global-variable'
            ) {
              variableNameContainer
                .style
                .display = '';
            } else {
              if (variableNameContainer.style.display !== 'none') {
                variableNameContainer
                  .style
                  .display = 'none';
              }
            }
          });
        </script>
      `;
    },
    async run(cache) {
      const sendTo = cache.getField(
        cache.index, 
        'send-to'
      );
      const variableName = cache.getField(
        cache.index,
        'variable-name'
      );
      const _message = cache.getField(
        cache.index, 
        'message'
      );

      try {
        switch (sendTo) {
          case 'command-channel':
            await cache.message.channel.send(_message);
            break;
          case 'command-author':
            await cache.message.author.send(_message);
            break;
          case 'bot-logs':
            console.log(_message);
            break;
          case 'channel-user-variable':
            await cache.variables
              .get(variableName)
              .send(_message);
            break;
          case 'channel-user-global-variable':
            await cache.globalVariables
              .get(variableName)
              .send(_message);
            break;
        }

        cache.goToAction(cache);
      } catch (err) {
        cache.throwActionError(cache.index, err);
      }
    }
  },
  /** Others */
  {
    name: 'Create Variable',
    description: 'Create custom variables.',
    category: 'Others',
    html() {
      return `
        <div>
          <label id="variable-type">Variable Type</label>
          <select id="variable-type" isDBCField>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="object">Object</option>
            <option value="list">List</option>
            <option value="true-false">True/false</option>
          </select>
        </div>
        <br>
        <div>
          <label id="variable-value">Variable Value</label>
          <textarea id="variable-value" isDBCField></textarea>
        </div>
        <br>
        <div>
          <div>
            <label id="variable-storage">Store in</label>
            <select id="variable-storage" isDBCField>
              <option value="temp">Variable</option>
              <option value="global">Global Variable</option>
            </select>
          </div>
          <div>
            <label id="variable-name">Variable Name</label>
            <input id="variable-name" type="text" isDBCField>
          </div>
        </div>
      `;
    },
    run(cache) {
      const variableType = cache.getField(
        cache.index, 
        'variable-type'
      );
      let variableValue = cache.getField(
        cache.index, 
        'variable-value'
      );
      const variableStorage = cache.getField(
        cache.index, 
        'variable-storage'
      );
      const variableName = cache.getField(
        cache.index, 
        'variable-name'
      );

      switch (variableType) {
        case 'text':
          variableValue = String(variableValue);
          break;
        case 'number':
          variableValue = Number(variableValue);
          break;
        case 'object':
          variableValue = Object(variableValue);
          break;
        case 'list':
          variableValue = Array(variableValue);
          break;
        case 'true-false':
          variableValue = Boolean(variableValue);
          break;
      }

      if (variableStorage === 'temp') {
        cache.variables.set(variableName, variableValue);
      } else {
        cache.globalVariables.set(variableName, variableValue);
      }

      cache.goToAction(cache);
    }
  },
  {
    name: 'Skip Actions',
    description: 'Skip a sequence of actions according with the amount.',
    category: 'Others',
    html() {
      return `
        <div>
          <label id="amount-to-skip">Amount to Skip</label>
          <input id="amount-to-skip" type="number" isDBCField>
        </div>
      `;
    },
    run(cache) {
      const amountToSkip = Number(
        cache.getField(
          cache.index, 
          'amount-to-skip'
        )
      );
      cache.index += amountToSkip;
      cache.goToAction(cache);
    }
  },
  {
    name: 'Jump to Action',
    description: 'Jump to any selected action number, if exists.',
    categoy: 'Others',
    html() {
      return `
        <div>
          <label id="action-to-jump">Action to Jump</label>
          <input id="action-to-jump" type="number" isDBCField>
        </div>
      `;
    },
    run(cache) {
      const actionToJump = Number(
        cache.getField(
          cache.index,
          'action-to-jump'
        )
      );
      cache.index = actionToJump;
      cache.goToAction(cache);
    }
  },
  {
    name: 'Stop Actions',
    description: 'Stop all actions, that is, the actions sequence.',
    category: 'Others',
    html() {
      return ``;
    },
    run() {}
  }
];

class DBCBot {
  /** Start the DBC Discord bot. */
  constructor() {
    return (async () => {
      /** 
       * DBC bot client, Discord client used for 
       * controling the DBC bot. 
       */
      this.client = new this.libs.Discord.Client({ ws: {
        intents: this.storage.config.intents
      }});

      await this.verifyFiles();
      this.setupSystems();

      try {
        this.utils.log('info', 'Starting bot...');
        await this.client.login(this.storage.config.token);
      } catch (err) {
        switch (err.code) {
          case 'TOKEN_INVALID':
            this.utils.log(
              'error',
              'You placed an invalid token in your bot config.'
            );
            break;
          default:
            this.utils.log(
              'error',
              'Unknown error: ' + err
            );
            break;
        }
      }
    })();
  }

  /** DBC bot version. */
  get version() {
    return require('./package.json').version;
  }

  /** DBC bot libs, used libs of DBC bot. */
  get libs() {
    return {
      Discord: require('discord.js'),
      fs: require('fs'),
      fetch: require('node-fetch')
    };
  }

  /** 
   * DBC bot storage, including commands, 
   * events and configs. 
   */
  get storage() {
    const { writeFileSync } = this.libs.fs;

    if (
      !DBCBotStorage.config.intents.includes('GUILDS')
    ) {
      DBCBotStorage.config.intents.push('GUILDS');
      writeFileSync(
        './storage.json', 
    	JSON.stringify(DBCBotStorage, null, 2)
      );
    }
    if (
      !DBCBotStorage.config.intents.includes('GUILD_MESSAGES')
    ) {
      DBCBotStorage.config.intents.push('GUILD_MESSAGES');
      writeFileSync(
        './storage.json', 
        JSON.stringify(DBCBotStorage, null, 2)
      );
    }

    return DBCBotStorage;
  }

  /** 
   * DBC bot actions, delimit
   * what the bot can do. 
   */
  get actions() {
    return DBCBotActions;
  }

  /** 
   * DBC bot utils, some useful functions and 
   * infos of DBC bot. 
   */
  get utils() {
    return {
      /**
       * A custom console logger.
       * @param {'info' | 'success' | 'error' | 'alert'} type 
       * @param {string} message 
       */
      log(type, message) {
        const dateNow = new Date();
        const logDate = 
          `${dateNow.getMonth()}/${dateNow.getDate()}/${dateNow.getFullYear()} - ${dateNow.getHours()}:${dateNow.getMinutes()}:${dateNow.getSeconds()}`;
    
        switch (type) {
          case 'info':
            console.log(
              `[${logDate}] \x1b[36minfo\x1b[0m ${message}`
            );
            break;
          case 'success':
            console.log(
              `[${logDate}] \x1b[32msuccess\x1b[0m ${message}`
            );
            break;
          case 'error':
            console.error(
              `[${logDate}] \x1b[31merror\x1b[0m ${message}`
            );
            break;
          case 'alert':
            console.log(
              `[${logDate}] \x1b[33malert\x1b[0m ${message}`
            );
            break;
        }
      }
    };
  }

  async verifyFiles() {
    this.utils.log('info', 'Verifying if your bot is up to date...');

    const currentDBCBotPackage = await (await this.libs.fetch(
      'https://raw.githubusercontent.com/discord-bot-creator/bot/master/package.json'
    )).json();

    if (this.version !== currentDBCBotPackage.version) {
      this.utils.log('alert', 'Your bot is not up to date, updating...');

      const currentDBCBotFile = await (await this.libs.fetch(
        'https://raw.githubusercontent.com/discord-bot-creator/bot/master/bot.js'
      )).text();
      const { writeFileSync } = this.libs.fs;

      writeFileSync(
        './package.json', 
        JSON.stringify(currentDBCBotPackage, null, 2)
      );
      writeFileSync(
        './bot.js',
        currentDBCBotFile
      );

      return this.utils.log('success', 'Bot updated successfully!');
    }

    this.utils.log('success', 'Your bot is up to date!');
  }

  setupSystems() {
    this.globalVariables = new Map();

    this.client.on('ready', () => {
      this.utils.log('success', 'Bot started!');
    });
      
    /** Prepares commands system. */
    this.client.on('message', message => {
      if (
        !message.content.startsWith(this.storage.config.prefix) ||
        message.author.bot
      ) return;

      const commandArgs = message.content
        .slice(this.storage.config.prefix.length)
        .split(/ +/);
      const commandName = this.storage.config.caseSensitive ?
        commandArgs.shift().toLowerCase() :
        commandArgs.shift();
      const command = this.storage.commands
        .find(c => c.name === commandName) || this.storage.commands
        .find(c => c.aliases.includes(commandName));

      if (command) {
        const variables = new Map();
        const globalVariables = this.globalVariables;

        const log = this.utils.log;
      
        const actions = this.actions;
        const action = actions
          .find(a => a.name === command.actions[0].name);
        
        if (
          action.intents && 
          !this.storage.config.intents.includes(actions.intents)
        ) {
          return log(
            'error',
            "Your bot's config doesn't have the following intents to use some actions: " + action.intents.join(', ')
          );
        }
      
        function getField(index, id) {
          const field = command
            .actions[index]
            .fields
            .find(f => f.id === id) || null;
          if (!field) return;
          const result = eval(`
            function variable(name) {
              return variables.get(name) || 
              globalVariables.get(name);
            }
            const command = message;
            ${'`' + field.value + '`'}
          `);
          
          return result;
        }

        function throwActionError(
          index, 
          error
        ) {
          log(
            'error', 
            `Ocurred on command ${commandName} on action ${index}: ${error}`
          )
        }

        function goToAction(cache) {
          cache.index++;
          if (command.actions[cache.index]) {
            actions
              .find(a => a.name === command.actions[cache.index].name)
              .run(cache);
          }
        }

        const cache = {
          index: 0,
          variables,
          globalVariables,
          getField,
          throwActionError,
          libs: this.libs,
          client: this.client,
          message,
          goToAction
        };
      
        action.run(cache);
      }
    });

    /** Prepares events system. */
    for (const event of this.storage.events) {
      this.client.on(event.type, (output0, output1) => {
        const variables = new Map();
        const globalVariables = this.globalVariables;

        if (event.outputs) {
          let outputIndex = 0;
          for (const output of event.outputs) {
            if (output1 && outputIndex === 1) {
              variables.set(output, output1);
            } else {
              variables.set(output, output0);
            }
            outputIndex++;
          }
        }

        const log = this.utils.log;

        const actions = this.actions;
        const action = actions
          .find(a => a.name === event.actions[0].name);
      
        function getField(index, id) {
          const field = event
            .actions[index]
            .fields
            .find(f => f.id === id) || null;
          if (!field) return;
          const result = eval(`
            function variable(name) {
              return variables.get(name) || 
              globalVariables.get(name);
            }
            const command = message;
            ${'`' + field.value + '`'}
          `);
          
          return result;
        }
        
        function throwActionError(
          index, 
          error
        ) {
          log(
            'error', 
            `Ocurred on event ${event.name} on action ${index}: ${error}`
          );
        }

        function goToAction(cache) {
          cache.index++;
          if (event.actions[cache.index]) {
            actions
              .find(a => a.name === event.actions[cache.index].name)
              .run(cache);
          }
        }

        const cache = {
          index: 0,
          variables,
          globalVariables,
          getField,
          throwActionError,
          libs: this.libs,
          client: this.client,
          goToAction
        };
      
        action.run(cache);
      });
    }
  }
}

/** 
 * Only starts the bot when 
 * there execute directly.
 */
if (
  process.mainModule.filename.endsWith('bot.js')
) new DBCBot();

/** 
 * Is necessary export the actions 
 * for use in the DBC.
 */
module.exports = DBCBotActions;
