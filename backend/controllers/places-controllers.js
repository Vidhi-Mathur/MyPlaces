const { validationResult } = require('express-validator')
const mongoose = require('mongoose');
const fs = require('fs')
const HttpError = require('../models/http-error')
const getCoordinates = require('../util/location')
const Place = require('../models/place')
const User = require('../models/user');


exports.getPlaceByPlaceId = async(req, res, next) => {
    try {
        const placeId = req.params.placeId
        let identifiedPlace = await Place.findById(placeId)
        if(!identifiedPlace){
            return next(new HttpError('No place found', 404));
        }
        res.json({ place: identifiedPlace })
    } 
    catch(err){
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
} 


exports.getPlacesByUserId = async(req, res, next) => {
    try {
        const userId = req.params.userId
        let identifiedPlace = await Place.find({creator: userId})
        if(!identifiedPlace){
            return next(new HttpError('No place found', 404))
        }
        res.json({places: identifiedPlace})        
    } 
    catch(err) {
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}


exports.createPlace = async(req, res, next) => {
    try {
        const { creator, title, description, address } = req.body;
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return next(new HttpError('Invalid Input Fields', 422))
        }
        let coordinates = await getCoordinates(address)
        const createPlace = new Place({ 
            creator: creator, 
            image: req.file.path,
            title, 
            description, 
            address, 
            location: coordinates 
        })  
        let existingUser = await User.findById(creator)
        if(!existingUser){
            return next(new HttpError('No user found', 404))
        }
        const newSession = await mongoose.startSession()
        newSession.startTransaction()
        //This session would automatically create a new placeId
        await createPlace.save({session: newSession})
        //method by mongoose to push createPlace to 'existingUser'
        existingUser.places.push(createPlace)
        await existingUser.save({session: newSession})
        await newSession.commitTransaction()
        res.status(200).json({ place: createPlace })
    } 
    catch(err) {
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}


exports.updatePlace = async(req, res, next) => {
    try {
        //Extracting from url
        const placeId = req.params.placeId
        //Extracting updated data from request body
        const { title, description } = req.body;
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return next(new HttpError('Invalid Input Fields', 422))
        }
        let updatedPlace = await Place.findById(placeId)
        if(updatedPlace.creator.toString() !== req.userData.userId){
            return next(new HttpError('You are not allowed to edit this place', 401))
        }
        updatedPlace.title = title
        updatedPlace.description = description
        await updatedPlace.save()
        res.status(200).json({ place: updatedPlace })
    } 
    catch(err){
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}

exports.deletePlace = async(req, res, next) => {
    try {
        const placeId = req.params.placeId
        let removedPlace = await Place.findById(placeId).populate('creator', '-password -name -email')
        if(!removedPlace){
        return next(new HttpError('No place found', 404))
        }
        const imagePath = removedPlace.image
        fs.unlink(imagePath, err => console.log(err))
        if(removedPlace.creator.id !== req.userData.userId){
            return next(new HttpError('You are not allowed to delete this places', 401))
        }
        const newSession = await mongoose.startSession()
        newSession.startTransaction()
        await removedPlace.deleteOne({session: newSession})
        removedPlace.creator.places.pull(removedPlace)
        await removedPlace.creator.save({session: newSession})
        await newSession.commitTransaction()
        res.status(200).json({message: 'Deleted'})
    } 
    catch(err) {
        return next(new HttpError(err.message || 'Something went wrong. Try again later', err.code || 500))
    }
}
