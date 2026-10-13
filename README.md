# twelve

An interactive "2D scale" for exploring scales, modes and intervals on a guitar/piano hybrid layout.

## Abstract

Western music has twelve pitch classes. Instruments present them in different ways. A piano lays them out in one dimension, with the pattern repeating every octave. A guitar lays them out in two dimensions (strings by frets), but the usual tuning breaks the pattern, because one string pair is a major third apart instead of a fourth.

`twelve` combines the two. It is a grid with one row per string and 12 columns per row. Every row is tuned a perfect fourth (P4, 5 semitones) above the one below it, so the layout is uniform. A scale is a set of pitch classes, and the same set is highlighted wherever it occurs in the grid. Because the tuning is uniform, a scale or interval always produces the same shape, wherever it starts. Learning the shape once gives you every transposition, and a mode is the same shape read from a different starting note.

The project is deliberately small: a static page of HTML, CSS and vanilla JavaScript, with no build step and no dependencies.

## Intent

The tool is meant to help you see music theory, not to play or notate it.

- **Scales:** toggle pitch classes on and off and see the resulting pattern across the whole grid.
- **Modes:** the diatonic scale is one pattern of seven notes. Its modes are the same pattern with a different note treated as the root, so they differ in where you start reading rather than in the shape.
- **Intervals:** because rows are a fixed interval apart, intervals appear as fixed geometric relationships between cells. Moving up one row is +5 semitones. A given interval has the same offset everywhere in the grid.
- **Transposition:** moving a shape to another place in the grid transposes it, so the shape never has to be relearned.

The page shows only pitch-class membership. It has no note names, no octave register, no audio and no fixed root. This keeps the focus on structure.

## Specification

### Model

- The state is a 12-element array, `scale`, indexed by pitch class. `1` means the pitch class is in the scale and `0` means it is not.
- Index `0` is only a reference point, the leftmost cell of the bottom row. It is not a note name and not a root.
- The default state is the diatonic scale: `[1,0,1,1,0,1,0,1,1,0,1,0]`. Read from index 0, this has seven notes with the interval pattern 2-1-2-2-1-2-2, which is the natural minor mode. Every mode of the diatonic scale is a rotation of this array.

### Layout

- The grid has `strings` rows and 12 columns. The default is 6 rows and can be changed with the `?strings=N` URL parameter, for example `?strings=4`.
- Row 1 is at the bottom. Each row above it is shifted by +5 semitones (P4), wrapping at 12.
- Cell `c` (0-based) in row `r` (0-based) shows pitch class `(c + 5r) mod 12`.
- Column 1 is the open string and columns 2 to 12 correspond to frets 1 to 11, as on a guitar.
- Four fixed inlay-style markers sit at frets 3, 5, 7 and 9, like the dots on a guitar neck.
- Cells in the scale are white and the others are dark grey, like the keys of a piano.
- Below the grid, a two-octave piano keyboard (starting on C) shows the same scale with the same colours. Pitch class `0` is A, so the default diatonic scale lights exactly the white keys.

### Interaction

| Input | Effect |
| --- | --- |
| Click a cell | Toggle that cell's pitch class. Every cell with the same pitch class changes. |
| Click a piano key | Toggle that key's pitch class, in both views. |
| Click the background | Clear the scale (all pitch classes off). |
| Press `r` | Clear the scale. |
| Load the page | Show the default diatonic scale. |
| `?strings=N` | Set the number of rows. A missing, zero or non-numeric value falls back to 6. |

Each change rebuilds the grid from the `scale` array. State is not persisted, so reloading the page restores the default.

### Implementation

- `index.html` is an empty page that loads `style.css` and `script.js`.
- `script.js` keeps the `scale` array, builds the grid and handles input.
  - `drawScale()` creates the DOM: one container `#scale`, one `.line` per string, and 12 `.cell` elements per line.
  - `getNote()` computes which pitch class a cell shows from its column and the row's offset.
  - `calculateCellOffset()` is the inverse. It maps a clicked cell back to a pitch class, using a lookup per row.
  - `toggleNote()` flips a pitch class and calls `redraw()`, which rebuilds both views.
  - `drawPiano()` creates `#piano`: white keys in a flex row, with black keys absolutely positioned over them.
- `style.css` lays the grid out with flexbox. Rows are stacked in reverse order so row 1 is at the bottom, and the inlay markers are absolutely positioned.

### Running

There is nothing to build or install. Serve the folder with any static file server and open it in a browser, for example:

```
npx serve -l 3000 .
```

Then open `http://localhost:3000/`.

## Known limitations

- The marker dots use hardcoded pixel positions that assume 6 rows, so they are misplaced with other string counts.
- `calculateCellOffset()` has explicit cases for rows 1 to 7 only. Beyond 7 rows, clicks toggle the wrong pitch class.
- `getNote()` returns the 0/1 value of the scale and `drawScale()` then uses it as an index into `scale`. This works by accident in the default case and is likely to cause surprises if the code changes.
- The whole grid is rebuilt on every click. This is fine at this size but not a pattern to scale up.
- There is no keyboard or screen-reader accessibility beyond the `r` shortcut, and no persistence.

## Possible directions

These are ideas, not commitments.

- Root and mode selection, with rotation of the scale.
- Interval labels or highlights relative to a chosen root.
- Optional note names, with the choice of root made explicit.
- Presets for common scales and modes.
- Replacing the per-row lookup with arithmetic, `(5 * (row - 1)) mod 12`, which would remove the 7-row limit.
- Audio playback.
- Persisting the scale in the URL.
