const {groupBy} = require('lodash')
const {roundOff} = require('./utils')

function median(values) {
  if (values.length === 0) return 0

  values.sort(function (a, b) {
    return a - b
  })

  const half = Math.floor(values.length / 2)

  if (values.length % 2)
    return values[half]

  let out = (values[half - 1] + values[half]) / 2.0
  return roundOff(out)
}

function mean(values) {
  if (values.length === 0) return 0;
  const out = values.reduce((a, b) => a + b, 0) / values.length
  return roundOff(out)
}

function calculateRepoStats(org, repo, data) {
  const out = {
    org: org,
    repo: repo,
    mean_hours_open: mean(data.map(d => d.hours_open)),
    mean_hours_open_no_review: mean(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    mean_hours_open_in_review: mean(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    mean_hours_to_first_review: mean(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    mean_minutes_to_first_review: mean(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),
    median_hours_open: median(data.map(d => d.hours_open)),
    median_hours_open_no_review: median(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    median_hours_open_in_review: median(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    median_hours_to_first_review: median(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    median_minutes_to_first_review: median(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),
  }
  return out
}

function calculateOrgStats(data) {
  const out = {
    org: org,
    mean_hours_open: mean(data.map(d => d.hours_open)),
    mean_hours_open_no_review: mean(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    mean_hours_open_in_review: mean(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    mean_hours_to_first_review: mean(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    mean_minutes_to_first_review: mean(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),
    median_hours_open: median(data.map(d => d.hours_open)),
    median_hours_open_no_review: median(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    median_hours_open_in_review: median(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    median_hours_to_first_review: median(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    median_minutes_to_first_review: median(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),
  }
  return out
}

module.exports = {calculateRepoStats, calculateOrgStats}
