const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/submit", (req, res) => {

    const data = req.body;

    const candidateQuery = `
    INSERT INTO candidate
    (first_name,last_name,designation,email,mobile_number,
    address1,address2,city,state,pincode,gender,relationship_status,dob)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
    `;

    const values = [
        data.fname,
        data.lname,
        data.designation,
        data.email,
        data.mobile,
        data.address1,
        data.address2,
        data.city,
        data.state,
        data.pincode,
        data.gender,
        data.relationship,
        data.dob
    ];

    db.query(candidateQuery, values, (err, result) => {

        if (err) {
            console.log(err);
            return res.send("Error inserting candidate");
        }

        const candidateId = result.insertId;

        // Insert education
        data.education.forEach((edu) => {

            const eduQuery = `
            INSERT INTO education
            (candidate_id,course,passing_year,university_board,percentage)
            VALUES (?,?,?,?,?)
            `;

            db.query(eduQuery, [
                candidateId,
                edu.course,
                edu.year,
                edu.board,
                edu.percentage
            ]);
        });

        // Insert experience
        data.experience.forEach((exp) => {

            const expQuery = `
            INSERT INTO experience
            (candidate_id,company,designation,annual_package,
            from_date,to_date,reason_to_leave,referral_contact,referral_name)
            VALUES (?,?,?,?,?,?,?,?,?)
            `;

            db.query(expQuery, [
                candidateId,
                exp.company,
                exp.designation,
                exp.salary,
                exp.from,
                exp.to,
                exp.reason,
                exp.contact,
                exp.name
            ]);
        });

        res.send("Form Submitted Successfully");
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
