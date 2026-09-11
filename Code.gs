/**
 * Hifz Companion — personal cloud sync (Google Apps Script)
 * ------------------------------------------------------------------
 * Stores the app's data as a JSON file in YOUR Google Drive
 * (folder "Hifz Companion" → state.json, plus one dated backup per day),
 * so the same progress appears on your desktop, phone and tablet.
 *
 * SET-UP (once, about 3 minutes)
 *  1. Go to https://script.new  (you must be signed in to Google).
 *  2. Delete the sample code, paste this whole file, and press Save (Ctrl+S).
 *  3. Left sidebar → Project Settings (gear) → "Script properties" → Add property:
 *        Property: KEY      Value: a passphrase of your choice (e.g. 12+ letters/digits)
 *     Save. This passphrase is what the app must present to read or write your data.
 *  4. Deploy → New deployment → gear → Web app:
 *        Description: Hifz sync · Execute as: Me · Who has access: Anyone
 *     → Deploy → authorise (it only asks for Drive access) → copy the Web app URL
 *     (it ends in /exec).
 *  5. In Hifz Companion: Settings → Cloud sync → paste the URL and the passphrase → "Test".
 *     Do the same on every device. From then on the app saves to Drive a few seconds
 *     after every change and loads the newest data when it opens.
 *
 * NOTES
 *  • "Anyone" access is required so the app can call this from any device without a
 *    Google login prompt; the passphrase (KEY) is what protects your data. Keep the
 *    URL and passphrase private, like a password.
 *  • Nothing else is stored or shared. You can open the folder "Hifz Companion" in
 *    Drive at any time; state.json is your data, human-readable.
 *  • If you ever change the passphrase, update it in the app on every device.
 *  • Redeploy (Deploy → Manage deployments → edit → Version: New) after editing this file.
 *
 * UPDATING FROM THE 2026-09 VERSION (revision checking) — ORDER MATTERS
 *  1. FIRST update Hifz Companion on EVERY device you sync (open the app once so the
 *     new version is installed). New devices work with the old script exactly as before.
 *  2. THEN paste this file over the old one and redeploy
 *     (Deploy → Manage deployments → edit → Version: New → Deploy).
 *  If you redeploy first, any device still on the old app version will be told to
 *  update before it can save; its data is not lost, it just cannot upload until updated.
 *  Your existing state.json needs no conversion: it is treated as revision 0 and gets
 *  revision 1 on the next save.
 *
 * WHY REVISIONS
 *  Timestamps cannot decide who is allowed to write: a phone with a wrong clock could
 *  claim to be newer and overwrite a desktop that had never seen its changes. Each save
 *  must now name the revision it was based on, and the script accepts it only if that is
 *  still the current revision. Otherwise it answers "conflict" and changes nothing —
 *  both copies survive and the person decides.
 */

var FOLDER_NAME = 'Hifz Companion';
var STATE_FILE = 'state.json';
var KEEP_BACKUPS = 30;

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    if (p.action === 'ping') return respond({ ok: true, time: new Date().toISOString(), version: 2, revisions: true });
    requireKey(p.key);
    if (p.action === 'load') return respond(loadState());
    return respond({ error: 'unknown action' });
  } catch (err) { return respond({ error: String(err) }); }
}

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    requireKey(body.key);
    if (body.action === 'save') return respond(saveState(body.state, body.savedAt, body.device, body.baseRev));
    if (body.action === 'load') return respond(loadState());
    return respond({ error: 'unknown action' });
  } catch (err) { return respond({ error: String(err) }); }
}

// ---------------------------------------------------------------- helpers
function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function requireKey(key) {
  var want = PropertiesService.getScriptProperties().getProperty('KEY');
  if (!want) throw new Error('Set the KEY script property first (Project Settings → Script properties).');
  if (!key || key !== want) throw new Error('Wrong passphrase.');
}

function folder() {
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function stateFile() {
  var it = folder().getFilesByName(STATE_FILE);
  return it.hasNext() ? it.next() : null;
}

/** Revision of the stored document. A file written by the previous version has none: it is revision 0. */
function revOf(doc) { return doc && typeof doc.rev === 'number' && doc.rev >= 0 ? doc.rev : 0; }

function loadState() {
  var f = stateFile();
  if (!f) return { state: null, savedAt: null, rev: 0 };
  var doc = JSON.parse(f.getBlob().getDataAsString('UTF-8'));
  return { state: doc.state, savedAt: doc.savedAt, device: doc.device || '', updated: f.getLastUpdated().toISOString(), rev: revOf(doc) };
}

/**
 * Optimistic concurrency. The save must name the revision it was based on; under the
 * script lock that must still be the current revision, or nothing is written.
 * Timestamps are kept for display only — they never decide who may write.
 */
function saveState(state, savedAt, device, baseRev) {
  if (!state || typeof state !== 'object') throw new Error('No state given.');
  var lock = LockService.getScriptLock(); lock.waitLock(10000);
  try {
    var existing = stateFile();
    var cur = existing ? JSON.parse(existing.getBlob().getDataAsString('UTF-8')) : null;
    var curRev = revOf(cur);

    // an app version that does not send baseRev cannot be allowed to bypass the check
    if (baseRev === undefined || baseRev === null || isNaN(Number(baseRev))) {
      return { ok: false, upgrade: true, rev: curRev, savedAt: cur ? cur.savedAt : null, device: cur ? (cur.device || '') : '',
               error: 'This device is running an older version of Hifz Companion that cannot save safely. Open the app on this device to update it, then try again — nothing was changed in the cloud.' };
    }
    if (Number(baseRev) !== curRev) {
      return { ok: false, conflict: true, rev: curRev, savedAt: cur ? cur.savedAt : null, device: cur ? (cur.device || '') : '', baseRev: Number(baseRev) };
    }

    var newRev = curRev + 1;
    var doc = JSON.stringify({ app: 'hifz-companion', rev: newRev, savedAt: savedAt || new Date().toISOString(), device: device || '', state: state });
    if (existing) existing.setContent(doc); else folder().createFile(STATE_FILE, doc, 'application/json');
    dailyBackup(doc);
    return { ok: true, rev: newRev, savedAt: savedAt, bytes: doc.length };
  } finally { lock.releaseLock(); }
}

function dailyBackup(doc) {
  var day = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var name = 'state-' + day + '.json';
  var fo = folder(); var it = fo.getFilesByName(name);
  if (it.hasNext()) it.next().setContent(doc); else fo.createFile(name, doc, 'application/json');
  // prune old backups
  var files = []; var all = fo.getFiles();
  while (all.hasNext()) { var f = all.next(); if (/^state-\d{4}-\d{2}-\d{2}\.json$/.test(f.getName())) files.push(f); }
  files.sort(function (a, b) { return a.getName() < b.getName() ? 1 : -1; });
  for (var i = KEEP_BACKUPS; i < files.length; i++) files[i].setTrashed(true);
}
