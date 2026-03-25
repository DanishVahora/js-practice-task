
const cityDropdown = document.getElementById("city")
const stateDropdown = document.getElementById("state")
const countryDropdown = document.getElementById("country")

window.onload = async () => {
    const res = await fetch(`http://localhost:3000/ap/country`)
    const country = await res.json()

    country.forEach(s => {
        const option = document.createElement("option")
        option.value = s.country_name
        option.textContent = s.country_name
        countryDropdown.appendChild(option)
    });
}

countryDropdown.addEventListener("change", async () => {
    const country = countryDropdown.value;

    stateDropdown.innerHTML = `<option value="select">select</option>`
    cityDropdown.innerHTML = `<option value="select">select</option>`

    const res = await fetch(`http://localhost:3000/ap/state?country=${country}`)
    const states = await res.json();


    states.forEach(s => {
        const option = document.createElement("option")
        option.value = s.state_name
        option.textContent = s.state_name
        stateDropdown.appendChild(option)
    });
})

stateDropdown.addEventListener("change", async () => {
    const state = stateDropdown.value;

    cityDropdown.innerHTML = `<option value="select">select</option>`


    const res = await fetch(`http://localhost:3000/ap/city?state=${state}`)
    const cities = await res.json();

    cities.forEach(c => {
        const option = document.createElement("option")
        option.value = c.city_name
        option.textContent = c.city_name
        cityDropdown.appendChild(option)
    });
})

const arr1 = ["basic", "edu", "exp", "lang", "tech", "ref", "pref"]
const arr2 = ["basic_details", "education_details", "experience", "languages_known", "technologies_known", "reference_contact", "preferences"]
const allButtons = document.querySelectorAll("#basic, #edu, #exp, #lang, #tech, #ref, #pref");
const allDivs = document.querySelectorAll("#basic_details, #education_details, #experience, #languages_known, #technologies_known, #reference_contact, #preferences");

for (let i = 0; i < 7; i++) {
    document.getElementById(arr1[i]).addEventListener("click", () => {

        allButtons.forEach(but => {
            but.style.backgroundColor = "white"
            but.style.color = "black"
        })

        allDivs.forEach(div => {
            div.style.display = "none";
        })
        document.getElementById(arr2[i]).style.display = "block";
        document.getElementById("sub").style.display = "none"


        document.getElementById(arr1[i]).style.backgroundColor = "black";
        document.getElementById(arr1[i]).style.color = "white";
        if (i == 6) {
            document.getElementById("sub").style.display = "block"
        }


    })
}


let education_index = 2;
let experience_index = 2;
let languageIndex = 4;
let technologyIndex = 5;
const API_BASE_URL = "http://localhost:3000";


function addEducation() {
    document.getElementById("education_container").insertAdjacentHTML("beforeend", `<hr id="hr_${education_index}"/>
                    <label id="course_label_${education_index}" for="course_${education_index}">Course:</label>
                    <input type="text" id="course_${education_index}" name="course"><br><br>
                    <label id="passing_year_label_${education_index}" for="passing_year_${education_index}">Passing Year:</label>
                    <input type="number" id="passing_year_${education_index}" name="passing_year_${education_index}">
                    <label id="uni_board_label_${education_index}" style="padding-left: 40px;" for="uni_board_${education_index}">University/Board:</label>
                    <input type="text" id="uni_board_${education_index}" name="uni_board_${education_index}">
                    <label id="percentage_label_${education_index}" style="padding-left: 40px;" for="percentage_${education_index}">Percentage:</label>
                    <input type="number" id="percentage_${education_index}" name="percentage_${education_index}" step="0.01">
                    <button type="button" id="remove_edu_${education_index}" onclick="removeEducationId(${education_index})">X</button>`);

    education_index++;
}
function removeEducationId(index) {
    document.getElementById(`hr_${index}`)?.remove();
    document.getElementById(`passing_year_label_${index}`)?.remove();
    document.getElementById(`uni_board_label_${index}`)?.remove();
    document.getElementById(`percentage_label_${index}`)?.remove();
    document.getElementById(`course_label_${index}`)?.remove();
    document.getElementById(`course_${index}`)?.remove();
    document.getElementById(`passing_year_${index}`)?.remove();
    document.getElementById(`uni_board_${index}`)?.remove();
    document.getElementById(`percentage_${index}`)?.remove();
    document.getElementById(`remove_edu_${index}`)?.remove();
}

function removeEducation() {
    if (education_index <= 2) {
        return;
    }

    const lastIndex = education_index - 1;
    document.getElementById(`hr_${lastIndex}`)?.remove();
    document.getElementById(`passing_year_label_${lastIndex}`)?.remove();
    document.getElementById(`uni_board_label_${lastIndex}`)?.remove();
    document.getElementById(`percentage_label_${lastIndex}`)?.remove();
    document.getElementById(`course_label_${lastIndex}`)?.remove();
    document.getElementById(`course_${lastIndex}`)?.remove();
    document.getElementById(`passing_year_${lastIndex}`)?.remove();
    document.getElementById(`uni_board_${lastIndex}`)?.remove();
    document.getElementById(`percentage_${lastIndex}`)?.remove();
    document.getElementById(`remove_edu_${lastIndex}`)?.remove();

    education_index--;
}

function addExperience() {
    document.getElementById("experience_container").insertAdjacentHTML("beforeend", `<hr id="hr_exp_${experience_index}"/>
                    <label id="company_label_${experience_index}" for="company_${experience_index}">Company:</label>
                    <input type="text" id="company_${experience_index}" name="company_${experience_index}">
                    <label id="designation_label_${experience_index}" style="padding-left: 75px;" for="designation_${experience_index}">Designation:</label>
                    <input type="text" id="designation_${experience_index}" name="designation_${experience_index}">
                    <label id="annual_package_label_${experience_index}" style="padding-left: 75px;" for="annual_package_${experience_index}">Annual Package:</label>
                    <input type="number" id="annual_package_${experience_index}" name="annual_package_${experience_index}" step="0.01"><br><br>
                    <label id="from_label_${experience_index}" for="from_${experience_index}">From:</label>
                    <input type="date" id="from_${experience_index}" name="from_${experience_index}">
                    <label id="to_label_${experience_index}" style="padding-left: 75px;" for="to_${experience_index}">To:</label>
                    <input type="date" id="to_${experience_index}" name="to_${experience_index}">
                    <label id="reason_to_leave_label_${experience_index}" style="padding-left: 75px;" for="reason_to_leave_${experience_index}">Reason for Leaving:</label>
                    <input type="text" name="reason_to_leave_${experience_index}" id="reason_to_leave_${experience_index}"><br><br>
                    <label id="ref_contact_label_${experience_index}" for="ref_contact_${experience_index}">Referral Contact:</label>
                    <input type="text" id="ref_contact_${experience_index}" name="ref_contact_${experience_index}">
                    <label id="ref_name_label_${experience_index}" style="padding-left: 75px;" for="ref_name_${experience_index}">Referral Name:</label>
                    <input type="text" id="ref_name_${experience_index}" name="ref_name_${experience_index}">
                    <button type="button" id="remove_exp_${experience_index}" onclick="removeExperienceId(${experience_index})">X</button>
                    `);
    experience_index++;
}

function removeExperienceId(index) {
    document.getElementById(`hr_exp_${index}`)?.remove();
    document.getElementById(`company_label_${index}`)?.remove();
    document.getElementById(`designation_label_${index}`)?.remove();
    document.getElementById(`annual_package_label_${index}`)?.remove();
    document.getElementById(`from_label_${index}`)?.remove();
    document.getElementById(`to_label_${index}`)?.remove();
    document.getElementById(`reason_to_leave_label_${index}`)?.remove();
    document.getElementById(`ref_contact_label_${index}`)?.remove();
    document.getElementById(`ref_name_label_${index}`)?.remove();
    document.getElementById(`company_${index}`)?.remove();
    document.getElementById(`designation_${index}`)?.remove();
    document.getElementById(`annual_package_${index}`)?.remove();
    document.getElementById(`from_${index}`)?.remove();
    document.getElementById(`to_${index}`)?.remove();
    document.getElementById(`reason_to_leave_${index}`)?.remove();
    document.getElementById(`ref_contact_${index}`)?.remove();
    document.getElementById(`ref_name_${index}`)?.remove();
    document.getElementById(`remove_exp_${index}`)?.remove();
}


function removeExperience() {
    if (experience_index <= 2) {
        return;
    }

    const lastIndex = experience_index - 1;
    document.getElementById(`hr_exp_${lastIndex}`)?.remove();
    document.getElementById(`company_label_${lastIndex}`)?.remove();
    document.getElementById(`designation_label_${lastIndex}`)?.remove();
    document.getElementById(`annual_package_label_${lastIndex}`)?.remove();
    document.getElementById(`from_label_${lastIndex}`)?.remove();
    document.getElementById(`to_label_${lastIndex}`)?.remove();
    document.getElementById(`reason_to_leave_label_${lastIndex}`)?.remove();
    document.getElementById(`ref_contact_label_${lastIndex}`)?.remove();
    document.getElementById(`ref_name_label_${lastIndex}`)?.remove();
    document.getElementById(`company_${lastIndex}`)?.remove();
    document.getElementById(`designation_${lastIndex}`)?.remove();
    document.getElementById(`annual_package_${lastIndex}`)?.remove();
    document.getElementById(`from_${lastIndex}`)?.remove();
    document.getElementById(`to_${lastIndex}`)?.remove();
    document.getElementById(`reason_to_leave_${lastIndex}`)?.remove();
    document.getElementById(`ref_contact_${lastIndex}`)?.remove();
    document.getElementById(`ref_name_${lastIndex}`)?.remove();
    document.getElementById(`remove_exp_${lastIndex}`)?.remove();
    experience_index--;
}

function checkBox(checkbox) {
    const containerId = `${checkbox.id}_skills`;
    let container = document.getElementById(containerId);

    if (checkbox.checked) {
        if (!container) {
            container = document.createElement("span");
            container.id = containerId;
            checkbox.insertAdjacentElement("afterend", container);
        }

        container.innerHTML = ` :
            <input type="checkbox" name="read_${checkbox.id}" id="read_${checkbox.id}" value="read">
            <label id="read_label_${checkbox.id}" for="read_${checkbox.id}">Read</label>
            <input type="checkbox" name="write_${checkbox.id}" id="write_${checkbox.id}" value="write">
            <label id="write_label_${checkbox.id}" for="write_${checkbox.id}">Write</label>
            <input type="checkbox" name="speak_${checkbox.id}" id="speak_${checkbox.id}" value="speak">
            <label id="speak_label_${checkbox.id}" for="speak_${checkbox.id}">Speak</label>`;
    } else {
        container?.remove();
    }
}

function radioButton(checkbox) {
    const containerId = `${checkbox.id}_skills`;
    let container = document.getElementById(containerId);

    if (checkbox.checked) {
        if (!container) {
            container = document.createElement("span");
            container.id = containerId;
            checkbox.insertAdjacentElement("afterend", container);
        }

        const groupName = `tech_level_${checkbox.id}`;

        container.innerHTML = ` :
            <input type="radio" name="${groupName}" id="beginner_${checkbox.id}" value="beginner">
            <label id="beginner_label_${checkbox.id}" for="beginner_${checkbox.id}">Beginner</label>
            <input type="radio" name="${groupName}" id="intermediate_${checkbox.id}" value="intermediate">
            <label id="intermediate_label_${checkbox.id}" for="intermediate_${checkbox.id}">Intermediate</label>
            <input type="radio" name="${groupName}" id="expert_${checkbox.id}" value="expert">
            <label id="expert_label_${checkbox.id}" for="expert_${checkbox.id}">Expert</label>`;
    } else {
        container?.remove();
    }
}

function addLanguage() {
    const input = document.getElementById("language_input");
    const name = input.value.trim();

    if (!name) {
        return;
    }

    const id = `language_${languageIndex++}`;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<label for="${id}">${name}</label>
                    <input type="checkbox" id="${id}" name="${id}" value="${name}" onclick="checkBox(this)">
                    <button type="button" id="remove_lang_${languageIndex - 1}" onclick="removeLanguageId(${languageIndex - 1})">X</button>
                    <br>`;

    document.getElementById("languages_list").appendChild(wrapper);
    input.value = "";
}

function removeLanguageId(index) {
    document.getElementById(`read_label_language_${index}`)?.remove();
    document.getElementById(`write_label_language_${index}`)?.remove();
    document.getElementById(`speak_label_language_${index}`)?.remove();
    document.getElementById(`read_language_${index}`)?.remove();
    document.getElementById(`write_language_${index}`)?.remove();
    document.getElementById(`speak_language_${index}`)?.remove();
    document.getElementById(`remove_lang_${index}`)?.remove();
    document.getElementById(`language_${index}`)?.remove();
}

function addTechnology() {
    const input = document.getElementById("technology_input");
    const name = input.value.trim();

    if (!name) {
        return;
    }

    const id = `technology_${technologyIndex++}`;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `<label for="${id}">${name}</label>
                    <input type="checkbox" id="${id}" name="${id}" value="${name}" onclick="radioButton(this)"><br>`;

    document.getElementById("technologies_list").appendChild(wrapper);
    input.value = "";
}

