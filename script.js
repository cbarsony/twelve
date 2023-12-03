let start = 0;
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

function calculateCellOffset(cell, line) {
  let result = cell;

  switch (line) {
    case 1:
      result = cell;
      break;

    case 2:
      result = cell - 7;
      break;

    case 3:
      result = cell - 2;
      break;

    case 4:
      result = cell + 3;
      break;

    case 5:
      result = cell + 8;
      break;

    case 6:
      result = cell + 1;
      break;

    case 7:
      result = cell + 6;
      break;

    default:
      result = cell;
      break;
  }

  if (result < 1) {
    result += 12;
  }

  if (result > 12) {
    result -= 12;
  }

  return result;
}

function drawScale() {
  const scaleElement = document.createElement("div");
  scaleElement.className = "scale";
  scaleElement.id = "scale";
  document.body.appendChild(scaleElement);

  for(let line = 1; line < 8; line++) {
    const lineDiv = document.createElement("div");
    lineDiv.className = `line line${line}`;

    scaleElement.appendChild(lineDiv);

    for(let cell = 1; cell < 13; cell++) {
      const cellElement = document.createElement("div");
      const note = getNote(cell - 1);
      cellElement.className = `cell cell${cell} note${scale[note]}${
        note > 0 ? " selected" : ""
      }`;
      cellElement.addEventListener("click", () => {
        toggleNote(calculateCellOffset(cell, line) - 1);
      });

      lineDiv.appendChild(cellElement);
    }

    start += 5;

    if (start > 11) {
      start -= 12;
    }
  }
}

drawScale();
