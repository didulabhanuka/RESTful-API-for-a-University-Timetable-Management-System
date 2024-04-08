const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
    type: String,
    required: true
  },
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  courseDescription: {
    type: String,
    required: true
  },
  courseCredits: {
    type: Number,
    required: true
  },
  enrolledUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] 
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
