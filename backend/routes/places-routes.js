const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const placesControllers = require('../controllers/places-controllers')
const { fileUpload } = require('../middleware/file-upload')
const checkAuth = require('../middleware/check-auth')

router.get('/:placeId', placesControllers.getPlaceByPlaceId)

router.get('/user/:userId', placesControllers.getPlacesByUserId)

router.use(checkAuth)

router.post('/new', fileUpload.single('image'),
            [ 
            check('title').not().isEmpty(),
            check('description').isLength({ min: 5}),
            check('address').not().isEmpty()
            ], placesControllers.createPlace)

router.patch('/:placeId', placesControllers.updatePlace)

router.delete('/:placeId', placesControllers.deletePlace)

module.exports = router