const locationController = require('../controller/locationController')
const stateController = require('../controller/stateController')
const expreess = require('express')
const router = expreess.Router()

router.get('/country', locationController.getCountry)
router.get('/state', stateController.getState)


module.exports = router;