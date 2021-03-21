const https = require('https')
const moment = require('moment')
const {uniq} = require('lodash')

//const endpoint = `https://dev.azure.com/${org}/${repo}/_apis/git/pullrequests?api-version=6.0`

function httpsGet(url, token) {
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

async function fetchPRs(token, org, repo, prLimit) {
  console.log("Fetching from ado")
}
