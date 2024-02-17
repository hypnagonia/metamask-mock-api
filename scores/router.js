const { Router } = require('express')
const { getScores } = require('./service')

const scoreRouter = Router({ mergeParams: true })

scoreRouter.get('/', async (req, res) => {
    const assertions = getAssertions()
    const { from, to = assertions.length + 1 } = req.query

    const r = assertions.slice(+from - 1, +to)
    res.json({ assertions: r })
})

scoreRouter.post('/new', async (req, res) => {
    const { locations } = req.body
    console.log({ locations })
    // s3://ek-spd-test-awriluhgawrleughaiwef/1706281200000.zip

    for (const l of locations) {
        if (l.indexOf('s3://') === -1) {
            res.status(400)
            res.json({ error: 'service supports only s3:// bucket location' })
        }

        if (l.indexOf('.zip') === -1) {
            res.status(400)
            res.json({ error: 'service supports only zip archives' })
        }

        const regex = /^s3:\/\/([^\/]+)\/(.+)$/
        const [, s3Bucket, s3Key] = l.match(regex)
        await getScores(s3Bucket, s3Key)
    }

    res.json({ ok: 'ok' })
})

module.exports = {
    scoreRouter
}



