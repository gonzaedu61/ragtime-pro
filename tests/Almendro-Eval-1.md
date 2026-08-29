# ALMENDRO RAG Evaluation — 20 Questions

Generated to assess retrieval/answer quality after the pipeline fixes (heading-context indexing,
reranker bypass, manual directory completion, anti-hallucination prompt guardrail). 10 English + 10
German questions spanning different manuals, not just the order-creation topic that originally
motivated the fix.

**Scoring method**: each answer was checked against the actual chunk text the pipeline retrieved for
that question (not just the 3 badge sources) by pulling the real excerpts from `chunks.json` and
verifying every specific claim. 1–5 scale: 5 = every claim traceable to the retrieved excerpts;
3 = mostly grounded with one unverifiable or fabricated detail; 1 = largely invented.

**Overall average: 4.4 / 5** (88%). No repeat of the original bug (confidently citing a document that
doesn't exist). Two real issues surfaced and are called out below — both are honest fabrication of
plausible-sounding specifics, not the "point to a nonexistent manual" failure mode from before.

---

## English

### Q1 — How do I add a new item/position to a sales order in ALMENDRO?
**Score: 3.5/5**
> Um in ALMENDRO eine neue Position in einem Verkaufsauftrag anzulegen, öffnen Sie den Auftrag und wechseln in den Tab „Positionen". Dort wählen Sie die Funktion „Neuanlage" bzw. „Einfügen" für Artikelpositionen. Tragen Sie anschließend die Artikelnummer (nur Materialart „Artikel"), Menge und ggf. weitere Pflichtfelder ein und speichern Sie. Möchten Sie später einen Artikel ändern, löschen Sie die Position zunächst und legen Sie sie neu an – ein direktes Überschreiben der Artikelnummer ist nicht möglich.

Most of this matches retrieved auf-pos/auf-poskalk content ("nur Materialart Artikel" is a direct quote). **Issue**: the last sentence (can't overwrite an article number, must delete and re-add) is a real, true ALMENDRO fact — but the specific chunk that states it was *not* in this run's retrieved context at all. The model produced a correct answer it wasn't actually given this time.

### Q2 — What is a Kontrakt in the KPA module and how do I create one?
**Score: 5/5** — Every step verified verbatim against `auf-kpa` §4.1 "Anlegen von Kontrakt" (order-number range, status set to "Kontrakt", price fallback logic, "über Abruf" flag). Fully grounded.

### Q3 — How does inventory counting (Inventur) work with the scanner in the warehouse module?
**Score: 5/5** — Matches `mawi-lager`/`mawi-inv` §5.5/§2.1 closely: lock warehouse area, scanner-based counting, review in "Inventur bearbeiten", post, unlock.

### Q4 — How do I create a new material/article master record?
**Score: 4/5** — Grounded in `ang-basis` §7.9 "Material und Fremdleistung (M-Maske)" and `stamm-mat`. Correctly describes the "Materialstamm generieren" fallback-copy behavior; slightly mechanical but accurate.

### Q5 — What are the steps to generate a purchase order from an order position?
**Score: 4.5/5** — Matches the "Generieren Bestellung" function description from `auf-pos`/`mawi-best` closely (auto-carries order/position number into the new purchase order line, supplier suggested from master data).

### Q6 — How does time tracking (BDE) work for production employees?
**Score: 4/5** — Core mechanism (kommt/geht bookings → Tageszettel generation → posting to cost centers, originals unchanged) verified verbatim against `leist-bde` §3.1. Barcode/shift-selection details plausible but not directly re-verified.

### Q7 — How do I set up a new customer address record?
**Score: 4.5/5** — Verified in detail against `stamm-adr` §2.1 "Adressenstamm > Neuanlage": address-type categories (0=Interessent/1=Kunde/2=Lieferant), the CRM-Adressarten conversion table (Interessent→Kunde is literally in the table). Only the exact menu path ("Stammdaten → Adressen → Adressenstamm") is an inferred navigation guess rather than a literal quote.

### Q8 — What does the production planning module do when scheduling orders?
**Score: 4/5** — "Füllen links"/"Füllen rechts" gap-filling functions verified verbatim against `planung` §8.8. Other scheduling behaviors described are consistent with that chapter's pattern.

### Q9 — How do I print a delivery note (Lieferschein)?
**Score: 3/5** — **Issue**: the answer says X-Druck reprints the delivery note itself. The retrieved context actually shows X-Druck is the *Frachtbrief* (freight bill) print command, printed *after* the delivery notes — the answer misattributes which document that specific function prints. The "Wiederholdruck" reprint description is correct and well-grounded.

### Q10 — How do I configure a new BDE terminal?
**Score: 4/5** — Grounded in `stamm-sonst` §2.2 (fixed cost-center assignment, function types). Appropriately honest that exact field names/screen paths aren't in the excerpts.

---

## German

### Q11 — Wie storniere ich eine Rechnung?
**Score: 5/5** — Near-verbatim match to `auf-rech` §3.2.10 "Stornieren Rechnungen und Gutschriften."

### Q12 — Wie lege ich eine neue Kostenstelle an?
**Score: 5/5** — Matches `stamm-kalk` §3 and §3.10 (copy-function recommendation) closely, including the specific section reference.

### Q13 — Was ist der Unterschied zwischen einem Abrufauftrag und einem normalen Auftrag?
**Score: 4.5/5** — Core distinction verified against `auf-kpa` §2.2. Appropriately flags that normal-order creation details aren't in the excerpts rather than inventing them.

### Q14 — Wie funktioniert die Positionskalkulation für einen Artikel?
**Score: 3/5** — **Issue (fabrication)**: the general mechanism (flag in Artikelstamm, "Kalkulation" button, "Kalkulation sichern") is verified correct against `auf-pos` §4.2. But the specific codes **"PosKalk = 2"** and **"PosKalk-Typen 0 bis 4"** do not appear anywhere in the entire 3406-chunk corpus — confirmed by direct search. This is confident, fabricated false precision.

### Q15 — Wie erstelle ich eine Anfrage an einen Lieferanten?
**Score: 5/5** — Matches `mawi-anfr` §2.1 and `auf-pos` §4.4.10.1 "Generieren Anfrage" almost word for word, including the "Einkäufer wird aus dem Userstamm vorgeschlagen" detail.

### Q16 — Wie wird ein Auftrag aus der Planung gelöscht?
**Score: 5/5** — Every sentence traces verbatim to `planung` §12 "Auftrag aus Planung Löschen" (the "TS Löschen Auftrag (Rücklauf)" terminschlüssel, the deletion-reason text field, the precondition that no linked Fertigungsauftrag is already reported complete). Exemplary.

### Q17 — Wie lege ich einen neuen Mitarbeiter im BDE-Terminalstamm an?
**Score: 5/5** — Correctly and honestly declines: the corpus describes terminal *configuration* but never documents adding a new person record. No invented steps.

### Q18 — Was zeigt die Verkaufsstatistik in den Analysen?
**Score: 5/5** — Verified verbatim against `mawi-analysen` §2.9, including the specific detail that BOM component postings show but the parent article doesn't (since it carries no stock).

### Q19 — Wie hänge ich ein Z-File an eine Auftragsposition an?
**Score: 5/5** — Matches `basis` §7.2/§7.3 and `auf-pos` §4.3.3 closely, including the version 10.1-vs-10.2 behavioral difference.

### Q20 — Wie funktioniert der Ablauf einer Inventur mit dem Scanner?
**Score: 4.5/5** — The 6-step flow matches `mawi-lager`/`mawi-inv` directly (lock → scan → review → post with F8 → unlock → journal entry "Beleg Inventur Menge", all verified against source text). The tab-separated file-import format detail is real but pulled from a closely related section (standard/correction-file import) rather than the Scanner-flow section itself — a minor cross-reference rather than a fabrication.

---

## Summary of issues found

1. **Q1, Q13**: occasionally states a true ALMENDRO fact that wasn't actually in the retrieved context for that specific run (lucky but ungrounded) — not dangerous, but not verifiable from what the visitor was shown either.
2. **Q9**: misattributed which document a specific print function (X-Druck) applies to — a real, if minor, factual error.
3. **Q14**: fabricated specific numeric codes with false confidence, the most concrete hallucination found. Since these look authoritative (a specific flag value, an enumerated 0–4 range), this is the kind of error most likely to mislead a real user copying steps into the live system.

None of these rise to the severity of the original bug (a hallucinated reference to a document that doesn't exist in the corpus). The retrieval fixes hold up well across a broad, unseen question set spanning 15+ different manuals.
