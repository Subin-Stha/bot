const { execSync } = require('child_process')
const { rmdirSync, writeFileSync, copyFileSync } = require('fs')

async function build() {
  execSync('npx tsc')
  rmdirSync('./build/src/interfaces', { recursive: true })
  copyFileSync('./storage.json', './build/storage.json')
  copyFileSync('./package.json', './build/package.json')

  const buildPackage = require('../build/package.json')
  delete buildPackage.scripts.lint
  delete buildPackage.scripts.build
  delete buildPackage.devDependencies
  writeFileSync('./build/package.json', JSON.stringify(buildPackage, null, 2))

  execSync('npx webpack')
  copyFileSync('./build/storage.json', './dist/storage.json')
  copyFileSync('./build/package.json', './dist/package.json')
  copyFileSync('./LICENSE', './dist/LICENSE')
  copyFileSync('./README.md', './dist/README.md')
}

build()
