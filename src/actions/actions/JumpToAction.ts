import { DBCBotAction, DBCBotActionCache } from '../../interfaces'

class JumpToAction implements DBCBotAction {
  get name () {
    return 'Jump to Action'
  }

  get description () {
    return 'Jump to any selected action number, if exists.'
  }

  get category () {
    return 'Actions'
  }

  get display () {
    return {
      field: {
        type: 'number',
        id: 'action-to-jump',
        label: 'Action to Jump'
      }
    }
  }

  run (cache: DBCBotActionCache) {
    const actionToJump = Number(cache.getField(cache.index, 'action-to-jump'))
    cache.index = actionToJump
    cache.goToAction(cache)
  }
}

export default new JumpToAction()
