const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const os = require('os')
const path = require('path')
const { assertionRouter } = require('./assertions/router')
const { scoreRouter } = require('./scores/router')


const run = async () => {
    const api = express()
    api.use('/files', express.static(path.join(__dirname, 'static')))
    api.use(cors())
    api.use(bodyParser.json())
    api.disable('x-powered-by')
    api.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`)
        next()
    })

    api.use('/api/assertions', assertionRouter)
    api.use('/api/scores', scoreRouter)

    const port = 3004
    const server = http.createServer(api).listen(port, () => {
        console.log(`API is up at http://localhost:${port}`)
    })

    const close = () => server.close()
    return close
}

module.exports = {
    run
}


