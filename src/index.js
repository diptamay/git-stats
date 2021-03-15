const program = require('commander')
const {fetchPRs} = require('./git-fetch')

async function main() {
  program
    .version('1.0.0')
    .description('Command line Git Stats Application')

  program
    .command("pulls <org> <repo> <token>")
    .alias('pr')
    .description('Pull the git stats for an org and its repo with the specified access token')
    .action((org, repo, token) => {
      fetchPRs(token, org, repo, 5, 100).then(
        (data) => console.log(JSON.stringify(data, undefined, 2)))
    })

  await program.parseAsync(process.argv)
}

main().catch((error) => console.error(error))