const {GraphQLClient, gql} = require('graphql-request')

const endpoint = 'https://api.github.com/graphql';
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: 'Bearer 401776fc1ca3a1937fc2ffb0dd8f252463970838',
  },
})

async function fetchPRs(org, repo, prLimit, internalLimit) {

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
          commits(first: ${internalLimit}) {
            totalCount
          }
          participants(first: ${internalLimit}) {
            totalCount
            nodes {
              name
              login
            }
          }
          comments(first: ${internalLimit}) {
            totalCount
            nodes {
              publishedAt
              author {
                login
              }
            }
          }
          reviews(first: ${internalLimit}) {
            totalCount
            nodes {
              comments(first: ${internalLimit}) {
                totalCount
                nodes {
                  publishedAt
                  author {
                    login
                  }
                }
              }
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

  return graphQLClient.request(query)
}

module.exports = {fetchPRs}