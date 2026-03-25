const locationController = require('../controller/locationController')
const stateController = require('../controller/stateController')
const cityController = require('../controller/cityController')
const expreess = require('express')
const router = expreess.Router()

router.get('/country', locationController.getCountry)
router.get('/state', stateController.getState)
router.get('/city', cityController.getCity)



module.exports = router;