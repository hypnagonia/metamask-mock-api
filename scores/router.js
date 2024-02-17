const { Router } = require('express')
const { getScores } = require('./service')
const fs = require('fs')
const path = require('path')

const scoreRouter = Router({ mergeParams: true })

scoreRouter.get('/', async (req, res) => {
    const directoryPath = path.join(__dirname, '../static')
    const list = fs.readdirSync(directoryPath).filter(r => r.indexOf('.') === -1)
    res.json(list)

})

scoreRouter.post('/new', async (req, res) => {
    const { locations } = req.body
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



