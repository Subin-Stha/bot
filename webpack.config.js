const { join } = require('path')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: './build/index.js',
  output: {
    path: join(__dirname, '/dist'),
    filename: 'bot.js',
    library: '@discord-bot-creator/bot',
    libraryTarget: 'umd'
  },
  externals: {
    'discord.js': 'commonjs2 discord.js',
    chalk: 'commonjs2 chalk',
    'node-fetch': 'commonjs2 node-fetch'
  }
}
