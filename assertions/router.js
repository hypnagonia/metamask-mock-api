const {
    getAssertions,
    saveToCSV,
    loadFromCSV
} = require('./db')
const { Router } = require('express')

const assertionRouter = Router({ mergeParams: true })

assertionRouter.get('/', async (req, res) => {
    const assertions = getAssertions()
    const { from, to = assertions.length + 1 } = req.query

    const r = assertions.slice(+from - 1, +to)
    res.json({ assertions: r })
})

assertionRouter.post('/new', async (req, res) => {
    const { assertion } = req.body
    const creationAtDate = Date.now()
    const date = new Date(creationAtDate);
    const creationAt = date.toISOString()
    const assertions = getAssertions()
    const a = { assertion: JSON.stringify(assertion), creationAt, id: assertions.length + 1 }
    assertions.push(a)
    saveToCSV(assertions)

    res.json({ ok: 'ok' })
})

module.exports = {
    assertionRouter
}



