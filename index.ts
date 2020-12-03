/*!
 * Copyright (c) Discord Bot Creator.
 *
 * This source code is licensed under the GPL-3.0.
 */

import { readFileSync } from 'fs'

import DBCBot from './src'

const dbcBot = new DBCBot(JSON.parse(readFileSync('./storage.json', 'utf-8')))
if (
  process.mainModule.filename.endsWith('bot') ||
  process.mainModule.filename.endsWith('bot.js') ||
  process.mainModule.filename.endsWith('index.ts')
) {
  dbcBot.start()
}

export default dbcBot
