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
  return path.join(`${GENERATED_DIR}`, `${root}`, `${org}-${repo}.${extn}`)
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

function persistCSVFile(filePath, items) {
  const arraytoString = (value) => Array.isArray(value) ? `${value.join(',')}` : value

  // specify how you want to handle null values and arrays here
  const replacer = (key, value) => value === null ? '' : arraytoString(value)

  const header = Object.keys(items[0])
  const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n')

  try {
    fs.writeFileSync(filePath, csv)
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

function persistDevStats(root, out) {
  persistJSONFile(path.join(`${GENERATED_DIR}`, "dev-stats.json"), out)
  persistCSVFile(path.join(`${GENERATED_DIR}`, "dev-stats.csv"), out)
}

module.exports = { persistAsCSV, persistAsJSON, readJSONFiles, persistOrgStats, persistDevStats }