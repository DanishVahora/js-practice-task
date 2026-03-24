const comboModel = require('../models/comboModel')
async function getOption(req, res) {
    try {
        const { name } = req.params
        const options = await comboModel.getOptionByName(name);
        console.log(options)
        res.json(options)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}

module.exports = {
    getOption
}
