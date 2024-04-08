
const Booking = require('../models/Booking');
const Resource = require('../models/Resource');

const addBooking = async (req, res, next) => {
    try {
        const { resourceId, resourceQty, roomId, date, startTime, endTime } = req.body;

        // Check if the total quantity of the resource booked on a specific date exceeds the available quantity
        const bookingsOnDate = await Booking.find({ resourceId, date });
        const totalQtyBooked = bookingsOnDate.reduce((total, booking) => total + booking.resourceQty, 0);
        const resource = await Resource.findById(resourceId);
        if (totalQtyBooked + resourceQty > resource.quantity) {
            return res.status(400).json({ error: 'Booking quantity exceeds available quantity for the resource on this date.' });
        }

        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            resourceId,
            date,
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
                { $and: [{ startTime: { $gte: startTime } }, { endTime: { $lte: endTime } }] }
            ]
        });
        if (overlappingBooking) {
            return res.status(400).json({ error: 'Booking overlaps with an existing booking.' });
        }

        const newBooking = new Booking({ resourceId, resourceQty, roomId, date, startTime, endTime });
        await newBooking.save();

        res.json({ message: 'Booking added successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find();
        res.json(bookings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error.' });
    }
};

const updateBooking = async (req, res, next) => {
    try {
        let bookingId = req.params.id;
        const { resourceId, resourceQty, roomId, date, startTime, endTime } = req.body;

        // Check if the booking exists
        const existingBooking = await Booking.findById(bookingId);
        if (!existingBooking) {
            return res.status(404).json({ status: "Booking not found" });
        }

        // Check if the total quantity of the resource booked on a specific date exceeds the available quantity
        const bookingsOnDate = await Booking.find({ resourceId, date, _id: { $ne: bookingId } });
        const totalQtyBooked = bookingsOnDate.reduce((total, booking) => total + booking.resourceQty, 0);
        const resource = await Resource.findById(resourceId);
        if (totalQtyBooked + resourceQty > resource.quantity) {
            return res.status(400).json({ error: 'Booking quantity exceeds available quantity for the resource on this date.' });
        }

        // Check for overlapping bookings
        const overlappingBooking = await Booking.findOne({
            resourceId,
            date,
            _id: { $ne: bookingId },
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] },
                { $and: [{ startTime: { $gte: startTime } }, { endTime: { $lte: endTime } }] }
            ]
        });
        if (overlappingBooking) {
            return res.status(400).json({ error: 'Booking overlaps with an existing booking.' });
        }

        // Update the booking
        const updateBooking = {
            resourceId,
            resourceQty,
            roomId,
            date,
            startTime,
            endTime
        };
        await Booking.findByIdAndUpdate(bookingId, updateBooking);

        res.status(200).json({ status: "Booking updated" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: "Error with updating booking", error: err.message });
    }
};

const deleteBooking = async (req, res, next) => {
    let bookingId = req.params.id;

    await Booking.findByIdAndDelete(bookingId)
    .then(() => {
        res.status(200).json({ status: "Booking removed" });
    }).catch((err) => {
        console.log(err.message);
        res.status(500).json({ status: "Error with delete booking", error: err.message });
    });
};

const getBooking = async (req, res, next) => {
    let bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
    .then((booking) => {
        if (!booking) {
            return res.status(404).json({ status: "Booking not found" });
        }
        res.status(200).json({ status: "Booking fetched", booking });
    }).catch((err) => {
        console.log(err.message);
        res.status(500).json({ status: "Error with get booking", error: err.message });
    });
};

module.exports = {
    addBooking,
    getBookings,
    updateBooking,
    deleteBooking,
    getBooking
};