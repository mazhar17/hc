# Qutrub verb-form build

This folder preserves the original Qutrub source archive and the original
pure-Python dependency distributions, with their notices and licences.
The browser runs none of this Python code; it reads `text/verb-forms.json`.
Downloads occur only for contributors rebuilding the lookup, not app readers.

To rebuild using Python 3 (run from the repository root):

1. Expand `third-party/qutrub/qutrub-52e1412-source.zip` into a build folder.
2. Install the two local `.whl` files with `python -m pip install --target BUILD_DEPS WHEEL_PATHS`.
3. Set PYTHONPATH to the absolute BUILD_DEPS directory.
4. Run `python tools/build_verb_forms.py QUTRUB_SOURCE_DIR text/quranic-corpus-morphology-0.4.txt OUTPUT_JSON`.
5. Compare OUTPUT_JSON with `text/verb-forms.json`. The adjacent report explains omitted entries.

The generator is GPL-3.0-or-later; upstream licences are included separately.
The source Corpus annotations must stay byte-for-byte unchanged.

Original archive SHA-256:
56746141afbed46e59fbedd08f3851abc08115445fcfa7ba87db5f3ef17eea11
