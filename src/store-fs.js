const fs = require('fs')
const path = require('path')

function getFilePath(root, org, repo, extn) {
  if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }
  return path.join(`${root}`, `${org}-${repo}.${extn}`)
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
  if (!fs.existsSync(root)) {
    throw new Error(`Directory ${root} doesn't exist`)
  }
  fs.readdir(root, (err, files) => {
    let jsonArr = []
    //handling error
    if (err) {
      throw new Error('Unable to scan directory: ' + err)
    }

    let filesProcessed = 0
    //listing all files using forEach
    files.forEach((file) => {
      console.log(`Processing ${file}`)
      let filePath = path.join(`${root}`, `${file}`)
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

function persistAsJSON(root, org, repo, out) {
  const fileContents = JSON.stringify(out, undefined, 2)
  try {
    fs.writeFileSync(getFilePath(root, org, repo, "json"), fileContents)
  } catch (e) {
    console.log("Error writing file", e)
  }
}

function persistAsCSV(root, org, repo, out) {
  const fileContents =
    Object.keys(out[0]) + '\n' + out.map(d => Object.values(d).join(',')).join('\n')

  try {
    fs.writeFileSync(getFilePath(root, org, repo, "csv"), fileContents)
  } catch (e) {
    console.log("Error writing file", e)
  }
}

module.exports = {persistAsCSV, persistAsJSON, readJSONFiles}