const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        required: true,
    },
    serviceType: {
        type: String,
        enum: ['Veterinary Checkup', 'Grooming', 'Boarding', 'Training', 'Walking', 'Other'],
        required: true,
        default: 'Veterinary Checkup'
    },
    date: {
        type: Date,
        required: [true, 'Please add a date'],
    },
    time: {
        type: String,
        required: [true, 'Please add a time slot'],
        default: '10:00 AM'
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    reason: {
        type: String,
        required: [true, 'Please add a reason for the appointment'],
    },
    notes: {
        type: String, // Vet notes after completion or user special requests
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
