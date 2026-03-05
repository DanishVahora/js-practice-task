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

function validateForm() {
    function isEmpty(value) {
        return value.trim() === "";
    }

    const fname = document.getElementById("fname").value;
    const lname = document.getElementById("lname").value;
    const designation = document.getElementById("designation").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile_number").value;
    const address1 = document.getElementById("adress_1").value;
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

    const course = document.getElementById("course_1").value;
    const passingYear = document.getElementById("passing_year_1").value;
    const uniBoard = document.getElementById("uni_board_1").value;
    const percentage = document.getElementById("percentage_1").value;

    if (isEmpty(course)) { alert("Course is required"); return false; }
    if (isEmpty(passingYear) || passingYear < 1900 || passingYear > new Date().getFullYear()) {
        alert("Enter a valid passing year"); return false;
    }
    if (isEmpty(uniBoard)) { alert("University/Board is required"); return false; }
    if (isEmpty(percentage) || percentage < 0 || percentage > 100) { alert("Enter a valid percentage (0-100)"); return false; }

    const company = document.getElementById("company_1").value;
    const expDesignation = document.getElementById("designation_1").value;
    const annualPackage = document.getElementById("annual_package_1").value;
    const fromDate = document.getElementById("from_1").value;
    const toDate = document.getElementById("to_1").value;

    if (isEmpty(company)) { alert("Company is required"); return false; }
    if (isEmpty(expDesignation)) { alert("Experience designation is required"); return false; }
    if (isEmpty(annualPackage) || annualPackage < 0) { alert("Enter a valid annual package"); return false; }
    if (isEmpty(fromDate)) { alert("Experience start date is required"); return false; }
    if (isEmpty(toDate)) { alert("Experience end date is required"); return false; }
    if (new Date(fromDate) > new Date(toDate)) { alert("From date cannot be after To date"); return false; }

    const languageCheckboxes = document.querySelectorAll("#languages_list input[type='checkbox']");
    const languageSelected = Array.from(languageCheckboxes).some(cb => cb.checked);
    if (!languageSelected) { alert("Select at least one language"); return false; }

    const techCheckboxes = document.querySelectorAll("#technologies_list input[type='checkbox']");
    const techSelected = Array.from(techCheckboxes).some(cb => cb.checked);
    if (!techSelected) { alert("Select at least one technology"); return false; }

    const refName = document.getElementById("ref_name").value;
    const refEmail = document.getElementById("ref_email").value;
    const refPhone = document.getElementById("ref_phone").value;

    if (isEmpty(refName)) { alert("Reference name is required"); return false; }
    if (isEmpty(refEmail) || !emailPattern.test(refEmail)) { alert("Valid reference email is required"); return false; }
    if (isEmpty(refPhone) || !mobilePattern.test(refPhone)) { alert("Reference phone number must be 10 digits"); return false; }

    const expectedSalary = document.getElementById("expected_salary").value;
    const currentSalary = document.getElementById("current_salary").value;
    const noticePeriod = document.getElementById("notice_period").value;

    if (expectedSalary < 0) { alert("Expected salary must be positive"); return false; }
    if (currentSalary < 0) { alert("Current salary must be positive"); return false; }
    if (noticePeriod < 0) { alert("Notice period must be positive"); return false; }

    window.print();
    return true;
}
