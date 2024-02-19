const axios = require('axios')
const { getLastId, appendToCSV } = require('./db')

const url = process.env.METAMASK_API_URL
const delay = 10000

let from = 1
const limit = 1000

const run = () => {
    from = Math.max(getLastId(), 1)
    loop()
}

const loop = async () => {

    try {
        console.log(`metamask api getting from ${from}`)
        const query = `${url}?from=${from}&to=${limit}`
        const { data } = await axios.get(query)

        const { assertions } = data
        appendToCSV(assertions)
        from = from + assertions.length
        console.log(`indexed ${assertions.length}, cursor at ${from}`)
        await new Promise(r => setTimeout(r, delay))
        setTimeout(loop, 0)
    } catch (e) {
        console.error(e)
        await new Promise(r => setTimeout(r, delay))
        setTimeout(loop, 0)
    }
}

module.exports = {
    run
}