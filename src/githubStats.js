// ported from iris: https://git.taservs.net/rcom/iris/blob/f7a19fb4ace9c03fbb7f3838456c7635856ff06d/scripts/ci/getBranchName.js
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const https = require('https')
const moment = require('moment')
const {uniq} = require('lodash')
const fs = require('fs')

const ACCESS_TOKEN = '030e668bd148249cf818c2fbae1dfdc84b12c020'
const OUT_PATH = './git-stats.csv'


function httpsGet(url) {
    return new Promise((resolve, reject) => {
        https
            .get(
                `${url}${
                    url.includes('?') ? '&' : '?'
                }access_token=${ACCESS_TOKEN}`,
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

const getDiffs = async commitsUrl => {
    const commits = await httpsGet(commitsUrl)

    const commitFiles = (await Promise.all(commits.map(c => httpsGet(c.url)))).map(c => c.stats)

    return commitFiles.reduce(
        (prev, curr) => {
            return {
                deletions: prev.deletions + curr.deletions,
                additions: prev.additions + curr.additions,
            }
        },
        {deletions: 0, additions: 0}
    )
}

async function main() {
    const pullsUrl = (org, repo, page) =>
        `https://git.taservs.net/api/v3/repos/${org}/${repo}/pulls?state=closed&per_page=100&page=${page}`

    let data = (
        await Promise.all([
            httpsGet(pullsUrl('rcom', 'iris', 1)),
            httpsGet(pullsUrl('rcom', 'iris', 2)),
            httpsGet(pullsUrl('rcom', 'iris', 3)),
            httpsGet(pullsUrl('rcom', 'iris', 4)),

            httpsGet(pullsUrl('rcom', 'hermes', 1)),
            httpsGet(pullsUrl('rcom', 'hermes', 2)),
            httpsGet(pullsUrl('rcom', 'hermes', 3)),
            httpsGet(pullsUrl('rcom', 'hermes', 4)),

            httpsGet(pullsUrl('rcom', 'zeke', 1)),
            httpsGet(pullsUrl('rcom', 'zeke', 2)),
            httpsGet(pullsUrl('rcom', 'zeke', 3)),
            httpsGet(pullsUrl('rcom', 'zeke', 4)),

            httpsGet(pullsUrl('rcom', 'ugp', 1)),
            httpsGet(pullsUrl('rcom', 'ugp', 2)),
            httpsGet(pullsUrl('rcom', 'ugp', 3)),
            httpsGet(pullsUrl('rcom', 'ugp', 4)),

            httpsGet(pullsUrl('rcom', 'common', 1)),

            // httpsGet(pullsUrl('rcom', 'resgard', 1)),
            // httpsGet(pullsUrl('rcom', 'resgard', 2)),
            // httpsGet(pullsUrl('rcom', 'resgard', 3)),

            // httpsGet(pullsUrl('rcom', 'schemastorus', 1)),
            // httpsGet(pullsUrl('rcom', 'schemastorus', 2)),
            // httpsGet(pullsUrl('rcom', 'schemastorus', 3)),
            // httpsGet(pullsUrl('rcom', 'schemastorus', 4)),

            httpsGet(pullsUrl('integrations', 'translator', 1)),
            httpsGet(pullsUrl('integrations', 'translator', 2)),
            httpsGet(pullsUrl('integrations', 'translator', 3)),

        ])
    ).flat()

    data = await Promise.all(
        data.map(async d => {
            const reviews = await httpsGet(`${d.url}/reviews?`)

            let first_review_time;
            let reviewers;

            if (!Array.isArray(reviews) || !reviews.length) {
                first_review_time = 0
                reviewers = ''
            } else {
                first_review_time = reviews.map(r => r.submitted_at)[0]
                reviewers = reviews.map(r => r.user ? r.user.login : '')
            }

            return {
                ...d,
                repo: d.url.replace('https://git.taservs.net/api/v3/repos/', '').split('/')[1],
                reviewers: reviewers,
                // ...(await getDiffs(d.commits_url)),
                first_review_time: first_review_time,
            }
        })
    )

    const out = data
        .map(d => ({
            html_url: d.html_url,
            user: d.user.login,
            repo: d.repo,
            created_at: d.created_at,
            merged_at: d.merged_at,
            first_review_time: d.first_review_time,
            reviewers: `"${uniq(d.reviewers).join(',')}"`,
            // additions: d.additions,
            // deletions: d.deletions,
            // total_diff: d.additions - d.deletions,
            hours_open:
                Math.round((moment(d.merged_at || undefined).diff(moment(d.created_at)) / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100,
            hours_to_first_review:
                d.first_review_time ? Math.round((moment(d.first_review_time).diff(moment(d.created_at)) / 1000 / 60 / 60 + Number.EPSILON) * 100) / 100 : 0,
        }))
        .filter(d => !!d.merged_at)

    const fileContents =
        Object.keys(out[0]) + '\n' + out.map(d => Object.values(d).join(',')).join('\n')
    fs.writeFileSync(OUT_PATH, fileContents)
}

main()