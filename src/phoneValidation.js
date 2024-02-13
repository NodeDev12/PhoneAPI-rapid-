const mongoose = require('mongoose');

const PhoneValidationSchema = new mongoose.Schema({
    valid: Boolean,
    country: String,
    location: String,
    type: String,
    timestamp: String,
    phoneNumber: String,
});

const PhoneValidation = mongoose.model('PhoneValidation', PhoneValidationSchema);

module.exports = PhoneValidation;
