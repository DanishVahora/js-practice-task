const db = require('../config/db')


async function getCountry(req, res) {
    try {

        const [rows] = await db.execute(`select country_name from countries`)
        console.log(rows)
        res.json(rows)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getCountry
}