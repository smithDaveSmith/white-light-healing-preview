# White Light Healing — GitHub Pages preview

Live preview: https://smithdavesmith.github.io/white-light-healing-preview/

This repository contains the ready-to-serve V3.3 website, including the original logo, GSAP and the corrected phone service chooser. It is an unofficial, noindex concept.

The upload was complete. The original package used domain-root paths such as `/assets/site.css` and `/reflexology/`. GitHub hosts this project under `/white-light-healing-preview/`, so those addresses requested files outside this repository. The repair adds that project prefix to HTML, application links, redirects and the route inventory. CSS, photographs, fonts and vendor libraries retain their original bytes.

**Pages settings for this repository:** Settings → Pages → Source: **Deploy from a branch** → Branch: **main** → Folder: **/(root)**. A commit to main triggers the built-in Pages deployment. No custom workflow or Run workflow button is required.

- [Full guide: from zero to a working preview](GITHUB-PAGES-GUIDE.md)
- [Reusable export tool](tools/prepare_github_pages.py)
- [Development-only browser checks](https://smithdavesmith.github.io/white-light-healing-preview/tools/pages-check.html)

For ordinary edits to this already-prepared repository, commit the changes and push main. Do not overwrite it with the original unprepared dist folder: that would restore the broken root paths. Read the guide before using a different repository name.

Booking uses the existing external Acuity calendar. The contact form prepares an email draft; it does not send a message. No real bookings, payments or messages are made by the browser checks.
