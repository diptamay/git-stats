const {chain} = require('lodash')
const {roundOff, getTimeDiffInDays} = require('./utils')

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

function isDateWithin4wks(d) {
  let days = getTimeDiffInDays(d, new Date())
  return (days <= 28)
}

function isDateWithin6mths(d) {
  let days = getTimeDiffInDays(d, new Date())
  return (days <= 183)
}

function isDateWithin1yr(d) {
  let days = getTimeDiffInDays(d, new Date())
  return (days <= 366)
}

function mean(values) {
  const out = sum(values) / values.length
  return roundOff(out)
}

function sum(values) {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0);
}

function calculateRepoStats(org, repo, data) {

  const repoStats = (data, suffix, percentile, check) => {
    let obj = {}
    obj["hrs_open" + suffix] = percentile(data.filter(d => check(d)).map(d => d.hrs_open))
    obj["hrs_open_no_review" + suffix] = percentile(data.filter(d => check(d) && d.reviews === 0).map(d => d.hrs_open))
    obj["hrs_open_in_review" + suffix] = percentile(data.filter(d => check(d) && d.reviews > 0).map(d => d.hrs_open))
    obj["hrs_to_1st_review" + suffix] = percentile(data.filter(d => check(d) && d.reviews > 0).map(d => d.hrs_to_1st_review))
    obj["mins_to_1st_review" + suffix] = percentile(data.filter(d => check(d) && d.reviews > 0).map(d => d.mins_to_1st_review))
    return obj
  }

  let out = {
    org: org,
    repo: repo,
  }

  let check = (d) => true
  out = Object.assign(out, repoStats(data, "_p50", p50, check))
  out = Object.assign(out, repoStats(data, "_p90", p90, check))

  check = (d) => (isDateWithin4wks(d.merged_at))
  out = Object.assign(out, repoStats(data, "_4wk_p50", p50, check))
  out = Object.assign(out, repoStats(data, "_4wk_p90", p90, check))

  check = (d) => (d.base_branch === 'master' || d.base_branch === 'main')
  out = Object.assign(out, repoStats(data, "_main_p50", p50, check))
  out = Object.assign(out, repoStats(data, "_main_p90", p90, check))

  check = (d) => ((d.base_branch === 'master' || d.base_branch === 'main') && isDateWithin4wks(d.merged_at))
  out = Object.assign(out, repoStats(data, "_main_4wk_p50", p50, check))
  out = Object.assign(out, repoStats(data, "_main_4wk_p90", p90, check))

  return out
}

function generateStats(org, repo, values) {
  return {
    org: org,
    repo: repo,

    hrs_open_p50: p50(values.map(d => d.hrs_open_p50)),
    hrs_open_no_review_p50: p50(values.map(d => d.hrs_open_no_review_p50)),
    hrs_open_in_review_p50: p50(values.map(d => d.hrs_open_in_review_p50)),
    hrs_to_1st_review_p50: p50(values.map(d => d.hrs_to_1st_review_p50)),
    mins_to_1st_review_p50: p50(values.map(d => d.mins_to_1st_review_p50)),

    hrs_open_p90: p90(values.map(d => d.hrs_open_p90)),
    hrs_open_no_review_p90: p90(values.map(d => d.hrs_open_no_review_p90)),
    hrs_open_in_review_p90: p90(values.map(d => d.hrs_open_in_review_p90)),
    hrs_to_1st_review_p90: p90(values.map(d => d.hrs_to_1st_review_p90)),
    mins_to_1st_review_p90: p90(values.map(d => d.mins_to_1st_review_p90)),

    hrs_open_4wk_p50: p50(values.map(d => d.hrs_open_4wk_p50)),
    hrs_open_no_review_4wk_p50: p50(values.map(d => d.hrs_open_no_review_4wk_p50)),
    hrs_open_in_review_4wk_p50: p50(values.map(d => d.hrs_open_in_review_4wk_p50)),
    hrs_to_1st_review_4wk_p50: p50(values.map(d => d.hrs_to_1st_review_4wk_p50)),
    mins_to_1st_review_4wk_p50: p50(values.map(d => d.mins_to_1st_review_4wk_p50)),

    hrs_open_4wk_p90: p90(values.map(d => d.hrs_open_p90)),
    hrs_open_no_review_4wk_p90: p90(values.map(d => d.hrs_open_no_review_4wk_p90)),
    hrs_open_in_review_4wk_p90: p90(values.map(d => d.hrs_open_in_review_4wk_p90)),
    hrs_to_1st_review_4wk_p90: p90(values.map(d => d.hrs_to_1st_review_4wk_p90)),
    mins_to_1st_review_4wk_p90: p90(values.map(d => d.mins_to_1st_review_4wk_p90)),
  }
}

// function calculateOrgStats(data) {
//   let grouped = chain(data)
//     .groupBy(x => x.org)
//     .map((values, key) => (
//       generateStats(key, "_all", values)
//     ))
//     .value()
//
//   let overall = generateStats("_all", "_all", grouped)
//
//   let out = data.concat(grouped)
//   out.push(overall)
//
//   return out
// }

function calculateOrgStats(data) {

  const generateStats = (values, suffix, percentile) => {
    let obj = {}
    let metrics = ["hrs_open", "hrs_open_no_review", "hrs_open_in_review", "hrs_to_1st_review", "mins_to_1st_review"]
    metrics.map(m => obj[m + suffix] = percentile(values.map(d => d[m + suffix])))
    return obj
  }

  let grouped = chain(data)
    .groupBy(x => x.org)
    .map((values, key) => {
      let out = {
        org: key,
        repo: "_all",
      }

      out = Object.assign(out, generateStats(data, "_p50", p50))
      out = Object.assign(out, generateStats(data, "_p90", p90))
      out = Object.assign(out, generateStats(data, "_4wk_p50", p50))
      out = Object.assign(out, generateStats(data, "_4wk_p90", p90))

      out = Object.assign(out, generateStats(data, "_main_p50", p50))
      out = Object.assign(out, generateStats(data, "_main_p90", p90))
      out = Object.assign(out, generateStats(data, "_main_4wk_p50", p50))
      out = Object.assign(out, generateStats(data, "_main_4wk_p90", p90))

      return out
    }).value()

  let overall = {
    org: "_all",
    repo: "_all",
  }
  overall = Object.assign(overall, generateStats(grouped, "_p50", p50))
  overall = Object.assign(overall, generateStats(grouped, "_p90", p90))
  overall = Object.assign(overall, generateStats(grouped, "_4wk_p50", p50))
  overall = Object.assign(overall, generateStats(grouped, "_4wk_p90", p90))

  overall = Object.assign(overall, generateStats(grouped, "_main_p50", p50))
  overall = Object.assign(overall, generateStats(grouped, "_main_p90", p90))
  overall = Object.assign(overall, generateStats(grouped, "_main_4wk_p50", p50))
  overall = Object.assign(overall, generateStats(grouped, "_main_4wk_p90", p90))

  let out = data.concat(grouped)
  out.push(overall)

  return out
}

function calculateDevStats(org, repo, data) {
  const devStats = (values, suffix, check) => {
    let obj = {}
    obj["prs" + suffix] = values.filter(d => check(d)).length
    obj["changed_files" + suffix] = sum(values.filter(d => check(d)).map(d => d.changed_files))
    obj["commits" + suffix] = sum(values.filter(d => check(d)).map(d => d.commits))
    obj["additions" + suffix] = sum(values.filter(d => check(d)).map(d => d.additions))
    obj["deletions" + suffix] = sum(values.filter(d => check(d)).map(d => d.deletions))
    obj["avg_reviews_on_prs" + suffix] = mean(values.filter(d => check(d)).map(d => d.reviews))
    obj["hrs_open_p50" + suffix] = p50(values.filter(d => check(d)).map(d => d.hrs_open))
    obj["hrs_open_p90" + suffix] = p90(values.filter(d => check(d)).map(d => d.hrs_open))
    return obj
  }

  let grouped = chain(data)
    .groupBy(x => x.author)
    .map((values, key) => {
      let out = {
        author: key,
        org: org,
        repo: repo,
      }

      let check = (d) => (isDateWithin6mths(d.merged_at))
      out = Object.assign(out, devStats(values, "_6mth", check))

      check = (d) => (isDateWithin1yr(d.merged_at))
      out = Object.assign(out, devStats(values, "_1yr", check))

      check = (d) => true
      out = Object.assign(out, devStats(values, "_overall", check))

      return out
    })
    .value()

  return grouped
}

function aggregateDevStats(data) {
  let input = data.flat()

  const devStats = (values, suffix) => {
    let obj = {}
    obj["prs" + suffix] = sum(values.map(d => d["prs" + suffix]))
    obj["changed_files" + suffix] = sum(values.map(d => d["changed_files" + suffix]))
    obj["commits" + suffix] = sum(values.map(d => d["commits" + suffix]))
    obj["additions" + suffix] = sum(values.map(d => d["additions" + suffix]))
    obj["deletions" + suffix] = sum(values.map(d => d["deletions" + suffix]))
    obj["avg_reviews_on_prs" + suffix] = mean(values.map(d => d["avg_reviews_on_prs" + suffix]))
    obj["hrs_open_p50" + suffix] = p50(values.map(d => d["hrs_open_p50" + suffix]))
    obj["hrs_open_p90" + suffix] = p90(values.map(d => d["hrs_open_p90" + suffix]))
    return obj
  }

  let grouped = chain(input)
    .groupBy(x => x.author)
    .map((values, key) => {
      let overall = {
        author: key,
        org: "_all",
        repo: "_all",
      }
      overall = Object.assign(overall, devStats(values, "_6mth"))
      overall = Object.assign(overall, devStats(values, "_1yr"))
      overall = Object.assign(overall, devStats(values, "_overall"))
      return overall
    })
    .value()
  let out = chain(input.concat(grouped)).sortBy(x => x.author).value()
  return out
}

module.exports = {calculateRepoStats, calculateOrgStats, calculateDevStats, aggregateDevStats}
