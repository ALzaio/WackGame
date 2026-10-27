# Blockchain in the Oil & Gas Industry: animated slides

This is an animated slide show for the CGEB4112 Group 10 presentation (about 8½ minutes). It is one 16:9 frame that you advance by hand while the speakers talk. Nothing on screen scrolls.

**To run it:** double-click `index.html` and open it in Chrome or Edge. It works offline because all the fonts and photos are in `assets/`. Press **F** for fullscreen.

## Controls

| Key | Tap | Double-tap | Hold |
|---|---|---|---|
| → · Space · PageDown · click right half | next beat | jump to the next scene | fast-forward |
| ← · PageUp · click left half | previous beat | start of this scene (again: previous scene) | rewind |

| Key | Action |
|---|---|
| Phone / tablet | tap the right or left half, or swipe; press and hold to fast-forward; ⛶ button for fullscreen |
| Home | back to the title page |
| F | fullscreen |
| B | black screen |
| A | Auto mode (plays like a video; hold → for 2×) |
| P | thin progress line |
| 1–6 | jump to Part A–F (rehearsal only) |

## Files

- `index.html`, `styles.css`: the frame and the visual system
- `app.js`: the engine (stage scaling, input, beat runner, crossfades and FLIP moves, Auto mode)
- `scenes.js`: a title page (logo, course, Group 10 members) plus the 15 scenes and their 66 beats. Beat counts match the ▸ lines in `script.md`
- `assets/img/`: photos (sources are in `credits.md`)
- `assets/fonts/`: Source Serif 4, IBM Plex Sans and IBM Plex Mono (SIL Open Font License)
- `tools/build-single-file.py`: builds one self-contained HTML file (everything inlined) that is easy to carry on a USB stick
- `slides.pdf`: the title page plus one page per scene (16 pages) for the BRIGHTEN upload. To rebuild it, run `node tools/make-slides-pdf.js` (needs Playwright)

To open the show at a particular beat while rehearsing, add `?scene=7&beat=2` to the URL.
