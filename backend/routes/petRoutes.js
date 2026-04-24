const express = require('express');
const router = express.Router();
const { getPets, createPet, updatePet, deletePet, getPetTips } = require('../controllers/petController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getPets).post(protect, createPet);
router.route('/:id').put(protect, updatePet).delete(protect, deletePet);
router.route('/:id/tips').get(protect, getPetTips);

module.exports = router;
