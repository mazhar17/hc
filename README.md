# Hifz Companion — hosted HD edition (v1.20.16)

This folder is the **web-hosted edition** of Hifz Companion, split into small files so it can be
published on GitHub Pages (or any static host) — every file is well under GitHub's 25 MB upload limit.

```
index.html            the app (about 1.6 MB)
mushaf/hd/001.webp …  the 604 Madinah Mushaf pages in full colour (about 250 KB each, 146 MB in all)
sw.js                 the service worker that makes offline use possible (Settings → Data)
.nojekyll             tells GitHub Pages to serve the files as they are
Code.gs               the optional cloud-sync script for Google Apps Script (see below)
Hifz-Companion-User-Guide.html   the complete User Guide — one self-contained file, must sit
                      beside index.html (the app links to ./Hifz-Companion-User-Guide.html)
Hifz-Companion-Tutorial.pdf      the illustrated 21-page tutorial — must sit beside index.html
                      under exactly this name (the app links to ./Hifz-Companion-Tutorial.pdf)
```

The pages are delivered in several ZIP parts (`hifz-hd-pages-part1.zip` … ) because of upload limits.
Unzip them all into the same `mushaf/hd/` folder before uploading.

## Use it straight from a folder (no hosting)
Keep `index.html` and the `mushaf` folder together in one folder and double-click `index.html` —
the full-colour pages load from the folder beside it. (Only the pages are local; cloud sync and
audio still need internet. Audio falls back automatically from everyayah.com to cdn.islamic.network; Settings → Audio source → "Test audio sources" shows which one works on your network. For instant, offline playback use **Download audio** on the Week tab or Settings → **Audio Manager**, where you also choose the qari, the quality and whether downloads live in the browser or in a folder on your computer — nothing else to host.)

`mirror_audio.py` (in the source zip) can additionally copy the 64 kbps set into a second GitHub Pages repository to use as the fallback source; see the notes at the top of that script for the GitHub Pages size limits.

## Publish on GitHub Pages
1. Create a repository (for example `hifz-companion`).
2. Upload the app files first: *Add file → Upload files*, drag in `index.html`, `sw.js`, `.nojekyll`,
   `README.md`, `Code.gs`, *Commit changes*.
3. Upload the pages: the web uploader accepts **100 files per upload**, so do it in seven rounds.
   Each time choose *Add file → Upload files* and drag the **`mushaf` folder** itself (containing
   `hd/` with about 100 pages) — dragging the folder keeps the `mushaf/hd/` path. Commit, repeat with
   the next hundred pages. (If you have GitHub Desktop or `git`, one push does it all.)
4. *Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root) → Save.*
5. After a minute the app is live at `https://<your-username>.github.io/hifz-companion/`.
   It works on phones and tablets too, including iPhone and iPad, because it is served over the web.

## The tutorial PDF
The illustrated tutorial is published beside `index.html` and its public link is

    https://mazhar17.github.io/hc/Hifz-Companion-Tutorial.pdf

**This URL is stable and is shared by learners.** Inside the app it is reachable from
*Help → Get started with Hifz Companion* (read, download, copy the link, and share where the browser
supports it), from the footer on every tab, from the first-use welcome screen, and from the top of the
HTML User Guide. The app always links to it **relatively** (`./Hifz-Companion-Tutorial.pdf`), so a copy
of the site served from any host or from a local folder finds its own copy; only the link that is
displayed and copied for sharing is absolute.

### Replacing the PDF without breaking shared links
1. Keep the filename **exactly** `Hifz-Companion-Tutorial.pdf` — same spelling, same capitalisation.
   GitHub Pages is case-sensitive, and every link already shared points at this name.
2. Overwrite the file in the repository root (and in the source tree, where `build.py` copies it into
   `dist/hosted/`). Do not add a version number or a date to the name.
3. Update the tutorial's metadata line — see below — so the page count, size and revision date match
   the new file.
4. Rebuild and republish. The service worker does **not** cache PDFs, so a normal reload fetches the
   new one; no cache version bump is needed for the PDF alone.

If you ever must rename it, keep the old name in place as well, or shared links will break.

### Where the tutorial metadata is maintained
The visible "PDF · 21 pages · 2.1 MB · revised 10 September 2026" line lives in **one** place in the
source: `src/index.html`, in the Help card's `<p class="tut-meta">`. The same figures appear in the HTML
User Guide's introduction (`Hifz-Companion-User-Guide.html`, the "Prefer a printable tutorial" box) and
in this README. The sharing title, description and absolute URL used by *Copy tutorial link* and
*Share tutorial* are the `TUT_URL`, `TUT_TITLE` and `TUT_TEXT` constants in `src/ui.js`.
The figures come from the PDF itself (`pdfinfo Hifz-Companion-Tutorial.pdf`). The file states no app
version anywhere, so none is claimed for it — do not add one unless the PDF itself says so.

## Working without internet — Offline use
Once the site is live, open *Settings → Data → **Offline use*** on each device and tick the box: the
browser then keeps the app itself on that device, so it opens with no internet at all. The buttons
beside it keep the Mushaf pages you choose — this week's pages, everything you have memorised, or all
604 pages (about 146 MB). Recitation audio is kept separately in *Settings → Audio → Audio Manager*
and translations in *Settings → Mushaf → Meanings*. This needs `sw.js` to sit beside `index.html` on
the site, and it only works over https (GitHub Pages is fine).

The tutorial PDF is deliberately **not** kept offline for everyone: it is about 2 MB and most visitors
never open it, so `sw.js` passes every `.pdf` request straight to the network and never answers one
with the app's own page. Offline, and without a downloaded copy, the tutorial fails to load as a PDF
rather than silently showing the app in its place. **Downloading the tutorial saves a copy on your
device that you can read offline** — that is what *Download Tutorial* in Help is for.

## Same progress on every device — Cloud sync
GitHub Pages only serves the app; each browser keeps its own progress. To share progress between
your desktop, phone and tablet, install the small `Code.gs` script (in this folder) in your Google
account once — it stores your data as a file in **your** Google Drive:

1. Open https://script.new, delete the sample code, paste `Code.gs`, save.
2. *Project Settings → Script properties → KEY = a passphrase you choose.*
3. *Deploy → New deployment → Web app → Execute as: Me · Who has access: Anyone → Deploy*, authorise,
   copy the `/exec` URL.
4. In the app on each device: *Settings → Cloud sync* → paste URL + passphrase, tick *Sync on*, *Test*.

The app loads the newest data on start and saves a few seconds after every change. A dated backup is
kept in your Drive folder for 30 days. Keep the URL and passphrase private.

`Code.gs` is **source code for you to paste into Apps Script** — GitHub Pages never runs it; it only
serves it as a file. If you upload this folder to a public repository, anyone can read `Code.gs`
(that is harmless — it contains no secret; your passphrase lives only in your own Script properties
and in each device's settings).

### How conflicts are handled (updated 2026-09)
Each save carries the **revision** it was based on, and your Apps Script accepts it only if that is
still the current revision. A device whose clock is wrong can no longer overwrite work it never saw.
When two devices have both changed something, the second one is **refused and nothing is
overwritten** — the app shows *Settings → Cloud sync → “This device could not save”* with four
choices: download this device's data, take the cloud copy (the replaced data is still recoverable
under *Restore the data this device had before the last cloud load*), overwrite the cloud with this
device, or decide later. **Nothing is ever merged automatically** — page ratings and weekly plans
cannot be combined without guessing.

*Decide later* is **sticky**: that device stays paused across reloads, browser restarts and
reconnections until you pick one of the other three. The choice is per device; the other device
keeps syncing normally.

**Looking is not adopting.** A device's base revision advances only when it has actually taken the
cloud copy into its own record, or when the cloud has accepted a save from it. Opening the app,
pressing *Test connection*, or a background poll never advances it — so a device can never gain the
right to overwrite a state whose contents it never loaded.

The same applies the first time a device with its own existing record connects to a cloud that
already has one: neither is touched until you choose.

### Updating the script — do this in order
1. **First** open the app on **every** device you sync so each one has version 1.20.9 or newer.
2. **Then** paste the new `Code.gs` over the old one in Apps Script and
   *Deploy → Manage deployments → edit → Version: New → Deploy*.

Your existing `state.json` needs no conversion: it is read as revision 0 and becomes revision 1 on
the next save. If you redeploy first, a device still on an older app version is told to update
before it can upload — its data is safe, it just cannot save to the cloud until updated. The app
also warns you (*Test connection*) if the app has been updated but the script has not.

### What the script keeps in your Drive folder
Besides the live `state.json`:

* **A daily baseline**, `state-YYYY-MM-DD.json`, holding the state as it was at the **first** save of
  that day. It is written only if that day's file does not already exist, so later saves can never
  overwrite the very copy the backup exists to preserve. The newest **30** are kept.
* **A displaced copy**, `displaced-rev<N>-<timestamp>.json`, written whenever you deliberately choose
  *Overwrite the cloud with this device*. The cloud state you replaced is kept under its own name and
  can be recovered from Drive. The newest **20** are kept.

A backup that fails to write never makes a successful save look like a failure: the save is reported
as saved, with the backup problem noted separately.

### What sync and JSON backups contain
Your plan, pages, ratings, reviews, weeks, notes, stumbles, highlights and minutes — the same data
as *Export data only (JSON)*. **Voice recordings are never included**: they stay in this browser's
storage on this device only, and are not uploaded, synced or exported. Downloaded recitation audio,
translations, tafsīr text and Mushaf pages are caches, also local, also never uploaded.

## The single-file edition
`hifz-companion.html` (about 29 MB, everything embedded, works offline) is too large for the GitHub
web uploader. If you want to offer it for download, attach it to a **GitHub Release**
(*Releases → Draft a new release → attach the file*; releases accept files up to 2 GB), or push it
with the `git` command line (limit 100 MB). Do not put it on the Pages site itself.

## Licence
Hifz Companion © 2026 — CC BY-NC-ND 4.0
(https://creativecommons.org/licenses/by-nc-nd/4.0/). Third-party components keep their own terms:
Madinah Mushaf page images © King Fahd Glorious Qur'an Printing Complex (free non-commercial
distribution, no modification); PDF.js © Mozilla, Apache-2.0; quran-meta metadata, MIT; recitation
streamed from everyayah.com; Tadabbur wa Amal and the Quranic Arabic Corpus are linked, never copied.
