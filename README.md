# git-stats

**Usage**

To generate stats for all the repos

`./run.sh <git_access_token> <ado_access_token>`

To generate stats for a specfic repo (note: project can be a dummy value for github)

`npm run app stats <github|ado> <org> <project> <repository <access_token>`

E.g.:

`npm run app stats github tumblr X colossus <access_token>`

`npm run app stats ado axon-eng rms-integrations darkwing-sql <access_token>`