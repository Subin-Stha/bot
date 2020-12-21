import { IntentsString } from 'discord.js'

import DBCBotActionCache from './DBCBotActionCache'

export default interface DBCBotAction {
  name: string
  description: string
  category: string
  intents?: Array<IntentsString>
  display: object
  run(cache?: DBCBotActionCache): void
}
