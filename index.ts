/*!
 * Copyright (c) Discord Bot Creator.
 *
 * This source code is licensed under the GPL-3.0.
 */

import { readFileSync } from 'fs'

import DBCBot from './src'

const dbcBot = new DBCBot(JSON.parse(readFileSync('./storage.json', 'utf-8')))
const dbcBotPackageMain = JSON.parse(readFileSync('./package.json', 'utf-8'))
  .main
if (
  process.mainModule.filename.endsWith(dbcBotPackageMain) ||
  process.mainModule.filename.endsWith(dbcBotPackageMain + '.js')
)
  dbcBot.start()

export default dbcBot.actions
