const express = require('express');
const router=express.Router();
const courseController = require('../controllers/courseController');
const checkAuth = require('../middleware/check-auth');

// For routes only accessible by Admin
router.post('/add', checkAuth(['Admin', 'Faculty']), courseController.addCourse);
router.put('/update/:id', checkAuth(['Admin', 'Faculty']), courseController.updateCourse);
router.delete('/delete/:id', checkAuth(['Admin', 'Faculty']), courseController.deleteCourse);
router.get('/:id/enrollments', checkAuth(['Faculty', 'Admin']), courseController.viewEnrollments);

// For routes accessible by all users
router.get('/', courseController.getCourses);
router.get('/get/:id', courseController.getCourse);

// Protected route for students
router.get('/:id/timetable', checkAuth(['Student','Admin', 'Faculty']), courseController.getCourseTimetable); 
router.post('/:id/enroll', checkAuth(['Student']), courseController.enrollCourse); 

module.exports = router;