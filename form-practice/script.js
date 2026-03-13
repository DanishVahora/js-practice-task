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

function validateForm() {
    function isEmpty(value) {
        return value.trim() === "";
    }

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const designation = document.getElementById("designation").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile_number").value;
    const address1 = document.getElementById("address_1").value;
    const address2 = document.getElementById("address_2").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const pincode = document.getElementById("pincode").value;
    const dob = document.getElementById("dob").value;

    if (isEmpty(fname)) { alert("First name is required"); return false; }
    if (isEmpty(lname)) { alert("Last name is required"); return false; }
    if (isEmpty(designation)) { alert("Designation is required"); return false; }
    if (isEmpty(email)) { alert("Email is required"); return false; }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) { alert("Invalid email format"); return false; }

    const mobilePattern = /^\d{10}$/;
    if (!mobilePattern.test(mobile)) { alert("Mobile number must be 10 digits"); return false; }

    if (isEmpty(address1)) { alert("Address 1 is required"); return false; }
    if (isEmpty(city)) { alert("City is required"); return false; }
    if (isEmpty(pincode)) { alert("Pincode is required"); return false; }
    if (isNaN(pincode) || pincode.length !== 6) { alert("Pincode must be a 6-digit number"); return false; }

    const genderMale = document.getElementById("male").checked;
    const genderFemale = document.getElementById("female").checked;
    if (!genderMale && !genderFemale) { alert("Please select your gender"); return false; }

    if (isEmpty(dob)) { alert("Date of Birth is required"); return false; }
    const dobDate = new Date(dob);
    const today = new Date();
    if (dobDate >= today) { alert("Date of Birth must be in the past"); return false; }

    // Education validation (all rows)
    for (let i = 1; i < education_index; i++) {
        const courseEl = document.getElementById(`course_${i}`);
        const passingYearEl = document.getElementById(`passing_year_${i}`);
        const uniBoardEl = document.getElementById(`uni_board_${i}`);
        const percentageEl = document.getElementById(`percentage_${i}`);

        if (!courseEl || !passingYearEl || !uniBoardEl || !percentageEl) continue;

        const course = courseEl.value;
        const passingYear = passingYearEl.value;
        const uniBoard = uniBoardEl.value;
        const percentage = percentageEl.value;

        if (isEmpty(course)) { alert(`Course is required (Education ${i})`); return false; }
        if (isEmpty(passingYear) || passingYear < 1900 || passingYear > new Date().getFullYear()) {
            alert(`Enter a valid passing year (Education ${i})`); return false;
        }
        if (isEmpty(uniBoard)) { alert(`University/Board is required (Education ${i})`); return false; }
        if (isEmpty(percentage) || percentage < 0 || percentage > 100) {
            alert(`Enter a valid percentage 0-100 (Education ${i})`); return false;
        }
    }

    // Experience validation (all rows)
    for (let i = 1; i < experience_index; i++) {
        const companyEl = document.getElementById(`company_${i}`);
        const designationEl = document.getElementById(`designation_${i}`);
        const annualPackageEl = document.getElementById(`annual_package_${i}`);
        const fromEl = document.getElementById(`from_${i}`);
        const toEl = document.getElementById(`to_${i}`);

        if (!companyEl || !designationEl || !annualPackageEl || !fromEl || !toEl) continue;

        const company = companyEl.value;
        const expDesignation = designationEl.value;
        const annualPackage = annualPackageEl.value;
        const fromDate = fromEl.value;
        const toDate = toEl.value;

        if (isEmpty(company)) { alert(`Company is required (Experience ${i})`); return false; }
        if (isEmpty(expDesignation)) { alert(`Designation is required (Experience ${i})`); return false; }
        if (isEmpty(annualPackage) || annualPackage < 0) { alert(`Enter a valid annual package (Experience ${i})`); return false; }
        if (isEmpty(fromDate)) { alert(`From date is required (Experience ${i})`); return false; }
        if (isEmpty(toDate)) { alert(`To date is required (Experience ${i})`); return false; }
        if (new Date(fromDate) > new Date(toDate)) { alert(`From date cannot be after To date (Experience ${i})`); return false; }
    }

    const languageCheckboxes = document.querySelectorAll("#languages_list input[type='checkbox']");
    const languageSelected = Array.from(languageCheckboxes).some(cb => cb.checked);
    if (!languageSelected) { alert("Select at least one language"); return false; }

    const techCheckboxes = document.querySelectorAll("#technologies_list input[type='checkbox']");
    const techSelected = Array.from(techCheckboxes).some(cb => cb.checked);
    if (!techSelected) { alert("Select at least one technology"); return false; }

    // Validate technology level selection
    const techChecked = Array.from(techCheckboxes).filter(cb => cb.checked);
    for (const cb of techChecked) {
        const groupName = `tech_level_${cb.id}`;
        const levelChosen = document.querySelector(`input[name="${groupName}"]:checked`);
        if (!levelChosen) {
            alert(`Select level (Beginner/Intermediate/Expert) for ${cb.value}`);
            return false;
        }
    }

    const refName = document.getElementById("ref_name").value;
    const refEmail = document.getElementById("ref_email").value;
    const refPhone = document.getElementById("ref_phone").value;

    if (isEmpty(refName)) { alert("Reference name is required"); return false; }
    if (isEmpty(refEmail) || !emailPattern.test(refEmail)) { alert("Valid reference email is required"); return false; }
    if (isEmpty(refPhone) || !mobilePattern.test(refPhone)) { alert("Reference phone number must be 10 digits"); return false; }

    const expectedSalary = document.getElementById("expected_salary").value;
    const currentSalary = document.getElementById("current_salary").value;
    const noticePeriod = document.getElementById("notice_period").value;

    if (expectedSalary !== "" && expectedSalary < 0) { alert("Expected salary must be positive"); return false; }
    if (currentSalary !== "" && currentSalary < 0) { alert("Current salary must be positive"); return false; }
    if (noticePeriod !== "" && noticePeriod < 0) { alert("Notice period must be positive"); return false; }

    submitForm();
    return false;
}

async function submitForm() {

    const data = {
        first_name: document.getElementById("fname").value,
        last_name: document.getElementById("lname").value,
        designation: document.getElementById("designation").value,
        email: document.getElementById("email").value,
        mobile: document.getElementById("mobile_number").value,

        address1: document.getElementById("address_1").value,
        address2: document.getElementById("address_2").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        pincode: document.getElementById("pincode").value,

        gender: document.querySelector('input[name="gender"]:checked').value,
        relationship: document.getElementById("relationship_status").value,
        dob: document.getElementById("dob").value,

        education: [],
        experience: [],
        languages: [],
        technologies: [],

        reference: {
            name: document.getElementById("ref_name").value,
            email: document.getElementById("ref_email").value,
            phone: document.getElementById("ref_phone").value
        },

        preferences: {
            expected_salary: document.getElementById("expected_salary").value,
            current_salary: document.getElementById("current_salary").value,
            notice_period: document.getElementById("notice_period").value,
            preferred_role: document.getElementById("preferred_role").value
        }
    };

    for (let i = 1; i < education_index; i++) {

        const course = document.getElementById(`course_${i}`);
        if (!course) continue;

        data.education.push({
            course: course.value,
            year: document.getElementById(`passing_year_${i}`).value,
            board: document.getElementById(`uni_board_${i}`).value,
            percentage: document.getElementById(`percentage_${i}`).value
        });
    }

    for (let i = 1; i < experience_index; i++) {

        const company = document.getElementById(`company_${i}`);
        if (!company) continue;

        data.experience.push({
            company: company.value,
            designation: document.getElementById(`designation_${i}`).value,
            salary: document.getElementById(`annual_package_${i}`).value,
            from: document.getElementById(`from_${i}`).value,
            to: document.getElementById(`to_${i}`).value,
            reason: document.getElementById(`reason_to_leave_${i}`).value,
            contact: document.getElementById(`ref_contact_${i}`).value,
            name: document.getElementById(`ref_name_${i}`).value
        });
    }

    const languageCheckboxes = document.querySelectorAll("#languages_list input[type='checkbox']");

    languageCheckboxes.forEach(cb => {
        if (cb.checked) {

            data.languages.push({
                name: cb.value,
                read: document.getElementById(`read_${cb.id}`)?.checked || false,
                write: document.getElementById(`write_${cb.id}`)?.checked || false,
                speak: document.getElementById(`speak_${cb.id}`)?.checked || false
            });
        }
    });

    const techCheckboxes = document.querySelectorAll("#technologies_list input[type='checkbox']");

    techCheckboxes.forEach(cb => {
        if (cb.checked) {

            const level = document.querySelector(`input[name="tech_level_${cb.id}"]:checked`);

            data.technologies.push({
                name: cb.value,
                level: level ? level.value : null
            });
        }
    });

    const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await response.text();
    if (!response.ok) {
        alert(result || "Failed to create candidate");
        return;
    }

    alert(result);
    document.getElementById("candidate_form").reset();
}
