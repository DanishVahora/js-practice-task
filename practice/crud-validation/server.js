const express = require('express')
const app = express()
const { body, validationResult } = require("express-validator")
const db = require("./config/db")

app.use(express.urlencoded({ extended: true }))
app.set("views")
app.use(express.static("public"))
app.set("view engine", "ejs")


app.get("/", async (req, res) => {
    let page = parseInt(req.query.page) || 1;
    let limit = 5
    let offset = (page - 1) * limit
    try {
        const [records] = await db.execute(`select * from basic_info limit ${limit}  offset ${offset}`)
        const [totalResult] = await db.execute(`select count(*) as total from basic_info`);
        const total = totalResult[0].total;
        console.log(page, total);

        res.render("index", {
            records,
            currentPage: page,
            totalPages: total
        })
    } catch (err) {
        console.log(err)
    }
})

app.get("/add", (req, res) => {
    res.render("add", {
        error: []
    })
})
app.post("/add", [
    body("name").isLength({ min: 8 }).withMessage("Name must be long enough"),
    body("email").isEmail().withMessage("Email must be correct"),
    body("enrollment").isInt({ min: 20 }).withMessage("enrollment must be above 20")
], async (req, res) => {
    const errors = validationResult(req);
    const email = req.body.email;
    const enrollment = req.body.enrollment;
    const name = req.body.name;
    const address = req.body.address;
    if (!errors.isEmpty()) {
        return res.render("add", {
            error: errors.array()
        })
    }
    else {
        const [resp] = await db.execute('insert into basic_info (name, email, enrollment, address) values (?, ?, ?, ?)', [name, email, enrollment, address])
        console.log(resp.insertId)
        return res.render("add", {
            error: []
        })
    }

})

app.listen(3000, () => {
    console.log("Server running !!")
})