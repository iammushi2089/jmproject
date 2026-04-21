const express = require('express');
const Message = require('../models/Message');
const { protect } = require('../middleware/auth.middleware');
const router = express.Router();

// POST /api/messages - Public (Guests and Members can send)
router.post('/', async (req, res) => {
    try {
        const { name, email, body, role, user } = req.body;
        const message = await Message.create({ name, email, body, role, user: user || null });
        res.status(201).json(message);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/messages/my-messages - Protected (Members only)
router.get('/my-messages', protect, async (req, res) => {
    try {
        const messages = await Message.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;