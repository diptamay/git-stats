const {GraphQLClient, gql} = require('graphql-request')

const endpoint = 'https://api.github.com/graphql';


function graphQLClient(token) {
  return new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  })
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

  return client.request(query)
}

module.exports = {fetchPRs}