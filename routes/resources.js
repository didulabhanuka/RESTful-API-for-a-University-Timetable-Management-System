const express = require('express');
const router=express.Router();
const resourceController  = require(`../controllers/resourceController`);
const checkAuth = require('../middleware/check-auth');

// For routes only accessible by Admin
router.post('/add', checkAuth(['Admin', 'Faculty']), resourceController.addResource);
router.put('/update/:id', checkAuth(['Admin', 'Faculty']), resourceController.updateResource);
router.delete('/delete/:id', checkAuth(['Admin', 'Faculty']), resourceController.deleteResource);

// For routes accessible by all users
router.get('/', resourceController.getResources);
router.get('/get/:id', resourceController.getResource);


module.exports = router;