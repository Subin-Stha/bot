import { DBCBotAction, DBCBotActionCache } from '../../../interfaces'

class SendMessage implements DBCBotAction {
  get name () {
    return 'Send Message'
  }

  get description () {
    return 'Send messages to channels, users and bot logs.'
  }

  get category () {
    return 'Client/Messages'
  }

  html (isCommand: boolean) {
    return `
      <div>
        <div>
          <label id="send-to">Send to</label>
          <select id="send-to" isDBCField>
            ${
              isCommand
                ? `
              <option value="command-channel">
                Command Channel
              </option>
              <option value="command-author">
                Command Author
              </option>
            `
                : ''
            }
            <option value="bot-logs">Bot Logs</option>
            <option value="variable">
              Channel/User Variable
            </option>
            <option value="global-variable">
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
        const messageSendTo = document.getElementById('message-send-to')
        const variableNameContainer = document.getElementById('variable-name-container')
            
        messageSendTo.addEventListener('select', (e) => {
          if (
            e.target.value === 'channel-user-variable' ||
            e.target.value === 'channel-user-global-variable'
          ) {
            variableNameContainer.style.display = ''
          } else {
            if (variableNameContainer.style.display !== 'none') {
              variableNameContainer.style.display = 'none'
            }
          }
        })
      </script>
    `
  }

  async run (cache: DBCBotActionCache) {
    const sendTo = cache.getField(cache.index, 'send-to')
    const variableName = cache.getField(cache.index, 'variable-name')
    const message = cache.getField(cache.index, 'message')

    try {
      switch (sendTo) {
        case 'command-channel':
          await cache.message.channel.send(message)
          break
        case 'command-author':
          await cache.message.author.send(message)
          break
        case 'variable':
          await cache.variables.get(variableName).send(message)
          break
        case 'global-variable':
          await cache.globalVariables.get(variableName).send(message)
          break
      }

      cache.goToAction(cache)
    } catch (err) {
      cache.throwActionError(cache.index, err)
    }
  }
}

export default new SendMessage()
