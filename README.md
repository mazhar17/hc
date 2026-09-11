# Hifz Companion — hosted HD edition (v1.21.0)

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

**Revision of 11 September 2026 (v1.20.19).** The tutorial was brought up to date with the app as it
is in v1.20.18: five translations (Muhiuddin Khan withdrawn), tajwīd colours working alongside the
word meanings and gap-fill, the ‹ › edge arrows and the ✕ that leaves full screen, the curtain being a
Mushaf-page tool only, and the *Import weekly lesson* button on the Week tab. Every screenshot was
retaken from the current build. Same name, same 21 pages, same size — only the revision date changed.

### Where the tutorial metadata is maintained
The visible "PDF · 21 pages · 2.1 MB · revised 11 September 2026" line lives in **one** place in the
source: `src/index.html`, in the Help card's `<p class="tut-meta">`. The same figures appear in the HTML
User Guide's introduction (`Hifz-Companion-User-Guide.html`, the "Prefer a printable tutorial" box) and
in this README. The sharing title, description and absolute URL used by *Copy tutorial link* and
*Share tutorial* are the `TUT_URL`, `TUT_TITLE` and `TUT_TEXT` constants in `src/ui.js`.
The figures come from the PDF itself (`pdfinfo Hifz-Companion-Tutorial.pdf`). The file states no app
version anywhere, so none is claimed for it — do not add one unless the PDF itself says so.


## Paste weekly lesson — importing the teacher's message (v1.20.17)
*Week → 📥 Import weekly lesson.* Paste the weekly message (the one the app itself writes under
*Share with my teacher*, or a hand-written one in the same spirit), press **Parse lesson**, read the
preview, then press **Import**. Nothing changes until Import is pressed.

**What is read** — deterministically, with no AI and no guessing:

| From the message | Recognised as |
|---|---|
| `হিফ্‌জ যাত্রার ২য় সপ্তাহ` · `Journey week 2` · `الأسبوع ٢ من رحلة` | journey week (the learner's own count) |
| `সপ্তাহ ৩৭, ২০২৬` · `Week 37, 2026` | calendar week and year — stored **separately** from the journey week |
| a heading containing মুরাজা‘আহ / রিভিশন / Revision / مراجعة | the revision section; `📖 প্রথম অংশ`, `Part 1`, `القسم ١` label each range |
| a heading containing নতুন হিফ্‌জ / New Hifz / Sabaq / حفظ جديد | the new-hifẓ section |
| `• Surah Qaf (سورة ق) — আয়াত ১` then `➜ Surah An-Najm (سورة النجم) — আয়াত ৪৪`, or `Surah Qaf — ayah 1 ➜ 45` on one line | one range: start surah/ayah → end surah/ayah |
| `৬ সেপ্টেম্বর ২০২৬ — ১২ সেপ্টেম্বর ২০২৬` · `6 September 2026 — 12 September 2026` · `2026-09-06` | week start and end |
| a line after সময়সীমা / Deadline with a date and a time (`রাত ১২:০০`, `11:59 pm`, `23:30`) | deadline, in the user's local time |
| `(১ রবিউস সানি ১৪৪৮)` | Hijri text — kept and displayed as written, **never** used for scheduling |
| anything else with letters | notes — kept with the week, untranslated |

Surah names resolve through the app's verified Quran data only: the English transliteration the app
uses (with common variants such as *Mumtahana*, *Yaseen*, *Fatiha*), the Arabic name (with or without
سورة and diacritics), or the surah number. Bengali, Arabic-Indic and Persian digits are converted.
**Bengali surah names are not resolved** — the message the app writes always carries the English and
Arabic names, so this is rarely needed; a Bengali-only name produces a clear error.

**Errors stop the import**: unknown surah, ayah outside the surah, reversed range, missing endpoint,
impossible or reversed dates, conflicting years. **Confirmations** must be ticked before Import
enables: a new-hifẓ range overlapping a revision range; a deadline outside the stated week.
**Warnings** are shown but do not block: unusual Bengali ordinal wording (`২তম` where `২য়` is
expected), a range that does not begin and end at page boundaries, a period that is not 7 days, a
week that starts on a different day than the plan's.

**What Import does** — and does not do:
- Pages are derived from the ayah ranges through the page map. New hifẓ pages become the week's
  **sabaq**; revision pages join **sabqi** or **manzil** according to each page's own stage in your
  record. A revision page that your record does not show as memorised is **left out** and named in
  the preview — importing never marks a page memorised, completed or rated, and never moves a due
  date. Mark such pages under *Settings → Plan → Already memorised* and import again.
- The target week is the plan week containing the message's start date (this week, or a week
  ahead). Past weeks cannot be changed. No other week is touched.
- *Add to the week's plan* (default) keeps what is there. If the week is still an untouched
  proposal, its proposed sabaq page gives way to the lesson's. *Replace this week's page lists*
  clears the three lists first. Teacher feedback, notes and pages already marked done are kept in
  both modes.
- Re-importing the same week merges by exact range and duplicates nothing.
- The exact ayah ranges, the deadline, the journey and calendar weeks, the Hijri text, the notes and
  the **whole original message** are stored on the week under `week.lesson` (`format:
  "weekly-lesson-v1"`) and travel with JSON export/import and cloud sync like everything else.
  Recordings remain governed by the existing recording policy (never exported, never synced).
- Ayah ranges and curtain line ranges are separate things; nothing here changes calibration.

**Where it shows**: the Week screen (an *Imported lesson* panel with *Open page* and *▶ Play range*
for each range), Today (under the sabaq card), Study (a badge on any page inside an imported range)
and Share (a note that the plan came from the teacher's message). *Play range* hands exactly the
range's ayāt to the existing audio engine.

**No new network destinations.** The parser runs entirely in the browser.

**Schema note**: one optional field, `week.lesson`, on the current week, planned weeks and archived
weeks. Older records simply lack it; nothing is migrated or rewritten. Older app versions ignore it.

### Manual acceptance checklist
- [ ] Paste the supplied Bengali lesson → preview shows 53:45 → 54:6, 50:1 → 53:44, 60:12 → 63:4.
- [ ] Preview shows derived Mushaf pages (528; 518–527; 551–554) and juz (27; 26–27; 28).
- [ ] An unknown surah name (e.g. *Al-Qamr*) gives an actionable error and Import stays disabled.
- [ ] Ayah 99 of Al-Qamar cannot be imported.
- [ ] The `২তম সপ্তাহ` warning is visible before confirmation.
- [ ] Confirming creates the week; no page is marked memorised or completed.
- [ ] Existing teacher feedback and ratings remain intact.
- [ ] Re-importing does not duplicate the week or its ranges.
- [ ] Imported ranges appear in Week, Today, Study and Share.
- [ ] *Export data only (JSON)* then *Import JSON* preserves the imported lesson.
- [ ] Cloud sync preserves the imported lesson (it is part of the state file).
- [ ] *Settings → Plan → run the scheduler self-test* still passes.
- [ ] Without a Mushaf PDF the app still works in audio/tracker mode; the importer does not need the viewer.

## Moving around a zoomed page (v1.20.18)
Zoom in — pinch on a phone, `Ctrl`+wheel or `− +` on a computer — and the page grows past the edges
of the screen. Every part of it can then be reached by scrolling or dragging: the top, the bottom and
both side margins, in full screen exactly as in the normal view.

Until v1.20.18 this was not true. The viewer centred the page with CSS flex alignment, and centring
something larger than its scroll container parks half the overflow *before* the container's starting
edge, where no browser will scroll back to it. The visible symptoms were that the upper part of a
zoomed page could not be reached in full screen, and that the right-hand margin of a zoomed page —
where every Arabic line begins — could not be reached in either view. The page is now centred with
auto margins instead, which centre it while it fits and collapse the moment it does not, so the
scrollable area always covers the whole page. `test79.mjs` checks this across phone portrait, phone
landscape, tablet and desktop, in Single and Spread, at 2.4× and 4× zoom.

## The Study tab, rearranged (v1.21.0)
The Study tab used to put everything on screen at once. On a phone that meant **121 interactive
controls** and a column **3,899 px tall** — about five screenfuls — with the Mushaf itself holding
72% of the first screen. It is now **11 controls**, **1,189 px**, and one toolbar row at every
width from 360 px up.

Nothing was removed. What changed is that only what you are using is on screen:

| | |
|---|---|
| Toolbar, one row | ‹ › page arrows and the page number · **Mushaf ⇄ Text** · **Go to ▾** · **Display ▾** · full screen · **🛠 Tools** |
| **Go to ▾** | sūrah and juz. Below 700 px these move *into* Display ▾ — moved, not duplicated, so there is one of each in the DOM and every binding still works. Below 460 px full screen moves there too. |
| **Display ▾** | Only what applies to the view on screen: Single/Spread and zoom on the Mushaf; the ayah layers, translations, word-meaning language and text size in Text view. The chosen translations are **named** above the picker rather than counted. |
| Under the page | Play page · Play selection · Listen… , with the transport, presets, repeat, loop, gap, speed and A/B loop inside **Audio settings ▾**. The persistent player remains the playback surface. |
| **Ayāt on this page** | A collapsible strip. Closed it is one control and still reports "26 ayāt · selected An-Najm 3 · 2 marked ✗". **The ✗ appears only on the selected chip** — that one change turned 52 controls into 27. |
| **🛠 Tools** | One section at a time — Practice, Understand, Notes — as a rail beside the page on a desktop and a sheet over it on a phone. On a phone it is **always closed on arrival**: a sheet that reopens itself over what you are reading is an obstruction, so only the desktop remembers open/closed. The section choice is remembered on both. |

Switching or closing a section preserves the page, the selected ayah or range, playback and the
reading position. The unaided-recall rules are unchanged: the curtain still belongs to the printed
page, and Text view, meanings and tafsīr stay out of reach during a revision test.

`test81.mjs` covers the new layout — section switching, context preservation, the menus, the sheet's
focus, Escape and outside-tap behaviour, the ✗ on the selected chip only — plus the budget above
measured at 360, 390, 768 and 1280 px. Suites that drive controls which have moved use the shared
helper in `study_ui.mjs`, which reveals whatever encloses a control before operating it.

## Full screen: the page and nothing else (v1.20.20)
In full screen the toolbar is gone for as long as full screen lasts. Nothing brings it back — not
moving the mouse, not touching the page, not pressing a key. Before v1.20.20 any mouse movement or
key press slid it in for two and a half seconds, which interrupted reading every time the reader
pressed an arrow key.

The ways out:

| | |
|---|---|
| `Esc` | Leaves, always. In real full screen the browser takes the key itself and the app follows its `fullscreenchange`; where the browser refused full screen, the app's own handler does it. |
| `F` | Same as the ⛶ button — toggles full screen. |
| the ✕, on a computer | Hidden by default. Rest the pointer near the **top centre** (within 110 px of centre, in the top 64 px) and after 0.42 s it fades in; hovering the button itself makes it solid; moving away hides it at once. The dwell is measured in `ui.js`, deliberately **not** with a CSS hover zone: such a zone would have to lie over the page and would swallow clicks meant for it. Nothing is laid over the page, and only the 40 px circle takes a click, and only while it is showing. It sits 10 px down, clear of the browser's own "press Esc to exit" chrome. |
| the ✕, on a touch device | Always faintly present in the top corner, as before: a phone has no hover and no `Esc` key. |

`↓` and `↑` now scroll the page, about one line of the Mushaf per press and smoothly, so holding the
key glides down the page — in full screen and in the normal view alike. While the **curtain** is on
they keep their old meaning and reveal or hide a line, since that is the drill; the curtain is a
printed-page tool, so in Text view they always scroll. `test80.mjs` covers all of this.

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
