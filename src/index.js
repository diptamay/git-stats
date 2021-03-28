const {program} = require('commander')
const {fetchPRs: gitStats} = require('./git-fetch')
const {fetchPRs: adoStats} = require('./ado-fetch')
const {printToConsole} = require('./utils')
const {persistAsCSV, persistAsJSON, readJSONFiles, persistOrgStats} = require('./store-fs')
const {calculateRepoStats, calculateOrgStats} = require('./stats')

const DATA_DIR = "data"
const STATS_DIR = "stats"

async function main() {
  program
    .version('1.0.0')
    .description('Command line Git Stats Application')

  program
    .command("stats <source> <org> <project> <repo> <token>")
    .description('Pull the git stats for an org (and project for ADO) and its repo with the specified access token from source')
    .action((source, org, project, repo, token) => {
      if (source === "github") {
        gitStats(token, org, repo, 25, 100).then(
          (data) => {
            console.log("Writing data")
            persistAsCSV(DATA_DIR, org, repo, data)
            persistAsJSON(DATA_DIR, org, repo, data)

            console.log("Writing repo stats")
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

  program
    .command("org-stats")
    .alias("os")
    .description('Generates git stats for all orgs')
    .action(() => {
      console.log("Generating git stats for all orgs")
      readJSONFiles("stats", (jsonArr) => {
        data = calculateOrgStats(jsonArr)
        persistOrgStats(".", data)
      })
    })

  await program.parseAsync(process.argv)
}

main().catch((error) => console.error(error))