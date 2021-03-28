const {GraphQLClient, gql} = require('graphql-request')
const {uniq} = require('lodash')
const {getTimeDiffInHours, getTimeDiffInMinutes} = require('./utils')

const endpoint = 'https://api.github.com/graphql'

function graphQLClient(token) {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
}

function normalize(org, repo, data) {
  const out = data.repository.pullRequests.nodes
    .map(d => ({
      org: org,
      repo: repo,
      url: d.url,
      number: d.number,
      author: d.author ? d.author.login : '',
      created_at: d.createdAt,
      merged_at: d.mergedAt,
      changed_files: d.changedFiles,
      commits: d.commits.totalCount,
      additions: d.additions,
      deletions: d.deletions,
      reviews: d.reviews.totalCount,
      time_of_first_review: (d.reviews.totalCount > 0) ? d.reviews.nodes[0].publishedAt : '',
      reviewers: (d.reviews.totalCount > 0) ? [uniq(d.reviews.nodes.map(r => r.author ? r.author.login : ''))] : [],
      hours_open: getTimeDiffInHours(d.createdAt, d.mergedAt),
      hours_to_first_review: (d.reviews.totalCount > 0) ? getTimeDiffInHours(d.createdAt, d.reviews.nodes[0].publishedAt) : 0,
      minutes_to_first_review: (d.reviews.totalCount > 0) ? getTimeDiffInMinutes(d.createdAt, d.reviews.nodes[0].publishedAt) : 0,
    }))
  return out
}

function getQuery(org, repo, prLimit, internalLimit, pagination = '') {
  return gql`
  {
    repository(owner: "${org}", name: "${repo}") {
      pullRequests(first: ${prLimit} ${pagination}, states: MERGED) {
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
}

async function fetchPRs(token, org, repo, prLimit, internalLimit) {
  const client = graphQLClient(token)
  let json = client.request(getQuery(org, repo, prLimit, internalLimit))
  let data = await json
  let out = normalize(org, repo, data)
  let count = prLimit
  console.log(`${org}/${repo} has ${data.repository.pullRequests.totalCount} PRs`)
  console.log(`Fetched ${count} PRs`)
  while (data.repository.pullRequests.pageInfo.hasNextPage) {
    let pagination = "after:\"" + data.repository.pullRequests.pageInfo.endCursor + "\""
    json = client.request(getQuery(org, repo, prLimit, internalLimit, pagination))
    data = await json
    out.push(normalize(org, repo, data))

    if (data.repository.pullRequests.pageInfo.hasNextPage) {
      count = count + prLimit
    } else {
      count = count + data.repository.pullRequests.nodes.length
    }
    console.log(`Fetched ${count} PRs`)
  }
  return out.flat()
}

module.exports = {fetchPRs}