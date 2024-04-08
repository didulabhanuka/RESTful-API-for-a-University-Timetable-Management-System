const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.route('/add').post(bookingController.addBooking);
router.route('/').get(bookingController.getBookings);
router.route('/update/:id').put(bookingController.updateBooking);
router.route('/delete/:id').delete(bookingController.deleteBooking);
router.route('/get/:id').get(bookingController.getBooking);

module.exports = router;
