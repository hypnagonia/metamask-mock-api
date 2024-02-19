require('dotenv').config()

const { run } = require('./app')
const cliArguments = process.argv.slice(2)

run()
