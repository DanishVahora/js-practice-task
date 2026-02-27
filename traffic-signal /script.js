const green = 3000; 
const yellow = 500; 

const directions = ['signal-top', 'signal-right', 'signal-bottom', 'signal-left'];
let currentIndex = 0;

function updateLights() {
    directions.forEach(id => {
        const block = document.getElementById(id);
        block.querySelector('.red').classList.add('active');
        block.querySelector('.yellow').classList.remove('active');
        block.querySelector('.green').classList.remove('active');
    });

    const currentBlock = document.getElementById(directions[currentIndex]);
    currentBlock.querySelector('.red').classList.remove('active');
    currentBlock.querySelector('.green').classList.add('active');

    setTimeout(() => {
        currentBlock.querySelector('.green').classList.remove('active');
        currentBlock.querySelector('.yellow').classList.add('active');
    }, green - yellow);

    setTimeout(() => {
        currentIndex = (currentIndex + 1) % 4
        updateLights();
    }, green);
    console.log()
}

