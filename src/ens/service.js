const { init: initAirStack, fetchQuery } = require("@airstack/node")
const { ethers } = require('ethers')
const { request, gql } = require('graphql-request')
const { 
    saveToCSV,
    loadFromCSV
} = require('./db')

initAirStack(process.env.AIRSTACK_API_KEY, 'prod')
let aliases = loadFromCSV()

// no api key hence left behind
const fetchSocialAliases = async (address) => {
    const query = `query MyQuery {
        Wallet(input: {identity: "${address}", blockchain: ethereum}) {
          addresses
          socials {
            dappName
            profileName
          }
          
        }
      }`
    const { data, error } = await fetchQuery(query, [])
    // console.log({ data, error, query })
    if (error) {
        console.error(error)
    }
    return data
}

async function queryENSSubgraph(address) {
    const query = gql`
        query ($address: Bytes!) {
           w
    `;

    const variables = {
        address: address.toLowerCase(),
    };

    try {
        const res = await request('https://api.thegraph.com/subgraphs/name/ensdomains/ens', query, variables)
        const { domains} = res
        const domainsFitlered = domains.filter(d => d.name.indexOf('.addr.') === -1)

        if (!domainsFitlered.length) {
            return ''
        }

        return domainsFitlered[0].name
    } catch (error) {
        console.error('Error querying ENS subgraph:', error);
        return ''

    }
}

const addSocialAliases = async (did) => {
    if (!did) {
        return
    }
    const address = did.split(':').at(-1)
    if (!ethers.isAddress(address)) {
        return
    }
    if (aliases[address]) {
        return
    }
    const res = await queryENSSubgraph(address)
    if (res && address) {
    aliases[address] = res
    }
}

const addSocialAliasFromAssertions = async (assertions) => {
    let prevCount = Object.keys(aliases).length

    for (const assertion of assertions) {
        const a = assertion.assertion
        await addSocialAliases(a.issuer)
        await addSocialAliases(a.credentialSubject.id)
    }

    let newCount = Object.keys(aliases).length

    // console.log({prevCount, newCount, aliases})
    if (newCount > prevCount) {
        saveToCSV(aliases)
    }
}

module.exports = {
    addSocialAliasFromAssertions
}