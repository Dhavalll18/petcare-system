const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    pet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet'
    },
    title: {
        type: String,
        required: [true, 'Please add a task title']
    },
    description: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    category: {
        type: String,
        enum: ['Food', 'Health', 'Exercise', 'Grooming', 'Other'],
        default: 'Other'
    },
    dueDate: {
        type: Date
    },
    completed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);
