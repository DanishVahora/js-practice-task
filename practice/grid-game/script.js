let h, s, l;
let col = 2;
let row = 2;
let score = 0;
let correctIndex;
let cellSize
let gameTime = 10


function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

function generateColor() {
    h = Math.floor(Math.random() * 360)
    s = Math.floor(Math.random() * 100)
    l = Math.floor(Math.random() * 50) + 50
}

function generateTable() {
    if (col == 2) {
        startTimer()
    }
    let total = col * row;
    correctIndex = getRandomNum(0, total)
    console.log(correctIndex);
    generateColor();

    let table = `<table border="1" style="border-collapse: collapse;">`
    let cellIndex = 0;
    cellSize = Math.max(400 / col, 12)
    for (let i = 0; i < row; i++) {
        table += `<tr>`
        for (let j = 0; j < col; j++) {
            if (cellIndex === correctIndex) {
                table += `<td style="background-color: hsl(${h}, ${s}%, ${Math.max(l - 10, 0)}%); height: ${cellSize}px; width: ${cellSize}px;" onclick="cellClicked()"></td>`
            }
            else {
                table += `<td style="background-color: hsl(${h}, ${s}%, ${l}%); height: ${cellSize}px; width: ${cellSize}px;"></td>`
            }
            cellIndex++;
        }
        table += `</tr>`
    }
    table += `</table>`
    document.getElementById('grid').innerHTML = table
}

let intervalId = null
function startTimer() {
    intervalId = setInterval(() => {
        if (gameTime < 1) {
            clearInterval(intervalId)
            document.querySelectorAll("td").forEach(td => {
                td.style.pointerEvents = "none";
            })
        }
        document.getElementById("time").innerText = gameTime;
        gameTime--;
    }, 1000);
}


function cellClicked() {
    console.log("cell clicked")
    col++
    row++
    score++
    document.getElementById("score").innerText = score
    generateTable();
}