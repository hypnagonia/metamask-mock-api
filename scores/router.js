const { Router } = require('express')

const scoreRouter = Router({ mergeParams: true })

scoreRouter.get('/', async (req, res) => {
    const assertions = getAssertions()
    const { from, to = assertions.length + 1 } = req.query

    const r = assertions.slice(+from - 1, +to)
    res.json({ assertions: r })
})

scoreRouter.post('/new', async (req, res) => {
    const { locations } = req.body
    console.log({locations})
    // res.status(400)

    res.json({ ok: 'ok' })
})

module.exports = {
    scoreRouter
}



