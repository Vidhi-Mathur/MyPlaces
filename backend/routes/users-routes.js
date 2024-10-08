const express = require('express')
const router = express.Router()
const { check } = require('express-validator')
const usersControllers = require('../controllers/users-controllers')
const { fileUpload } = require('../middleware/file-upload')

router.get('/', usersControllers.getUsers)

router.post('/signup', fileUpload.single('image'),
    [
    check('name').not().isEmpty(),
    check('email').isEmail().normalizeEmail(),
    check('password').isLength({min: 6})
    ], usersControllers.signup)

router.post('/login', check('email').isEmail().normalizeEmail(), usersControllers.login)

module.exports = router