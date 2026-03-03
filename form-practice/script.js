let education_index = 2;
let experience_index = 2;
let languageIndex = 4;
let technologyIndex = 5;

function addEducation() {
    document.getElementById("education_container").innerHTML += `<hr id="hr_${education_index}"/>
                    <label id="course_label_${education_index}" for="course_${education_index}">Course:</label>
                    <input type="text" id="course_${education_index}" name="course"><br><br>
                    <label id="passing_year_label_${education_index}" for="passing_year_${education_index}">Passing Year:</label>
                    <input type="number" id="passing_year_${education_index}" name="passing_year_${education_index}">
                    <label id="uni_board_label_${education_index}" style="padding-left: 40px;" for="uni_board_${education_index}">University/Board:</label>
                    <input type="text" id="uni_board_${education_index}" name="uni_board_${education_index}">
                    <label id="percentage_label_${education_index}" style="padding-left: 40px;" for="percentage_${education_index}">Percentage:</label>
                    <input type="number" id="percentage_${education_index}" name="percentage_${education_index}" step="0.01">`;
    education_index++;
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

    education_index--;
}

function addExperience() {
    document.getElementById("experience_container").innerHTML += `<hr id="hr_exp_${experience_index}"/>
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
                    <input type="text" name="reason_to_leave_${experience_index}" id="reason_to_leave_${experience_index}"></input><br><br>
                    <label id="ref_contact_label_${experience_index}" for="ref_contact_${experience_index}">Referral Contact:</label>
                    <input type="text" id="ref_contact_${experience_index}" name="ref_contact_${experience_index}">
                    <label id="ref_name_label_${experience_index}" style="padding-left: 75px;" for="ref_name_${experience_index}">Referral Name:</label>
                    <input type="text" id="ref_name_${experience_index}" name="ref_name_${experience_index}">`;
    experience_index++;
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

        container.innerHTML = ` : <input type="checkbox" name="read_${checkbox.id}" id="read_${checkbox.id}">
                <label id="read_label_${checkbox.id}" for="read_${checkbox.id} value="read">Read</label>
                <input type="checkbox" name="write_${checkbox.id}" id="write_${checkbox.id}">
                <label id="write_label_${checkbox.id}" for="write_${checkbox.id} value="write">Write</label>
                <input type="checkbox" name="speak_${checkbox.id}" id="speak_${checkbox.id}">
                <label id="speak_label_${checkbox.id}" for="speak_${checkbox.id} value="speak">Speak</label>`;
    } else {
        container?.remove();
    }
}

function radioButton(radio) {
    const containerId = `${radio.id}_skills`;
    let container = document.getElementById(containerId);

    if (radio.checked) {
        if (!container) {
            container = document.createElement("span");
            container.id = containerId;
            radio.insertAdjacentElement("afterend", container);
        }

        container.innerHTML = ` : <input type="radio" name="beginner_${radio.name}" id="beginner_${radio.id}" value="beginner">
                <label id="beginner_label_${radio.id}" for="beginner_${radio.id}">Beginner</label>
                <input type="radio" name="intermediate_${radio.name}" id="intermediate_${radio.id}" value="intermediate">
                <label id="intermediate_label_${radio.id}" for="intermediate_${radio.id}">Intermediate</label>
                <input type="radio" name="expert_${radio.name}" id="expert_${radio.id}" value="expert">
                <label id="expert_label_${radio.id}" for="expert_${radio.id}">Expert</label>`;
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
                    <input type="checkbox" id="${id}" name="${id}" value="${name}" onclick="checkBox(this)"> </input><br>`;

    document.getElementById("languages_list").appendChild(wrapper);
    input.value = "";
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
                    <input type="checkbox" id="${id}" name="${id}" value="${name}" onclick="radioButton(this)"> </input><br>`;

    document.getElementById("technologies_list").appendChild(wrapper);
    input.value = "";
}

