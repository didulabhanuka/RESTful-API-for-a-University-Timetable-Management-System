const mongoose = require('mongoose');

const classSessionSchema  = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },  
    module: {
        type: String,
        required: true
     },
     date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
       type: String,
       required: true
    },

});

const ClassSession = mongoose.model('ClassSession', classSessionSchema );

module.exports = ClassSession;
