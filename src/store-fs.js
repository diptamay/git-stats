const fs = require('fs')
const path = require('path')

const GENERATED_DIR = "generated"

function getFilePath(root, org, repo, extn) {
  if (!fs.existsSync(GENERATED_DIR)) {
    fs.mkdirSync(GENERATED_DIR)
  }
  if (!fs.existsSync(path.join(`${GENERATED_DIR}`, `${root}`))) {
    fs.mkdirSync(path.join(`${GENERATED_DIR}`, `${root}`))
  }
  const fPath = path.join(`${GENERATED_DIR}`, `${root}`, `${org}-${repo}.${extn}`)
  console.log(fPath)
  return fPath
}

function readJSON(filePath, callback) {
  try {
    fs.readFile(filePath, (err, data) => {
      if (err) throw err
      let json = JSON.parse(data)
      callback(json)
    })
  } catch (e) {
    console.log("Error reading file", e)
  }
}

function readJSONFiles(root, callback) {
  const dirPath = path.join(`${GENERATED_DIR}`, `${root}`)
  if (!fs.existsSync(dirPath)) {
    throw new Error(`Directory ${dirPath} doesn't exist`)
  }
  fs.readdir(dirPath, (err, files) => {
    //handling error
    if (err) {
      console.log(err)
      throw new Error('Unable to scan directory: ' + err)
    }

    let jsonArr = []
    let filesProcessed = 0
    //listing all files using forEach
    files.forEach((file) => {
      console.log(`Processing ${file}`)
      let filePath = path.join(`${GENERATED_DIR}`, `${root}`, `${file}`)
      readJSON(filePath, (json) => {
        jsonArr.push(json)
        filesProcessed++;
        if (filesProcessed === files.length) {
          callback(jsonArr);
        }
      })
    })
  })
}

function persistJSONFile(filePath, json) {
  const fileContents = JSON.stringify(json, undefined, 2)
  try {
    fs.writeFileSync(filePath, fileContents)
  } catch (e) {
    console.log("Error writing file", e)
  }
}

function persistAsJSON(root, org, repo, out) {
  persistJSONFile(getFilePath(root, org, repo, "json"), out)
}

function persistCSVFile(filePath, out) {
  const fileContents =
    Object.keys(out[0]) + '\n' + out.map(d => Object.values(d).join(',')).join('\n')

  try {
    fs.writeFileSync(filePath, fileContents)
  } catch (e) {
    console.log("Error writing file", e)
  }
}

function persistAsCSV(root, org, repo, out) {
  persistCSVFile(getFilePath(root, org, repo, "csv"), out)
}

function persistOrgStats(root, out) {
  persistJSONFile(path.join(`${GENERATED_DIR}`, "orgs-stats.json"), out)
  persistCSVFile(path.join(`${GENERATED_DIR}`, "orgs-stats.csv"), out)
}

module.exports = {persistAsCSV, persistAsJSON, readJSONFiles, persistOrgStats}