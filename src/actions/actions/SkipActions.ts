import { DBCBotAction, DBCBotActionCache } from '../../interfaces'

class SkipActions implements DBCBotAction {
  get name () {
    return 'Skip Actions'
  }

  get description () {
    return 'Skip a sequence of actions according with the amount.'
  }

  get category () {
    return 'Actions'
  }

  html () {
    return `
      <div>
        <label id="amount-to-skip">Amount to Skip</label>
        <input id="amount-to-skip" type="number" isDBCField>
      </div>
    `
  }

  run (cache: DBCBotActionCache) {
    const amountToSkip = Number(cache.getField(cache.index, 'amount-to-skip'))
    cache.index += amountToSkip
    cache.goToAction(cache)
  }
}

export default new SkipActions()
