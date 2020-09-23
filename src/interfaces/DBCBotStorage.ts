import DBCBotCommand from './DBCBotCommand'
import DBCBotEvent from './DBCBotEvent'
import DBCBotConfig from './DBCBotConfig'

export default interface DBCBotStorage {
  commands: Array<DBCBotCommand>
  events: Array<DBCBotEvent>
  config: DBCBotConfig
}
