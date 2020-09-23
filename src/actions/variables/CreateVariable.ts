import { DBCBotAction, DBCBotActionCache } from '../../interfaces'

class CreateVariable implements DBCBotAction {
  get name() {
    return 'Create Variable'
  }

  get description() {
    return 'Create custom variables.'
  }

  get category() {
    return 'Variables'
  }

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
    `
  }

  run(cache: DBCBotActionCache) {
    const variableType = cache.getField(cache.index, 'variable-type')
    let variableValue = cache.getField(cache.index, 'variable-value')
    const variableStorage = cache.getField(cache.index, 'variable-storage')
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
