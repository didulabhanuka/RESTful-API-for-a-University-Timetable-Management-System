const mongoose = require(`mongoose`);

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true,
        min: 8
    },
    role: {
        type: String,
        enum: ['Admin', 'Faculty', 'Student'],
        default: 'Student'
    },
    enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
    
});

module.exports = mongoose.model('User', userSchema);