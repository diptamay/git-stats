const moment = require('moment')

function printToConsole(json) {
  console.log(JSON.stringify(json, undefined, 2))
}

function roundOff(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function getTimeDiffInHours(start, end) {
  return roundOff(moment(end).diff(moment(start)) / 1000 / 60 / 60)
}

function getTimeDiffInMinutes(start, end) {
  return roundOff(moment(end).diff(moment(start)) / 1000 / 60)
}

function getTimeDiffInDays(start, end) {
  return moment(end).diff(moment(start)) / (1000 * 60 * 60 * 24)
}

module.exports = { printToConsole, roundOff, getTimeDiffInHours, getTimeDiffInMinutes, getTimeDiffInDays }