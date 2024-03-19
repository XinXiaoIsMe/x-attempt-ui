import fs from 'node:fs'
import { Command } from 'commander'
import consola from 'consola'
import buildComponent from './scripts/build-component'
import buildStyle from './scripts/build-style'
import clear from './scripts/clear'
import { createPath, publishDir } from './utils/paths'

const program = new Command()
const packageContent = fs.readFileSync('./package.json', {
  encoding: 'utf-8',
})
const packageJson: Record<string, any> = JSON.parse(packageContent)

program
  .name('x-attempt-build')
  .version(packageJson.version)
  .description('x-attempt-ui build tool')

program
  .command('buildComp')
  .description('build component module')
  .action((_args) => {
    buildComponent()
  })

program
  .command('buildStyle')
  .description('build component style')
  .action((_args) => {
    buildStyle()
  })

program
  .command('build')
  .description('build component')
  .action(async (_args) => {
    await buildComponent()
    await buildStyle()
    setPackageJson()
  })

program
  .command('clear')
  .description('clear build product')
  .action((_args) => {
    clear()
  })

program.parse()

function setPackageJson() {
  const pkgJson = { ...packageJson }
  pkgJson.name = 'x-attempt-ui'
  pkgJson.scripts.publish = 'npm publish'
  fs.writeFile(
    createPath(publishDir, 'package.json'),
    JSON.stringify(pkgJson, null, 2),
    'utf8',
    (err) => {
      if (!err)
        return

      consola.error('set package.json failed. \n')
      consola.error(err)
    },
  )
}
