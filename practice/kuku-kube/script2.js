let col = 2;
let row = 2;
let total;
let h, s, l;
let cellSize;
let time = 30;
let score = 0;

function getRandomNum(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomHslColour() {
  h = Math.floor(Math.random() * 360);
  s = Math.floor(Math.random() * 100);
  l = Math.floor(Math.random() * 50) + 50;
}

let intervalId = null;

function startTimer() {
  intervalId = setInterval(() => {
    if (time > 0) {
      document.getElementById("time").innerText = time;
      time--;
    } else {
      document.getElementById("message").innerHTML =
        `Game over!! Your score is : ${score}`;

      stopGame();
    }
  }, 1000);
}

function stopGame() {
  clearInterval(intervalId);
}

function generateTable() {
  document.getElementById("message").innerHTML = "";

  if (col === 2) {
    startTimer();
  }
  let table = `<table border="1" style="border-collapse:collapse">`;
  let total = col * row;
  let correctIndex = getRandomNum(0, total);
  let cellIndex = 0;
  let cellSize = Math.max(400 / col, 12);

  getRandomHslColour();

  for (let i = 0; i < row; i++) {
    table += `<tr>`;
    for (let j = 0; j < col; j++) {
      if (cellIndex === correctIndex) {
        table += `<td style="width:${cellSize}px; height:${cellSize}px; background-color:hsl(${h},${s}%,${Math.max(l - 10, 0)}%)" onclick="cellClicked()"></td>`;
      } else {
        table += `<td style="width:${cellSize}px; height:${cellSize}px; background-color:hsl(${h},${s}%,${l}%) ;"></td>`;
      }
      cellIndex++;
    }
    table += `</tr>`;
  }
  table += `</table>`;
  document.getElementById("grid").innerHTML = table;
}

function cellClicked() {
  col++;
  row++;
  score++;
  generateTable();
  document.getElementById("score").innerText = score;
}
