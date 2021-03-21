# git-stats

### Usage

All stats are written under the `data` folder in both `csv` and `json` formats

First run `npm install` to get the dependencies.

To generate stats for all github repos

`./run.sh <git_access_token>`

To generate stats for a specfic repo (note: project can be a dummy value for github)

`npm run app stats <github|ado> <org> <project> <repository <access_token>`

E.g.:

`npm run app stats github tumblr X colossus <access_token>`

`npm run app stats ado axon-eng rms-integrations darkwing-sql <access_token>`

NOTE: `ado` stats doesn't work yet. Needs oAuth2 workflow to be setup.