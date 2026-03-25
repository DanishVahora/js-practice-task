const db = require('../config/db')
async function getOptionssByName(name) {
    const [rows] = await db.execute(`SELECT * FROM option_master o join select_master s on o.select_id = s.id 
        where s.name = ? and o.is_active = 1 order by o.sort_order`, [name])
    console.log(rows)
    return rows
}

module.exports = {
    getOptionssByName
}