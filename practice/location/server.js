const express = require('express')
const app = express()
const path = require('path')
const db = require('./config/db')

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')


app.get('/', async (req, res) => {
    try {
        const [countries] = await db.execute(`select * from country`)
        return res.status(200).render("index", {
            countries
        })
    } catch (err) {
        console.log(err);
    }
})

app.get('/state', async (req, res) => {
    let country = req.query.country;
    try {
        const [states] = await db.execute("select * from state s join country c where s.country_id=c.country_id and c.country_name = ?", [country]);
        res.json(states)
    } catch (err) {
        console.log(err)
    }
})

app.get("/city", async (req, res) => {
    let state = req.query.state
    try {
        const [cities] = await db.execute(`select * from city c join state s on c.state_id=s.state_id where s.state_name =?`, [state])
        res.json(cities)
    } catch (err) {
        console.log(err);
    }
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})
