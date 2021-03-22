const {program} = require('commander')
const {fetchPRs: gitStats} = require('./git-fetch')
const {fetchPRs: adoStats} = require('./ado-fetch')
const {persistAsCSV, persistAsJSON, printToConsole, readJSONFiles} = require('./store-fs')
const {calculateRepoStats} = require('./stats')

const DATA_DIR = "data"
const STATS_DIR = "stats"

async function main() {
  program
    .version('1.0.0')
    .description('Command line Git Stats Application')

  program
    .command("org-stats")
    .alias("os")
    .description('Generates git stats for all orgs')
    .action(() => {
      console.log("Generating git stats for all orgs")
      readJSONFiles("stats", (jsonArr) => printToConsole(jsonArr))
    })

  program
    .command("stats <source> <org> <project> <repo> <token>")
    .description('Pull the git stats for an org (and project for ADO) and its repo with the specified access token from source')
    .action((source, org, project, repo, token) => {
      if (source === "github") {
        gitStats(token, org, repo, 25, 100).then(
          (data) => {
            persistAsCSV(DATA_DIR, org, repo, data)
            persistAsJSON(DATA_DIR, org, repo, data)

            let stats = calculateRepoStats(org, repo, data)
            persistAsJSON(STATS_DIR, org, repo, stats)
          })
      } else if (source === "ado") {
        adoStats(token, org, project, repo, 50).then(
          (data) => printToConsole(data))
      } else {
        console.log("Expected Source Control values -> 'github' or 'ado' Not Provided!")
      }

    })

  await program.parseAsync(process.argv)
}

main().catch((error) => console.error(error))