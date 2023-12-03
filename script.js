let start = 0;
/* const scale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; */
const scale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];

function toggleNote(note) {
  if (scale[note] === 0) {
    scale[note] = 1;
  } else {
    scale[note] = 0;
  }

  document.getElementById("scale").remove();
  start = 0;
  drawScale();
}

function getNote(cell) {
  let firstNote = cell + start;

  if (firstNote > 11) {
    firstNote -= 12;
  }

  return scale[firstNote];
}

function drawScale() {
  const scaleElement = document.createElement("div");
  scaleElement.className = "scale";
  scaleElement.id = "scale";
  document.body.appendChild(scaleElement);

  _.range(1, 8).map((line) => {
    const lineDiv = document.createElement("div");
    lineDiv.className = `line line${line}`;

    scaleElement.appendChild(lineDiv);

    _.range(1, 13).map((cell) => {
      const cellElement = document.createElement("div");
      const note = getNote(cell - 1);
      cellElement.className = `cell cell${cell} note${scale[note]}${
        note > 0 ? " selected" : ""
      }`;
      cellElement.addEventListener("click", () => {
        toggleNote(cell - 1);
      });

      lineDiv.appendChild(cellElement);
    });

    start += 5;

    if (start > 11) {
      start -= 12;
    }
  });
}

drawScale();
