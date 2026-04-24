const Appointment = require('../models/Appointment');

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ user: req.user.id }).populate('pet', 'name species');
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create an appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
    try {
        const appt = await Appointment.create({
            ...req.body,
            user: req.user.id
        });
        
        // Notify via socket
        if (req.io) {
            req.io.emit('new-appointment', appt);
        }

        res.status(201).json(appt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);

        if (!appt) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appt.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedAppt = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedAppt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
    try {
        const appt = await Appointment.findById(req.params.id);

        if (!appt) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appt.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await appt.deleteOne();
        res.json({ message: 'Appointment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
