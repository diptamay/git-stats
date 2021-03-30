# git-stats

Generates stats like `mean_hours_open`, `mean_minutes_to_first_review` and so on at the repo level, at the org level and overall as well. 
It pulls all PRs as exists for a repo from start. It is not incremental in nature at the moment.

**Additional Notes:**
- All git stats pulled from git are written under the `generated/data` folder in both `csv` and `json` formats. 
  `json` data can easily be put in a datastore like ElasticSearch for each querying. 
  `csv` could be imported into a spreadsheet for easy analysis.
- All aggregated stats per repo is written per file under `generated/stats`
- All aggregated overall/org/repo stats is accumulated under `generated/org-stats.csv` or `generated/org-stats.json` for each analysis.

### Usage

1. First run `npm install` to get the dependencies.

2. To pull stats for all github repos and generate overall stats for org/repo
   
    `./run.sh <git_access_token>`

    If you like to add a new org & repo for data gathering, please add it here.

3. To pull stats for a specfic repo (note: project can be a dummy value for github)

    `npm run app stats <github|ado> <org> <project> <repository <access_token>`

    E.g.:

    `npm run app stats github tumblr X colossus <access_token>`

    `npm run app stats ado axon-eng rms-integrations darkwing-sql <access_token>`

    NOTE: `ado` stats doesn't work yet. Needs oAuth2 workflow to be setup.

4. To generate aggregated overall/org/repo stats

    `npm run app os` OR `npm run app org-stats`
