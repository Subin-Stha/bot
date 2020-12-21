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

  get display () {
    return {
      field: {
        type: 'number',
        id: 'amount-to-skip',
        label: 'Amount to Skip'
      }
    }
  }

  run (cache: DBCBotActionCache) {
    const amountToSkip = Number(cache.getField(cache.index, 'amount-to-skip'))
    cache.index += amountToSkip
    cache.goToAction(cache)
  }
}

export default new SkipActions()
