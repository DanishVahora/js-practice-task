const locationController = require('../controller/locationController')
const expreess = require('express')
const router = expreess.Router()

router.get('/country', locationController.getCountry)

module.exports = router;