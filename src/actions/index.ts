import { DBCBotAction } from '../interfaces'

import SendMessage from './client/messages/SendMessage'

import JumpToAction from './actions/JumpToAction'
import SkipActions from './actions/SkipActions'
import StopActions from './actions/StopActions'

import CreateVariable from './variables/CreateVariable'

const actions: Array<DBCBotAction> = [
  SendMessage,
  JumpToAction,
  SkipActions,
  StopActions,
  CreateVariable
]

export default actions
