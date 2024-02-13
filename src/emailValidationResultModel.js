// emailValidationResultModel.js
const mongoose = require('mongoose');

const EmailValidationResultSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    valid: Boolean,
    provider: String,
    isFreemail: Boolean,
    isDisposable: Boolean,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const EmailValidationResultModel = mongoose.model('EmailValidationResult', EmailValidationResultSchema);

module.exports = EmailValidationResultModel;
