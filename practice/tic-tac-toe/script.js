const winningArr = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
]

let found = false

let turn = "x"
let xMoves = []
let oMoves = []

document.querySelectorAll("td").forEach(td => {
    td.addEventListener("click", (e) => {
        moveTaken(e.target.id);
    })
})

function moveTaken(id) {

    if (turn === "X") {
        document.getElementById(id).innerText = "X"
        xMoves.push(Number(id))
        if (checkWinner(xMoves)) {
            document.getElementById("msg").innerText = "X won"
        }
        turn = "0";
    }
    else {
        document.getElementById(id).innerText = "0"
        oMoves.push(Number(id))
        if (checkWinner(oMoves)) {
            document.getElementById("msg").innerText = "0 won"
        }
        turn = "X"
    }

    if ((xMoves.length + oMoves.length) == 9 && !found) {
        document.getElementById("msg").innerText = "DRAW"
        document.querySelectorAll("td").forEach(td => {
            td.style.pointerEvents = "none"
        })
    }
}

function checkWinner(arr) {
    for (let i of winningArr) {
        count = 0;
        for (let j of i) {
            if (arr.includes(j)) {
                count++
            }
        }
        if (count == 3) {
            found = true;
            document.querySelectorAll("td").forEach(td => {
                td.style.pointerEvents = "none"
            })
            return true;
        }
    }

    return false

}