# Hifz Companion — hosted HD edition (v1.23.0)

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
Hifz-Companion-Tutorial.pdf      the illustrated 22-page tutorial — must sit beside index.html
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

**Revision of 12 September 2026 (v1.21.4).** Brought up to date with v1.21.2 and v1.21.3: slide 8
describes Go to ▾ sitting with the page controls and names ⤢ Focus, slide 9 says that closing Tools
gives its width back to the page, slide 7 points at *Edit the share template*, and slide 19 states how
saving and syncing actually behave. Every screenshot retaken from the v1.21.3 build. Still 22 pages
and 2.3 MB — only the revision date changed, and the Guide and the app's metadata line with it.

**Revision of 11 September 2026 (v1.21.1).** The tutorial was rebuilt for the redesigned Study tab:
slide 8 describes the one-row toolbar and the Display menu, a **new slide 9** introduces 🛠 Tools and
its three sections, and the curtain, gap-fill, translations, stumble-mark, recording and video slides
now say where each lives. Every screenshot was retaken from the v1.21.0 build. **22 pages, 2.3 MB** —
the page count and size changed, so the metadata line in the app, this README and the Guide were all
updated to match.

**Revision of 11 September 2026 (v1.20.19).** The tutorial was brought up to date with the app as it
is in v1.20.18: five translations (Muhiuddin Khan withdrawn), tajwīd colours working alongside the
word meanings and gap-fill, the ‹ › edge arrows and the ✕ that leaves full screen, the curtain being a
Mushaf-page tool only, and the *Import weekly lesson* button on the Week tab. Every screenshot was
retaken from the current build. Same name, same 21 pages, same size — only the revision date changed.

### Where the tutorial metadata is maintained
The visible "PDF · 22 pages · 2.3 MB · revised 12 September 2026" line lives in **one** place in the
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

## Saving, sharing and the theme (v1.21.3)
**Saving was already automatic; what was missing was the last few seconds.** Every change writes to
the device immediately through `Store.save()`, and that same call schedules a cloud push — 3 s after
an ordinary change, 8 s after a quiet one (presentation preferences; it was 20 s). Cloud sync runs
automatically whenever it is switched on in *Settings → Data*. The gap was that a push still inside
its debounce was lost when the tab closed or the phone was locked, and waited until the next launch.
`Sync.flush()` now sends what is owed on `pagehide` and when the page becomes hidden, and a `pull()`
runs when it becomes visible again, in case another device wrote meanwhile. **The flush changes no
invariant**: it does nothing while sync is off, while a conflict stands, while a push is in flight,
or when nothing is owed — it only skips the remaining wait.

**Settings → Sharing was hard to find from where it matters.** It is not a duplicate of *Week →
Share with my teacher*: that tab produces the message, this one holds the names and the editable
template with its placeholders. Week now carries an **Edit the share template** button that opens
Settings on the Sharing pane.

**The theme toggle was unreachable on a phone.** The ◐ button lives in `.sidenav-foot`, which is only
shown from 900 px up, so on a phone — where the side bar becomes the bottom tab bar — it was never
on screen, while the User Guide said it was. The mobile header now carries the same control, wired to
the same `cycleTheme()`, and the Guide says where each one is. `test83.mjs` covers all three.

## Focus, and the space the rail was wasting (v1.21.2)
**Go to ▾ moved beside the page number.** The ‹ › arrows, the page box, the sūrah and the juz all
answer "which page am I on", so they now sit together; the view switch no longer splits them.

**Closing Tools now frees its space.** The Study layout declares `minmax(0, 1fr) 330px`, so hiding
the rail left the 330 px track behind as dead margin — the reading column measured the same 704 px
open or closed at 1280 px wide. The track is removed with the rail (`.study-layout.no-rail`), and in
Spread that alone takes the pages from 412 px to 650 px tall.

**⤢ Focus** (Display ▾ → Reading, `Shift`+`F`) does four things at once: drops the rail and its
track, hides the tab bar, lifts `main`'s 1400 px width cap and raises the viewer's height cap from
84 vh to 92 vh. The toolbar stays — so pages still turn — and while Focus is on a `⤢ Focus on`
button sits in the toolbar to leave, as do `Esc` and `Shift`+`F`. Measured at 1280×860, page 526:

| | reading column | a spread |
|---|---|---|
| Tools open | 704 px | 412 px tall |
| Tools closed | 1046 px | 650 px tall |
| Focus | 1250 px | 772 px tall |

A single page at *Fit page* is limited by height rather than width, so it gains from the taller
viewer (703 → 772 px) rather than from the width. **Focus is remembered between sessions**, per
device, in `settings.studyFocus`. It is a Study-tab mode: every other tab gets its tab bar back, and
below 1000 px it is neither offered nor applied — there is nothing beside the page to hide there, and
the tab bar is the only way between tabs. `test82.mjs` covers all of it.

## Import Feedback — reading a teacher's Hifz Mentor report (v1.23.0)

**Progress → Import Feedback** (Bengali: **ফিডব্যাক আমদানি**). The student copies the teacher's
whole WhatsApp message from Hifz Mentor, pastes it into a dialog, checks the preview, and presses
Import. No API, no sign-in, no file upload, no clipboard reading.

### How the message is read

Hifz Mentor ends its message with one versioned block:

```
[HIFZ_MENTOR_FEEDBACK_V1]
{ …one line of JSON… }
[/HIFZ_MENTOR_FEEDBACK_V1]
```

`src/feedback.js` is a pure module — no DOM, no storage, no network — so every rule can be
exercised directly. It extracts **exactly one** block, ignoring the surrounding prose and
tolerating CRLF and whitespace around the JSON. Nothing is ever guessed from the prose: no block
means no import. It refuses a missing, truncated, empty, duplicated, malformed or
unsupported-version block, each with a plain-language reason.

**This is not a backup.** It carries one lesson's corrections and never reaches the full-state
importer that replaces everything.

### Treating the message as untrusted text

* Parsed with `JSON.parse`, never `eval`.
* Keys that could reach `Object.prototype` (`__proto__`, `constructor`, `prototype`) are refused
  anywhere in the tree; a test asserts `({}).polluted` stays undefined afterwards.
* Input bounded to 1 MB, marks to 500, and every string to the contract's limit.
* Everything imported is rendered as **text**. A note containing `<img src=x onerror=…>` shows
  those characters literally: the browser test asserts no element was created and no script ran.
* The report is rebuilt from validated fields only, so nothing unexpected reaches storage.

### Validation

Top level: `format`, `version`, `lessonId` (≤100), `studentName` (≤300), `teacher` (≤100), a real
`YYYY-MM-DD` date, integer `from`/`to` in 1–604 with `to >= from`, and `marks` (≤500, may be
empty — an empty report is a valid "no mistakes" result).

Each mark: id, a page inside `from..to`, `x`/`y` in [0,1], one of the six categories, bounded
reference and note, boolean `selfCorrected`/`resolved`, and a location of point / reference /
text / area (absent = legacy point). **Text** marks add `verseKey`, `selectedText` and inclusive
`wordStart`/`wordEnd`; the sūrah and āyah are checked against the app's own Qur'ān data, and a
verse that sits on a different page is rejected with both page numbers named. **Area** marks add
positive `width`/`height` with `x+width <= 1.001` and `y+height <= 1.001`.

### Stored separately

A new `teacherFeedback` collection sits beside the existing ones in the defaults, the validation
model and the backup/export path. Importing does **not** touch pages, ratings, memorisation
progress, weekly plans or the learner's own ✗ mistake log — the browser test compares eight
collections before and after an import. The learner's own reading of a correction (*Reviewed* /
*Needs practice*) is a separate `review` map keyed by mark id, so it never edits what the teacher
wrote.

Duplicates are handled by `lessonId`: an identical re-import is a no-op that says so; a changed
report with the same id asks for explicit confirmation, replaces the old one, and **keeps the
review status of every mark that is still present**. The whole report is validated before anything
is written, and a storage failure rolls the change back and reports it.

### Highlights, and the overlay we refuse to draw

A teacher's text selection is highlighted in Text view **only** where the word list actually
fetched confirms the range. If the two apps tokenise differently the range is dropped and the
Arabic is shown as a quotation instead — a guessed highlight would point at the wrong words.

Point and area marks are positions on Hifz Mentor's own uncropped page images. This app cannot
know its Mushaf edition shares that coordinate system, so **no overlay is drawn**: the page
reference is given with a line explaining why. A mark in the wrong place is worse than no mark.
A `reference` mark carries no image position at all and gets no such note.

### Tests

* **test88** — 68 unit checks on the parser: the happy path in English, Bengali and Arabic; every
  mark position including legacy; CRLF and whitespace; no block, truncated, empty, doubled,
  malformed, wrong format, unsupported version, over 1 MB; prototype-reaching keys; every field
  and mark rule; HTML-looking notes; and telling a re-paste from a revised report.
* **test89** — 65 browser checks: the button in Progress, preview before storing, nothing stored
  until confirmed, the eight untouched collections, duplicates and updates with review status
  preserved, seven errors explained in the dialog with nothing stored, safe rendering, an empty
  report, persistence across a reload, the Bengali interface, export round-trip, Open in Study,
  and the refusal to draw or guess.

## The wheel change reaches existing users too (v1.22.4)

v1.22.3 made the wheel scroll **for new installs only**, on the principle that a stored setting
beats a default. That principle was applied wrongly here. `wheelMode: 'zoom'` was never a choice
anyone made — it had simply sat in every record since the day it was created — so "protect the
learner's choice" protected a preference nobody had expressed, and the correction could never
reach a single existing user. The person who asked for the change would not have got it.

**A one-time move now fixes that.** `migrate()` in `store.js` gains an `ONCE` table: each entry
runs at most once per record and writes a mark under `settings.applied`, so it can never run
twice. The first entry moves `wheelMode` from `zoom` to `scroll`.

* Anyone who genuinely prefers wheel-zoom sets it back in Settings → 📖 Mushaf, **once** — the
  mark is already stored, so the move never repeats and their choice stands for good.
* The marks are written to storage the moment they are set, rather than waiting for the next
  save. Otherwise the move would run again on the following load and undo someone who had just
  set the old value back.
* `migrate()` runs on **every** path that brings a record into memory — local load, file import,
  cloud pull, restore from backup — so a device syncing an older record gets the same treatment.

**Nothing else in the record is touched.** The word-meaning language and the tafsīr edition are
*real* choices and are deliberately left alone; `test87` asserts a record holding Bengali for both
still holds them after the move.

**test87** is now 18 checks: the wheel behaviour in both modes, Ctrl+wheel and the trackpad pinch,
Shift+wheel sideways, the one-time move firing on an old record, the mark being recorded, setting
the old value back and surviving a reload, and the untouched neighbours.

## The mouse wheel scrolls the Mushaf (v1.22.3)

On a computer the wheel now **scrolls** the Mushaf page up and down, and **Ctrl+wheel** (⌘ on a
Mac) zooms around the pointer. That is what every other document reader does — a browser, a PDF
viewer, Word — so the old default was the surprising one. It also fails more kindly: a stray wheel
nudge now moves the page a little instead of silently rescaling it.

* **wheel** — scroll up and down
* **Ctrl+wheel / ⌘+wheel / trackpad pinch** — zoom at the pointer
* **Shift+wheel** — move sideways on a page wider than the window
* **drag with the left button** — pan a page larger than the window

**Nothing was removed.** Settings → 📖 Mushaf → **Mouse wheel in Study** still offers
*Zooms (hold Shift to scroll)*, and the default option is simply listed first now. Ctrl+wheel
zooms in **both** modes, as it always did, so a trackpad pinch — which browsers report as a wheel
event with `ctrlKey` set — works either way.

**Only new installs are affected.** As with the language defaults in v1.21.6, a stored setting
beats a default, so anyone already using the app keeps the wheel behaviour they have. `test87`
asserts that directly: a seeded record holding `wheelMode: 'zoom'` still zooms on the plain wheel
after the upgrade.

**test87** (14 checks) drives real wheel input rather than synthetic events — a synthetic
`WheelEvent` carries no browser default action, so a handler that deliberately does nothing and
lets the browser scroll would look identical to a broken one. It covers the wheel scrolling
without changing zoom, Ctrl+wheel zooming both ways, Shift+wheel moving sideways, the pinch path,
both settings, and the upgrade case.

## The Today card is quieter (v1.22.2)

The sabaq card no longer carries the day's suggested task — the **Suggested today** label and the
line beneath it (*"Segment 2 (curtain lines 4–6 · audio 54:12–15): listen ×5, repeat ×5, recite
under the curtain, verify"*). The card now goes straight from the page and its range to the
buttons, in both languages.

**Nothing was deleted.** The same guidance still appears in **Study → 🛠 Tools → Practice**, beside
the page it actually describes, and the **▶ Today's segment** button on the Today card still plays
that day's segment. The **Weekly day template** in Settings → Plan still drives both, so a template
you have edited keeps working.

**test86** asserts, in English and in Bengali, that neither the label nor the segment line appears
on Today, and that the task is still reachable in Study → Tools → Practice.

## The language is visible on every screen (v1.22.1)

An **EN / BN** pill sits at the top of the screen beside ◐ and ? — in the sidebar on a computer,
in the header bar on a phone. It shows the language you are in (the ISO 639-1 codes, `en` / `bn`,
the same codes the app stores internally) and one tap switches. The tooltip names the language in
full and says what a tap will do, in whichever language you are currently reading.

The code itself is never translated — `data-notr` keeps the walker off it — because EN and BN are
codes, not words, and a reader who cannot read the current language needs them to stay legible.

**One regression, caught and fixed.** On a 360 px phone the header bar is `nowrap`, so the extra
button squeezed the brand text and pushed the version tag onto a second line — 44 px to 52 px.
The pill is now tighter below 400 px and the version tag is hidden in that bar (it is still on
every Settings screen and in About). Measured back at **44 px in both languages**.

## A Bengali interface (v1.22.0)

**Settings → 📖 Mushaf → Interface language** switches the whole interface between **English** (the
default) and **বাংলা**. The choice is stored in the record, so it syncs across devices like every
other setting.

### How it works

No keys were added to the markup. The English string *is* the key:

* **The static shell** — a walker visits every text node, `title`, `placeholder` and `aria-label`,
  looks the English up, and writes the translation. The original English is held in a `WeakMap`,
  so switching back and forth is lossless and a translation is never re-translated. The walker
  also notices when the app has re-rendered a node and re-reads it, so a recycled element can
  never inherit the previous string's translation.
* **Everything ui.js builds at run time** goes through `t('English string', { tokens })`.
* **A string with no Bengali entry returns the English** — never a blank and never a key name. A
  translation can therefore be incomplete without ever looking broken.

The table lives in its own file, `src/strings-bn.json` (790 strings), folded into the app at
build time. Correcting a translation means editing one JSON value.

### What is never translated

The Qur'ān text and the Mushaf pages · the learner's own notes, plan, weekly template and their
teacher's feedback · sūrah, translator and publisher names, and links · the Help & About tab and
the User Guide. Those subtrees are excluded outright, and because lookup is by exact English
string, generated text cannot match an entry by accident.

### Coverage, stated honestly

The interface, the Today, Week and Progress screens, the Study tools, the messages the app shows,
the rating labels and the day and month names in dates are Bengali. **About 29 strings remain in
English**, in the technical corners of Settings (audio-source diagnostics, storage figures) —
plus Help & About, which is a separate job. Nothing is blank anywhere.

**The Bengali has not been checked by a native reviewer.** `Hifz-Companion-Bengali-review.html`
in this package is a side-by-side sheet for exactly that: English on the left, the current Bengali
on the right, editable, with placeholders and symbols marked as untouchable.

### Layout

Bengali runs longer than English and stacks marks above and below the baseline, so the line height
is raised and a Bengali UI font stack is used (no webfont is bundled — the app is offline-first).
Measured in Bengali at 360, 390, 414, 768 and 1280 px: the Study toolbar is **42 px, one row**, at
every width, and no screen overflows horizontally.

### A bug this work uncovered

Two render loops used `t` as a local variable — `steps.map((t, i) => …)` in the sabaq ladder and
`weekTemplate.map((t, i) => …)` in the weekly-template editor — which shadowed the new translate
helper and threw `t is not a function`. Both are fixed; **test86** asserts the page raises no
errors in either language.

**test86** (27 checks): the switch, `<html lang>`, the font class, persistence across a reload,
the exact restoration of English, Qur'ān text and learner notes untouched, generated content and
toasts translated on Today/Week/Progress, one-row toolbar and no overflow at four widths, and the
fallback behaviour of a missing entry.

## English is the default language of the meaning layers (v1.21.6)

The app has always carried both languages; the defaults simply pointed at Bengali. They now point
at English, and English is listed first in every picker.

| | Before | Now |
|---|---|---|
| Word meanings in Text view | বাংলা | **English** |
| Translation a new install starts with | Taisirul Quran | **Saheeh International** |
| Tafsīr edition | তাফসীর আহসানুল বায়ান | **Tafsir Ibn Kathir (English)** |
| Tafsīr picker order | Ahsanul Bayaan · Ibn Kaseer · Ibn Kathir | **Ibn Kathir (En) · ইবনে কাসীর · আহসানুল বায়ান** |
| Translation picker order | বাংলা group, then English | **English group, then বাংলা** |
| Word-meaning selects | বাংলা · English · Both | **English · বাংলা · Both** |
| "Both" mode | Bengali gloss first, English under it | **English first, Bengali under it** |

**Nothing is removed.** All five translations, both Bengali tafsīr editions and the Bengali word
meanings are exactly where they were — one tap away in **Display ▾** and **Settings → Mushaf**.

**Nothing changes for an existing user.** These are *defaults*, and a stored setting always wins
over a default (`finishLoad()` merges `{...defaults, ...stored}`). A record that says Bengali keeps
Bengali — the language, the ticked translations and the tafsīr edition all survive the upgrade
untouched. The one behavioural change for existing records is cosmetic: an unrecognised tafsīr id
now falls back to the English edition rather than the Bengali one, because the fallback is simply
the first entry in the table.

**test85** (15 checks) covers both halves: that a fresh install comes up English throughout and
lists English first in all four pickers, and that a seeded Bengali record still reads Bengali —
in the stored settings *and* in what the Settings screen displays — after a reload on the new build.

## Revision mode is visible now, and has a way out (v1.21.5)

**The defect.** Tapping **Open in Study** on a Today or Week revision card does not just open the
page — it opens it *for revision*: the Text view, your notes, the look-alike hints and the tafsīr
are all hidden so the page is recited unaided. That is deliberate. What was wrong is that nothing
on screen said so. Tapping **☰ Text** produced one message covering three different situations —
*"The Text view is hidden while the curtain is on or during revision"* — so a user who was in
revision went looking for a curtain that had never been on. The only indication the mode existed
lived inside **Tools → Understand**, which on a phone is a sheet that starts closed. And the mode
outlived the screen it belonged to: leaving the Study tab and coming back did not clear it, so the
sole escape was changing the page number, which nobody would guess.

**What changed.**

* **A band above the page.** While a page is open for revision, a sticky banner sits above it:
  *"Reciting page 600 unaided — the text and the aids are hidden."* It is pinned, because opening
  a page from Today scrolls straight to the Mushaf — a banner that merely sat above the page would
  be scrolled past before it was ever read. It appears only during revision, and the toolbar keeps
  its single row at 360, 390, 414, 768 and 1280 px, as it has since v1.21.0.
* **Leave revision ✕.** The banner carries the way out, in words. Ending revision brings the text,
  the notes and the aids straight back — and restores the Text view if that is what you had asked for.
* **Three causes, three messages.** The curtain, full screen and revision each now say what is
  actually blocking the Text view, and name the specific remedy for it.
* **The ☰ Text button is disabled** while the text is unavailable, with the reason as its tooltip —
  matching the Curtain button, which has always been disabled in Text view for the same reason.
  A control that looks tappable and then refuses reads as a fault; a disabled one teaches.
* **Revision ends by itself** when you rate the page — the recitation has been assessed, so the
  test is over — and when you leave the Study tab.

Nothing about the schedule, the ratings or your data changed. **test84** (28 checks) covers the
banner, its stickiness, the one-row toolbar, each of the three messages, the escape route, and the
two automatic exits; it also asserts that the curtain path still says "curtain".

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
