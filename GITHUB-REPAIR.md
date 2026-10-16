# GitHub Pages repair and verification

16 October 2026. Repository: smithDaveSmith/white-light-healing-preview. The existing public Pages audience and main/root publishing method were preserved. The business domain and the separate concept host were not changed.

## Cause and change

All 53 uploaded website files exactly matched the V3.3 output. The original Pages deployment was successful. Root-relative URLs nevertheless requested account-root resources outside /white-light-healing-preview/.

Repair commit 1be6df7bc8871841ad5b5a8a3f8da9ec4db751b5 prefixes the 22 HTML documents, two application scripts and routes.json; updates preview structured-data URLs; adds .nojekyll, an export tool, a complete publishing guide and the browser harness. Initial repair: 26 files modified, 5 added, 0 deleted. Later commits contain test measurement corrections and evidence. Fonts, photographs, CSS, vendor libraries, layout, the phone UX fix and the external booking/contact targets are unchanged.

## Collected results

- 22 HTML documents, 999 internal URL/anchor checks: 0 failures.
- 27 asset files: 25 identical to the original upload; only the two application scripts change their URLs.
- 25 application output files: repeat-export and repository-rename checks pass without URL duplication or an old base.
- Python compile and both application-JavaScript syntax checks pass.
- Live Chromium: 21 routes × 360/390/834/1280/1440px = 105 viewports; 0 overflow cases, 0 captured application errors, 0 measured text-contrast failures; minimum normal text pair 5.65:1.
- 51 mobile selection cases pass, including reduced motion and absent GSAP. The selected photo and controls remain visible and focus is retained. Four portrait initial-booking viewports pass.
- 21 reduced-motion routes and 21 JavaScript-disabled routes pass.
- Programmatic visible-focus checks across all routes: 0 failures.
- Seven real top-level navigation observations pass: service-choice navigation, nested-page reload, contact, and four legacy/query redirects.
- The Pages deployment runs for the repair and the evidence updates are successful.

## Test measurement notes

The first full run recorded the loader already closed at one 120ms timed-open sample. Its activation is now captured synchronously, with the timed modal state recorded separately. A subsequent full run passed all route and mobile cases but sampled the main inert lock before its queued microtask: opening and Skip focus were true, while the early lock sample was false. The source applies that lock in the resolved DOM-ready promise, before the next paint. The final harness waits for that microtask before measuring the lock. These are changes to measurement, not to application behaviour. Earlier raw results remain in tools/browser-first-timed.json and tools/browser-full-verification.json.

Final focused results are recorded separately after the corrected measurement. Whole-site rendering results and direct navigation above come from the actual GitHub deployment, not from a local server.

## Limits

This is a Chromium lab check, not real-user data, a full WCAG certification or native Safari/iPhone/Android testing. Reduced motion is simulated; no-JS uses a script-disabled sandbox. No real booking, payment or email was submitted. The contact form remains a mailto draft. _headers and _redirects are host-specific source files and are not GitHub Pages server configuration; the retained legacy HTML/JavaScript paths are independently tested. Noindex HTML is retained. The project-level robots.txt does not control the account-root robots.txt.

See GITHUB-PAGES-GUIDE.md for the complete zero-to-publish and update process.
