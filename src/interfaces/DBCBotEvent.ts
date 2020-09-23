import DBCBotStorageAction from './DBCBotStorageAction'

export default interface DBCBotEvent {
  name: string
  type: string
  outputs: Array<string>
  actions: Array<DBCBotStorageAction>
}
