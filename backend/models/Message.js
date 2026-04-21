const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    role: { type: String, enum: ['Guest', 'Member'], default: 'Guest' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reply: { type: String, default: '' },
    status: { type: String, enum: ['unread', 'replied'], default: 'unread' }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);