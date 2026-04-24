const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: [true, 'Please add a name'],
    },
    species: {
        type: String,
        required: [true, 'Please add a species'],
    },
    breed: {
        type: String,
        default: 'Unknown'
    },
    age: {
        type: Number,
        required: [true, 'Please add age'],
    },
    weight: {
        type: Number, // in kg or lbs
        default: 0
    },
    allergies: [{
        type: String
    }],
    vaccinations: [{
        name: String,
        dateAdministered: Date,
        nextDueDate: Date
    }],
    avatarUrl: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/3069/3069172.png' // Default pet icon
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Pet', petSchema);
