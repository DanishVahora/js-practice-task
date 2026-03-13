const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

/* DATABASE CONNECTION */

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "job_platform"
})

db.connect(err => {
    if (err) {
        console.log("Database error:", err)
    } else {
        console.log("MySQL Connected")
    }
})



/* CREATE */

app.post("/candidates", (req, res) => {

    const data = req.body

    const sql = `
    INSERT INTO candidates
    (first_name,last_name,designation,email,mobile_number,address_1,address_2,city,state,pincode)
    VALUES (?,?,?,?,?,?,?,?,?,?)`

    db.query(sql, [
        data.first_name,
        data.last_name,
        data.designation,
        data.email,
        data.mobile,
        data.address1,
        data.address2,
        data.city,
        data.state,
        data.pincode
    ],
        (err, result) => {

            if (err) {
                console.log(err)
                return res.status(500).send("Database error")
            }

            res.send("Candidate Created")

        })

})



/* READ ALL */

app.get("/candidates", (req, res) => {

    db.query("SELECT * FROM candidates", (err, result) => {

        if (err) {
            return res.status(500).send(err)
        }

        res.json(result)

    })

})



/* READ ONE */

app.get("/candidates/:id", (req, res) => {

    const id = req.params.id

    db.query(
        "SELECT * FROM candidates WHERE candidate_id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err)
            }

            res.json(result)

        }
    )

})



/* UPDATE */

app.put("/candidates/:id", (req, res) => {

    const id = req.params.id
    const data = req.body

    const sql = `
    UPDATE candidates
    SET first_name=?, last_name=?, designation=?, email=?
    WHERE candidate_id=?`

    db.query(sql,
        [
            data.first_name,
            data.last_name,
            data.designation,
            data.email,
            id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).send(err)
            }

            res.send("Candidate Updated")

        })

})



/* DELETE */

app.delete("/candidates/:id", (req, res) => {

    const id = req.params.id

    db.query(
        "DELETE FROM candidates WHERE candidate_id=?",
        [id],
        (err, result) => {

            if (err) {
                return res.status(500).send(err)
            }

            res.send("Candidate Deleted")

        }
    )

})



/* SERVER */

app.listen(3000, () => {

    console.log("Server running on port 3000")

})
