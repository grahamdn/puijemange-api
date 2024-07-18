const mongoose = require('mongoose')

const allergeneSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allergene: { type: String, required: true }
});

const Allergene = mongoose.model('Allergene', allergeneSchema);

module.exports = Allergene;