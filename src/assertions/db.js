const os = require('os')
const path = require('path')
const fs = require('fs')

const fileName = `./db.csv`
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

const getAssertions = () => assertions

module.exports = {
    getAssertions,
    saveToCSV,
    loadFromCSV
}