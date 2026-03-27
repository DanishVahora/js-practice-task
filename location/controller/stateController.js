const db = require('../config/db')


async function getState(req, res) {
    try {
        const country = req.query.country;
        const [rows] = await db.execute(`select state_name from state s join country c on c.country_id = s.country_id where c.country_name = '${country}'`)
        console.log(rows)
        res.json(rows)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getState
}