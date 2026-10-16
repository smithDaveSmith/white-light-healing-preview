# From zero to a working GitHub Pages preview

This guide applies to a prebuilt static website: HTML, CSS, JavaScript, images and fonts. The current White Light Healing repository is already repaired and published; you do not need to repeat setup for it.

## 1. Understand the three parts

| Part | What it does |
|---|---|
| Project source | Editable templates, components and build commands. It may need a build before hosting. |
| Built website | The folder containing the final index.html and its assets. In the supplied White Light Healing source package this is dist/. |
| GitHub Pages | Publishes the selected built files as a website. The GitHub repository page itself is not the website URL. |

Python generated the HTML for this project before upload. Pages receives that HTML; it does not run the Python builder. A Node server, PHP application, database or WordPress installation needs a host that supports its runtime. A framework with a supported static export can still use Pages after that export is correctly configured.

## 2. Why this upload broke

All 53 website files matched the working V3.3 package, and the original Pages build succeeded. The problem was the URL base, not missing files or an unsuccessful deployment.

| Address in the package | Address the browser requested | Correct address for this repository |
|---|---|---|
| /assets/site.css | https://smithdavesmith.github.io/assets/site.css | https://smithdavesmith.github.io/white-light-healing-preview/assets/site.css |
| /reflexology/ | https://smithdavesmith.github.io/reflexology/ | https://smithdavesmith.github.io/white-light-healing-preview/reflexology/ |

A leading slash starts at the domain root. It does not mean the current repository. The same issue affected scripts, photographs, generated service links, legacy redirects and the homepage's blog query redirect. A green deployment only says the files were published; it does not prove their links are correct.

The repair updates 22 HTML documents, the two application scripts and routes.json, adds .nojekyll, and supplies this guide and the exporter. Fonts, photographs, CSS and vendor libraries are preserved. The external booking, phone and email addresses are preserved. No files were deleted.

## 3. Start a different static project

1. Choose the repository name first, for example **new-project-preview**. Its normal project-site address will be **https://YOURNAME.github.io/new-project-preview/**. The site must be prepared for that final base path.
2. Unzip the complete project source. Read its README. Run its documented build if one is required; do not assume every project uses the same command.
3. Find the built folder. For this project's source it is **dist/**, containing **index.html**, **assets/** and the page folders. A folder of JSX, Python or templates is not the final website output.
4. For a framework project, configure its own base path and router for the chosen repository, then build its static export. Do not apply this plain-HTML helper to an arbitrary JavaScript bundle.
5. For a similar vanilla static site using quoted root-relative URLs, use the reusable Python 3 exporter below. It has no third-party dependencies and writes to a new empty folder.

Copy **tools/prepare_github_pages.py** from this repository into a **tools** folder in your original project's source folder. From that source folder, this is the command for the original White Light Healing package:

```bash
python3 tools/prepare_github_pages.py --source dist --output github-ready --repository white-light-healing-preview --origin https://smithdavesmith.github.io --replace-origin https://white-light-healing-concept.dave-smith-tripadvis.chatgpt.site --app-script assets/site.js --app-script assets/arrival.js
```

For another similar project, change **--repository**, **--origin**, **--source**, any **--replace-origin**, and the actual **--app-script** filenames to that project's values. Each app-script must exist. List only your own small scripts containing page URLs; do not list GSAP, React or other third-party/bundled code. Omit replace-origin if there is no previous preview origin to change.

The exporter prefixes local HTML URLs, CSS URLs, the supplied application-script URL literals and the routes.json list. It copies images/fonts/vendor JS, preserves external URLs and writes .nojekyll. It recognises its own base markers when re-exporting an already-prepared copy. An account repository named YOURNAME.github.io uses / as its base automatically. Custom-domain deployments need their own correct origin/base configuration.

Use a separate empty output folder, such as **github-ready-v2** for a subsequent export. The tool refuses to overwrite a populated folder or write inside the source. It never deletes your original project. Review its exported URL and rewritten-file list before upload.

## 4. Upload with GitHub Desktop — useful for larger projects

1. Open GitHub Desktop and sign into the GitHub account that should own the preview.
2. For a new project, choose **File → New repository**, use the exact chosen name, select its local parent folder and create it. If the repository already exists online, use **File → Clone repository → URL**, paste its actual repository URL and clone it instead. Do not create a second repository for an existing project.
3. Open the local repository folder in Finder or File Explorer.
4. Copy the **contents** of the prepared **github-ready** folder into that repository folder. At the top level you should see **index.html**, **assets/**, the page folders and **.nojekyll**. Do not put the whole github-ready or dist folder one level deeper. Do not upload the full source ZIP as the website.
5. In GitHub Desktop, review the changed files. Enter a message such as **Publish initial preview**, then choose **Commit to main**.
6. For a new local repository choose **Publish repository**, confirm the intended name and public/private setting, then publish. For an existing cloned repository choose **Push origin**.

The browser upload interface supports up to 100 files at a time. GitHub Desktop avoids that per-upload selection limit and preserves version history. For a small project you may instead use GitHub's **Add file → Upload files** and upload the prepared folder's contents, preserving every subfolder.

## 5. Enable Pages once

1. Open the repository on github.com.
2. Select **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to **main** and **Folder** to **/(root)**, then **Save**.
5. Open the repository's **Actions** tab. Wait for the built-in **pages build and deployment** run to finish successfully.
6. Return to **Settings → Pages** and use **Visit site**. Share that website address, not the github.com repository address.

The branch mode offers /(root) or /docs, not an arbitrary dist folder. This guide uses the prepared files at root. A project that must build in Actions can instead use a custom deployment workflow, but that is a different setup. No workflow YAML or manual Run workflow button is needed for the branch mode used here.

For this repository, the exact settings address is https://github.com/smithDaveSmith/white-light-healing-preview/settings/pages and the live site is https://smithdavesmith.github.io/white-light-healing-preview/ .

## 6. Check the actual website

- Open the home page and a nested service page, then refresh the nested page.
- Check that photographs, fonts and styling load. In browser developer tools, inspect failed requests; a missing repository name before /assets is the same base-path problem.
- Follow navigation links. They should stay under /YOUR-REPOSITORY/ unless they intentionally open an external service.
- Check a narrow phone view and activate the actual controls. For this project, change Touch / Scent / Stillness, 60/90 minutes and the parent/baby choices.
- Open and close the mobile menu, then navigate with a keyboard and check visible focus.
- Check the form's real behaviour. This concept prepares a mailto draft; it does not have a sending backend. Do not make an unwanted real appointment to test the calendar.
- Keep the unofficial notice and noindex metadata on a concept preview. A robots.txt inside a project folder does not control the account's domain-root robots.txt; the HTML noindex is retained here.

## 7. Publish later changes

1. In GitHub Desktop, **Fetch origin** and pull any changes before editing.
2. Edit the correct source and rebuild if needed. Keep the same repository base. If exporting again, use a fresh output folder.
3. Copy the updated prepared website files into the cloned repository. Review the actual changes rather than deleting the repository.
4. **Commit to main → Push origin**.
5. Wait for the Pages run to succeed, then reload the live URL. If the browser retains old CSS/JS, use a hard refresh and check the latest deployment commit.

This already-repaired repository can be edited directly because it contains the finished output. Copying the original root-domain dist back over it would undo the path repair.

## Quick diagnosis

| Symptom | First thing to check |
|---|---|
| Pages 404 at the home URL | Pages enabled, correct main/root source, index.html at that source root, latest deployment successful |
| Plain text, no images, disabled controls | Failed CSS/JS/image URLs, especially missing /repository-name/ |
| Home works but service links fail | Internal links and script-generated links use the same base |
| Nested page fails on refresh | The real page directory/index.html exists; an SPA may require its framework-specific routing strategy |
| No Run workflow button | Expected in this branch-publishing setup; commits trigger the built-in Pages job |
| More than 100 upload files | Use GitHub Desktop instead of splitting files manually in the web uploader |
| Form looks correct but nothing arrives | Hosting static HTML does not create a submission backend |

Official references, checked 16 October 2026:

- https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop
- https://docs.github.com/en/desktop/adding-and-cloning-repositories/cloning-a-repository-from-github-to-github-desktop

GitHub Pages is being used here for an unofficial review preview. Review GitHub's hosting limits and the business's production needs before choosing it as a permanent commercial host: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits .
