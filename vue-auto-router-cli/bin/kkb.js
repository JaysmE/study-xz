#!/usr/bin/env node
// 制定解释器
// console.log('kkb niubi666~~~')
const program = require('commander')

program.version(require('../package.json').version)

program.command('init <name>')
  .description('init project')
  .action(name => {
    // console.log(name + ' inited')
  })
// console.log(process.argv, 'process.argv')
// console.log(program.parse(process.argv), 'program.parse')
program.parse(process.argv)

console.log(process.version, 'version')