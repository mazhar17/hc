#!/usr/bin/env python3
"""Build the app's conservative verb-form lookup from Qutrub and Corpus v0.4.

Generator: Hifz Companion contributors, GPL-3.0-or-later.
Dependencies: official Qutrub source, PyArabic==0.6.15, six==1.17.0.
Input annotations are read only; they are never rewritten.
Usage: python build_verb_forms.py QUTRUB_SOURCE CORPUS_FILE OUTPUT_JSON
"""
import sys, re, csv, json, hashlib, unicodedata
from pathlib import Path
from collections import defaultdict

def canonical(text):
    text = unicodedata.normalize('NFC', text).replace('ٱ','ا').replace('ـ','')
    text = re.sub(r'([اى])ٰ', r'\1', text).replace('ٰ','ا')
    return re.sub(r'[\u0653-\u0655\u06d6-\u06ed]', '', text)
BW = dict(zip("'|>&<}AbptvjHxd*rzs$SDTZEgfqklmnhwYyFNKaui~o`{", 'ءآأؤإئا بةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰٱ'.replace(' ','')))
def decode(text): return ''.join(BW.get(c,c) for c in text)
def radical(text): return canonical(text).translate(str.maketrans({'ا':'ء','أ':'ء','إ':'ء','ؤ':'ء','ئ':'ء'}))
def feature(fields, name): return next((f[len(name):] for f in fields if f.startswith(name)), '')
def generate(qutrub, corpus):
    sys.path.insert(0, str(qutrub.resolve()))
    from libqutrub.classverb import VerbClass
    from libqutrub import verb_const as c
    from libqutrub.triverbtable import TriVerbTable
    tri=defaultdict(list)
    for entry in TriVerbTable.values(): tri[canonical(entry['verb'])].append(entry)
    augmented=defaultdict(set)
    with (qutrub/'data/Classified_verbs.csv').open(encoding='utf-8-sig') as handle:
        for entry in csv.DictReader(handle, delimiter='\t'):
            if entry.get('verb') and int(entry.get('length','0'))>3: augmented[canonical(entry['verb'])].add(entry['verb'])
    lemmas={}
    for line in corpus.read_text(encoding='utf-8').splitlines():
        cells=line.split('\t')
        if len(cells)!=4 or cells[2]!='V': continue
        features=cells[3].split('|'); lemma=feature(features,'LEM:'); root=feature(features,'ROOT:')
        if lemma and root: lemmas[(lemma,root)]=next((f[1:-1] for f in features if re.fullmatch(r'\([IVX]+\)',f)), 'I')
    result={}; skipped=[]
    for (lemma,root),form in sorted(lemmas.items()):
        lemma_ar=canonical(decode(lemma)); root_ar=canonical(decode(root))
        candidates=[]
        if re.sub(r'[\u064b-\u0652]', '', lemma_ar) in {'ليس','عسى','نعم','بئس'}:
            skipped.append({'lemma':lemma,'root':root,'reason':'defective or non-conjugating verb'}); continue
        if form=='I':
            candidates=[(e['verb'],e['haraka']) for e in tri.get(lemma_ar,[]) if radical(e['root'])==radical(root_ar)]
        else:
            # The fully vocalised lemma must exist in Qutrub's published verb lexicon.
            candidates=[(v,'فتحة') for v in augmented.get(lemma_ar,set())]
        tables=set()
        for verb,vowel in candidates:
            try:
                v=VerbClass(verb,False,vowel)
                table=(v.conjugate_tense_pronoun(c.TensePast,c.PronounHuwa),v.conjugate_tense_pronoun(c.TenseFuture,c.PronounHuwa),v.conjugate_tense_pronoun(c.TenseImperative,c.PronounAnta))
                if canonical(table[0])==lemma_ar and all(table): tables.add(table)
            except (ValueError,KeyError,IndexError): continue
        if len(tables)==1:
            past,present,command=next(iter(tables))
            result[lemma+'|'+root]={'form':form,'perfect':past,'imperfect':present,'imperative':command}
        else: skipped.append({'lemma':lemma,'root':root,'reason':'ambiguous' if len(tables)>1 else 'no exact lexical match'})
    return result,skipped

def main():
    if len(sys.argv)!=4: raise SystemExit(__doc__)
    qutrub,corpus,out=map(Path,sys.argv[1:])
    entries,skipped=generate(qutrub,corpus)
    payload={'version':1,'source':'Qutrub, Taha Zerrouki and contributors','revision':'52e1412ccbaaf429136412183318fcbf0cf9bcd7','license':'GPL-3.0-or-later','method':'Unique exact vocalised lemma match; Form I also requires an exact root match. Active dictionary forms, not necessarily the selected ayah inflection.','entries':entries}
    out.write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    out.with_suffix('.report.json').write_text(json.dumps({'included':len(entries),'withheld':skipped},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Included',len(entries),'withheld',len(skipped))
if __name__=='__main__': main()
