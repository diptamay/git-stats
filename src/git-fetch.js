const {GraphQLClient, gql} = require('graphql-request')
const moment = require('moment')
const {uniq} = require('lodash')

const endpoint = 'https://api.github.com/graphql'

function graphQLClient(token) {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}

function getTimeDiffInHours(start, end) {
  //console.log(`start -> ${start}, end -> ${end}`)
  const diff = Math.round((moment(end).diff(moment(start)) / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100
  return diff
}

function getTimeDiffInMinutes(start, end) {
  //console.log(`start -> ${start}, end -> ${end}`)
  const diff = Math.round((moment(end).diff(moment(start)) / 1000 / 60 + Number.EPSILON) * 100) / 100
  return diff
}

async function normalize(org, repo, json) {
  data = await json
  const out = data.repository.pullRequests.nodes.map(d => ({
    org: org,
    repo: repo,
    url: d.url,
    number: d.number,
    author: d.author.login,
    createdAt: d.createdAt,
    mergedAt: d.mergedAt,
    changedFiles: d.changedFiles,
    commits: d.commits.totalCount,
    additions: d.additions,
    deletions: d.deletions,
    reviews: d.reviews.totalCount,
    first_review_time: (d.reviews.totalCount > 0) ? d.reviews.nodes[0].publishedAt : '',
    reviewers: (d.reviews.totalCount > 0) ? `"${uniq(d.reviews.nodes.map(r => r.author ? r.author.login : '')).join(',')}"` : '',
    hours_open: getTimeDiffInHours(d.createdAt, d.mergedAt),
    hours_to_first_review: (d.reviews.totalCount > 0) ? getTimeDiffInHours(d.createdAt, d.reviews.nodes[0].publishedAt) : 0,
    minutes_to_first_review: (d.reviews.totalCount > 0) ? getTimeDiffInMinutes(d.createdAt, d.reviews.nodes[0].publishedAt) : 0,
  }))
  return out
}

async function fetchPRs(token, org, repo, prLimit, internalLimit) {
  const client = graphQLClient(token)
  const query = gql`
  {
    repository(owner: "${org}", name: "${repo}") {
      pullRequests(last: ${prLimit}, states: MERGED) {
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
        nodes {
          number
          id
          url
          title
          author {
            login
          }
          changedFiles
          additions
          deletions
          createdAt
          mergedAt
          commits(first: 1) {
            totalCount
          }
          reviews(first: ${internalLimit}) {
            totalCount
            nodes {
              publishedAt
              author {
                login
              }
            }
          }
        }
      }
    }
  }`

  return normalize(org, repo, client.request(query))
}

module.exports = {fetchPRs}