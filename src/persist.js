const fs = require('fs')

const DATA_DIR = "data"

function getFilePath(org, repo) {

  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR)
  }
  const dir = `${DATA_DIR}/${org}`
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  return `${dir}/${repo}.csv`
}

function persistAsCSV(org, repo, out) {
  const fileContents =
    Object.keys(out[0]) + '\n' + out.map(d => Object.values(d).join(',')).join('\n')

  try {
    fs.writeFileSync(getFilePath(org, repo), fileContents)
  } catch (e) {
    console.log("Error writing file", e);
  }
}

function printToConsole(json) {
  console.log(JSON.stringify(json, undefined, 2))
}

module.exports = {persistAsCSV, printToConsole}