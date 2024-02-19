const { Router } = require('express')
const { getScores, getSnapshotList } = require('./service')
const fs = require('fs')
const path = require('path')

const scoreRouter = Router({ mergeParams: true })

scoreRouter.get('/', async (req, res) => {
    const list = getSnapshotList()
    res.json(list)
})

scoreRouter.post('/new', async (req, res) => {
    const { locations } = req.body
    const list = getSnapshotList()

    for (const l of locations) {
        if (l.indexOf('s3://') === -1) {
            res.status(400)
            res.json({ error: 'service supports only s3:// bucket location' })
            return
        }

        if (l.indexOf('.zip') === -1) {
            res.status(400)
            res.json({ error: 'service supports only zip archives' })
            return
        }

        const regex = /^s3:\/\/([^\/]+)\/(.+)$/
        const [, s3Bucket, s3Key] = l.match(regex)

        const snapshotName = s3Key.split('.')[0]
        if (list.find(l => l === snapshotName)) {
            console.log(`${s3Key} already exists in ${list.join(', ')}. skipping`)
            continue
        }

        await getScores(s3Bucket, s3Key)
    }

    res.json({ ok: 'ok' })
})

module.exports = {
    scoreRouter
}



