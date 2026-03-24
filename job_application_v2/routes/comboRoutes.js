const comboController = require('../controller/comboController')
const expreess = require('express')
const router = expreess.Router()

router.get('/options/:name', comboController.getOption)

module.exports = router;