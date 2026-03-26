let col = 2;
let row = 2;
let total;
let cellIndex;
let correctIndex;
let h, s, l;

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateColours() {
  h = Math.floor(Math.random() * 360);
  s = Math.floor(Math.random() * 100);
  l = Math.floor(Math.random() * 50) + 50;
}

function generateTable() {
  let table = `<table border="1" >`;
  let total = col * row;
  let correctIndex = generateRandomNumber(0, total);
  let cellIndex = 0;
  let cellSize = Math.max(400 / col, 12);

  generateColours();

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
  console.log(correctIndex);
  console.log(col, row);
}

function cellClicked() {
  col++;
  row++;
  generateTable();
}
