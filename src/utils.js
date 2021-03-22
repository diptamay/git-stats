function printToConsole(json) {
  console.log(JSON.stringify(json, undefined, 2))
}

function roundOff(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

module.exports = {printToConsole, roundOff}