function calculateStats(org, repo, data) {
  let relevantLength = data.filter(d => d.reviews > 0).length
  const out = {
    org: org,
    repo: repo,
    avg_hours_open: Math.round(data.reduce((sum, arr) => {
      return sum + arr.hours_open
    }, 0) / data.length),
    avg_hours_to_first_review: Math.round(data.reduce((sum, arr) => {
      return sum + arr.hours_to_first_review
    }, 0) / relevantLength),
    avg_minutes_to_first_review: Math.round(data.reduce((sum, arr) => {
      return sum + arr.minutes_to_first_review
    }, 0) / relevantLength)
  }
  return out
}

module.exports = {calculateStats}
