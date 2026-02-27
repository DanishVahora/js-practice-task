function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

let h, s, l;

function generateRandomHslColor() {
    h = Math.floor(Math.random() * 360);
    s = Math.floor(Math.random() * 100);
    l = Math.floor(Math.random() * 50) + 50;
}

let row = 2;
let col = 2;
let score = 0;
let gameTime = 30



let totalScore = document.getElementById("score")

function generateTable() {
    document.getElementById("message").innerHTML = ""

    if (col === 2) {
        startTimer();
    }
    let table = `<table border="1" style="border-collapse:collapse">`
    let total = col * row;
    let correctIndex = getRandomNum(0, total)
    let cellIndex = 0;
    let cellSize = Math.max(400 / col, 12);

    generateRandomHslColor();

    for (let i = 0; i < row; i++) {
        table += `<tr>`
        for (let j = 0; j < col; j++) {
            if (cellIndex === correctIndex) {
                table += `<td style="width:${cellSize}px; height:${cellSize}px; background-color:hsl(${h},${s}%,${Math.max(l - 10, 0)}%)" onclick="cellClicked()"></td>`;
            } else {
                table += `<td style="width:${cellSize}px; height:${cellSize}px; background-color:hsl(${h},${s}%,${l}%) ;"></td>`;
            }
            cellIndex++;
        }
        table += `</tr>`
    }
    table += `</table>`
    document.getElementById("grid").innerHTML = table
}

let intervalId = null;

function startTimer() {

    if (intervalId) return;

    intervalId = setInterval(() => {
        if (gameTime > 0) {
            gameTime--;
            document.getElementById("time").innerHTML = gameTime;
        } else {
            document.getElementById("message").innerHTML = `Game over!! Your score is : ${score}`

            stopGame();
        }
    }, 1000);
}

function pauseGame() {
    let cells = document.querySelectorAll("td");
    cells.forEach(cell => cell.style.pointerEvents = "none");
    clearInterval(intervalId);
    intervalId = null;
}

function togglePause() {
    if (intervalId) {
        pauseGame();
        document.getElementById("pauseButton").innerText = "Resume";
    } else {
        resumeGame();
        document.getElementById("pauseButton").innerText = "Pause";
    }
}

function resumeGame() {
    startTimer();
    let cells = document.querySelectorAll("td");
    cells.forEach(cell => cell.style.pointerEvents = "auto");
}

function stopGame() {
    clearInterval(intervalId);
    intervalId = null;
    gameTime = 30;
    let cells = document.querySelectorAll("td");
    cells.forEach(cell => cell.style.pointerEvents = "none");
    document.getElementById("time").innerHTML = gameTime;
    row = 2; col = 2; score = 0;
    totalScore.innerHTML = score;

    document.getElementById("generteBtn").innerHTML = "Restart"

}


function cellClicked() {

    col++
    row++
    score++
    generateTable()
    totalScore.innerHTML = score;

}