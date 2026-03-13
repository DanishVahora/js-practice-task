const API_BASE_URL = "http://localhost:3000";

const candidateRows = document.getElementById("candidate_rows");
const editSection = document.getElementById("edit_section");
const editForm = document.getElementById("edit_form");

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setEditValues(candidate) {
    document.getElementById("edit_id").value = candidate.candidate_id;
    document.getElementById("edit_first_name").value = candidate.first_name || "";
    document.getElementById("edit_last_name").value = candidate.last_name || "";
    document.getElementById("edit_designation").value = candidate.designation || "";
    document.getElementById("edit_email").value = candidate.email || "";
    document.getElementById("edit_mobile").value = candidate.mobile_number || "";
    document.getElementById("edit_address_1").value = candidate.address_1 || "";
    document.getElementById("edit_address_2").value = candidate.address_2 || "";
    document.getElementById("edit_city").value = candidate.city || "";
    document.getElementById("edit_state").value = candidate.state || "";
    document.getElementById("edit_pincode").value = candidate.pincode || "";
}

async function loadCandidates() {
    const response = await fetch(`${API_BASE_URL}/candidates`);
    const candidates = await response.json();

    if (!response.ok) {
        alert("Failed to load candidates");
        return;
    }

    candidateRows.innerHTML = "";

    for (const candidate of candidates) {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${candidate.candidate_id}</td>
            <td>${escapeHtml(candidate.first_name)} ${escapeHtml(candidate.last_name)}</td>
            <td>${escapeHtml(candidate.designation)}</td>
            <td>${escapeHtml(candidate.email)}</td>
            <td>${escapeHtml(candidate.mobile_number)}</td>
            <td>${escapeHtml(candidate.city)}</td>
            <td>${escapeHtml(candidate.state)}</td>
            <td>
                <div class="actions">
                    <button type="button" onclick="viewCandidate(${candidate.candidate_id})">View</button>
                    <button type="button" onclick="startEdit(${candidate.candidate_id})">Edit</button>
                    <button type="button" onclick="deleteCandidate(${candidate.candidate_id})">Delete</button>
                </div>
            </td>`;
        candidateRows.appendChild(row);
    }
}

async function viewCandidate(id) {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    const data = await response.json();

    if (!response.ok) {
        alert("Failed to read candidate details");
        return;
    }

    const candidate = Array.isArray(data) ? data[0] : data;

    if (!candidate) {
        alert("Candidate not found");
        return;
    }

    const summary = [
        `Name: ${candidate.first_name} ${candidate.last_name}`,
        `Designation: ${candidate.designation}`,
        `Email: ${candidate.email}`,
        `Mobile: ${candidate.mobile_number}`,
        `Address: ${candidate.address_1}, ${candidate.address_2 || ""}, ${candidate.city}, ${candidate.state} - ${candidate.pincode}`
    ].join("\n");

    alert(summary);
}

async function startEdit(id) {
    const response = await fetch(`${API_BASE_URL}/candidates/${id}`);
    const data = await response.json();

    if (!response.ok) {
        alert("Failed to load candidate for editing");
        return;
    }

    const candidate = Array.isArray(data) ? data[0] : data;

    if (!candidate) {
        alert("Candidate not found");
        return;
    }

    setEditValues(candidate);
    editSection.style.display = "block";
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

async function deleteCandidate(id) {
    const shouldDelete = confirm("Delete this candidate?");
    if (!shouldDelete) {
        return;
    }

    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: "DELETE"
    });

    const result = await response.text();

    if (!response.ok) {
        alert(result || "Failed to delete candidate");
        return;
    }

    alert(result);
    await loadCandidates();
}

editForm.addEventListener("submit", async event => {
    event.preventDefault();

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
        pincode: document.getElementById("edit_pincode").value.trim()
    };

    const response = await fetch(`${API_BASE_URL}/candidates/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const result = await response.text();

    if (!response.ok) {
        alert(result || "Failed to update candidate");
        return;
    }

    alert(result);
    editSection.style.display = "none";
    await loadCandidates();
});

document.getElementById("cancel_edit").addEventListener("click", () => {
    editSection.style.display = "none";
});

document.getElementById("refresh_btn").addEventListener("click", () => {
    loadCandidates().catch(() => {
        alert("Failed to refresh data");
    });
});

loadCandidates().catch(() => {
    alert("Failed to load candidates. Make sure server is running on port 3000.");
});

window.viewCandidate = viewCandidate;
window.startEdit = startEdit;
window.deleteCandidate = deleteCandidate;
