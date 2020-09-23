export default interface DBCBotStorageAction {
  name: string
  fields: Array<{
    id: string
    value: string
  }>
}
