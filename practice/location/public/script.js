const countryDropdown = document.getElementById("country")
const stateDropdown = document.getElementById("state")
const cityDropdown = document.getElementById("city")

countryDropdown.addEventListener("change", async () => {

    stateDropdown.innerHTML = `<option value="select">select</option>`
    cityDropdown.innerHTML = ` <option value="select">select</option>`
    let country = countryDropdown.value;
    let res = await fetch(`http://localhost:3000/state?country=${country}`)
    let states = await res.json();

    states.forEach(s => {
        const option = document.createElement('option')
        option.value = s.state_name
        option.textContent = s.state_name
        stateDropdown.appendChild(option);
    });
})

stateDropdown.addEventListener("change", async () => {

    cityDropdown.innerHTML = ` <option value="select">select</option>`
    let state = stateDropdown.value;
    let resp = await fetch(`http://localhost:3000/city?state=${state}`)
    let cities = await resp.json();

    cities.forEach(c => {
        const option = document.createElement('option')
        option.value = c.city_name
        option.textContent = c.city_name
        cityDropdown.appendChild(option)
    });
})