

let green = 30000;
let yellow = 5000;

let currentIndex = 0;

let sec_1 = document.getElementById("time-left-1");
let sec_2 = document.getElementById("time-left-2");
let sec_3 = document.getElementById("time-left-3");
let sec_4 = document.getElementById("time-left-4");

let sec1 = 0
let sec3 = 29
let sec4 = 59
let sec2 = 89


const directions = ['signal-top', 'signal-right', 'signal-bottom', 'signal-left'];


function updateLights() {
    // updateTimes(currentIndex);
    directions.forEach((id) => {
        const block = document.getElementById(id)
        block.querySelector(".red").classList.add("active");
        block.querySelector(".green").classList.remove("active");
        block.querySelector(".yellow").classList.remove("active");
    })

    const currentBlock = document.getElementById(directions[currentIndex]);

    currentBlock.querySelector(".green").classList.add("active")
    currentBlock.querySelector(".red").classList.remove("active")

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % 4
        updateLights();
    }, green);

    setTimeout(() => {
        currentBlock.querySelector(".yellow").classList.add("active")
        currentBlock.querySelector(".green").classList.remove("active")
    }, green - yellow)

}


function updateTimes() {

    setInterval(() => {

        if (sec1 < -30) {
            sec1 = 88;
        }
        if (sec2 < -30) {
            sec2 = 88;
        }
        if (sec3 < -30) {
            sec3 = 88;
        }
        if (sec4 < -30) {
            sec4 = 88;
        }



        sec_1.innerHTML = sec1--;
        sec_2.innerHTML = sec2--;
        sec_3.innerHTML = sec3--;
        sec_4.innerHTML = sec4--;
    }, 1000)

    setInterval(() => {
        if (sec1 <= 0) {
            sec_1.innerHTML = "--:--" + "<br/>" + "You can go!"
        }
        if (sec2 <= 0) {
            sec_2.innerHTML = "--:--" + "<br/>" + "You can go!"
        }
        if (sec3 <= 0) {
            sec_3.innerHTML = "--:--" + "<br/>" + "You can go!"
        }
        if (sec4 <= 0) {
            sec_4.innerHTML = "--:--" + "<br/>" + "You can go!"
        }
    }, 1000)
}








