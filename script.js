let start = 0;
let scale = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0];
const urlParams = new URLSearchParams(window.location.search);
let strings = Number(urlParams.get("strings")) || 6;
strings++;

document.body.addEventListener("keydown", function (e) {
  if (e.key === "r") {
    scale = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    document.getElementById("scale").remove();
    start = 0;
    drawScale();
  }
});

document.body.addEventListener("click", function () {
  scale = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  document.getElementById("scale").remove();
  start = 0;
  drawScale();
});

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

  for (let line = 1; line < strings; line++) {
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

    for (let cell = 1; cell < 13; cell++) {
      const cellElement = document.createElement("div");
      const note = getNote(cell - 1);
      cellElement.className = `cell cell${cell} note${scale[note]}${
        note > 0 ? " selected" : ""
      }`;
      cellElement.addEventListener("click", (e) => {
        e.stopPropagation();
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
