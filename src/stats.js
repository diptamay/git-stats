const {chain} = require('lodash')
const {roundOff, getTimeDiffInDays} = require('./utils')

function median(values) {
  if (values.length === 0) return 0

  values.sort(function (a, b) {
    return a - b
  })

  const half = Math.floor(values.length / 2)
  //console.log(`median len=${values.length} half=${half} vals=(${values.length % 2})`)
  if (values.length % 2)
    return values[half]

  let out = (values[half - 1] + values[half]) / 2.0
  return roundOff(out)
}

function percentile(values, p) {
  if (values.length === 0) return 0

  if (typeof p !== 'number') throw new TypeError('p must be a number')
  if (p <= 0) return values[0]
  if (p >= 1) return values[values.length - 1]

  values.sort(function (a, b) {
    return a - b
  })

  const part = Math.floor(values.length * p)

  const val = values.length * p
  //console.log(`metric=${p} len=${values.length} part=${part} vals=(${val % 1})`)
  if (val % 1) {
    return values[part]
  }

  let out = (values[part - 1] + values[part]) / 2.0
  return roundOff(out)
}

function p50(values) {
  return percentile(values, 0.5)
}

function p90(values) {
  return percentile(values, 0.9)
}

function mean(values) {
  if (values.length === 0) return 0;
  const out = values.reduce((a, b) => a + b, 0) / values.length
  return roundOff(out)
}

function isDateWithin4wks(d) {
  let days = getTimeDiffInDays(d, new Date())
  return (days <= 28)
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

    hours_open_p50: p50(data.map(d => d.hours_open)),
    hours_open_no_review_p50: p50(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_p50: p50(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_p50: p50(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_p50: p50(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),

    hours_open_p90: p90(data.map(d => d.hours_open)),
    hours_open_no_review_p90: p90(data.filter(d => d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_p90: p90(data.filter(d => d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_p90: p90(data.filter(d => d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_p90: p90(data.filter(d => d.reviews > 0).map(d => d.minutes_to_first_review)),

    hours_open_4wk_avg: mean(data.filter(d => isDateWithin4wks(d.merged_at)).map(d => d.hours_open)),
    hours_open_no_review_4wk_avg: mean(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_4wk_avg: mean(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_4wk_avg: mean(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_4wk_avg: mean(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.minutes_to_first_review)),

    hours_open_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at)).map(d => d.hours_open)),
    hours_open_no_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.minutes_to_first_review)),

    hours_open_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at)).map(d => d.hours_open)),
    hours_open_no_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews === 0).map(d => d.hours_open)),
    hours_open_in_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hours_open)),
    hours_to_first_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hours_to_first_review)),
    minutes_to_first_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.minutes_to_first_review)),
  }
  return out
}

function generateStats(org, repo, values) {
  return {
    org: org,
    repo: repo,

    hours_open_avg: mean(values.map(d => d.hours_open_avg)),
    hours_open_no_review_avg: mean(values.map(d => d.hours_open_no_review_avg)),
    hours_open_in_review_avg: mean(values.map(d => d.hours_open_in_review_avg)),
    hours_to_first_review_avg: mean(values.map(d => d.hours_to_first_review_avg)),
    minutes_to_first_review_avg: mean(values.map(d => d.minutes_to_first_review_avg)),

    hours_open_p50: p50(values.map(d => d.hours_open_p50)),
    hours_open_no_review_p50: p50(values.map(d => d.hours_open_no_review_p50)),
    hours_open_in_review_p50: p50(values.map(d => d.hours_open_in_review_p50)),
    hours_to_first_review_p50: p50(values.map(d => d.hours_to_first_review_p50)),
    minutes_to_first_review_p50: p50(values.map(d => d.minutes_to_first_review_p50)),

    hours_open_p90: p90(values.map(d => d.hours_open_p90)),
    hours_open_no_review_p90: p90(values.map(d => d.hours_open_no_review_p90)),
    hours_open_in_review_p90: p90(values.map(d => d.hours_open_in_review_p90)),
    hours_to_first_review_p90: p90(values.map(d => d.hours_to_first_review_p90)),
    minutes_to_first_review_p90: p90(values.map(d => d.minutes_to_first_review_p90)),

    hours_open_4wk_avg: mean(values.map(d => d.hours_open_4wk_avg)),
    hours_open_no_review_4wk_avg: mean(values.map(d => d.hours_open_no_review_4wk_avg)),
    hours_open_in_review_4wk_avg: mean(values.map(d => d.hours_open_in_review_4wk_avg)),
    hours_to_first_review_4wk_avg: mean(values.map(d => d.hours_to_first_review_4wk_avg)),
    minutes_to_first_review_4wk_avg: mean(values.map(d => d.minutes_to_first_review_4wk_avg)),

    hours_open_4wk_p50: p50(values.map(d => d.hours_open_4wk_p50)),
    hours_open_no_review_4wk_p50: p50(values.map(d => d.hours_open_no_review_4wk_p50)),
    hours_open_in_review_4wk_p50: p50(values.map(d => d.hours_open_in_review_4wk_p50)),
    hours_to_first_review_4wk_p50: p50(values.map(d => d.hours_to_first_review_4wk_p50)),
    minutes_to_first_review_4wk_p50: p50(values.map(d => d.minutes_to_first_review_4wk_p50)),

    hours_open_4wk_p90: p90(values.map(d => d.hours_open_p90)),
    hours_open_no_review_4wk_p90: p90(values.map(d => d.hours_open_no_review_4wk_p90)),
    hours_open_in_review_4wk_p90: p90(values.map(d => d.hours_open_in_review_4wk_p90)),
    hours_to_first_review_4wk_p90: p90(values.map(d => d.hours_to_first_review_4wk_p90)),
    minutes_to_first_review_4wk_p90: p90(values.map(d => d.minutes_to_first_review_4wk_p90)),
  }
}

function calculateOrgStats(data) {
  let grouped = chain(data)
    .groupBy(x => x.org)
    .map((values, key) => (
      generateStats(key, "_all", values)
    ))
    .value()

  let overall = generateStats("_all", "_all", grouped)

  let out = data.concat(grouped)
  out.push(overall)

  return out
}

module.exports = {calculateRepoStats, calculateOrgStats}
