install

```
yarn
```

or 

```
npm i
```

create config, use `.env.example` as reference to create `.env` file and edit its contents


run

```
node index.js
```

get
```
http://localhost:3004/api/assertions/?from=1&to=2
```


put
```
 curl -X POST \
  http://localhost:3004/api/assertions/new/ \
  -H 'Content-Type: application/json' \
  -d '{
        "assertion": {"type":["VerifiableCredential","TrustCredential"],"proof":{"type":"EthereumEip712Signature2021","eip712":{"types":{"Proof":[{"name":"created","type":"string"},{"name":"proofPurpose","type":"string"},{"name":"type","type":"string"},{"name":"verificationMethod","type":"string"}],"EIP712Domain":[{"name":"name","type":"string"},{"name":"version","type":"string"},{"name":"chainId","type":"uint256"}],"Trustworthiness":[{"name":"scope","type":"string"},{"name":"level","type":"int8"},{"name":"reason","type":"string[]"}],"CredentialSubject":[{"name":"id","type":"string"},{"name":"trustworthiness","type":"Trustworthiness[]"}],"VerifiableCredential":[{"name":"@context","type":"string[]"},{"name":"type","type":"string[]"},{"name":"issuer","type":"string"},{"name":"credentialSubject","type":"CredentialSubject"},{"name":"issuanceDate","type":"string"},{"name":"proof","type":"Proof"}]},"domain":{"name":"VerifiableCredential","chainId":59144,"version":"1"},"primaryType":"VerifiableCredential"},"created":"2024-02-09T10:22:24.837Z","proofValue":"0x97daa958d9f172f5b318536a1d4c60583de47878f8bd6aa81d79d77436c5bb373f7840c6d251a19d0040f85dc7aa7c415416b1651a5b644550685d7c949aa8ba1b","proofPurpose":"assertionMethod","verificationMethod":"did:pkh:eip155:59144:0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D#blockchainAccountId"},"issuer":"did:pkh:eip155:59144:0x6eCfD8252C19aC2Bf4bd1cBdc026C001C93E179D","@context":["https://www.w3.org/2018/credentials/v2"],"issuanceDate":"2024-02-09T10:22:21.670Z","credentialSubject":{"id":"did:pkh:eip155:59144:0xefc6191B3245df60B209Ec58631c7dCF04137329","trustworthiness":[{"level":1,"scope":"Software development","reason":[]},{"level":0,"scope":"Software security","reason":[]}]}}
    }'

```


notify about new score snapshot
```
curl -X POST \
  http://localhost:3004/api/scores/new/ \
  -H 'Content-Type: application/json' \
  -d '
{"issuanceDate":"2024-02-16T02:30:00Z","issuer":"did:pkh:eip155:1:0x23d86aa31d4198a78baa98e49bb2da52cd15c6f0","locations":["s3://ek-spd-test-awriluhgawrleughaiwef/1706281200000.zip"],"proof":{}}
'
```

download
```
http://localhost:3004/files/1706281200000/peer_scores.jsonl
```