const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb+srv://ersultan12:ersultan12@cluster0.lk9zkpa.mongodb.net/?retryWrites=true&w=majority");

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})


// Create Schema
const Loginschema = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    updateDate: {
        type: Date
    },
    deletionDate: {
        type: Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});


// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;