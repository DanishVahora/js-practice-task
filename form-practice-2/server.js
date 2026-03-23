const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")



const app = express()
const PORT = 3000

app.use(cors())
app.use(express.json())
app.use(express.static("public"));


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

// promisify db.query
function query(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, result) => {
            if (err) reject(err)
            else resolve(result)
        })
    })
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MOBILE_RE = /^\d{10}$/
const PIN_RE = /^\d{6}$/

function norm(value) {
    return String(value ?? "").trim()
}

function normalizeSkillLevel(level) {
    const v = norm(level).toLowerCase()
    if (v === "expert") return "Expert"
    if (v === "intermediate" || v === "intermidiate") return "Intermidiate"
    return "Beginner"
}

function parsePositiveNumber(value) {
    if (value === "" || value === null || value === undefined) return null
    const n = Number(value)
    return Number.isFinite(n) ? n : NaN
}

function validateCandidatePayload(payload) {
    const firstName = norm(payload.first_name)
    const lastName = norm(payload.last_name)
    const designation = norm(payload.designation)
    const email = norm(payload.email)
    const mobile = norm(payload.mobile)
    const address1 = norm(payload.address1)
    const city = norm(payload.city)
    const pincode = norm(payload.pincode)
    const gender = norm(payload.gender).toLowerCase()
    const relationship = norm(payload.relationship).toLowerCase()
    const dob = norm(payload.dob)

    if (!firstName) return "First name is required"
    if (!lastName) return "Last name is required"
    if (!designation) return "Designation is required"
    if (!email || !EMAIL_RE.test(email)) return "Valid email is required"
    if (!mobile || !MOBILE_RE.test(mobile)) return "Mobile number must be 10 digits"
    if (!address1) return "Address 1 is required"
    if (!city) return "City is required"
    if (!pincode || !PIN_RE.test(pincode)) return "Pincode must be 6 digits"
    if (!["male", "female"].includes(gender)) return "Valid gender is required"
    if (!["single", "married", "divorced"].includes(relationship)) return "Valid relationship status is required"
    if (!dob) return "Date of birth is required"

    const dobDate = new Date(dob)
    if (Number.isNaN(dobDate.getTime()) || dobDate >= new Date()) {
        return "Date of birth must be a valid past date"
    }

    return null
}

function validateEducationPayload(payload) {
    const course = norm(payload.course_name)
    const board = norm(payload.university_board)
    const year = Number(payload.passing_year)
    const pct = Number(payload.percentage)
    const currentYear = new Date().getFullYear()

    if (!course) return "Course is required"
    if (!Number.isInteger(year) || year < 1900 || year > currentYear) return "Passing year is invalid"
    if (!board) return "University/Board is required"
    if (!Number.isFinite(pct) || pct < 0 || pct > 100) return "Percentage must be between 0 and 100"
    return null
}

function validateExperiencePayload(payload) {
    const company = norm(payload.company)
    const designation = norm(payload.designation)
    const fromDate = norm(payload.from_date)
    const toDate = norm(payload.to_date)
    const annualPackage = Number(payload.annual_package)

    if (!company) return "Company is required"
    if (!designation) return "Designation is required"
    if (!Number.isFinite(annualPackage) || annualPackage < 0) return "Annual package must be 0 or greater"
    if (!fromDate) return "From date is required"
    if (!toDate) return "To date is required"

    const from = new Date(fromDate)
    const to = new Date(toDate)
    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from > to) {
        return "Experience date range is invalid"
    }

    return null
}

function validateReferencePayload(payload) {
    const name = norm(payload.reference_name)
    const email = norm(payload.email)
    const phone = norm(payload.phone_number)
    if (!name) return "Reference name is required"
    if (!email || !EMAIL_RE.test(email)) return "Valid reference email is required"
    if (!phone || !MOBILE_RE.test(phone)) return "Reference phone must be 10 digits"
    return null
}

function validateCandidateLanguagePayload(payload) {
    const name = norm(payload.language_name)
    if (!payload.language_id && !name) return "Language is required"
    return null
}

function validateCandidateTechnologyPayload(payload) {
    const name = norm(payload.technology_name)
    if (!payload.technology_id && !name) return "Technology is required"
    return null
}

function validatePreferencesPayload(payload) {
    const current = parsePositiveNumber(payload.current_salary)
    const expected = parsePositiveNumber(payload.expected_salary)
    const notice = parsePositiveNumber(payload.notice_period)
    if (Number.isNaN(current) || (current !== null && current < 0)) return "Current salary must be 0 or greater"
    if (Number.isNaN(expected) || (expected !== null && expected < 0)) return "Expected salary must be 0 or greater"
    if (Number.isNaN(notice) || (notice !== null && notice < 0)) return "Notice period must be 0 or greater"
    return null
}

function parseSearch(searchText) {
    const q = norm(searchText)
    if (!q) return { sql: "", params: [] }

    const prefix = q[0]
    const term = q.slice(1)
    const byPrefix = {
        "$": { sql: "WHERE first_name LIKE ?", term },
        "^": { sql: "WHERE last_name LIKE ?", term },
        "@": { sql: "WHERE email LIKE ?", term },
        "#": { sql: "WHERE mobile_number LIKE ?", term }
    }

    if (byPrefix[prefix]) {
        const clean = norm(byPrefix[prefix].term)
        return {
            sql: byPrefix[prefix].sql,
            params: [`%${clean}%`]
        }
    }

    return {
        sql: "WHERE first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR mobile_number LIKE ?",
        params: [`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`]
    }
}

//  CANDIDATES APIS

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "public" })
})
app.get("/index", (req, res) => {
    res.redirect("/")
})

app.get("/users", (req, res) => {
    res.sendFile("users.html", { root: "public" })
})

app.get("/candidates", async (req, res) => {
    try {
        const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
        const pageSize = Math.min(50, Math.max(1, Number.parseInt(req.query.pageSize, 10) || 5))
        const search = norm(req.query.search)
        const where = parseSearch(search)
        const offset = (page - 1) * pageSize

        const countSql = `SELECT COUNT(*) AS total FROM candidates ${where.sql}`
        const rowsSql = `SELECT * FROM candidates ${where.sql} ORDER BY candidate_id DESC LIMIT ? OFFSET ?`

        const [countRow] = await query(countSql, where.params)
        const rows = await query(rowsSql, [...where.params, pageSize, offset])
        const total = countRow.total || 0

        res.json({
            data: rows,
            pagination: {
                page,
                pageSize,
                total,
                totalPages: Math.max(1, Math.ceil(total / pageSize))
            },
            search
        })
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
        const candidateError = validateCandidatePayload(d)
        if (candidateError) return res.status(400).send(candidateError)

        if (!Array.isArray(d.education) || d.education.length === 0) {
            return res.status(400).send("At least one education row is required")
        }
        if (!Array.isArray(d.experience) || d.experience.length === 0) {
            return res.status(400).send("At least one experience row is required")
        }
        if (!Array.isArray(d.languages) || d.languages.length === 0) {
            return res.status(400).send("At least one language is required")
        }
        if (!Array.isArray(d.technologies) || d.technologies.length === 0) {
            return res.status(400).send("At least one technology is required")
        }

        for (const edu of d.education) {
            const rowError = validateEducationPayload({
                course_name: edu.course,
                passing_year: edu.year,
                university_board: edu.board,
                percentage: edu.percentage
            })
            if (rowError) return res.status(400).send(`Education: ${rowError}`)
        }

        for (const exp of d.experience) {
            const rowError = validateExperiencePayload({
                company: exp.company,
                designation: exp.designation,
                annual_package: exp.salary,
                from_date: exp.from,
                to_date: exp.to
            })
            if (rowError) return res.status(400).send(`Experience: ${rowError}`)
        }

        if (!d.reference || !d.reference.name) {
            return res.status(400).send("Reference details are required")
        }
        const refError = validateReferencePayload({
            reference_name: d.reference.name,
            email: d.reference.email,
            phone_number: d.reference.phone
        })
        if (refError) return res.status(400).send(refError)

        const prefError = validatePreferencesPayload(d.preferences || {})
        if (prefError) return res.status(400).send(prefError)

        const result = await query(
            `INSERT INTO candidates
             (first_name,last_name,designation,email,mobile_number,address_1,address_2,city,state,pincode,gender,relationship_status,dob)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [norm(d.first_name), norm(d.last_name), norm(d.designation), norm(d.email), norm(d.mobile),
            norm(d.address1), norm(d.address2), norm(d.city), norm(d.state), norm(d.pincode),
            norm(d.gender).toLowerCase(), norm(d.relationship).toLowerCase(), d.dob])

        const candidateId = result.insertId

        // Education
        if (d.education && d.education.length) {
            for (const edu of d.education) {
                await query(
                    `INSERT INTO education (candidate_id, course_name, passing_year, university_board, percentage)
                     VALUES (?,?,?,?,?)`,
                    [candidateId, norm(edu.course), edu.year, norm(edu.board), edu.percentage])
            }
        }

        // Experience
        if (d.experience && d.experience.length) {
            for (const exp of d.experience) {
                await query(
                    `INSERT INTO experience (candidate_id, company, designation, annual_package, from_date, to_date, reason_to_leaving, referral_contact, referral_name)
                     VALUES (?,?,?,?,?,?,?,?,?)`,
                    [candidateId, norm(exp.company), norm(exp.designation), exp.salary,
                        exp.from, exp.to, norm(exp.reason), norm(exp.contact), norm(exp.name)])
            }
        }

        // Languages
        if (d.languages && d.languages.length) {
            for (const lang of d.languages) {
                let [existing] = await query("SELECT language_id FROM language_known WHERE language_name=?", [norm(lang.name)])
                let languageId
                if (existing) {
                    languageId = existing.language_id
                } else {
                    const r = await query("INSERT INTO language_known (language_name) VALUES (?)", [norm(lang.name)])
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
                const techName = norm(tech.name)
                if (!techName) return res.status(400).send("Technology name is required")
                let [existing] = await query("SELECT technology_id FROM technology_known WHERE technology_name=?", [techName])
                let technologyId
                if (existing) {
                    technologyId = existing.technology_id
                } else {
                    const r = await query("INSERT INTO technology_known (technology_name) VALUES (?)", [techName])
                    technologyId = r.insertId
                }
                const level = normalizeSkillLevel(tech.level)
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
                [candidateId, norm(d.reference.name), norm(d.reference.email), norm(d.reference.phone)])
        }

        // Preferences
        if (d.preferences) {
            const prefResult = await query(
                `INSERT INTO preferences (candidate_id, cureent_salary, expected_salary, notice_period, preferred_role)
                 VALUES (?,?,?,?,?)`,
                [candidateId, parsePositiveNumber(d.preferences.current_salary), parsePositiveNumber(d.preferences.expected_salary),
                    parsePositiveNumber(d.preferences.notice_period), norm(d.preferences.preferred_role) || null])

            const preferenceId = prefResult.insertId

            // Locations
            if (d.preferred_locations && d.preferred_locations.length) {
                for (const loc of d.preferred_locations) {
                    await query(
                        `INSERT INTO location (candidate_id, preference_id, preferred_location) VALUES (?,?,?)`,
                        [candidateId, preferenceId, norm(loc)])
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
        const candidateError = validateCandidatePayload(d)
        if (candidateError) return res.status(400).send(candidateError)

        await query(
            `UPDATE candidates
             SET first_name=?, last_name=?, designation=?, email=?, mobile_number=?,
                 address_1=?, address_2=?, city=?, state=?, pincode=?,
                 gender=?, relationship_status=?, dob=?
             WHERE candidate_id=?`,
            [norm(d.first_name), norm(d.last_name), norm(d.designation), norm(d.email), norm(d.mobile),
            norm(d.address1), norm(d.address2), norm(d.city), norm(d.state), norm(d.pincode),
            norm(d.gender).toLowerCase(), norm(d.relationship).toLowerCase(), d.dob || null,
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
        const error = validateEducationPayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `INSERT INTO education (candidate_id, course_name, passing_year, university_board, percentage)
             VALUES (?,?,?,?,?)`,
            [req.params.id, norm(d.course_name), d.passing_year, norm(d.university_board), d.percentage])
        res.send("Education Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/education/:id", async (req, res) => {
    try {
        const d = req.body
        const error = validateEducationPayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `UPDATE education SET course_name=?, passing_year=?, university_board=?, percentage=?
             WHERE education_id=?`,
            [norm(d.course_name), d.passing_year, norm(d.university_board), d.percentage, req.params.id])
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
        const error = validateExperiencePayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `INSERT INTO experience (candidate_id, company, designation, annual_package, from_date, to_date, reason_to_leaving, referral_contact, referral_name)
             VALUES (?,?,?,?,?,?,?,?,?)`,
            [req.params.id, norm(d.company), norm(d.designation), d.annual_package,
            d.from_date, d.to_date, norm(d.reason_to_leaving), norm(d.referral_contact), norm(d.referral_name)])
        res.send("Experience Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/experience/:id", async (req, res) => {
    try {
        const d = req.body
        const error = validateExperiencePayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `UPDATE experience SET company=?, designation=?, annual_package=?, from_date=?, to_date=?,
             reason_to_leaving=?, referral_contact=?, referral_name=?
             WHERE experience_id=?`,
            [norm(d.company), norm(d.designation), d.annual_package, d.from_date, d.to_date,
            norm(d.reason_to_leaving), norm(d.referral_contact), norm(d.referral_name), req.params.id])
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
        const error = validateCandidateLanguagePayload(d)
        if (error) return res.status(400).send(error)
        let languageId = d.language_id
        if (!languageId && d.language_name) {
            let [existing] = await query("SELECT language_id FROM language_known WHERE language_name=?", [norm(d.language_name)])
            if (existing) {
                languageId = existing.language_id
            } else {
                const r = await query("INSERT INTO language_known (language_name) VALUES (?)", [norm(d.language_name)])
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
        const error = validateCandidateTechnologyPayload(d)
        if (error) return res.status(400).send(error)
        let technologyId = d.technology_id
        if (!technologyId && d.technology_name) {
            const technologyName = norm(d.technology_name)
            let [existing] = await query("SELECT technology_id FROM technology_known WHERE technology_name=?", [technologyName])
            if (existing) {
                technologyId = existing.technology_id
            } else {
                const r = await query("INSERT INTO technology_known (technology_name) VALUES (?)", [technologyName])
                technologyId = r.insertId
            }
        }
        await query(
            `INSERT INTO candidate_technology (technology_id, candidate_id, skill_level)
             VALUES (?,?,?)`,
            [technologyId, req.params.id, normalizeSkillLevel(d.skill_level)])
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
            [normalizeSkillLevel(d.skill_level), req.params.id])
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
        const error = validateReferencePayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `INSERT INTO reference_contact (candidate_id, reference_name, email, phone_number)
             VALUES (?,?,?,?)`,
            [req.params.id, norm(d.reference_name), norm(d.email), norm(d.phone_number)])
        res.send("Reference Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/references/:id", async (req, res) => {
    try {
        const d = req.body
        const error = validateReferencePayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `UPDATE reference_contact SET reference_name=?, email=?, phone_number=?
             WHERE reference_contact_id=?`,
            [norm(d.reference_name), norm(d.email), norm(d.phone_number), req.params.id])
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
        const error = validatePreferencesPayload(d)
        if (error) return res.status(400).send(error)
        const result = await query(
            `INSERT INTO preferences (candidate_id, cureent_salary, expected_salary, notice_period, preferred_role)
             VALUES (?,?,?,?,?)`,
            [req.params.id, parsePositiveNumber(d.current_salary), parsePositiveNumber(d.expected_salary),
            parsePositiveNumber(d.notice_period), norm(d.preferred_role) || null])
        res.json({ message: "Preferences Added", preference_id: result.insertId })
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/preferences/:id", async (req, res) => {
    try {
        const d = req.body
        const error = validatePreferencesPayload(d)
        if (error) return res.status(400).send(error)
        await query(
            `UPDATE preferences SET cureent_salary=?, expected_salary=?, notice_period=?, preferred_role=?
             WHERE preference_id=?`,
            [parsePositiveNumber(d.current_salary), parsePositiveNumber(d.expected_salary),
            parsePositiveNumber(d.notice_period), norm(d.preferred_role) || null, req.params.id])
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
        if (!norm(d.preferred_location)) return res.status(400).send("Preferred location is required")
        await query(
            `INSERT INTO location (candidate_id, preference_id, preferred_location) VALUES (?,?,?)`,
            [req.params.id, d.preference_id, norm(d.preferred_location)])
        res.send("Location Added")
    } catch {
        res.status(500).send("Database error")
    }
})

app.put("/locations/:id", async (req, res) => {
    try {
        const d = req.body
        if (!norm(d.preferred_location)) return res.status(400).send("Preferred location is required")
        await query(
            `UPDATE location SET preferred_location=? WHERE location_id=?`,
            [norm(d.preferred_location), req.params.id])
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