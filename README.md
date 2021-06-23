# git-stats

Generates stats like `mean_hours_open`, `mean_minutes_to_first_review` and so on at the repo level, at the org level and overall as well.
It pulls all PRs as exists for a repo from start. It is not incremental in nature at the moment.

   The PR stats that are generated are:

      Across all branches suffixed by : p50, p90, 4wk_p50, 4wk_p90
      ONLY main branch suffixed by : main_p50, main_p90, main_4wk_p50, main_4wk_p90

      mean_hours_open:
      mean_hours_open_no_review:
      mean_hours_open_in_review:
      mean_hours_to_first_review:
      mean_minutes_to_first_review:
      median_hours_open:
      median_hours_open_no_review:
      median_hours_open_in_review:
      median_hours_to_first_review:
      median_minutes_to_first_review:

   The Dev related stats generated for trailing 6 mth, 1 yr and overall (suffixed accordingly) are:

      prs
      changed_files
      commits
      additions
      deletions
      avg_reviews_on_prs
      hrs_open_p50
      hrs_open_p90
   **Note**: It assumes that the author of the PR is the dev who contributed to all the changes in the PR, which may not be true always.

**Additional Notes:**
- All git stats pulled from git are written under the `generated/data` folder in both `csv` and `json` formats.
  `json` data can easily be put in a datastore like ElasticSearch for each querying.
  `csv` could be imported into a spreadsheet for easy analysis.
- All aggregated stats per repo is written per file under `generated/stats`
- All aggregated overall/org/repo stats is accumulated under `generated/org-stats.csv` or `generated/org-stats.json` for easy analysis.
- All aggregated dev stats per repo is written per file under `generated/dev-stats`
- All aggregated dev stats is accumulated under `generated/dev-stats.csv` or `generated/dev-stats.json` for easy analysis.

### Usage

1. First run `npm install` to get the dependencies

2. Generate a Git person access token give it the right permissions for the repos. Screenshot for mine is below
   ![alt text](git-token-settings.png?raw=true)

3. To pull stats for all github repos and generate overall stats for org/repo

    `./run.sh <git_access_token>`

    If you like to add a new org & repo for data gathering, please add it here.

4. To pull stats for a specfic repo

    `npm run app stats <org> <repository <access_token>`

    E.g.:

    `npm run app stats okta okta-cli <access_token>`

5. To generate aggregated overall/org/repo stats

    `npm run app os` OR `npm run app org-stats`

6. To generate aggregated overall developer stats

   `npm run app ds` OR `npm run app dev-stats`

    Note - It assumes the author of the PR is the one who has made all the code changes which is true most of the time but not always. So please use the numbers with that in mind