const express = require('express');
const router=express.Router();
const sessionController = require(`../controllers/sessionController`);
const checkAuth = require('../middleware/check-auth');

// For routes only accessible by Admin
router.post('/add', checkAuth(['Admin', 'Faculty']), sessionController.addSession);
router.put('/update/:id', checkAuth(['Admin', 'Faculty']), sessionController.updateSession);
router.delete('/delete/:id', checkAuth(['Admin', 'Faculty']), sessionController.deleteSession);

// For routes accessible by all users
router.get('/', sessionController.getSessions);
router.get('/get/:id', sessionController.getSession);
router.get('/get/:course', sessionController.getCourseSessions);

module.exports = router;