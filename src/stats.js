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
  const out = {
    org: org,
    repo: repo,

    hrs_open_p50: p50(data.map(d => d.hrs_open)),
    hrs_open_no_review_p50: p50(data.filter(d => d.reviews === 0).map(d => d.hrs_open)),
    hrs_open_in_review_p50: p50(data.filter(d => d.reviews > 0).map(d => d.hrs_open)),
    hrs_to_1st_review_p50: p50(data.filter(d => d.reviews > 0).map(d => d.hrs_to_1st_review)),
    mins_to_1st_review_p50: p50(data.filter(d => d.reviews > 0).map(d => d.mins_to_1st_review)),

    hrs_open_p90: p90(data.map(d => d.hrs_open)),
    hrs_open_no_review_p90: p90(data.filter(d => d.reviews === 0).map(d => d.hrs_open)),
    hrs_open_in_review_p90: p90(data.filter(d => d.reviews > 0).map(d => d.hrs_open)),
    hrs_to_1st_review_p90: p90(data.filter(d => d.reviews > 0).map(d => d.hrs_to_1st_review)),
    mins_to_1st_review_p90: p90(data.filter(d => d.reviews > 0).map(d => d.mins_to_1st_review)),

    hrs_open_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at)).map(d => d.hrs_open)),
    hrs_open_no_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews === 0).map(d => d.hrs_open)),
    hrs_open_in_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hrs_open)),
    hrs_to_1st_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hrs_to_1st_review)),
    mins_to_1st_review_4wk_p50: p50(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.mins_to_1st_review)),

    hrs_open_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at)).map(d => d.hrs_open)),
    hrs_open_no_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews === 0).map(d => d.hrs_open)),
    hrs_open_in_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hrs_open)),
    hrs_to_1st_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.hrs_to_1st_review)),
    mins_to_1st_review_4wk_p90: p90(data.filter(d => isDateWithin4wks(d.merged_at) && d.reviews > 0).map(d => d.mins_to_1st_review)),
  }
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

function calculateDevStats(org, repo, data) {
  let grouped = chain(data)
    .groupBy(x => x.author)
    .map((values, key) => (
      {
        author: key,
        org: org,
        repo: repo,

        total_6mth_prs: values.filter(d => isDateWithin6mths(d.merged_at)).length,
        total_6mth_changed_files: sum(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.changed_files)),
        total_6mth_commits: sum(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.commits)),
        total_6mth_additions: sum(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.additions)),
        total_6mth_deletions: sum(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.deletions)),
        avg_6mth_reviews_on_prs: mean(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.reviews)),
        hrs_open_6mth_p50: p50(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.hrs_open)),
        hrs_open_6mth_p90: p90(values.filter(d => isDateWithin6mths(d.merged_at)).map(d => d.hrs_open)),

        total_1yr_prs: values.filter(d => isDateWithin1yr(d.merged_at)).length,
        total_1yr_changed_files: sum(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.changed_files)),
        total_1yr_commits: sum(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.commits)),
        total_1yr_additions: sum(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.additions)),
        total_1yr_deletions: sum(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.deletions)),
        avg_1yr_reviews_on_prs: mean(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.reviews)),
        hrs_open_1yr_p50: p50(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.hrs_open)),
        hrs_open_1yr_p90: p90(values.filter(d => isDateWithin1yr(d.merged_at)).map(d => d.hrs_open)),

        total_prs: values.length,
        total_changed_files: sum(values.map(d => d.changed_files)),
        total_commits: sum(values.map(d => d.commits)),
        total_additions: sum(values.map(d => d.additions)),
        total_deletions: sum(values.map(d => d.deletions)),
        avg_reviews_on_prs: mean(values.map(d => d.reviews)),
        hrs_open_p50: p50(values.map(d => d.hrs_open)),
        hrs_open_p90: p90(values.map(d => d.hrs_open)),
      }
    ))
    .value()

  return grouped
}

function aggregateDevStats(data) {
  let input = data.flat()
  let grouped = chain(input)
    .groupBy(x => x.author)
    .map((values, key) => (
      {
        author: key,
        org: "_all",
        repo: "_all",

        total_6mth_prs: sum(values.map(d => d.total_6mth_prs)),
        total_6mth_changed_files: sum(values.map(d => d.total_6mth_changed_files)),
        total_6mth_commits: sum(values.map(d => d.total_6mth_commits)),
        total_6mth_additions: sum(values.map(d => d.total_6mth_additions)),
        total_6mth_deletions: sum(values.map(d => d.total_6mth_deletions)),
        avg_6mth_reviews_on_prs: mean(values.map(d => d.avg_6mth_reviews_on_prs)),
        hrs_open_6mth_p50: p50(values.map(d => d.hrs_open_6mth_p50)),
        hrs_open_6mth_p90: p90(values.map(d => d.hrs_open_6mth_p90)),

        total_1yr_prs: sum(values.map(d => d.total_1yr_prs)),
        total_1yr_changed_files: sum(values.map(d => d.total_1yr_changed_files)),
        total_1yr_commits: sum(values.map(d => d.total_1yr_commits)),
        total_1yr_additions: sum(values.map(d => d.total_1yr_additions)),
        total_1yr_deletions: sum(values.map(d => d.total_1yr_deletions)),
        avg_1yr_reviews_on_prs: mean(values.map(d => d.avg_1yr_reviews_on_prs)),
        hrs_open_1yr_p50: p50(values.map(d => d.hrs_open_1yr_p50)),
        hrs_open_1yr_p90: p90(values.map(d => d.hrs_open_1yr_p90)),

        total_prs: sum(values.map(d => d.total_prs)),
        total_changed_files: sum(values.map(d => d.total_changed_files)),
        total_commits: sum(values.map(d => d.total_commits)),
        total_additions: sum(values.map(d => d.total_additions)),
        total_deletions: sum(values.map(d => d.total_deletions)),
        avg_reviews_on_prs: mean(values.map(d => d.avg_reviews_on_prs)),
        hrs_open_p50: p50(values.map(d => d.hrs_open_p50)),
        hrs_open_p90: p90(values.map(d => d.hrs_open_p90)),
      }
    ))
    .value()
  let out = chain(input.concat(grouped)).sortBy(x => x.author).value()
  return out
}

module.exports = {calculateRepoStats, calculateOrgStats, calculateDevStats, aggregateDevStats}
