const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const checkAuth = require('../middleware/check-auth');

// Endpoint to get notifications for a specific user
router.get('/', checkAuth(['Student','Admin', 'Faculty']), notificationController.getNotifications);

// Endpoint to mark a notification as read
router.put('/:id/mark-read', checkAuth(['Student','Admin', 'Faculty']), notificationController.markNotificationAsRead);

module.exports = router;
