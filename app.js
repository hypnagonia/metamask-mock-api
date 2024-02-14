const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const os = require('os')
const path = require('path')
const { Router } = require('express')
const fs = require('fs')

const filename = `db.csv`
const filePath = path.join(process.cwd(), filename)
const delimiter = ';'

function loadFromCSV() {
    try {
        // Read CSV file synchronously
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const rows = [];

        // Parse CSV data
        fileData.trim().split('\n').forEach(line => {
            rows.push(line.split(delimiter));
        });

        return rows;
    } catch (error) {
        console.error('Error reading CSV file:', error);
        return [];
    }
}

let assertions = loadFromCSV().map((a,i)=> ({
    id: a[0],
    creationAt: a[1],
    assertion: a[2]
}))

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


const run = async () => {
    const api = express()

    api.use(express.static(path.join(__dirname, 'static')))
    api.use(cors())
    api.use(bodyParser.json())
    api.disable('x-powered-by')
    api.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`)
        next()
    })

    const r = Router({ mergeParams: true })


    r.get('/api/assertions/', async (req, res) => {
        const {from, to = assertions.length + 1} = req.query
         
        const r = assertions.slice(+from - 1, +to);
        res.json(r)
    })

    r.post('/api/assertions/new', async (req, res) => {
        const {assertion} = req.body
        const creationAt = Date.now()

        const a = {assertion: JSON.stringify(assertion), creationAt}
        assertions.push(a)
        saveToCSV(assertions)

        res.json({ ok: 'ok' })
    })

    /*
    curl -X POST \
  http://localhost:3003/api/assertions/new/ \
  -H 'Content-Type: application/json' \
  -d '{
        "assertion": {"type":["VerifiableCredential","TrustCredential"],"proof":{"type":"EthereumEip712Signature2021","eip712":{"types":{"Proof":[{"name":"created","type":"string"},{"name":"proofPurpose","type":"string"},{"name":"type","type":"string"},{"name":"verificationMethod","type":"string"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"Trustworthiness":[{"name":"scope","type":"string"},{"name":"level","type":"int8"},{"name":"reason","type":"string[]"}],"CredentialSubject":[{"name":"id","type":"string"},{"name":"trustworthiness","type":"Trustworthiness[]"}],"VerifiableCredential":[{"name":"@context","type":"string[]"},{"name":"type","type":"string[]"},{"name":"issuer","type":"string"},{"name":"credentialSubject","type":"CredentialSubject"},{"name":"issuanceDate","type":"string"},{"name":"proof","type":"Proof"}]},"domain":{"name":"VerifiableCredential","chainId":59144,"version":"1"},"primaryType":"VerifiableCredential"},"created":"2024-02-09T10:22:24.837Z","proofValue":"0x97daa958d9f172f5b318536a1d4c60583de47878f8bd6aa81d79d77436c5bb373f7840c6d251a19d0040f85dc7aa7c415416b1651a5b644550685d7c949aa8ba1b","proofPurpose":"assertionMethod","verificationMethod":"did:pkh:eip155:59144:0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D#blockchainAccountId"},"issuer":"did:pkh:eip155:59144:0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D","@context":["https://www.w3.org/2018/credentials/v2"],"issuanceDate":"2024-02-09T10:22:21.670Z","credentialSubject":{"id":"did:pkh:eip155:59144:0xefc6191B3245df60B209Ec58631c7dCF04137329","trustworthiness":[{"level":1,"scope":"Software development","reason":[]},{"level":0,"scope":"Software security","reason":[]}]}}
    }'
    */

    api.use('/', r)





    const port = 3003
    const server = http.createServer(api).listen(port, () => {
        console.log(`API is up at http://localhost:${port}`)
    })

    const close = () => server.close()
    return close
}

module.exports = {
    run
}


