const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const os = require('os')
const path = require('path')
const { Router } = require('express')
const fs = require('fs')

const fileName = `db.csv`
const filePath = path.join(process.cwd(), fileName)
const delimiter = ';'

function loadFromCSV() {
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8')
        const rows = []
        fileData.trim().split('\n').forEach(line => {
            rows.push(line.split(delimiter))
        })

        return rows
    } catch (error) {
        console.error('Error reading CSV file:', error)
        return []
    }
}

let assertions = loadFromCSV().map(a => {

    return {
        id: +a[0],
        creationAt: a[1],
        assertion: a[2]
    }
}
)

const saveToCSV = (assertions) => {
    const CSVData = assertions
        .map((a, i) => {
            const id = i + 1
            const creationAt = a.creationAt
            const assertion = a.assertion
            return [id, creationAt, assertion]
        })
        .map(row => row.join(delimiter)).join('\n')

    fs.writeFileSync(filePath, CSVData, 'utf8')
}


const run = async () => {
    const api = express()

    api.use(express.static(path.join(__dirname, 'static')))
    api.use(cors())
    api.use(bodyParser.json())
    api.disable('x-powered-by')
    api.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`)
        next()
    })

    const r = Router({ mergeParams: true })


    r.get('/api/assertions/', async (req, res) => {
        const { from, to = assertions.length + 1 } = req.query

        const r = assertions.slice(+from - 1, +to)
        res.json({ assertions: r })
    })

    r.post('/api/assertions/new', async (req, res) => {
        const { assertion } = req.body
        const creationAtDate = Date.now()
        const date = new Date(creationAtDate);
        const creationAt = date.toISOString()

        const a = { assertion: JSON.stringify(assertion), creationAt, id: assertions.length + 1 }
        assertions.push(a)
        saveToCSV(assertions)

        res.json({ ok: 'ok' })
    })

    api.use('/', r)

    const port = 3003
    const server = http.createServer(api).listen(port, () => {
        console.log(`API is up at http://localhost:${port}`)
    })

    const close = () => server.close()
    return close
}

module.exports = {
    run
}


