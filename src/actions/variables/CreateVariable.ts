import { DBCBotAction, DBCBotActionCache } from '../../interfaces'

class CreateVariable implements DBCBotAction {
  get name () {
    return 'Create Variable'
  }

  get description () {
    return 'Create custom variables.'
  }

  get category () {
    return 'Variables'
  }

  get display () {
    return {
      column: [
        {
          field: {
            type: 'select',
            id: 'variable-type',
            label: 'Type',
            options: ['Text', 'Number', 'Object', 'List', 'True/false']
          }
        },
        {
          field: {
            type: 'textarea',
            id: 'variable-value',
            label: 'Value'
          }
        },
        {
          field: {
            type: 'variable-select',
            id: 'variable-store-in',
            label: 'Store in'
          }
        }
      ]
    }
  }

  run (cache: DBCBotActionCache) {
    const variableType = cache.getField(cache.index, 'variable-type')
    let variableValue = cache.getField(cache.index, 'variable-value')
    const variableStorage = cache.getField(cache.index, 'variable-store-in')
    const variableName = cache.getField(cache.index, 'variable-name')

    switch (variableType) {
      case 'text':
        variableValue = String(variableValue)
        break
      case 'number':
        variableValue = Number(variableValue)
        break
      case 'object':
        variableValue = Object(variableValue)
        break
      case 'list':
        variableValue = Array(variableValue)
        break
      case 'true-false':
        variableValue = Boolean(variableValue)
        break
    }

    if (variableStorage === 'temp') {
      cache.variables.set(variableName, variableValue)
    } else {
      cache.globalVariables.set(variableName, variableValue)
    }

    cache.goToAction(cache)
  }
}

export default new CreateVariable()
