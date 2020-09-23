import { DBCBotAction } from '../../interfaces'

class StopActions implements DBCBotAction {
  get name() {
    return 'Stop Actions'
  }

  get description() {
    return 'Stop the actions sequence.'
  }

  get category() {
    return 'Actions'
  }

  html() {}

  run() {}
}

export default new StopActions()
