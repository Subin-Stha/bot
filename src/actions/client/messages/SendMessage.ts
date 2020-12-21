import { DBCBotAction, DBCBotActionCache } from '../../../interfaces'

class SendMessage implements DBCBotAction {
  get name () {
    return 'Send Message'
  }

  get description () {
    return 'Send messages to channels and users.'
  }

  get category () {
    return 'Client/Messages'
  }

  get display () {
    return {
      column: [
        {
          field: {
            type: 'message-select',
            id: 'send-to',
            label: 'Send To'
          }
        },
        {
          field: {
            type: 'textarea',
            id: 'message',
            label: 'Message'
          }
        }
      ]
    }
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
