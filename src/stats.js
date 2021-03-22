const {chain} = require('lodash')
const {roundOff, printToConsole} = require('./utils')

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
  let grouped = chain(data)
    .groupBy(x => x.org)
    .map((values, key) => ({
      org: key,
      repo: "_all",
      mean_hours_open: mean(values.map(d => d.mean_hours_open)),
      mean_hours_open_no_review: mean(values.map(d => d.mean_hours_open_no_review)),
      mean_hours_open_in_review: mean(values.map(d => d.mean_hours_open_in_review)),
      mean_hours_to_first_review: mean(values.map(d => d.mean_hours_to_first_review)),
      mean_minutes_to_first_review: mean(values.map(d => d.mean_minutes_to_first_review)),
      median_hours_open: median(values.map(d => d.median_hours_open)),
      median_hours_open_no_review: median(values.map(d => d.median_hours_open_no_review)),
      median_hours_open_in_review: median(values.map(d => d.median_hours_open_in_review)),
      median_hours_to_first_review: median(values.map(d => d.median_hours_to_first_review)),
      median_minutes_to_first_review: median(values.map(d => d.median_minutes_to_first_review)),
    }))
    .value()

  let overall = {
    org: "_all",
    repo: "_all",
    mean_hours_open: mean(grouped.map(d => d.mean_hours_open)),
    mean_hours_open_no_review: mean(grouped.map(d => d.mean_hours_open_no_review)),
    mean_hours_open_in_review: mean(grouped.map(d => d.mean_hours_open_in_review)),
    mean_hours_to_first_review: mean(grouped.map(d => d.mean_hours_to_first_review)),
    mean_minutes_to_first_review: mean(grouped.map(d => d.mean_minutes_to_first_review)),
    median_hours_open: median(grouped.map(d => d.median_hours_open)),
    median_hours_open_no_review: median(grouped.map(d => d.median_hours_open_no_review)),
    median_hours_open_in_review: median(grouped.map(d => d.median_hours_open_in_review)),
    median_hours_to_first_review: median(grouped.map(d => d.median_hours_to_first_review)),
    median_minutes_to_first_review: median(grouped.map(d => d.median_minutes_to_first_review)),
  }

  let out = data.concat(grouped)
  out.push(overall)

  return out
}

module.exports = {calculateRepoStats, calculateOrgStats}
