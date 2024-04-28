const Notification = require('../models/Notification');

// Controller function to get notifications for a specific user
const getNotifications = async (req, res, next) => {
    const userId = req.user._id;

    try {
        const notifications = await Notification.find({ userId, read: false }).sort({ timestamp: -1 });
        res.status(200).json({ notifications });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Controller function to mark a notification as read
const markNotificationAsRead = async (req, res, next) => {
    const notificationId = req.params.id;

    try {
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }
        notification.read = true;
        await notification.save();
        res.status(200).json({ message: "Notification marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead
};
