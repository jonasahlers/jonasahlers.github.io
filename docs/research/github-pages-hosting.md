# Hosting a one-page CV on GitHub Pages

Research date: **2026-09-26**. Scope: host a static one-page CV/portfolio on GitHub Pages, built with a modern static-site framework (Astro expected).

Method: primary sources only (docs.github.com and GitHub-owned repos, framework docs and repos, the npm registry, nodejs.org). Every factual claim links to its source. Anything marked **Unverified** or **Judgment** is not backed by a primary source.

---

## What the user must do (checklist)

Only these steps need a human. The coding agent can do the rest (scaffolding, config, workflow file, commits, `gh repo create`, pushing) once `gh` is logged in.

1. **Pick the site type and repo name.** For a CV, use a *user site*: a repo named exactly `<username>.github.io`, which is served at `https://<username>.github.io/` with no sub-path ([GH: What is Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)). The name must be lowercase even if your username has capitals ([GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)). Any other repo name gives a *project site* under `/<repo>/`, which needs a `base` setting (§4.2).
2. **Install Node.js 24 LTS, not 25.** Check with `node -v`. Node 24 is today's Active LTS, and Node 25 is end-of-life and not supported by Astro (§5).
3. **Install GitHub CLI.** If `brew --version` works, run `brew install gh` ([cli/cli: install on macOS](https://github.com/cli/cli/blob/trunk/docs/install_macos.md)). If Homebrew is missing, see §3.
4. **Log in yourself, in your own Terminal:** run `gh auth login`, then choose **GitHub.com**, then **HTTPS**, answer **Yes** to "Authenticate Git with your GitHub credentials?", and pick **Login with a web browser**. Type the one-time code shown in Terminal into the browser page and approve.
   - gh stores the token in the macOS credential store, so there is nothing to copy or paste into a chat ([gh auth login help](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/login/login.go), [GH: Caching credentials](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)).
   - To check: `gh auth status` should list `workflow` among the "Token scopes" ([gh status source](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/status/status.go), [gh git-credential flow](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/shared/git_credential.go)).
5. **Enable Pages with the GitHub Actions source (one time).** In the repo, go to **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions** ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
   - Do **not** click "Configure" on GitHub's suggested *Astro* template. It pins Node 20, and Astro 7 exits with an error on Node 20 ([starter workflow](https://github.com/actions/starter-workflows/blob/main/pages/astro.yml), [astro CLI check](https://github.com/withastro/astro/blob/main/packages/astro/bin/astro.mjs)).
   - *Agent-runnable alternative (documented, but not tested here):* after the repo exists, `gh api --method POST "repos/{owner}/{repo}/pages" -f build_type=workflow` ([GH REST: Create a Pages site](https://docs.github.com/en/rest/pages/pages), [gh api help](https://github.com/cli/cli/blob/trunk/pkg/cmd/api/api.go)).
6. **If the first Actions run failed** because step 5 happened after the first push, re-run it. Use Actions tab → *Re-run failed jobs*, or `gh workflow run deploy.yml` (possible because the workflow has `workflow_dispatch`), or `gh run rerun <run-id> --failed`. The run ID is required when the command isn't run interactively ([gh workflow run](https://github.com/cli/cli/blob/trunk/pkg/cmd/workflow/run/run.go), [gh run rerun](https://github.com/cli/cli/blob/trunk/pkg/cmd/run/rerun/rerun.go)).
7. *(Optional)* **Custom domain:**
   - Verify the domain: profile Settings → Pages → Add a domain, then add the DNS TXT record.
   - Enter the domain in repo Settings → Pages → Custom domain.
   - Create the DNS records.
   - Tick **Enforce HTTPS** (§1.5).

**Not needed:** a personal access token, a repository secret, a `gh-pages` branch, or `.nojekyll` (§2, §4.7).

## Recommendations at a glance

- **Framework: Astro 7.** Astro publishes an official GitHub Pages guide and maintains its own deploy action ([Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)). It outputs a static site by default (`output: 'static'`) ([Astro config: output](https://docs.astro.build/en/reference/configuration-reference/#output)), ships "Zero JS, by default" ([Why Astro](https://docs.astro.build/en/concepts/why-astro/)), and has a stable built-in Fonts API (§6.3).
- **Workflow:** Astro's documented workflow, using `actions/checkout@v7`, `withastro/action@v6`, and `actions/deploy-pages@v5` (§4.2).
- **Config:**
  - User site: `site: 'https://<username>.github.io'` and no `base`.
  - Project site: `site: 'https://<username>.github.io'` and `base: '/<repo>'` (§4.2).
- **Node:** 24 LTS, both locally and in CI. The withastro/action default is already 24 (§5).
- **Local auth:** Homebrew → `gh` → `gh auth login` (HTTPS + browser), then `gh repo create … --push` (§3).

---

## 1. GitHub Pages basics

### 1.1 User site vs project site

| | User/organization site | Project site |
|---|---|---|
| Repo | `<owner>.github.io` | any other repo |
| Default URL | `http(s)://<owner>.github.io` | `http(s)://<owner>.github.io/<repositoryname>` |
| Limit | one per account | one per repository |

Source: [GH: What is GitHub Pages?](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)

- If the user site has a custom domain, any project site without its own domain is served under it (e.g. `www.octocat.com/octo-project`) ([GH: About custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)).
- With an Actions workflow, the deployed artifact must have the entry file (`index.html`) at its top level ([GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).

### 1.2 Publishing sources

- **Deploy from a branch:** you pick a branch and either `/` or `/docs`. GitHub builds the site with Jekyll by default ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).
- **GitHub Actions:** GitHub recommends this "If you want to use a build process other than Jekyll or you do not want a dedicated branch to hold your compiled static files" ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
- Both methods end in an Actions workflow run that deploys the site ([same](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
- Changes can take up to 10 minutes to go live after a push ([GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).
- There are no server-side languages (PHP, Ruby, Python) ([same](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).

### 1.3 Plan requirements

- GitHub's docs say Pages "is available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud, and GitHub Enterprise Server" ([github/docs availability text](https://github.com/github/docs/blob/main/data/reusables/gated-features/pages.md)).
- "If the account that owns the repository uses GitHub Free or GitHub Free for organizations, the repository must be public" ([GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).
- A site built from a private repo is still public on the internet ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
- Downgrading from Pro to Free unpublishes sites built from private repos ([GH: About custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)).
- GitHub Actions is free for public repositories ([GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).

### 1.4 Usage limits

Source for everything in this section except the artifact rules: [GH: GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

- **Source repository:** recommended limit of 1 GB.
- **Published site:** no larger than 1 GB.
- **Deployment timeout:** a deployment fails if it takes longer than 10 minutes.
- **Bandwidth:** *soft* limit of 100 GB per month.
- **Builds:** *soft* limit of 10 builds per hour. This limit "does not apply if you build and publish your site with a custom GitHub Actions workflow."
- **Rate limiting:** GitHub may rate-limit requests, which returns HTTP 429.
- **Use policy:** Pages is not for commercial transactions or SaaS, and not for sensitive transactions like sending passwords or credit card numbers.
- **Actions artifact rules:** the artifact must be one gzip'd tar file under 10 GB, with no symbolic or hard links ([GH: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)). 1 GB is the officially supported size ([upload-pages-artifact README](https://github.com/actions/upload-pages-artifact)).

### 1.5 Custom domains

- **Order matters:** add the domain in repo Settings → Pages *before* you configure DNS. Otherwise someone else could host a site on your subdomain ([GH: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)).
- **The CNAME file does nothing with Actions deploys:** "If you are publishing from a custom GitHub Actions workflow, no `CNAME` file is created, and any existing `CNAME` file is ignored and is not required" ([same](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)). Also, "A `CNAME` file in your repository file does not automatically add or remove a custom domain" ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
  - **Conflict between sources:** Astro's guide tells you to add `public/CNAME` ([Astro guide](https://docs.astro.build/en/guides/deploy/github/)). GitHub owns this behaviour, so follow GitHub: set the domain in Settings (or with the REST `cname` field, [GH REST](https://docs.github.com/en/rest/pages/pages)). The file does no harm, but it is not enough on its own.
- **DNS records** ([GH: Managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)):

  | Scenario | Type | Name | Value(s) |
  |---|---|---|---|
  | Apex (`example.com`) | `A` | `@` | `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` |
  | Apex | `AAAA` | `@` | `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153` |
  | Apex (alternative) | `ALIAS`/`ANAME` | `@` | `<username>.github.io` |
  | `www` or other subdomain | `CNAME` | `www.example.com.` | `<username>.github.io` (no repo name) |

- **Configure both apex and `www`.** GitHub recommends this. When both are set up, Pages redirects automatically between them ([GH: Managing](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), [GH: About custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)).
- **Don't use wildcard DNS records** such as `*.example.com` ([GH: Managing](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)).
- **DNS changes** can take up to 24 hours ([same](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)).
- **Domain verification.** GitHub recommends verifying before you add the domain to a repo. Verification happens in your *profile* Settings, not repo settings ([GH: Verifying your domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)):
  1. Profile Settings → Pages → **Add a domain**.
  2. Create the TXT record `_github-pages-challenge-<USERNAME>.<domain>`.
  3. Click **Verify**.
  4. Keep the TXT record in place afterwards.
- **HTTPS** ([GH: Securing with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https), [GH: Managing](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)):
  - `github.io` sites are served over HTTPS automatically.
  - For custom domains, the **Enforce HTTPS** option (Settings → Pages) can take up to 24 hours to appear.
  - Certificates come from Let's Encrypt.
  - The full domain name must be under 64 characters.

## 2. Credentials for an Actions-based deploy

- **No PAT and no secret are needed.** "At the start of each workflow job, GitHub automatically creates a unique `GITHUB_TOKEN` secret" ([GH: GITHUB_TOKEN](https://docs.github.com/en/actions/concepts/security/github_token)).
- **Required permissions:** the deploy job needs at least `pages: write` and `id-token: write` ([GH: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [deploy-pages README](https://github.com/actions/deploy-pages)).
  - `id-token: write` lets the job request an OIDC token. The Pages API uses that token to check which branch or ref is deploying ([deploy-pages README](https://github.com/actions/deploy-pages)).
  - The Astro workflow also sets `contents: read` for checkout. Once any permission is listed, every unlisted permission becomes `none` ([GH: Workflow syntax — permissions](https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions)).
- **The `github-pages` environment** is created automatically if it doesn't exist. GitHub recommends a protection rule so only the default branch can deploy ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
- **Is "Settings → Pages → Source = GitHub Actions" required before the first run? Yes, in practice. It is a one-time step, and the workflow cannot do it with the default token.**
  - GitHub: "To start using custom workflows you must first enable them for your current repository" ([GH: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)).
  - Astro's workflow never calls `configure-pages` ([Astro guide](https://docs.astro.build/en/guides/deploy/github/), [withastro/action action.yml](https://github.com/withastro/action/blob/main/action.yml)).
  - Even if it did, `configure-pages`' `enablement` input "requires a token other than `GITHUB_TOKEN`" (a PAT or a GitHub App) ([configure-pages action.yml](https://github.com/actions/configure-pages/blob/main/action.yml)). That would bring back the token you are trying to avoid.
  - If Pages is not enabled, `deploy-pages` fails with `Failed to create deployment (status: 404) … Ensure GitHub Pages has been enabled: <repo>/settings/pages` ([deploy-pages source](https://github.com/actions/deploy-pages/blob/main/src/internal/deployment.js)).
  - The docs disagree on order. Astro lists the Source step *after* adding the workflow ([Astro guide](https://docs.astro.build/en/guides/deploy/github/)). Hugo and Vite list it *first* ([Hugo](https://gohugo.io/host-and-deploy/host-on-github-pages/), [Vite](https://vite.dev/guide/static-deploy#github-pages)). Doing it first avoids a failed first run.
  - **API alternative:** `POST /repos/{owner}/{repo}/pages` with `build_type: "workflow"`. The caller must be a repo admin or maintainer, and OAuth or classic PAT tokens need the `repo` scope ([GH REST: Pages](https://docs.github.com/en/rest/pages/pages)). gh's login token includes `repo` by default ([gh authflow](https://github.com/cli/cli/blob/trunk/internal/authflow/flow.go)). **Untested here.**

## 3. Local auth for pushing from the Mac (git present, no `gh`, Homebrew unknown)

| Option | Extra install | Token handling | Verdict |
|---|---|---|---|
| **GitHub CLI** (`gh auth login`, HTTPS) | `brew install gh` | Browser login plus a one-time code. gh stores and uses the token; the user never sees it. | **Recommended** |
| Git Credential Manager | `brew install git` + `brew install --cask git-credential-manager` | Browser OAuth; stored in the macOS keychain ([GH: Caching credentials](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)) | Good, but it can't create repos or enable Pages |
| HTTPS + `osxkeychain` + PAT | none | You must create a PAT and type it at git's password prompt ([GH: About remote repos](https://docs.github.com/en/get-started/git-basics/about-remote-repositories)). GitHub recommends SSH or GCM instead ([GH: macOS Keychain](https://docs.github.com/en/get-started/git-basics/updating-credentials-from-the-macos-keychain)). A classic PAT also needs the `workflow` scope to push `.github/workflows/*` ([GH: OAuth scopes](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps)). | Avoid |
| SSH key | none (macOS `ssh-keygen`, `ssh-add`) | No token. The *public* key is pasted into GitHub's web UI. | Best fallback without Homebrew |

### Recommended path: GitHub CLI

- **Install.** `brew install gh` is the officially recommended macOS method ([install_macos.md](https://github.com/cli/cli/blob/trunk/docs/install_macos.md)).
  - Alternative: the precompiled binaries or universal installer on the releases page. The docs note that the macOS `.pkg` installers are unsigned ([same](https://github.com/cli/cli/blob/trunk/docs/install_macos.md)).
  - The latest release is v2.101.0 ([cli/cli releases](https://github.com/cli/cli/releases/latest)).
  - **Unverified:** how to install Homebrew itself. brew.sh is outside the allowed sources.
- **`gh auth login`** ([login help text](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/login/login.go), [manual](https://cli.github.com/manual/gh_auth_login), [GH: gh quickstart](https://docs.github.com/en/github-cli/github-cli/quickstart)):
  - The default mode is a web-browser flow. The token is "stored securely in the system credential store", with a plain-text fallback if no store is available.
  - gh prints "First copy your one-time code: …" and then opens the GitHub login URL ([authflow](https://github.com/cli/cli/blob/trunk/internal/authflow/flow.go)).
  - The prompts only appear in an interactive terminal (a TTY) ([login.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/login/login.go)). So **the human runs it**; the agent's shell can't answer the prompts.
- **Does it set up git's credential helper? Yes**, if you pick HTTPS and answer "yes" to "Authenticate Git with your GitHub credentials?" ([GH: Caching credentials](https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git)). According to the source:
  - gh adds the `workflow` scope, so pushing workflow files works.
  - If no credential helper is configured, it registers `gh auth git-credential` globally for github.com. Otherwise it hands the token to the helper you already have ([git_credential.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/shared/git_credential.go), [helper_config.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/shared/gitcredentials/helper_config.go)).
  - Base scopes are `repo`, `read:org`, and `gist` ([flow.go](https://github.com/cli/cli/blob/trunk/internal/authflow/flow.go)).
  - To repair later: `gh auth setup-git` sets up the helper ([setupgit.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/setupgit/setupgit.go)), and `gh auth refresh --scopes workflow` adds the scope ([refresh.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/refresh/refresh.go)).
- **Create the repo and push:** `gh repo create <name> --public --source=. --remote=origin --push` ([create.go](https://github.com/cli/cli/blob/trunk/pkg/cmd/repo/create/create.go), [manual](https://cli.github.com/manual/gh_repo_create), [GH: Adding local code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)):
  - `--public`: running non-interactively requires a name plus one of `--public`, `--private`, or `--internal`. The owner defaults to the logged-in user.
  - `--source=.`: must point to an existing git repo; otherwise gh says "Run `git init`".
  - `--remote`: the remote name, which defaults to `origin`.
  - `--push`: pushes `HEAD` and fails if there are no commits. It only works together with `--source`.
- **Default branch.** Run `git init -b main` (needs Git 2.28 or later) ([GH: Adding local code](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)). The branch must match the workflow's `branches: [ main ]` trigger ([Astro guide](https://docs.astro.build/en/guides/deploy/github/)).

### SSH fallback (no Homebrew, no tokens)

Source for these steps unless noted: [GH: Generate SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent).

1. Generate a key: `ssh-keygen -t ed25519 -C "you@example.com"` and set a passphrase.
2. Add these lines to `~/.ssh/config`:
   ```
   Host github.com
     AddKeysToAgent yes
     UseKeychain yes
     IdentityFile ~/.ssh/id_ed25519
   ```
3. Load the key into the agent: `ssh-add --apple-use-keychain ~/.ssh/id_ed25519`.
4. Copy the **public** key with `pbcopy < ~/.ssh/id_ed25519.pub`. Paste it in GitHub under Settings → SSH and GPG keys → New SSH key ([GH: Add SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)).
5. Test the connection: `ssh -T git@github.com` ([GH: Test SSH](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection)).
6. Create the repo in the web UI, then `git remote add origin git@github.com:<user>/<repo>.git` and `git push -u origin main`.

**Verdict:** For a non-expert, the GitHub CLI route is the simplest and safest. It means one browser login, the token is never shown, and git is configured automatically, including the `workflow` scope. The same tool then creates the repo and can re-run workflows. If Homebrew isn't available, use SSH.

---

## 4. Framework options (static output only)

### 4.1 Current stable versions (as of 2026-09-26)

| Tool | Current stable | Published | Source |
|---|---|---|---|
| Astro | **7.3.5** (7.0.0: 2026-06-22) | 2026-09-24 | [npm: astro](https://registry.npmjs.org/astro) |
| create-astro | 5.2.4 | 2026-08-24 | [npm: create-astro](https://registry.npmjs.org/create-astro) |
| Next.js | **16.3.6** (16.0.0: 2025-10-22) | 2026-09-22 | [npm: next](https://registry.npmjs.org/next) |
| Vite | **8.3.1** (8.0.0: 2026-03-12) | 2026-09-24 | [npm: vite](https://registry.npmjs.org/vite) |
| React / @vitejs/plugin-react | 19.3.0 / 6.1.1 | 2026-09-09 / 2026-08-28 | [npm: react](https://registry.npmjs.org/react), [npm: @vitejs/plugin-react](https://registry.npmjs.org/@vitejs/plugin-react) |
| Hugo | **v0.166.0** (Hugo is still on 0.x) | 2026-09-09 | [gohugoio/hugo releases](https://github.com/gohugoio/hugo/releases/latest) |
| Jekyll | **4.4.1** | 2025-01-29 | [jekyll/jekyll releases](https://github.com/jekyll/jekyll/releases/latest) |
| Jekyll used by the native Pages build | 3.10.0 (`github-pages` gem 232) | n/a | [pages.github.com/versions.json](https://pages.github.com/versions.json) |

### 4.2 Astro (recommended)

**Official workflow** at `.github/workflows/deploy.yml`, copied verbatim from [docs.astro.build/en/guides/deploy/github/](https://docs.astro.build/en/guides/deploy/github/). The [withastro/action README](https://github.com/withastro/action) shows the same versions.

```yaml
name: Deploy to GitHub Pages

on:
  # Trigger the workflow every time you push to the `main` branch
  # Using a different branch name? Replace `main` with your branch’s name
  push:
    branches: [ main ]
  # Allows you to run this workflow manually from the Actions tab on GitHub.
  workflow_dispatch:

# Allow this job to clone the repo and create a page deployment
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout your repository using git
        uses: actions/checkout@v7
      - name: Install, build, and upload your site
        uses: withastro/action@v6
        # with:
          # path: . # The root location of your Astro project inside the repository. (optional)
          # node-version: 24 # The specific version of Node that should be used to build your site. Defaults to 24. (optional)
          # package-manager: pnpm@latest # The Node package manager that should be used to install dependencies and build your site. Automatically detected based on your lockfile. (optional)
          # build-cmd: pnpm run build # The command to run to build your site. Runs the package build script/task by default. (optional)
        # env:
          # PUBLIC_POKEAPI: 'https://pokeapi.co/api/v2' # Use single quotation marks for the variable value. (optional)

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

**Action versions.** All three major tags (`v7`, `v6`, `v5`) exist and point at the latest releases:

| Action | Tag in Astro workflow | Latest release |
|---|---|---|
| `actions/checkout` | `@v7` | v7.0.1 (2026-07-20) ([releases](https://github.com/actions/checkout/releases)) |
| `withastro/action` | `@v6` | v6.1.3 (2026-09-14) ([releases](https://github.com/withastro/action/releases)) |
| `actions/deploy-pages` | `@v5` | v5.0.1 (2026-09-01); v5 moved to the Node 24 runtime ([releases](https://github.com/actions/deploy-pages/releases)) |
| *Inside withastro/action:* `actions/upload-pages-artifact` | v5 (SHA-pinned) | v5.0.0 (2026-04-10) ([releases](https://github.com/actions/upload-pages-artifact/releases)) |
| *Inside withastro/action:* `actions/setup-node` | v7.0.0 (SHA-pinned) | v7.0.0 (2026-07-14) ([action.yml](https://github.com/withastro/action/blob/main/action.yml)) |
| `actions/configure-pages` (not used by Astro) | n/a | v6.0.0 (2026-03-25) ([releases](https://github.com/actions/configure-pages/releases)) |

**Workflow notes:**
- **What withastro/action does** ([action.yml](https://github.com/withastro/action/blob/main/action.yml)):
  - Default `node-version` is `24`.
  - It detects the package manager from the lockfile and **fails with "No lockfile found" if there is none**, so commit `package-lock.json`. The [Astro guide](https://docs.astro.build/en/guides/deploy/github/) says the same.
  - It uploads `dist/` with `include-hidden-files: true`.
- **GitHub's own docs show older tags** (`checkout@v6`, `configure-pages@v5`, `upload-pages-artifact@v4`, `deploy-pages@v4`) ([GH: Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)). Newer majors have been released since (table above).
- **GitHub's suggested Astro starter is outdated.** It uses `checkout@v4` and `setup-node@v4` with `node-version: "20"` ([starter-workflows/pages/astro.yml](https://github.com/actions/starter-workflows/blob/main/pages/astro.yml)). Astro 7 needs Node >= 22.12.0, and its CLI exits with "Node.js v20… is not supported by Astro!" ([bin/astro.mjs](https://github.com/withastro/astro/blob/main/packages/astro/bin/astro.mjs)).
- *Optional hardening:* GitHub's starter adds `concurrency: { group: "pages", cancel-in-progress: false }` so deploys don't overlap ([starter workflow](https://github.com/actions/starter-workflows/blob/main/pages/astro.yml)). Vite's docs pin actions by commit SHA ([Vite workflow file](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy-github-pages.yaml)).

**`site` / `base` settings** ([Astro guide](https://docs.astro.build/en/guides/deploy/github/)):

| Scenario | Repo | URL | `astro.config.mjs` |
|---|---|---|---|
| **User site** (recommended) | `<username>.github.io` | `https://<username>.github.io/` | `site: 'https://<username>.github.io'`, **no `base`** |
| Project site | e.g. `cv` | `https://<username>.github.io/cv/` | `site: 'https://<username>.github.io'`, `base: '/cv'` |
| Custom domain | any | `https://example.com/` | `site: 'https://example.com'`, **remove `base`** |

- A project site under a user site that has a custom domain would presumably need `site: '<custom domain>'` plus `base: '/<repo>'` (see §1.1). **Unverified:** Astro's docs don't cover this combination.
- `site` is used for the sitemap and canonical URLs ([config: site](https://docs.astro.build/en/reference/configuration-reference/#site)).
- Instead of the config file, `astro build --site <url> --base <path>` overrides both values. GitHub's starter feeds these from `configure-pages` outputs ([Astro CLI: common flags](https://docs.astro.build/en/reference/cli-reference/), [starter workflow](https://github.com/actions/starter-workflows/blob/main/pages/astro.yml)).

**How `base` affects URLs:**
- Astro treats `base` "as the root for your pages and assets both in development and in production build". `astro dev` also serves under `base` ([config: base](https://docs.astro.build/en/reference/configuration-reference/#base)).
- Astro-generated CSS and JS links are prefixed with `base` automatically ([ssr-element.ts `createAssetLink`](https://github.com/withastro/astro/blob/main/packages/astro/src/core/render/ssr-element.ts)).
- **URLs you write by hand must include `base`:**
  - Internal page links: `<a href="/my-repo/about">` ([Astro guide](https://docs.astro.build/en/guides/deploy/github/), [Routing](https://docs.astro.build/en/guides/routing/)).
  - Files in `public/`, which are copied as-is and referenced by URL path ([Imports](https://docs.astro.build/en/guides/imports/)).
  - Build these with `import.meta.env.BASE_URL` ([config: base](https://docs.astro.build/en/reference/configuration-reference/#base), [Env vars](https://docs.astro.build/en/guides/environment-variables/)).
- **`BASE_URL`'s trailing slash** follows `trailingSlash`: always present with `"always"` and never with `"never"` ([config: base](https://docs.astro.build/en/reference/configuration-reference/#base)). The behaviour under the default `'ignore'` isn't spelled out (**Unverified**), so join paths with a small helper.
- **The minimal template hard-codes `/favicon.svg` and `/favicon.ico`**, which break on a project site unless prefixed ([examples/minimal/src/pages/index.astro](https://github.com/withastro/astro/blob/main/examples/minimal/src/pages/index.astro)).
- In-page anchors (`href="#experience"`) are not affected by `base`. This is standard URL resolution, not an Astro-specific documented claim.
- With a **user site**, none of these adjustments are needed. That is the main reason to prefer it.

### 4.3 Next.js static export (Next 16)

Source for everything in this section unless noted: [Next.js: Static exports](https://nextjs.org/docs/app/guides/static-exports) (docs version 16.3.6).

- **Enable export:** set `output: 'export'` in `next.config.js`. `next build` then writes the site to `out/`.
- **Unsupported features:** Image Optimization with the default loader, Server Actions, ISR, cookies, rewrites, redirects, headers, proxy, dynamic routes without `generateStaticParams()`, Draft Mode, intercepting routes, and Route Handlers that read the request.
- **Images:** use a custom `images.loader`, or set `images: { unoptimized: true }` globally (available since 12.3.0) ([Next Image: unoptimized](https://nextjs.org/docs/app/api-reference/components/image#unoptimized)).
- **Project site:** set `basePath: '/<repo>'` ([Next: basePath](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath)).
  - It is set at build time and inlined into the client bundles.
  - `next/link` adds the prefix automatically.
  - `next/image` `src` must include `basePath` manually.
- **Node:** `engines.node` is `>=20.9.0` ([npm: next](https://registry.npmjs.org/next)).
- **GitHub Pages:** the Next docs point to a template repo (`github.com/nextjs/deploy-github-pages`). That repo was not reviewed (outside the allowed sources).

### 4.4 Vite + React (Vite 8)

Source for everything in this section unless noted: [Vite: Deploying a static site → GitHub Pages](https://vite.dev/guide/static-deploy#github-pages).

- **`base` setting:**
  - User site or custom domain: `base: '/'`, which is the default.
  - Project site: `base: '/<REPO>/'`.
- **Order:** Vite's guide says to enable Settings → Pages → Source → GitHub Actions first, then add the workflow.
- **Vite's sample workflow** ([YAML source](https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy-github-pages.yaml)):
  - Runs `npm ci`, then `npm run build`, then uploads `./dist`.
  - Pins actions by SHA: checkout v7, setup-node v7 (`node-version: lts/*`), configure-pages v6, upload-pages-artifact v5, deploy-pages v5.
  - The SHAs match those release tags: checkout `3d3c42e…` is v7.0.1, deploy-pages `368f825…` is v5.0.1, configure-pages `45bfe01…` is v6.0.0, upload-pages-artifact `fc324d3…` is v5.0.0 ([actions/checkout releases](https://github.com/actions/checkout/releases), [actions/deploy-pages releases](https://github.com/actions/deploy-pages/releases)).
- **Node:** Vite's `engines.node` is `^20.19.0 || >=22.12.0` ([npm: vite](https://registry.npmjs.org/vite)).
- **Judgment:** a plain Vite + React app renders in the browser. For a text-only CV that is more machinery than Astro, which ships static HTML.

### 4.5 Hugo (v0.166.0)

Source for everything in this section: [Hugo: Host on GitHub Pages](https://gohugo.io/host-and-deploy/host-on-github-pages/).

- **Step 1 is setting Settings → Pages → Source to GitHub Actions.** "The change is immediate; you do not have to press a Save button."
- **Workflow:** `.github/workflows/hugo.yaml` with `HUGO_VERSION: 0.166.0`.
  - Uses `checkout@v7`, `configure-pages@v6`, `setup-go@v7`, `setup-node@v7`, `cache@v6`, `upload-pages-artifact@v5`, and `deploy-pages@v5`.
  - Builds with `--baseURL "${{ steps.pages.outputs.base_url }}/"`, so user and project paths are handled automatically.

### 4.6 Jekyll (4.4.1; the native Pages build uses 3.10.0)

- **The native branch build is locked down** ([GH: About Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)):
  - Some settings can't be changed (`safe: true`, `lsi: false`, `highlighter: rouge`, …).
  - Some plugins are always on.
  - Extra plugins must come from the supported list. "GitHub Pages cannot build sites using unsupported plugins."
  - Versions come from [pages.github.com/versions.json](https://pages.github.com/versions.json) (Jekyll 3.10.0, `github-pages` 232).
- GitHub's docs now say "GitHub Actions is now the recommended approach" even for Jekyll ([same](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)).
- With Actions you can use any Jekyll version and any plugins ([Jekyll: GitHub Actions](https://jekyllrb.com/docs/continuous-integration/github-actions/)).
- For project-site URLs, use the `relative_url` filter ([Jekyll: GitHub Pages](https://jekyllrb.com/docs/github-pages/)).

### 4.7 Is `.nojekyll` needed with the Actions artifact method? No.

- **Jekyll only runs on branch publishing.** "If you publish your site from a source branch, GitHub Pages will use Jekyll to build your site by default … disable the Jekyll build process by creating an empty file called `.nojekyll`" ([GH: Creating a site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)).
- **External CI tools that push to `gh-pages`** "typically include a `.nojekyll` file" ([GH: Publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)).
- **Why it mattered:** Jekyll skips files and folders that start with `_` ([GH: About Pages and Jekyll](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll)). Astro puts its assets in `_astro/` by default ([config: build.assets](https://docs.astro.build/en/reference/configuration-reference/#buildassets)).
- **The Actions flow skips Jekyll.** Your built folder is uploaded as an artifact and `deploy-pages` deploys that artifact ([deploy-pages README](https://github.com/actions/deploy-pages)). The Astro, Vite, and Hugo Actions guides never mention `.nojekyll`.
- **The file wouldn't even be uploaded by default:** `upload-pages-artifact` excludes dotfiles unless `include-hidden-files: true` ([upload-pages-artifact action.yml](https://github.com/actions/upload-pages-artifact/blob/main/action.yml)).
- No GitHub page says "not needed for Actions" in one sentence. The conclusion is inferred from the sources above.

---

## 5. Node.js

| Line | Status on 2026-09-26 | Key dates |
|---|---|---|
| **24 "Krypton"** | **Active LTS**; latest 24.21.0 (2026-09-07) | LTS since 2025-10-28 → Maintenance from 2026-10-20 → EOL 2028-04-30 |
| 26 | Current; latest 26.10.0 (2026-09-21) | Released 2026-05-05; LTS planned for 2026-10-28 |
| 25 | **End-of-life** since 2026-06-01; last release 25.9.0 (2026-03-31) | n/a |
| 22 "Jod" | Maintenance LTS | EOL 2027-04-30 |
| 20 | EOL (2026-04-30) | n/a |

Sources: [nodejs/Release schedule.json](https://github.com/nodejs/Release/blob/main/schedule.json), [nodejs.org: Previous releases](https://nodejs.org/en/about/previous-releases), [nodejs.org/dist/index.json](https://nodejs.org/dist/index.json). The [download page](https://nodejs.org/en/download) offers v24.21.0 LTS by default.

- nodejs.org: "Production applications should only use *Active LTS* or *Maintenance LTS* releases" ([Previous releases](https://nodejs.org/en/about/previous-releases)).
- From Node 27 on, releases are yearly and every major becomes LTS ([same](https://nodejs.org/en/about/previous-releases)).
- **Is Node 25 accepted by Astro 7.3.5? Mechanically yes, officially no:**
  - **`engines.node` is `>=22.12.0`** ([npm: astro](https://registry.npmjs.org/astro), [packages/astro/package.json](https://github.com/withastro/astro/blob/main/packages/astro/package.json)), and that range includes 25. Astro 6.0 allowed `^20.19.1 || >=22.12.0`; Astro 7.0 dropped Node 20 ([npm: astro](https://registry.npmjs.org/astro)).
  - **The CLI only runs its version check for majors 23 and below** (`skipSemverCheckIfAbove = 23`), so Node 25 starts without an error ([bin/astro.mjs](https://github.com/withastro/astro/blob/main/packages/astro/bin/astro.mjs)).
  - **Astro's docs:** "Node.js - `v22.12.0` or higher. Odd-numbered versions like `v23` are not supported" ([Astro: Install](https://docs.astro.build/en/install-and-setup/)).
  - Node 25 is also EOL.
  - **Conclusion:** use **Node 24** locally, which matches withastro/action's default of `24` ([action.yml](https://github.com/withastro/action/blob/main/action.yml)).

## 6. Astro specifics for a one-page site

### 6.1 Version

- **Astro 7** is current; 7.3.5 is `latest` ([npm](https://registry.npmjs.org/astro)).
- Astro 7 changes: it moved to Vite 8, added a Rust compiler, made a new Markdown processor the default, and changed the default `compressHTML` to `'jsx'` ([Upgrade to v7](https://docs.astro.build/en/guides/upgrade-to/v7/)).

### 6.2 Non-interactive scaffold

Flags ([create-astro README](https://github.com/withastro/astro/blob/main/packages/create-astro/README.md)):

| Flag | Meaning |
|---|---|
| `--template <name>` | Which template to use |
| `--install` / `--no-install` | Install dependencies or not |
| `--git` / `--no-git` | Initialize a git repo or not |
| `--add <integrations>` | Add integrations |
| `--no-ai` | Don't create AI agent files |
| `--yes` / `-y` | Accept all defaults |
| `--no` / `-n` | Decline all defaults |
| `--dry-run` | Walk through the steps without doing anything |
| `--skip-houston` | Skip the mascot animation |
| `--ref` | Use a specific Astro branch |
| `--fancy` | Full Unicode support on Windows |

Minimal, non-interactive, in the current folder:

```sh
npm create astro@latest . -- --template minimal --install --no-git --no-ai --skip-houston --yes
git init -b main
```

- **Always pass `--template minimal`.** With `--yes` and no template, create-astro uses `basics` ([template.ts](https://github.com/withastro/astro/blob/main/packages/create-astro/src/actions/template.ts)). Minimal is the "Use minimal (empty) template" option, and Astro's docs show the `npm create astro@latest -- --template <name>` form ([Astro: Install](https://docs.astro.build/en/install-and-setup/)).
- **The target folder must count as "empty".** If it isn't and you pass `--yes`, create-astro silently scaffolds into a **randomly named subfolder** ([project-name.ts](https://github.com/withastro/astro/blob/main/packages/create-astro/src/actions/project-name.ts)).
  - Ignored names: `.DS_Store`, `.git`, `.gitignore`, `.gitattributes`, `.gitkeep`, `.idea`, `.npmignore`, `.yarn`, `.yarnrc.yml`, `docs`, `LICENSE`, `mkdocs.yml`, `Thumbs.db`, and log files ([shared.ts](https://github.com/withastro/astro/blob/main/packages/create-astro/src/actions/shared.ts)).
  - So this `docs/` folder is fine. A `README.md`, `CLAUDE.md`, or `.claude/` would make the folder non-empty.
- **Without `--no-ai`**, create-astro writes `AGENTS.md` plus a `CLAUDE.md` symlink ([template.ts](https://github.com/withastro/astro/blob/main/packages/create-astro/src/actions/template.ts)).
- **With `--git`**, it makes the first commit as `houston[bot]` on git's default branch ([git.ts](https://github.com/withastro/astro/blob/main/packages/create-astro/src/actions/git.ts)). That is why the command above uses `--no-git` + `git init -b main`.
- **What you get:** the minimal template has one page (`src/pages/index.astro`), an empty `defineConfig({})`, `tsconfig` extending `astro/tsconfigs/strict`, and `engines.node >=22.12.0` ([examples/minimal](https://github.com/withastro/astro/tree/main/examples/minimal)).

### 6.3 Fonts

- **Stable built-in Fonts API:** the top-level `fonts` config option, stable since astro@6.0.0 ([config: fonts](https://docs.astro.build/en/reference/configuration-reference/#fonts)). Each font needs a `name`, a `cssVariable`, and a `provider`.
- **Built-in providers:** Adobe, Bunny, Fontshare, Fontsource, Google, Google Icons, NPM, and local files ([Fonts guide](https://docs.astro.build/en/guides/fonts/), [Font provider reference](https://docs.astro.build/en/reference/font-provider-reference/)).
- **Self-hosted:** Astro downloads and caches the fonts and serves them from your own site. You get preload links and optimized fallbacks ([Fonts guide](https://docs.astro.build/en/guides/fonts/)).
- **Usage:** put `<Font cssVariable="--font-x" />` (from `astro:assets`) in `<head>`, optionally with `preload`, then use `font-family: var(--font-x)` in CSS ([same](https://docs.astro.build/en/guides/fonts/)).
- **Example:** `fonts: [{ provider: fontProviders.fontsource(), name: "Roboto", cssVariable: "--font-roboto" }]`, with `fontProviders` imported from `astro/config` ([same](https://docs.astro.build/en/guides/fonts/)).
- **@fontsource packages** are still supported, through `fontProviders.npm()`. It resolves `@fontsource/*` and `@fontsource-variable/*` from `node_modules`, falling back to a CDN unless `remote: false` ([Font provider reference: NPM](https://docs.astro.build/en/reference/font-provider-reference/)).

### 6.4 Profile data: content collection or a typed module?

- **The `file()` loader can hold a single profile, but awkwardly** ([Content collections](https://docs.astro.build/en/guides/content-collections/), [Loader reference](https://docs.astro.build/en/reference/content-loader-reference/)):
  - It loads *entries* from one JSON, YAML, or TOML file (available since 5.0).
  - The file must be an array of objects, each with a unique `id`, or an object keyed by id.
  - So a single profile would be `{ "profile": { … } }`, read with `getEntry('profile', 'profile')`.
  - The schema uses `z` from `astro/zod`, a re-export that supports all of Zod 4.
  - TypeScript files are not a `file()` format. They would need a function loader that returns `[{ id, … }]` ([Loader reference](https://docs.astro.build/en/reference/content-loader-reference/)).
- **Astro's own guidance:** "Collections may not be your solution if: You have only one or a small number of different content pages" ([Content collections: when not to](https://docs.astro.build/en/guides/content-collections/)).
- **Simpler idiom (recommended):** a plain typed module such as `src/data/profile.ts` that exports a typed object and is imported into `index.astro`.
  - Astro imports `.ts` natively ([Imports](https://docs.astro.build/en/guides/imports/)).
  - Astro does not type-check during build. Add `astro check && astro build` to the build script so type errors fail CI ([TypeScript guide](https://docs.astro.build/en/guides/typescript/), [CLI: astro check](https://docs.astro.build/en/reference/cli-reference/)).
  - If you would rather keep the data in JSON, Astro imports `.json` directly ([Imports](https://docs.astro.build/en/guides/imports/)). You can validate it with a `z` schema from `astro/zod`.

---

## Open questions / not verified

- **Homebrew:** how to install it and whether it is already on this Mac. brew.sh is outside the allowed sources; check with `brew --version`.
- **Pages enablement via `gh api`** (`POST /repos/{owner}/{repo}/pages`, `build_type=workflow`): documented, but not executed here.
- **`import.meta.env.BASE_URL` trailing slash** under the default `trailingSlash: 'ignore'`: not explicitly documented.
- **`site`/`base` for a project site under a custom-domain user site:** inferred, not documented by Astro.
- **Next.js's GitHub Pages template repo:** not reviewed.
- **The local Git version:** not checked. `git init -b` needs Git 2.28 or later.

## Sources

**GitHub docs and GitHub-owned data**
- https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages
- https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll
- https://github.com/github/docs/blob/main/data/reusables/gated-features/pages.md
- https://docs.github.com/en/rest/pages/pages
- https://docs.github.com/en/actions/concepts/security/github_token
- https://docs.github.com/en/actions/tutorials/authenticate-with-github_token
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions
- https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/scopes-for-oauth-apps
- https://docs.github.com/en/get-started/git-basics/caching-your-github-credentials-in-git
- https://docs.github.com/en/get-started/git-basics/about-remote-repositories
- https://docs.github.com/en/get-started/git-basics/updating-credentials-from-the-macos-keychain
- https://docs.github.com/en/github-cli/github-cli/quickstart
- https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent
- https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account
- https://docs.github.com/en/authentication/connecting-to-github-with-ssh/testing-your-ssh-connection
- https://pages.github.com/versions.json

**GitHub CLI (cli/cli source and manual)**
- https://github.com/cli/cli/blob/trunk/docs/install_macos.md
- https://github.com/cli/cli/releases/latest
- https://cli.github.com/manual/gh_auth_login
- https://cli.github.com/manual/gh_repo_create
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/login/login.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/shared/login_flow.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/shared/git_credential.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/shared/gitcredentials/helper_config.go
- https://github.com/cli/cli/blob/trunk/internal/authflow/flow.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/setupgit/setupgit.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/refresh/refresh.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/auth/status/status.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/repo/create/create.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/api/api.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/workflow/run/run.go
- https://github.com/cli/cli/blob/trunk/pkg/cmd/run/rerun/rerun.go

**GitHub Actions**
- https://github.com/withastro/action (README, [action.yml](https://github.com/withastro/action/blob/main/action.yml), [releases](https://github.com/withastro/action/releases))
- https://github.com/actions/checkout/releases
- https://github.com/actions/deploy-pages (README, [releases](https://github.com/actions/deploy-pages/releases), [src/internal/deployment.js](https://github.com/actions/deploy-pages/blob/main/src/internal/deployment.js))
- https://github.com/actions/upload-pages-artifact (README, [action.yml](https://github.com/actions/upload-pages-artifact/blob/main/action.yml), [releases](https://github.com/actions/upload-pages-artifact/releases))
- https://github.com/actions/configure-pages/blob/main/action.yml ([releases](https://github.com/actions/configure-pages/releases))
- https://github.com/actions/starter-workflows/blob/main/pages/astro.yml

**Astro**
- https://docs.astro.build/en/guides/deploy/github/
- https://docs.astro.build/en/install-and-setup/
- https://docs.astro.build/en/reference/configuration-reference/
- https://docs.astro.build/en/reference/cli-reference/
- https://docs.astro.build/en/guides/fonts/
- https://docs.astro.build/en/reference/font-provider-reference/
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/reference/content-loader-reference/
- https://docs.astro.build/en/guides/imports/
- https://docs.astro.build/en/guides/routing/
- https://docs.astro.build/en/guides/environment-variables/
- https://docs.astro.build/en/guides/typescript/
- https://docs.astro.build/en/guides/upgrade-to/v7/
- https://docs.astro.build/en/concepts/why-astro/
- https://github.com/withastro/astro/blob/main/packages/create-astro/README.md (and `src/actions/{context,template,project-name,shared,git}.ts`)
- https://github.com/withastro/astro/tree/main/examples/minimal
- https://github.com/withastro/astro/blob/main/packages/astro/package.json
- https://github.com/withastro/astro/blob/main/packages/astro/bin/astro.mjs
- https://github.com/withastro/astro/blob/main/packages/astro/src/core/render/ssr-element.ts

**npm registry**
- https://registry.npmjs.org/astro
- https://registry.npmjs.org/create-astro
- https://registry.npmjs.org/next
- https://registry.npmjs.org/vite
- https://registry.npmjs.org/react
- https://registry.npmjs.org/@vitejs/plugin-react

**Other frameworks**
- https://nextjs.org/docs/app/guides/static-exports
- https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath
- https://nextjs.org/docs/app/api-reference/components/image#unoptimized
- https://vite.dev/guide/static-deploy#github-pages
- https://github.com/vitejs/vite/blob/main/docs/guide/static-deploy-github-pages.yaml
- https://gohugo.io/host-and-deploy/host-on-github-pages/
- https://github.com/gohugoio/hugo/releases/latest
- https://jekyllrb.com/docs/github-pages/
- https://jekyllrb.com/docs/continuous-integration/github-actions/
- https://github.com/jekyll/jekyll/releases/latest

**Node.js**
- https://nodejs.org/en/about/previous-releases
- https://nodejs.org/en/download
- https://nodejs.org/dist/index.json
- https://github.com/nodejs/Release/blob/main/schedule.json
