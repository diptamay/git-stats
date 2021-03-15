const program = require('commander')
const {fetchPRs} = require('./git-fetch')

async function main() {
  const data = await fetchPRs('tumblr', 'colossus', 5, 100)
  console.log(JSON.stringify(data, undefined, 2))
}

main().catch((error) => console.error(error))