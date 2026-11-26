let scale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
const urlParams = new URLSearchParams(window.location.search);
const strings = Number(urlParams.get("strings")) || 6;

const PIANO_OCTAVES = 2;
// Pitch class 0 is A, so the leftmost piano key (C) is pitch class 3.
const PIANO_FIRST_NOTE = 3;
// The bottom-left grid cell (open low string) is E, pitch class 7, as on a guitar.
const GUITAR_FIRST_NOTE = 7;
const BLACK_KEYS = [1, 3, 6, 8, 10];
let hoveredNote = null;

function setHoveredNote(note) {
  hoveredNote = note;
  document.querySelectorAll("[data-note]").forEach((el) => {
    el.classList.toggle("hovered", Number(el.dataset.note) === note);
  });
}

function addHover(element, note) {
  element.dataset.note = note;
  if (note === hoveredNote) {
    element.classList.add("hovered");
  }
  element.addEventListener("mouseenter", () => setHoveredNote(note));
  element.addEventListener("mouseleave", () => setHoveredNote(null));
}

const themeSwitcher = document.getElementById("theme-switcher");

function setTheme(theme) {
  if (theme) {
    document.documentElement.dataset.theme = theme;
  } else {
    delete document.documentElement.dataset.theme;
  }
  themeSwitcher.value = theme;
  localStorage.setItem("theme", theme);
}

setTheme(localStorage.getItem("theme") || "");
themeSwitcher.addEventListener("change", () => setTheme(themeSwitcher.value));
// Body click clears the scale.
themeSwitcher.addEventListener("click", (e) => e.stopPropagation());

document.body.addEventListener("keydown", function (e) {
  if (e.key === "r") {
    scale = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    redraw();
  }
});

document.body.addEventListener("click", function () {
  scale = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  redraw();
});

function redraw() {
  document.getElementById("scale").remove();
  document.getElementById("piano").remove();
  drawScale();
  drawPiano();
}

function toggleNote(note) {
  if (scale[note] === 0) {
    scale[note] = 1;
  } else {
    scale[note] = 0;
  }

  redraw();
}

// Pitch class shown by a cell. `cell` and `line` are 1-based.
function calculateCellNote(cell, line) {
  return (GUITAR_FIRST_NOTE + cell - 1 + 5 * (line - 1)) % 12;
}

function drawScale() {
  const scaleElement = document.createElement("div");
  scaleElement.className = "scale";
  scaleElement.id = "scale";
  document.body.appendChild(scaleElement);

  for (let line = 1; line <= strings; line++) {
    const lineDiv = document.createElement("div");
    lineDiv.className = `line line${line}`;

    if (line === 1) {
      const dot1 = document.createElement("div");
      dot1.className = "dot dot1";

      const dot2 = document.createElement("div");
      dot2.className = "dot dot2";

      const dot3 = document.createElement("div");
      dot3.className = "dot dot3";

      const dot4 = document.createElement("div");
      dot4.className = "dot dot4";

      lineDiv.appendChild(dot1);
      lineDiv.appendChild(dot2);
      lineDiv.appendChild(dot3);
      lineDiv.appendChild(dot4);
    }

    scaleElement.appendChild(lineDiv);

    for (let cell = 1; cell <= 12; cell++) {
      const cellElement = document.createElement("div");
      const note = calculateCellNote(cell, line);
      cellElement.className = `cell cell${cell}${
        scale[note] ? " selected" : ""
      }`;
      cellElement.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleNote(note);
      });
      addHover(cellElement, note);

      lineDiv.appendChild(cellElement);
    }
  }
}

function drawPiano() {
  const pianoElement = document.createElement("div");
  pianoElement.className = "piano";
  pianoElement.id = "piano";
  document.body.appendChild(pianoElement);

  let whiteKeys = 0;

  for (let key = 0; key < 12 * PIANO_OCTAVES; key++) {
    const note = (key + PIANO_FIRST_NOTE) % 12;
    const black = BLACK_KEYS.includes(key % 12);
    const keyElement = document.createElement("div");
    keyElement.className = `key ${black ? "black" : "white"}${
      scale[note] ? " selected" : ""
    }`;

    if (black) {
      keyElement.style.left = `calc(${whiteKeys} * (var(--white-key-width) - 1px) - var(--black-key-width) / 2)`;
    } else {
      whiteKeys++;
    }

    keyElement.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNote(note);
    });
    addHover(keyElement, note);

    pianoElement.appendChild(keyElement);
  }
}

drawScale();
drawPiano();
