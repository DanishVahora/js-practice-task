

const candidateRows = document.getElementById("candidate_rows");
const detailSection = document.getElementById("detail_section");
const editForm = document.getElementById("edit_form");

const API_BASE_URL = (window.API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

let currentCandidateId = null;

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function formatDate(d) {
    if (!d) return "";
    return new Date(d).toLocaleDateString();
}

// ─── CANDIDATES LIST ───

async function loadCandidates() {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    const candidates = await response.json();

    if (!response.ok) {
        alert("Failed to load candidates");
        return;
    }

    candidateRows.innerHTML = "";

    for (const c of candidates) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${c.candidate_id}</td>
            <td>${escapeHtml(c.first_name)} ${escapeHtml(c.last_name)}</td>
            <td>${escapeHtml(c.designation)}</td>
            <td>${escapeHtml(c.email)}</td>
            <td>${escapeHtml(c.mobile_number)}</td>
            <td>${escapeHtml(c.city)}</td>
            <td>${escapeHtml(c.state)}</td>
            <td>
                <div class="actions">
                    <button type="button" onclick="openDetail(${c.candidate_id})">View / Edit</button>
                    <button type="button" onclick="deleteCandidate(${c.candidate_id})">Delete</button>
                </div>
            </td>`;
        candidateRows.appendChild(row);
    }
}

async function deleteCandidate(id) {
    if (!confirm("Delete this candidate? This will also delete all related data.")) return;
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, { method: "DELETE" });
    const result = await response.text();
    if (!response.ok) { alert(result || "Failed to delete"); return; }
    alert(result);
    if (currentCandidateId === id) {
        detailSection.style.display = "none";
        currentCandidateId = null;
    }
    await loadCandidates();
}

// ─── OPEN DETAIL (loads everything) ───

async function openDetail(id) {
    currentCandidateId = id;
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    if (!response.ok) { alert("Failed to load candidate"); return; }
    const data = await response.json();

    document.getElementById("detail_title").textContent = `Candidate #${id} - ${data.first_name} ${data.last_name}`;

    // Fill basic edit form
    document.getElementById("edit_id").value = id;
    document.getElementById("edit_first_name").value = data.first_name || "";
    document.getElementById("edit_last_name").value = data.last_name || "";
    document.getElementById("edit_designation").value = data.designation || "";
    document.getElementById("edit_email").value = data.email || "";
    document.getElementById("edit_mobile").value = data.mobile_number || "";
    document.getElementById("edit_address_1").value = data.address_1 || "";
    document.getElementById("edit_address_2").value = data.address_2 || "";
    document.getElementById("edit_city").value = data.city || "";
    document.getElementById("edit_state").value = data.state || "";
    document.getElementById("edit_pincode").value = data.pincode || "";
    document.getElementById("edit_gender").value = data.gender || "";
    document.getElementById("edit_relationship").value = data.relationship_status || "";
    document.getElementById("edit_dob").value = data.dob ? data.dob.split("T")[0] : "";

    renderEducation(data.education || []);
    renderExperience(data.experience || []);
    renderLanguages(data.languages || []);
    renderTechnologies(data.technologies || []);
    renderReferences(data.references || []);
    renderPreferences(data.preferences);
    renderLocations(data.locations || [], data.preferences);

    detailSection.style.display = "block";
    detailSection.scrollIntoView({ behavior: "smooth" });
}

// ─── UPDATE BASIC DETAILS ───

editForm.addEventListener("submit", async e => {
    e.preventDefault();
    const id = document.getElementById("edit_id").value;
    const payload = {
        first_name: document.getElementById("edit_first_name").value.trim(),
        last_name: document.getElementById("edit_last_name").value.trim(),
        designation: document.getElementById("edit_designation").value.trim(),
        email: document.getElementById("edit_email").value.trim(),
        mobile: document.getElementById("edit_mobile").value.trim(),
        address1: document.getElementById("edit_address_1").value.trim(),
        address2: document.getElementById("edit_address_2").value.trim(),
        city: document.getElementById("edit_city").value.trim(),
        state: document.getElementById("edit_state").value.trim(),
        pincode: document.getElementById("edit_pincode").value.trim(),
        gender: document.getElementById("edit_gender").value,
        relationship: document.getElementById("edit_relationship").value,
        dob: document.getElementById("edit_dob").value
    };
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    const result = await response.text();
    if (!response.ok) { alert(result || "Failed to update"); return; }
    alert(result);
    await loadCandidates();
    await openDetail(id);
});

// ─── EDUCATION ───

function renderEducation(list) {
    const container = document.getElementById("education_list");
    if (!list.length) { container.innerHTML = "<p>No education records.</p>"; return; }
    container.innerHTML = list.map(e => `
        <div class="item-row" id="edu_row_${e.education_id}">
            <span><strong>${escapeHtml(e.course_name)}</strong> | ${e.passing_year} | ${escapeHtml(e.university_board)} | ${e.percentage}%</span>
            <button onclick="editEducation(${e.education_id}, '${escapeHtml(e.course_name)}', ${e.passing_year}, '${escapeHtml(e.university_board)}', ${e.percentage})">Edit</button>
            <button onclick="deleteEducation(${e.education_id})">Delete</button>
        </div>`).join("");
}

async function deleteEducation(id) {
    if (!confirm("Delete this education record?")) return;
    const r = await fetch(`${API_BASE_URL}/education/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

async function editEducation(id, course, year, board, pct) {
    const newCourse = prompt("Course:", course);
    if (newCourse === null) return;
    const newYear = prompt("Passing Year:", year);
    if (newYear === null) return;
    const newBoard = prompt("University/Board:", board);
    if (newBoard === null) return;
    const newPct = prompt("Percentage:", pct);
    if (newPct === null) return;

    const r = await fetch(`${API_BASE_URL}/education/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_name: newCourse, passing_year: newYear, university_board: newBoard, percentage: newPct })
    });
    if (!r.ok) { alert("Failed to update"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("add_education_form").addEventListener("submit", async e => {
    e.preventDefault();
    const r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/education`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            course_name: document.getElementById("add_edu_course").value,
            passing_year: document.getElementById("add_edu_year").value,
            university_board: document.getElementById("add_edu_board").value,
            percentage: document.getElementById("add_edu_percentage").value
        })
    });
    if (!r.ok) { alert("Failed to add"); return; }
    alert(await r.text());
    e.target.reset();
    await openDetail(currentCandidateId);
});

// ─── EXPERIENCE ───

function renderExperience(list) {
    const container = document.getElementById("experience_list");
    if (!list.length) { container.innerHTML = "<p>No experience records.</p>"; return; }
    container.innerHTML = list.map(e => `
        <div class="item-row" id="exp_row_${e.experience_id}">
            <span><strong>${escapeHtml(e.company)}</strong> | ${escapeHtml(e.designation)} | ${e.annual_package} | ${formatDate(e.from_date)} - ${formatDate(e.to_date)}</span>
            <button onclick='editExperience(${JSON.stringify(e).replace(/'/g, "&#39;")})'>Edit</button>
            <button onclick="deleteExperience(${e.experience_id})">Delete</button>
        </div>`).join("");
}

async function deleteExperience(id) {
    if (!confirm("Delete this experience record?")) return;
    const r = await fetch(`${API_BASE_URL}/experience/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

async function editExperience(e) {
    const company = prompt("Company:", e.company);
    if (company === null) return;
    const designation = prompt("Designation:", e.designation);
    if (designation === null) return;
    const annual_package = prompt("Annual Package:", e.annual_package);
    if (annual_package === null) return;
    const from_date = prompt("From (YYYY-MM-DD):", e.from_date ? e.from_date.split("T")[0] : "");
    if (from_date === null) return;
    const to_date = prompt("To (YYYY-MM-DD):", e.to_date ? e.to_date.split("T")[0] : "");
    if (to_date === null) return;
    const reason_to_leaving = prompt("Reason for Leaving:", e.reason_to_leaving || "");
    if (reason_to_leaving === null) return;
    const referral_contact = prompt("Referral Contact:", e.referral_contact || "");
    if (referral_contact === null) return;
    const referral_name = prompt("Referral Name:", e.referral_name || "");
    if (referral_name === null) return;

    const r = await fetch(`${API_BASE_URL}/experience/${e.experience_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, designation, annual_package, from_date, to_date, reason_to_leaving, referral_contact, referral_name })
    });
    if (!r.ok) { alert("Failed to update"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("add_experience_form").addEventListener("submit", async e => {
    e.preventDefault();
    const r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/experience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            company: document.getElementById("add_exp_company").value,
            designation: document.getElementById("add_exp_designation").value,
            annual_package: document.getElementById("add_exp_package").value,
            from_date: document.getElementById("add_exp_from").value,
            to_date: document.getElementById("add_exp_to").value,
            reason_to_leaving: document.getElementById("add_exp_reason").value,
            referral_contact: document.getElementById("add_exp_ref_contact").value,
            referral_name: document.getElementById("add_exp_ref_name").value
        })
    });
    if (!r.ok) { alert("Failed to add"); return; }
    alert(await r.text());
    e.target.reset();
    await openDetail(currentCandidateId);
});

// ─── LANGUAGES ───

function renderLanguages(list) {
    const container = document.getElementById("language_list");
    if (!list.length) { container.innerHTML = "<p>No languages.</p>"; return; }
    container.innerHTML = list.map(l => `
        <div class="item-row">
            <span><strong>${escapeHtml(l.language_name)}</strong> |
            Read: ${l.can_read ? "Yes" : "No"} |
            Write: ${l.can_write ? "Yes" : "No"} |
            Speak: ${l.can_speak ? "Yes" : "No"}</span>
            <button onclick="editLanguage(${l.candidate_language_id}, ${l.can_read}, ${l.can_write}, ${l.can_speak})">Edit</button>
            <button onclick="deleteLanguage(${l.candidate_language_id})">Delete</button>
        </div>`).join("");
}

async function deleteLanguage(id) {
    if (!confirm("Delete this language?")) return;
    const r = await fetch(`${API_BASE_URL}/candidate-language/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

async function editLanguage(id, canRead, canWrite, canSpeak) {
    const read = confirm("Can Read?");
    const write = confirm("Can Write?");
    const speak = confirm("Can Speak?");

    const r = await fetch(`${API_BASE_URL}/candidate-language/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ can_read: read, can_write: write, can_speak: speak })
    });
    if (!r.ok) { alert("Failed to update"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("add_language_form").addEventListener("submit", async e => {
    e.preventDefault();
    const r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/languages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            language_name: document.getElementById("add_lang_name").value,
            can_read: document.getElementById("add_lang_read").checked,
            can_write: document.getElementById("add_lang_write").checked,
            can_speak: document.getElementById("add_lang_speak").checked
        })
    });
    if (!r.ok) { alert("Failed to add"); return; }
    alert(await r.text());
    e.target.reset();
    await openDetail(currentCandidateId);
});

// ─── TECHNOLOGIES ───

function renderTechnologies(list) {
    const container = document.getElementById("technology_list");
    if (!list.length) { container.innerHTML = "<p>No technologies.</p>"; return; }
    container.innerHTML = list.map(t => `
        <div class="item-row">
            <span><strong>${escapeHtml(t.technology_name)}</strong> | Level: ${escapeHtml(t.skill_level)}</span>
            <button onclick="editTechnology(${t.candidate_technology_id}, '${escapeHtml(t.skill_level)}')">Edit</button>
            <button onclick="deleteTechnology(${t.candidate_technology_id})">Delete</button>
        </div>`).join("");
}

async function deleteTechnology(id) {
    if (!confirm("Delete this technology?")) return;
    const r = await fetch(`${API_BASE_URL}/candidate-technology/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

async function editTechnology(id, currentLevel) {
    const level = prompt("Skill Level (Beginner / Intermidiate / Expert):", currentLevel);
    if (level === null) return;

    const r = await fetch(`${API_BASE_URL}/candidate-technology/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill_level: level })
    });
    if (!r.ok) { alert("Failed to update"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("add_technology_form").addEventListener("submit", async e => {
    e.preventDefault();
    const r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/technologies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            technology_name: document.getElementById("add_tech_name").value,
            skill_level: document.getElementById("add_tech_level").value
        })
    });
    if (!r.ok) { alert("Failed to add"); return; }
    alert(await r.text());
    e.target.reset();
    await openDetail(currentCandidateId);
});

// ─── REFERENCE CONTACTS ───

function renderReferences(list) {
    const container = document.getElementById("reference_list");
    if (!list.length) { container.innerHTML = "<p>No reference contacts.</p>"; return; }
    container.innerHTML = list.map(r => `
        <div class="item-row">
            <span><strong>${escapeHtml(r.reference_name)}</strong> | ${escapeHtml(r.email)} | ${escapeHtml(r.phone_number)}</span>
            <button onclick="editReference(${r.reference_contact_id}, '${escapeHtml(r.reference_name)}', '${escapeHtml(r.email)}', '${escapeHtml(r.phone_number)}')">Edit</button>
            <button onclick="deleteReference(${r.reference_contact_id})">Delete</button>
        </div>`).join("");
}

async function deleteReference(id) {
    if (!confirm("Delete this reference?")) return;
    const r = await fetch(`${API_BASE_URL}/references/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

async function editReference(id, name, email, phone) {
    const newName = prompt("Name:", name);
    if (newName === null) return;
    const newEmail = prompt("Email:", email);
    if (newEmail === null) return;
    const newPhone = prompt("Phone:", phone);
    if (newPhone === null) return;

    const r = await fetch(`${API_BASE_URL}/references/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference_name: newName, email: newEmail, phone_number: newPhone })
    });
    if (!r.ok) { alert("Failed to update"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("add_reference_form").addEventListener("submit", async e => {
    e.preventDefault();
    const r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/references`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            reference_name: document.getElementById("add_ref_name").value,
            email: document.getElementById("add_ref_email").value,
            phone_number: document.getElementById("add_ref_phone").value
        })
    });
    if (!r.ok) { alert("Failed to add"); return; }
    alert(await r.text());
    e.target.reset();
    await openDetail(currentCandidateId);
});

// ─── PREFERENCES ───

let currentPreferenceId = null;

function renderPreferences(pref) {
    const display = document.getElementById("preferences_display");
    if (!pref) {
        display.innerHTML = "<p>No preferences set.</p>";
        currentPreferenceId = null;
        document.getElementById("pref_submit_btn").textContent = "Save Preferences";
        document.getElementById("pref_current_salary").value = "";
        document.getElementById("pref_expected_salary").value = "";
        document.getElementById("pref_notice_period").value = "";
        document.getElementById("pref_role").value = "";
        return;
    }
    currentPreferenceId = pref.preference_id;
    display.innerHTML = `<p>Current Salary: ${pref.cureent_salary || "N/A"} | Expected: ${pref.expected_salary || "N/A"} | Notice: ${pref.notice_period || "N/A"} days | Role: ${escapeHtml(pref.preferred_role) || "N/A"}
        <button onclick="deletePreferences(${pref.preference_id})">Delete</button></p>`;
    document.getElementById("pref_submit_btn").textContent = "Update Preferences";
    document.getElementById("pref_current_salary").value = pref.cureent_salary || "";
    document.getElementById("pref_expected_salary").value = pref.expected_salary || "";
    document.getElementById("pref_notice_period").value = pref.notice_period || "";
    document.getElementById("pref_role").value = pref.preferred_role || "";
}

async function deletePreferences(id) {
    if (!confirm("Delete preferences?")) return;
    const r = await fetch(`${API_BASE_URL}/preferences/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("preferences_form").addEventListener("submit", async e => {
    e.preventDefault();
    const payload = {
        current_salary: document.getElementById("pref_current_salary").value,
        expected_salary: document.getElementById("pref_expected_salary").value,
        notice_period: document.getElementById("pref_notice_period").value,
        preferred_role: document.getElementById("pref_role").value
    };

    let r;
    if (currentPreferenceId) {
        r = await fetch(`${API_BASE_URL}/preferences/${currentPreferenceId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    } else {
        r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/preferences`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
    }
    if (!r.ok) { alert("Failed to save preferences"); return; }
    const result = await r.text();
    alert(typeof result === "string" ? result : "Preferences saved");
    await openDetail(currentCandidateId);
});

// ─── LOCATIONS ───

function renderLocations(list, pref) {
    const container = document.getElementById("location_list");
    if (!list.length) { container.innerHTML = "<p>No preferred locations.</p>"; return; }
    container.innerHTML = list.map(l => `
        <div class="item-row">
            <span>${escapeHtml(l.preferred_location)}</span>
            <button onclick="editLocation(${l.location_id}, '${escapeHtml(l.preferred_location)}')">Edit</button>
            <button onclick="deleteLocation(${l.location_id})">Delete</button>
        </div>`).join("");
}

async function deleteLocation(id) {
    if (!confirm("Delete this location?")) return;
    const r = await fetch(`${API_BASE_URL}/locations/${id}`, { method: "DELETE" });
    if (!r.ok) { alert("Failed to delete"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

async function editLocation(id, current) {
    const newLoc = prompt("Preferred Location:", current);
    if (newLoc === null) return;
    const r = await fetch(`${API_BASE_URL}/locations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferred_location: newLoc })
    });
    if (!r.ok) { alert("Failed to update"); return; }
    alert(await r.text());
    await openDetail(currentCandidateId);
}

document.getElementById("add_location_form").addEventListener("submit", async e => {
    e.preventDefault();
    if (!currentPreferenceId) {
        alert("Please save preferences first before adding locations.");
        return;
    }
    const r = await fetch(`${API_BASE_URL}/candidates/${currentCandidateId}/locations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            preference_id: currentPreferenceId,
            preferred_location: document.getElementById("add_loc_name").value
        })
    });
    if (!r.ok) { alert("Failed to add"); return; }
    alert(await r.text());
    e.target.reset();
    await openDetail(currentCandidateId);
});

// ─── CLOSE / REFRESH ───

document.getElementById("close_detail").addEventListener("click", () => {
    detailSection.style.display = "none";
    currentCandidateId = null;
});

document.getElementById("refresh_btn").addEventListener("click", () => {
    loadCandidates().catch(() => alert("Failed to refresh"));
});

// ─── INIT ───

loadCandidates().catch(() => {
    alert("Failed to load candidates. Make sure server is running on port 3000.");
});

window.openDetail = openDetail;
window.deleteCandidate = deleteCandidate;
window.editEducation = editEducation;
window.deleteEducation = deleteEducation;
window.editExperience = editExperience;
window.deleteExperience = deleteExperience;
window.editLanguage = editLanguage;
window.deleteLanguage = deleteLanguage;
window.editTechnology = editTechnology;
window.deleteTechnology = deleteTechnology;
window.editReference = editReference;
window.deleteReference = deleteReference;
window.deletePreferences = deletePreferences;
window.editLocation = editLocation;
window.deleteLocation = deleteLocation;
