const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const genderMap = { male: "Male", female: "Female" };
const relationshipMap = { single: "Single", married: "Married", divorced: "Divorced" };
const techLevelMap = { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" };

const normalizeEnum = (value, map) => map[(value || "").toLowerCase()] || null;
const toNumberOrNull = (value) => (value === undefined || value === null || value === "") ? null : Number(value);
const toValueOrNull = (value) => (value === undefined || value === null || value === "") ? null : value;

app.post("/submit", async (req, res) => {
    const data = req.body || {};
    const conn = db.promise();

    try {
        await conn.beginTransaction();

        const [candidateResult] = await conn.query(
            `INSERT INTO candidates
            (first_name, last_name, designation, email, mobile_number,
            address_1, address_2, city, state, pincode, gender, relationship_status, dob)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            , [
                toValueOrNull(data.first_name),
                toValueOrNull(data.last_name),
                toValueOrNull(data.designation),
                toValueOrNull(data.email),
                toValueOrNull(data.mobile),
                toValueOrNull(data.address1),
                toValueOrNull(data.address2),
                toValueOrNull(data.city),
                toValueOrNull(data.state),
                toValueOrNull(data.pincode),
                normalizeEnum(data.gender, genderMap),
                normalizeEnum(data.relationship, relationshipMap),
                toValueOrNull(data.dob)
            ]
        );

        const candidateId = candidateResult.insertId;

        if (Array.isArray(data.education)) {
            for (const edu of data.education) {
                await conn.query(
                    `INSERT INTO education
                    (candidate_id, course_name, passing_year, university_board, percentage)
                    VALUES (?, ?, ?, ?, ?)`
                    , [
                        candidateId,
                        toValueOrNull(edu.course),
                        toNumberOrNull(edu.year),
                        toValueOrNull(edu.board),
                        toNumberOrNull(edu.percentage)
                    ]
                );
            }
        }

        if (Array.isArray(data.experience)) {
            for (const exp of data.experience) {
                await conn.query(
                    `INSERT INTO experience
                    (candidate_id, company, designation, annual_package,
                    from_date, to_date, reason_to_leaving, referral_contact, referral_name)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
                    , [
                        candidateId,
                        toValueOrNull(exp.company),
                        toValueOrNull(exp.designation),
                        toNumberOrNull(exp.salary),
                        toValueOrNull(exp.from),
                        toValueOrNull(exp.to),
                        toValueOrNull(exp.reason),
                        toValueOrNull(exp.contact),
                        toValueOrNull(exp.name)
                    ]
                );
            }
        }

        if (Array.isArray(data.languages)) {
            for (const lang of data.languages) {
                const name = toValueOrNull(lang.name);
                if (!name) continue;

                const [existingLang] = await conn.query(
                    "SELECT language_id FROM language_known WHERE language_name = ? LIMIT 1",
                    [name]
                );

                let languageId = existingLang[0]?.language_id;

                if (!languageId) {
                    const [insertLang] = await conn.query(
                        "INSERT INTO language_known (language_name) VALUES (?)",
                        [name]
                    );
                    languageId = insertLang.insertId;
                }

                await conn.query(
                    `INSERT INTO candidate_language
                    (language_id, candidate_id, can_read, can_write, can_speak)
                    VALUES (?, ?, ?, ?, ?)`
                    , [
                        languageId,
                        candidateId,
                        lang.read ? 1 : 0,
                        lang.write ? 1 : 0,
                        lang.speak ? 1 : 0
                    ]
                );
            }
        }

        if (Array.isArray(data.technologies)) {
            for (const tech of data.technologies) {
                const name = toValueOrNull(tech.name);
                if (!name) continue;

                const [existingTech] = await conn.query(
                    "SELECT technology_id FROM technology_known WHERE technology_name = ? LIMIT 1",
                    [name]
                );

                let technologyId = existingTech[0]?.technology_id;

                if (!technologyId) {
                    const [insertTech] = await conn.query(
                        "INSERT INTO technology_known (technology_name) VALUES (?)",
                        [name]
                    );
                    technologyId = insertTech.insertId;
                }

                const skill = techLevelMap[(tech.level || "").toLowerCase()] || null;

                await conn.query(
                    `INSERT INTO candidate_technology
                    (technology_id, candidate_id, skill_level)
                    VALUES (?, ?, ?)`
                    , [technologyId, candidateId, skill]
                );
            }
        }

        if (data.reference) {
            await conn.query(
                `INSERT INTO reference_contact
                (candidate_id, reference_name, email, phone_number)
                VALUES (?, ?, ?, ?)`
                , [
                    candidateId,
                    toValueOrNull(data.reference.name),
                    toValueOrNull(data.reference.email),
                    toValueOrNull(data.reference.phone)
                ]
            );
        }

        let preferenceId = null;

        if (data.preferences) {
            const [prefResult] = await conn.query(
                `INSERT INTO preferences
                (candidate_id, cureent_salary, expected_salary, notice_period, preferred_role)
                VALUES (?, ?, ?, ?, ?)`
                , [
                    candidateId,
                    toNumberOrNull(data.preferences.current_salary),
                    toNumberOrNull(data.preferences.expected_salary),
                    toNumberOrNull(data.preferences.notice_period),
                    toValueOrNull(data.preferences.preferred_role)
                ]
            );

            preferenceId = prefResult.insertId;

            if (preferenceId && Array.isArray(data.job_location)) {
                for (const loc of data.job_location) {
                    const preferredLocation = toValueOrNull(loc);
                    if (!preferredLocation) continue;
                    await conn.query(
                        `INSERT INTO location
                        (candidate_id, preference_id, preferred_location)
                        VALUES (?, ?, ?)`
                        , [candidateId, preferenceId, preferredLocation]
                    );
                }
            }
        }

        await conn.commit();
        console.log("Form submitted successfully with candidate ID:", candidateId);
        console.log("Submitted Data:", JSON.stringify(data, null, 2));
        res.send("Form Submitted Successfully");
    } catch (err) {
        console.error("Error submitting candidate application", err);
        try {
            await conn.rollback();
        } catch (rollbackErr) {
            console.error("Error rolling back transaction", rollbackErr);
        }
        res.status(500).send("Failed to submit candidate application. Please try again later.");
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
