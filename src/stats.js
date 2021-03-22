function median(values) {
  if (values.length === 0) return 0

  values.sort(function (a, b) {
    return a - b
  })

  const half = Math.floor(values.length / 2)

  if (values.length % 2)
    return values[half]

  let out = (values[half - 1] + values[half]) / 2.0
  return Math.round((out + Number.EPSILON) * 100) / 100
}

function mean(values) {
  if (values.length === 0) return 0;
  const out = values.reduce((a, b) => a + b, 0) / values.length
  return Math.round((out + Number.EPSILON) * 100) / 100
}

function calculateRepoStats(org, repo, data) {
  //let relevantLength = data.filter(d => d.reviews > 0).length
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
    // avg_hours_open: Math.round(data.reduce((sum, arr) => {
    //   return sum + arr.hours_open
    // }, 0) / data.length),
    // avg_hours_to_first_review: Math.round(data.reduce((sum, arr) => {
    //   return sum + arr.hours_to_first_review
    // }, 0) / relevantLength),
    // avg_minutes_to_first_review: Math.round(data.reduce((sum, arr) => {
    //   return sum + arr.minutes_to_first_review
    // }, 0) / relevantLength)
  }
  return out
}

function calculateOrgStats(org) {
  //let relevantLength = data.filter(d => d.reviews > 0).length
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

module.exports = {calculateRepoStats}
