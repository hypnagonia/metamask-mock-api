const g = require('ger')
const fs = require('fs')
const csv = require('csv-parser')

const esm = new g.MemESM()
const ger = new g.GER(esm)
ger.initialize_namespace('contracts')

const filePath = './static/contracts.csv';

let results = []

const load = async () => {

    return new Promise((resolve) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                // Split the first column by commas
                const firstColumn = row[Object.keys(row)[0]].split(',');

                // Output the split values


                const action = row.call_count < 2 ? 'called_once' : 'called_many'
                ger.events([{
                    namespace: 'contracts',
                    person: row.from,
                    action: action,
                    thing: row.to,
                    expires_at: '2024-06-06'
                }])

                // console.log(row)
                results.push(firstColumn)
            })
            .on('end', () => {
                // console.log(results.join(','))

                resolve()
            })
    })
}
load()

const { Router } = require('express')
const path = require('path')
const axios = require('axios')

const collabFilterRouter = Router({ mergeParams: true })

collabFilterRouter.get('/', async (req, response) => {

    const address = req.query.address
    console.log('here', address)
    const res = await ger.recommendations_for_person('contracts', address, { actions: { 'called_once': 1, 'called_many': 3 } })

    console.log(res)
    // console.log('top 10 recommendations')
    const recommendations = (res.recommendations.filter((a, i) => i < 10))


    // console.log('neighbourhood')
    const neighbourhood = res.neighbourhood ? (Object.keys(res.neighbourhood).sort((a, b) => res.neighbourhood[b] - res.neighbourhood[a])
        .map(k => ({ address: k, v: res.neighbourhood[k] }))
        .reduce((acc, o) => {
            acc[o.address] = o.v
            return acc
        }, {})
    ) : []

    response.json({ recommendations, neighbourhood })
})

module.exports = {
    collabFilterRouter
}




/*
    (async function () {
        await load()

        // node recommender.js 0x3eee61b92c36e97be6319bf9096a1ac3c04a1466
        const address = process.argv[2]

        const res = await ger.recommendations_for_person('contracts', address, { actions: { 'called_once': 1, 'called_many': 3 } })

        console.log('top 10 recommendations')
        console.log(res.recommendations.filter((a, i) => i < 10))
        console.log('neighbourhood')
        console.log(Object.keys(res.neighbourhood).sort((a, b) => res.neighbourhood[b] - res.neighbourhood[a])
            .map(k => ({ address: k, v: res.neighbourhood[k] }))
            .reduce((acc, o) => {
                acc[o.address] = o.v
                return acc
            }, {})
        )
    })()
*/