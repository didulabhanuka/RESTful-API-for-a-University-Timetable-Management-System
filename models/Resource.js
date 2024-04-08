const mongoose = require('mongoose');

const resourceSchema  = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    }

});

const Resource = mongoose.model('Resource', resourceSchema );

module.exports = Resource;
