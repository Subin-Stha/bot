export default interface DBCBotConfig {
  avatar: string
  description: string
  owners: Array<string>
  token: string
  prefix: string
  caseSensitive: boolean
  intents: Array<any>
}
