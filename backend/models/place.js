const mongoose = require('mongoose')
const schema = mongoose.Schema

const place = new schema({
    creator: { 
        type: mongoose.Types.ObjectId, 
        required: true,
        ref: 'User'
    },
    image: {
        type: String, 
        required: true
    },
    title: {
        type: String, 
        required: true
    },
    description: {
        type: String, 
        required: true
    },
    address: {
        type: String, 
        required: true
    },
    location: {
        lat: {
            type: Number, 
            required: true
        },
        long:{
            type: Number, 
            required: true
        } 
    }
})

place.set('toJSON', {getters: true})

module.exports = mongoose.model('Place', place)