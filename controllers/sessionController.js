const ClassSession = require(`../models/ClassSession`);
const Course = require(`../models/Course`);
const User = require('../models/User');
const Notification = require('../models/Notification');

// ADD DATA
const addSession = async (req, res, next) => {
    const { course, module, date, startTime, endTime, location } = req.body;

    try {
        // Check if the course exists in the database
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Check if any session exists at the given time, date, and location
        const existingSession = await ClassSession.findOne({
            date: date,
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] }
            ],
            location: location
        });
        if (existingSession) {
            return res.status(400).json({ error: "Another class session already exists at this date, time, and location" });
        }

        // Check if any session exists with the same date, time, and location for a different course
        const existingSessionSameDateTimeLocation = await ClassSession.findOne({
            date: date,
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] }
            ],
            location: location,
            course: { $ne: course }
        });
        if (existingSessionSameDateTimeLocation) {
            return res.status(400).json({ error: "Another class session for a different course already exists at this date, time, and location" });
        }

        // Create the new class session
        const newClassSession = new ClassSession({
            course,
            module,
            date,
            startTime,
            endTime,
            location
        });

        await newClassSession.save();

        // Create notifications for enrolled users of the course
        const enrolledUsers = existingCourse.enrolledUsers;
        enrolledUsers.forEach(async (userId) => {
            const notification = new Notification({
                userId,
                message: `New class session added for ${existingCourse.courseName}.`,
                courseId: existingCourse._id
            });
            await notification.save();
        });

        res.status(201).json({ message: "Class session added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};


// READ DATA
const getSessions = async (req, res, next) => {
    ClassSession.find().then((classSessions)=>{
        res.json(classSessions)

    }).catch((err)=>{
        console.log(err)

    })
};

// UPDATE DATA
const updateSession = async (req, res, next) => {
    let sessionId = req.params.id;
    const { course, module, date, startTime, endTime, location } = req.body;

    try {
        // Check if the course exists in the database
        const existingCourse = await Course.findById(course);
        if (!existingCourse) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Check if any session exists at the given time, date, and location
        const existingSession = await ClassSession.findOne({
            date: date,
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] }
            ],
            location: location
        });
        if (existingSession && existingSession._id != sessionId) {
            return res.status(400).json({ error: "Another class session already exists at this date, time, and location" });
        }

        // Check if any session exists with the same date, time, and location for a different course
        const existingSessionSameDateTimeLocation = await ClassSession.findOne({
            date: date,
            $or: [
                { $and: [{ startTime: { $lte: startTime } }, { endTime: { $gte: startTime } }] },
                { $and: [{ startTime: { $lte: endTime } }, { endTime: { $gte: endTime } }] }
            ],
            location: location,
            course: { $ne: course }
        });
        if (existingSessionSameDateTimeLocation) {
            return res.status(400).json({ error: "Another class session for a different course already exists at this date, time, and location" });
        }

        // Update the class session
        await ClassSession.findByIdAndUpdate(sessionId, {
            course,
            module,
            date,
            startTime,
            endTime,
            location
        });

        // Create notifications for enrolled users of the course
        const enrolledUsers = existingCourse.enrolledUsers;
        enrolledUsers.forEach(async (userId) => {
            const notification = new Notification({
                userId,
                message: `Class session updated for ${existingCourse.courseName}.`,
                courseId: existingCourse._id
            });
            await notification.save();
        });

        res.status(200).json({ message: "Class session updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// DELETE DATA
const deleteSession = async (req, res, next) => {
    let sessionId = req.params.id;

    await ClassSession.findByIdAndDelete(sessionId)
    .then(() =>{
        res.status(200).send({status: "Class session removed"});

    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});

    })
};

// FETCH DATA
const getSession = async (req, res, next) => {
    let sessionId = req.params.id;
    const classSession = await ClassSession.findById(sessionId)
    .then((classSession) => {
        res.status(200).send({status: "class session fetched", classSession});
    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with get class session", error: err.message});
    })
};

// READ PARTICULAR COURSE DATA
const getCourseSessions = async (req, res, next) => {
    try {
        const classSessions = await ClassSession.find({ course: req.params.course });
        res.json(classSessions);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

module.exports = {
    addSession,
    getSessions,
    updateSession,
    deleteSession,
    getSession,
    getCourseSessions
};