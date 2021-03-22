const fs = require('fs')

function getFilePath(root, org, repo, extn) {
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
  return `${root}/${org}-${repo}.${extn}`
}

function persistAsJSON(root, org, repo, out) {
  const fileContents = JSON.stringify(out, undefined, 2)
  try {
    fs.writeFileSync(getFilePath(root, org, repo, "json"), fileContents)
  } catch (e) {
    console.log("Error writing file", e);
  }
}

function persistAsCSV(root, org, repo, out) {
  const fileContents =
    Object.keys(out[0]) + '\n' + out.map(d => Object.values(d).join(',')).join('\n')

  try {
    fs.writeFileSync(getFilePath(root, org, repo, "csv"), fileContents)
  } catch (e) {
    console.log("Error writing file", e);
  }
}

function printToConsole(json) {
  console.log(JSON.stringify(json, undefined, 2))
}

module.exports = {persistAsCSV, persistAsJSON, printToConsole}