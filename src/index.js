const {program} = require('commander')
const {fetchPRs: gitStats} = require('./git-fetch')
const {fetchPRs: adoStats} = require('./ado-fetch')
const {persistAsCSV} = require('./persist')

async function main() {
  program
    .version('1.0.0')
    .description('Command line Git Stats Application')

  program
    .command("stats <source> <org> <project> <repo> <token>")
    .description('Pull the git stats for an org (and project for ADO) and its repo with the specified access token from source')
    .action((source, org, project, repo, token) => {
      if (source === "github") {
        gitStats(token, org, repo, 20, 100).then(
          (data) => persistAsCSV(data))
      } else if (source === "ado") {
        adoStats(token, org, project, repo, 20).then(
          (data) => persistAsCSV(data))
      } else {
        console.log("Expected Source Control values -> 'github' or 'ado' Not Provided!")
      }

    })

  await program.parseAsync(process.argv)
}

main().catch((error) => console.error(error))