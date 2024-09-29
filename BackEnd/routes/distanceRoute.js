const express = require('express')
const router = express.Router()
const {getDistance}  = require('../controllers/distanceCotroller')

router.post('/distance', getDistance)

module.exports = router