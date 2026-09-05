# Hifz Companion — hosted edition (v1.2.0)

This folder is the **web-hosted edition** of Hifz Companion, split into small files so it can be
published on GitHub Pages (or any static host) — every file is well under GitHub's 25 MB upload limit.

```
index.html            the app (about 1.6 MB)
mushaf/frames.json    the Mushaf frame templates
mushaf/juz01.txt …    the 604 Mushaf pages, one file per juz (about 0.5–1.2 MB each)
.nojekyll             tells GitHub Pages to serve the files as they are
```

## Publish on GitHub Pages
1. Create a repository (for example `hifz-companion`).
2. Upload **all** of these files, keeping the `mushaf/` folder: on the repository page choose
   *Add file → Upload files*, drag the `index.html`, `.nojekyll`, `README.md` and the whole `mushaf`
   folder in, then *Commit changes*. (The web uploader accepts up to 100 files at a time; this
   folder has 34.)
3. *Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, folder: / (root) → Save.*
4. After a minute the app is live at `https://<your-username>.github.io/hifz-companion/`.
   It works on phones and tablets too, including iPhone and iPad, because it is served over the web.

Your progress is stored in the browser of each device you use (nothing is sent to GitHub). To move
between devices use *Settings → Export → Export app + data* and open the exported file — it points
back to the hosted Mushaf pages, so it needs internet for the pages but carries all your data.

## The single-file edition
`hifz-companion.html` (about 29 MB, everything embedded, works offline) is too large for the GitHub
web uploader. If you want to offer it for download, attach it to a **GitHub Release**
(*Releases → Draft a new release → attach the file*; releases accept files up to 2 GB), or push it
with the `git` command line (limit 100 MB). Do not put it on the Pages site itself.

## Licence
Hifz Companion © 2026 Prof. Dr. Mazharul Islam — CC BY-NC-ND 4.0
(https://creativecommons.org/licenses/by-nc-nd/4.0/). Third-party components keep their own terms:
Madinah Mushaf page images © King Fahd Glorious Qur'an Printing Complex (free non-commercial
distribution, no modification); PDF.js © Mozilla, Apache-2.0; quran-meta metadata, MIT; recitation
streamed from everyayah.com; Tadabbur wa Amal and the Quranic Arabic Corpus are linked, never copied.
