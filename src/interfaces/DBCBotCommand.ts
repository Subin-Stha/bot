import DBCBotStorageAction from './DBCBotStorageAction'

export default interface DBCBotCommand {
  name: string
  description?: string
  category?: string
  aliases?: Array<string>
  actions: Array<DBCBotStorageAction>
}
