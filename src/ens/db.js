const os = require('os')
const path = require('path')
const fs = require('fs')

const fileName = `./social-db.csv`
const filePath = path.join(process.cwd(), 'static', fileName)
const delimiter = ';'

function loadFromCSV() {
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8')
        const rows = []
        fileData.trim().split('\n').forEach((line, i) => {
            const fields = line.split(delimiter)
            // skip header
            if (!fields[0] || !fields[1]) {
                return
            }

            rows.push(fields)
        })

        return rows.map(a => {
            return {
                address: a[0],
                ENSName: a[1],
            }
        }
        ).reduce((obj, e) => {
            obj[e.address] = e.ENSName
            return obj
        }, {})

    } catch (error) {
        console.error('Error reading CSV file:', error)
        return []
    }
}

const saveToCSV = (aliases) => {
    const CSVData = Object.keys(aliases)
        .filter(a => a && aliases[a])
        .map((a, i) => {
            const address = a
            const ENSName = aliases[a]
            return [address, ENSName]
        })
        .map(row => row.join(delimiter)).join('\n')

    fs.writeFileSync(filePath, CSVData, 'utf8')
}

module.exports = {
    saveToCSV,
    loadFromCSV
}