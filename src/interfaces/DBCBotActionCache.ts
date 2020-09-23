import { Client, Message } from 'discord.js'

export default interface DBCBotActionCache {
  client: Client
  message?: Message
  index: number
  variables: Map<string, any>
  globalVariables: Map<string, any>
  getField(index: number, id: string): any
  throwActionError(index: number, error: string): void
  goToAction(cache: DBCBotActionCache): void
}
