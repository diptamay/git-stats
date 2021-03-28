const {chain} = require('lodash')
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
    hours_open_avg: mean(data.map(d => d.hours_open)),
    hours_open_no_review_avg: mean(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_avg: mean(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_avg: mean(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_avg: mean(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),
    hours_open_p50: median(data.map(d => d.hours_open)),
    hours_open_no_review_p50: median(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_p50: median(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_p50: median(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_p50: median(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),
  }
  return out
}

function calculateOrgStats(data) {
  let grouped = chain(data)
    .groupBy(x => x.org)
    .map((values, key) => ({
      org: key,
      repo: "_all",
      hours_open_avg: mean(values.map(d => d.hours_open_avg)),
      hours_open_no_review_avg: mean(values.map(d => d.hours_open_no_review_avg)),
      hours_open_in_review_avg: mean(values.map(d => d.hours_open_in_review_avg)),
      hours_to_first_review_avg: mean(values.map(d => d.hours_to_first_review_avg)),
      minutes_to_first_review_avg: mean(values.map(d => d.minutes_to_first_review_avg)),
      hours_open_p50: median(values.map(d => d.hours_open_p50)),
      hours_open_no_review_p50: median(values.map(d => d.hours_open_no_review_p50)),
      hours_open_in_review_p50: median(values.map(d => d.hours_open_in_review_p50)),
      hours_to_first_review_p50: median(values.map(d => d.hours_to_first_review_p50)),
      minutes_to_first_review_p50: median(values.map(d => d.minutes_to_first_review_p50)),
    }))
    .value()

  let overall = {
    org: "_all",
    repo: "_all",
    hours_open_avg: mean(grouped.map(d => d.hours_open_avg)),
    hours_open_no_review_avg: mean(grouped.map(d => d.hours_open_no_review_avg)),
    hours_open_in_review_avg: mean(grouped.map(d => d.hours_open_in_review_avg)),
    hours_to_first_review_avg: mean(grouped.map(d => d.hours_to_first_review_avg)),
    minutes_to_first_review_avg: mean(grouped.map(d => d.minutes_to_first_review_avg)),
    hours_open_p50: median(grouped.map(d => d.hours_open_p50)),
    hours_open_no_review_p50: median(grouped.map(d => d.hours_open_no_review_p50)),
    hours_open_in_review_p50: median(grouped.map(d => d.hours_open_in_review_p50)),
    hours_to_first_review_p50: median(grouped.map(d => d.hours_to_first_review_p50)),
    minutes_to_first_review_p50: median(grouped.map(d => d.minutes_to_first_review_p50)),
  }

  let out = data.concat(grouped)
  out.push(overall)

  return out
}

module.exports = {calculateRepoStats, calculateOrgStats}
