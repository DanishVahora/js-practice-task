const db = require('../config/db')


async function getCity(req, res) {
    try {
        const state = req.query.state;
        const [rows] = await db.execute(`select city_name from city c join state s on c.state_id = s.state_id where s.state_name = '${state}'`)
        console.log(rows)
        res.json(rows)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getCity
}