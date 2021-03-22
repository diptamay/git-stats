const https = require('https')
const moment = require('moment')
const {uniq} = require('lodash')

function getPREndpoint(org, project, repo, prLimit, page = 1) {
  let skips = prLimit * (page - 1)
  return `https://dev.azure.com/${org}/${project}/_apis/git/repositories/${repo}/pullrequests` +
    `?searchCriteria.status=completed&api-version=6.0&searchCriteria.includeLinks=false&$top=${prLimit}&$skip=${skips}`
}

function getReviewsEndpoint(org, project, repo, pullRequestId) {
  return `https://dev.azure.com/${org}/${project}/_apis/git/repositories/${repo}/pullrequests` +
    `/${pullRequestId}/threads?api-version=6.0`
}

async function httpsGet(url, token) {
  return new Promise((resolve, reject) => {
    https
      .get(
        `${url}${
          url.includes('?') ? '&' : '?'
        }access_token=${token}`,
        res => {
          res.setEncoding('utf8')
          // eslint-disable-next-line no-restricted-syntax
          let body = ''

          res.on('data', data => {
            body += data
          })

          res.on('end', () => {
            resolve(JSON.parse(body))
          })
        }
      )
      .on('error', reject)
  })
}

async function fetchPRs(token, org, project, repo, prLimit) {
  let endpoint = getPREndpoint(org, project, repo, prLimit)
  console.log(`Fetching from ado endpoint ${endpoint}`)
  data = await httpsGet(endpoint, token)
  return data
}

module.exports = {fetchPRs}
