const { execSync } = require('child_process')
const { rmSync, writeFileSync, copyFileSync, existsSync } = require('fs')

async function build () {
  if (existsSync('./build')) rmSync('./build', { recursive: true })
  execSync('npx tsc')
  rmSync('./build/src/interfaces', { recursive: true })
  copyFileSync('./storage.json', './build/storage.json')
  copyFileSync('./package.json', './build/package.json')

  if (existsSync('./dist')) rmSync('./dist', { recursive: true })
  execSync('npx webpack')
  copyFileSync('./build/storage.json', './dist/storage.json')
  copyFileSync('./build/package.json', './dist/package.json')
  copyFileSync('./LICENSE', './dist/LICENSE')
  copyFileSync('./README.md', './dist/README.md')
  const buildPackage = require('../build/package.json')
  delete buildPackage.scripts.dev
  delete buildPackage.scripts.build
  delete buildPackage.scripts.test
  delete buildPackage.scripts.format
  delete buildPackage.devDependencies
  writeFileSync(
    './dist/package-template.json',
    JSON.stringify(buildPackage, null, 2)
  )
  writeFileSync('./dist/package.json', JSON.stringify(buildPackage, null, 2))
}

build()
