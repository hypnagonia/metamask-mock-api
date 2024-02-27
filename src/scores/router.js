const { Router } = require('express')
const { getSnapMetaData, getScores, getSnapshotList } = require('./service')
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const scoreRouter = Router({ mergeParams: true })

scoreRouter.get('/', async (req, res) => {
    const list = getSnapshotList()
    res.json(list)
})

const indexerCacheUrl = 'http://54.186.233.253/indexer/metamask-connector:b0fbad22d4e0324978cee3ab54d6e98fab6f0b3e2bf6b29b1cf4ff45d8752f84.csv'

scoreRouter.get('/indexer-scores', async (req, res) => {
    const { data } = await axios.get(indexerCacheUrl)
    res.text(data)
})

scoreRouter.get('/list', async (req, res) => {
    const list = getSnapMetaData()
    res.json(list)
})

scoreRouter.post('/new', async (req, res) => {
    const { locations } = req.body
    const list = getSnapshotList()
    console.log({ locations })

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

        setTimeout(() => getScores(s3Bucket, s3Key), 0)
    }

    res.json({ ok: 'ok' })
})

module.exports = {
    scoreRouter
}



