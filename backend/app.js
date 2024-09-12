require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes')
const cors = require("cors")

const app = express()

app.use(cors({
    origin: '*'
}))

app.use(bodyParser.json())

app.use('/uploads/images', express.static(path.join('uploads', 'images')))

app.use(express.static(path.join('public')))

app.use('/places', placesRoutes)
app.use('/users', usersRoutes)

app.use((req, res, next) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

app.use((error, req, res, next) => {
    if(req.file){
        fs.unlink(req.file.path, err => console.log(err))
    }
    if(res.headerSent){
        return next(error)
    }
    const status = error.code && Number.isInteger(error.code) && error.code >= 100 && error.code < 600 ? error.code : 500;
    res.status(status).json({message: error.message || 'An unknown error occurred'})
})

mongoose.connect(process.env.MONGODB_URI).then(() =>  app.listen(5000)).catch(err => console.log(err))
