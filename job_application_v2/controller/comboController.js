const comboModel = require('../models/comboModel')
async function getOptions(req, res) {
    try {
        const { name } = req.params
        const options = await comboModel.getOptionssByName(name);
        console.log(options)
        res.json(options)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getOptions
}
