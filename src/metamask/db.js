const os = require('os')
const path = require('path')
const fs = require('fs')

const fileName = `./metamask-input.csv`
const filePath = path.join(process.cwd(), 'static', fileName)
const delimiter = ';'

const appendToCSV = (assertions) => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, 'id;timestamp;schema_value\n')
    }

    try {
        for (a of assertions) {
            const line = [a.id, a.creationAt, JSON.stringify(a.assertion)].join(delimiter) + '\n'
            fs.appendFileSync(filePath, line)
        }
    } catch (err) {
        console.error(`Error appending to ${filePath}: ${err}`);
    }
}

function getLastId() {
    try {
        const fileData = fs.readFileSync(filePath, 'utf-8')
        const count = fileData.trim().split('\n').length
        return count
    } catch (error) {
        console.error('Error reading CSV file:', error)
        return 0
    }
}

module.exports = {
    appendToCSV,
    getLastId
}