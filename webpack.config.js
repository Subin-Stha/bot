module.exports = {
  mode: 'production',
  target: 'node',
  entry: './build/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bot.js',
    library: '@discord-bot-creator/bot',
    libraryTarget: 'umd'
  },
  externals: {
    'discord.js': 'commonjs2 discord.js',
    'node-fetch': 'commonjs2 node-fetch'
  }
}
