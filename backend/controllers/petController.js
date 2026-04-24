const Pet = require('../models/Pet');
const generatePetCareTips = require('../utils/aiTips');

// @desc    Get all pets for a user
// @route   GET /api/pets
// @access  Private
exports.getPets = async (req, res) => {
    try {
        const pets = await Pet.find({ user: req.user.id });
        res.json(pets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a pet
// @route   POST /api/pets
// @access  Private
exports.createPet = async (req, res) => {
    try {
        const pet = await Pet.create({
            ...req.body,
            user: req.user.id
        });
        res.status(201).json(pet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private
exports.updatePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        if (pet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPet);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private
exports.deletePet = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        if (pet.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await pet.deleteOne();
        res.json({ message: 'Pet removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get AI Tips for a pet
// @route   GET /api/pets/:id/tips
// @access  Private
exports.getPetTips = async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });

        const tips = generatePetCareTips(pet);
        res.json({ tips });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
