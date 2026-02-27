const lights = document.querySelectorAll('.traffic-light');
let currentLane = 0;

function runTrafficCycle() {
    lights.forEach(light => {
        light.querySelectorAll('.bulb').forEach(b => b.classList.remove('active'));
        light.querySelector('.red').classList.add('active');
    });

    const activeLane = lights[currentLane];
    activeLane.querySelector('.red').classList.remove('active');
    activeLane.querySelector('.green').classList.add('active');

    setTimeout(() => {
        activeLane.querySelector('.green').classList.remove('active');
        activeLane.querySelector('.yellow').classList.add('active');
    }, 25000); 

    // 4. After 30s total, move to next lane clockwise
    setTimeout(() => {
        currentLane = (currentLane + 1) % lights.length;
        runTrafficCycle();
    }, 30000);
}

runTrafficCycle();
