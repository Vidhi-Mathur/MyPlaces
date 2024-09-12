require('dotenv').config()
const { validationResult } = require('express-validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const HttpError = require('../models/http-error')
const User = require('../models/user')
const { uploadToCloudinary } = require('../middleware/file-upload')

exports.getUsers = async(req, res, next) => {
    try {
        let users = await User.find({}, '--password')
        res.status(200).json({ users })
    }
    catch(err) {
        console.log(err)
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}

exports.signup = async(req, res, next) => {
    const { name, email, password } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid Input Fields', 422))
    }
    try {
        let existingUser = await User.findOne({ email: email })
        if(existingUser) return next(new HttpError('User already exist, login instead', 422))
        let hashedPassword = await bcryptjs.hash(password, 12)
        let uploadedFile = await uploadToCloudinary(req.file.buffer, 'user-production');
        const createUser = new User({
            name,
            email,
            password: hashedPassword,
            image: uploadedFile.secure_url,
            places: []
        })
        await createUser.save()
        let token = jwt.sign({userId: createUser.id, email: createUser.email}, process.env.JWT_KEY, {
            expiresIn: '1h'
        })
        return res.status(201).json({ userId: createUser.id, email: createUser.email, token: token })
    }
    catch (err){
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}

exports.login = async(req, res, next) => {
    const { email, password } = req.body
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return next(new HttpError('Invalid Input Fields', 422))
    }
    try {
        let identifiedUser = await User.findOne({ email })
        if(!identifiedUser) return next(new HttpError('User not found. Please try again', 403))
        let isValidPassword = bcryptjs.compare(identifiedUser.password, password)
        if(!isValidPassword) return next(new HttpError('Incorrect Password. Please try again', 403))
        let token = jwt.sign({userId: identifiedUser.id, email: identifiedUser.email}, process.env.JWT_KEY, {
            expiresIn: '1h'
        })
        res.json({ userId: identifiedUser.id, email: identifiedUser.email, token: token})
    }
    catch(err) {
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}