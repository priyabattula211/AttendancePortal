const express = require('express');
const {
    getAllEvents,
    getEventById,
    createEvent,
    updateEvent,
    registerForEvent,
    getEventAttendees
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.post('/', protect, adminOnly, createEvent);
router.put('/:id', protect, adminOnly, updateEvent);
router.post('/:id/register', protect, registerForEvent);
router.get('/:id/attendees', protect, adminOnly, getEventAttendees);

module.exports = router;
