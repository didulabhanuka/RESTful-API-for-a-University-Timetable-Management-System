const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const checkAuth = require('../middleware/check-auth');


router.post('/add', checkAuth(['Student', 'Admin', 'Faculty']), bookingController.addBooking);
router.get('/', checkAuth(['Student', 'Admin', 'Faculty']), bookingController.getBookings);
router.put('/update/:id', checkAuth(['Student', 'Admin', 'Faculty']), bookingController.updateBooking);
router.delete('/delete/:id', checkAuth(['Student', 'Admin', 'Faculty']), bookingController.deleteBooking);
router.get('/get/:id', checkAuth(['Student', 'Admin', 'Faculty']), bookingController.getBooking);


module.exports = router;
