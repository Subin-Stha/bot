import { IntentsString } from 'discord.js'

import DBCBotActionCache from './DBCBotActionCache'

export default interface DBCBotAction {
  name: string
  description: string
  category: string
  intents?: Array<IntentsString>
  html(isCommand?: boolean): string | void
  run(cache?: DBCBotActionCache): void
}
