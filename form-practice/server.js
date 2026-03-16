const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static(__dirname))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Root@1234",
    database: "job_application"
})

db.connect(err => {
    if (err) {
        return console.log("Database error:", err)
    }
    console.log("MySQL Connected")
})

// Helper: promisify db.query
function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

// ─── CANDIDATES ───
    
app.get("/candidates", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM candidates")
        res.json(rows)
    } catch (err) {
        console.error(err)
        res.status(500).send("Database error")
    }
})

app.get("/candidates/:id", async (req, res) => {
    try {
        const id = req.params.id
        const [candidate] = await query("SELECT * FROM candidates WHERE candidate_id=?", [id])
        if (!candidate) return res.status(404).send("Candidate not found")

        const education = await query("SELECT * FROM education WHERE candidate_id=?", [id])
        const experience = await query("SELECT * FROM experience WHERE candidate_id=?", [id])
        const languages = await query(
            `SELECT cl.candidate_language_id, cl.language_id, lk.language_name,
                    cl.can_read, cl.can_write, cl.can_speak
             FROM candidate_language cl
             JOIN language_known lk ON lk.language_id = cl.language_id
             WHERE cl.candidate_id=?`, [id])
        const technologies = await query(
            `SELECT ct.candidate_technology_id, ct.technology_id, tk.technology_name,
                    ct.skill_level
             FROM candidate_technology ct
             JOIN technology_known tk ON tk.technology_id = ct.technology_id
             WHERE ct.candidate_id=?`, [id])
        const references = await query("SELECT * FROM reference_contact WHERE candidate_id=?", [id])
        const preferences = await query("SELECT * FROM preferences WHERE candidate_id=?", [id])

        let locations = []
        if (preferences.length > 0) {
            locations = await query("SELECT * FROM location WHERE candidate_id=?", [id])
        }

        res.json({
            ...candidate,
            education,
            experience,
            languages,
            technologies,
            references,
            preferences: preferences[0] || null,
            locations
        })
    } catch (err) {
        console.error(err)
        res.status(500).send("Database error")
    }
})

app.post("/candidates", async (req, res) => {
    try {
        const d = req.body
        const result = await query( 
            `INSERT INTO candidates
             (first_name,last_name,designation,email,mobile_number,address_1,address_2,city,state,pincode,gender,relationship_status,dob)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [d.first_name, d.last_name, d.designation, d.email, d.mobile,
            d.address1, d.address2, d.city, d.state, d.pincode,
            d.gender, d.relationship, d.dob])

        const candidateId = result.insertId

        // Education
        if (d.education && d.education.length) {
            for (const edu of d.education) {
                await query(
                    `INSERT INTO education (candidate_id, course_name, passing_year, university_board, percentage)
                     VALUES (?,?,?,?,?)`,
                    [candidateId, edu.course, edu.year, edu.board, edu.percentage])
            }
        }

        // Experience
        if (d.experience && d.experience.length) {
            for (const exp of d.experience) {
                await query(
                    `INSERT INTO experience (candidate_id, company, designation, annual_package, from_date, to_date, reason_to_leaving, referral_contact, referral_name)
                     VALUES (?,?,?,?,?,?,?,?,?)`,
                    [candidateId, exp.company, exp.designation, exp.salary,
                        exp.from, exp.to, exp.reason, exp.contact, exp.name])
            }
        }

        // Languages
        if (d.languages && d.languages.length) {
            for (const lang of d.languages) {
                let [existing] = await query("SELECT language_id FROM language_known WHERE language_name=?", [lang.name])
                let languageId
                if (existing) {
                    languageId = existing.language_id
                } else {
                    const r = await query("INSERT INTO language_known (language_name) VALUES (?)", [lang.name])
                    languageId = r.insertId
                }
                await query(
                    `INSERT INTO candidate_language (language_id, candidate_id, can_read, can_write, can_speak)
                     VALUES (?,?,?,?,?)`,
                    [languageId, candidateId, lang.read ? 1 : 0, lang.write ? 1 : 0, lang.speak ? 1 : 0])
            }
        }

        // Technologies
        if (d.technologies && d.technologies.length) {
            for (const tech of d.technologies) {
                let [existing] = await query("SELECT technology_id FROM technology_known WHERE technology_name=?", [tech.name])
                let technologyId
                if (existing) {
                    technologyId = existing.technology_id
                } else {
                    const r = await query("INSERT INTO technology_known (technology_name) VALUES (?)", [tech.name])
                    technologyId = r.insertId
                }
                const levelMap = { beginner: "Beginner", intermediate: "Intermidiate", intermidiate: "Intermidiate", expert: "Expert" }
                const level = levelMap[(tech.level || "beginner").toLowerCase()] || "Beginner"
                await query(
                    `INSERT INTO candidate_technology (technology_id, candidate_id, skill_level)
                     VALUES (?,?,?)`,
                    [technologyId, candidateId, level])
            }
        }

        // Reference contact
        if (d.reference && d.reference.name) {
            await query(
                `INSERT INTO reference_contact (candidate_id, reference_name, email, phone_number)
                 VALUES (?,?,?,?)`,
                [candidateId, d.reference.name, d.reference.email, d.reference.phone])
        }

        // Preferences
        if (d.preferences) {
            const prefResult = await query(
                `INSERT INTO preferences (candidate_id, cureent_salary, expected_salary, notice_period, preferred_role)
                 VALUES (?,?,?,?,?)`,
                [candidateId, d.preferences.current_salary || null, d.preferences.expected_salary || null,
                    d.preferences.notice_period || null, d.preferences.preferred_role || null])

            const preferenceId = prefResult.insertId

            // Locations
            if (d.preferred_locations && d.preferred_locations.length) {
                for (const loc of d.preferred_locations) {
                    await query(
                        `INSERT INTO location (candidate_id, preference_id, preferred_location) VALUES (?,?,?)`,
                        [candidateId, preferenceId, loc])
                }
            }
        }

        res.send("Candidate Created")
    } catch (err) {
        console.error(err)
        res.status(500).send("Database error: " + err.message)
    }
})

app.put("/candidates/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE candidates
             SET first_name=?, last_name=?, designation=?, email=?, mobile_number=?,
                 address_1=?, address_2=?, city=?, state=?, pincode=?,
                 gender=?, relationship_status=?, dob=?
             WHERE candidate_id=?`,
            [d.first_name, d.last_name, d.designation, d.email, d.mobile,
            d.address1, d.address2, d.city, d.state, d.pincode,
            d.gender || null, d.relationship || null, d.dob || null,
            req.params.id])
        res.send("Candidate Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/candidates/:id", async (req, res) => {
    try {
        await query("DELETE FROM candidates WHERE candidate_id=?", [req.params.id])
        res.send("Candidate Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── EDUCATION ───

app.get("/candidates/:id/education", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM education WHERE candidate_id=?", [req.params.id])
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/education", async (req, res) => {
    try {
        const d = req.body
        await query(
            `INSERT INTO education (candidate_id, course_name, passing_year, university_board, percentage)
             VALUES (?,?,?,?,?)`,
            [req.params.id, d.course_name, d.passing_year, d.university_board, d.percentage])
        res.send("Education Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/education/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE education SET course_name=?, passing_year=?, university_board=?, percentage=?
             WHERE education_id=?`,
            [d.course_name, d.passing_year, d.university_board, d.percentage, req.params.id])
        res.send("Education Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/education/:id", async (req, res) => {
    try {
        await query("DELETE FROM education WHERE education_id=?", [req.params.id])
        res.send("Education Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── EXPERIENCE ───

app.get("/candidates/:id/experience", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM experience WHERE candidate_id=?", [req.params.id])
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/experience", async (req, res) => {
    try {
        const d = req.body
        await query(
            `INSERT INTO experience (candidate_id, company, designation, annual_package, from_date, to_date, reason_to_leaving, referral_contact, referral_name)
             VALUES (?,?,?,?,?,?,?,?,?)`,
            [req.params.id, d.company, d.designation, d.annual_package,
            d.from_date, d.to_date, d.reason_to_leaving, d.referral_contact, d.referral_name])
        res.send("Experience Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/experience/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE experience SET company=?, designation=?, annual_package=?, from_date=?, to_date=?,
             reason_to_leaving=?, referral_contact=?, referral_name=?
             WHERE experience_id=?`,
            [d.company, d.designation, d.annual_package, d.from_date, d.to_date,
            d.reason_to_leaving, d.referral_contact, d.referral_name, req.params.id])
        res.send("Experience Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/experience/:id", async (req, res) => {
    try {
        await query("DELETE FROM experience WHERE experience_id=?", [req.params.id])
        res.send("Experience Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── LANGUAGES ───

app.get("/languages", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM language_known")
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.get("/candidates/:id/languages", async (req, res) => {
    try {
        const rows = await query(
            `SELECT cl.candidate_language_id, cl.language_id, lk.language_name,
                    cl.can_read, cl.can_write, cl.can_speak
             FROM candidate_language cl
             JOIN language_known lk ON lk.language_id = cl.language_id
             WHERE cl.candidate_id=?`, [req.params.id])
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/languages", async (req, res) => {
    try {
        const d = req.body
        let languageId = d.language_id
        if (!languageId && d.language_name) {
            let [existing] = await query("SELECT language_id FROM language_known WHERE language_name=?", [d.language_name])
            if (existing) {
                languageId = existing.language_id
            } else {
                const r = await query("INSERT INTO language_known (language_name) VALUES (?)", [d.language_name])
                languageId = r.insertId
            }
        }
        await query(
            `INSERT INTO candidate_language (language_id, candidate_id, can_read, can_write, can_speak)
             VALUES (?,?,?,?,?)`,
            [languageId, req.params.id, d.can_read ? 1 : 0, d.can_write ? 1 : 0, d.can_speak ? 1 : 0])
        res.send("Language Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/candidate-language/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE candidate_language SET can_read=?, can_write=?, can_speak=?
             WHERE candidate_language_id=?`,
            [d.can_read ? 1 : 0, d.can_write ? 1 : 0, d.can_speak ? 1 : 0, req.params.id])
        res.send("Language Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/candidate-language/:id", async (req, res) => {
    try {
        await query("DELETE FROM candidate_language WHERE candidate_language_id=?", [req.params.id])
        res.send("Language Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── TECHNOLOGIES ───

app.get("/technologies", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM technology_known")
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.get("/candidates/:id/technologies", async (req, res) => {
    try {
        const rows = await query(
            `SELECT ct.candidate_technology_id, ct.technology_id, tk.technology_name, ct.skill_level
             FROM candidate_technology ct
             JOIN technology_known tk ON tk.technology_id = ct.technology_id
             WHERE ct.candidate_id=?`, [req.params.id])
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/technologies", async (req, res) => {
    try {
        const d = req.body
        let technologyId = d.technology_id
        if (!technologyId && d.technology_name) {
            let [existing] = await query("SELECT technology_id FROM technology_known WHERE technology_name=?", [d.technology_name])
            if (existing) {
                technologyId = existing.technology_id
            } else {
                const r = await query("INSERT INTO technology_known (technology_name) VALUES (?)", [d.technology_name])
                technologyId = r.insertId
            }
        }
        await query(
            `INSERT INTO candidate_technology (technology_id, candidate_id, skill_level)
             VALUES (?,?,?)`,
            [technologyId, req.params.id, d.skill_level || "Beginner"])
        res.send("Technology Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/candidate-technology/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE candidate_technology SET skill_level=?
             WHERE candidate_technology_id=?`,
            [d.skill_level, req.params.id])
        res.send("Technology Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/candidate-technology/:id", async (req, res) => {
    try {
        await query("DELETE FROM candidate_technology WHERE candidate_technology_id=?", [req.params.id])
        res.send("Technology Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── REFERENCE CONTACTS ───

app.get("/candidates/:id/references", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM reference_contact WHERE candidate_id=?", [req.params.id])
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/references", async (req, res) => {
    try {
        const d = req.body
        await query(
            `INSERT INTO reference_contact (candidate_id, reference_name, email, phone_number)
             VALUES (?,?,?,?)`,
            [req.params.id, d.reference_name, d.email, d.phone_number])
        res.send("Reference Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/references/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE reference_contact SET reference_name=?, email=?, phone_number=?
             WHERE reference_contact_id=?`,
            [d.reference_name, d.email, d.phone_number, req.params.id])
        res.send("Reference Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/references/:id", async (req, res) => {
    try {
        await query("DELETE FROM reference_contact WHERE reference_contact_id=?", [req.params.id])
        res.send("Reference Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── PREFERENCES ───

app.get("/candidates/:id/preferences", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM preferences WHERE candidate_id=?", [req.params.id])
        res.json(rows[0] || null)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/preferences", async (req, res) => {
    try {
        const d = req.body
        const result = await query(
            `INSERT INTO preferences (candidate_id, cureent_salary, expected_salary, notice_period, preferred_role)
             VALUES (?,?,?,?,?)`,
            [req.params.id, d.current_salary || null, d.expected_salary || null,
            d.notice_period || null, d.preferred_role || null])
        res.json({ message: "Preferences Added", preference_id: result.insertId })
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/preferences/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE preferences SET cureent_salary=?, expected_salary=?, notice_period=?, preferred_role=?
             WHERE preference_id=?`,
            [d.current_salary || null, d.expected_salary || null,
            d.notice_period || null, d.preferred_role || null, req.params.id])
        res.send("Preferences Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/preferences/:id", async (req, res) => {
    try {
        await query("DELETE FROM preferences WHERE preference_id=?", [req.params.id])
        res.send("Preferences Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

// ─── LOCATIONS ───

app.get("/candidates/:id/locations", async (req, res) => {
    try {
        const rows = await query("SELECT * FROM location WHERE candidate_id=?", [req.params.id])
        res.json(rows)
    } catch {
        res.status(500).send("Database error")
    }
})

app.post("/candidates/:id/locations", async (req, res) => {
    try {
        const d = req.body
        await query(
            `INSERT INTO location (candidate_id, preference_id, preferred_location) VALUES (?,?,?)`,
            [req.params.id, d.preference_id, d.preferred_location])
        res.send("Location Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/locations/:id", async (req, res) => {
    try {
        const d = req.body
        await query(
            `UPDATE location SET preferred_location=? WHERE location_id=?`,
            [d.preferred_location, req.params.id])
        res.send("Location Updated")
    } catch {
        res.status(500).send("Database error")
    }
})

app.delete("/locations/:id", async (req, res) => {
    try {
        await query("DELETE FROM location WHERE location_id=?", [req.params.id])
        res.send("Location Deleted")
    } catch {
        res.status(500).send("Database error")
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
