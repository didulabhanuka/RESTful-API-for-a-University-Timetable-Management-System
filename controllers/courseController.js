const Course = require(`../models/Course`);
const ClassSession = require(`../models/ClassSession`);
const User = require(`../models/User`);

// ADD DATA
const addCourse = async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }

    const courseName = req.body.courseName;
    const courseCode = req.body.courseCode;
    const courseDescription = req.body.courseDescription ;
    const courseCredits= req.body.courseCredits ;
   
    const newCourse = new Course({
        courseName,
        courseCode,
        courseDescription,
        courseCredits
       
    })
    newCourse.save().then(()=>{
        res.json("Course added")

    }).catch((err)=>{
        console.log(err);

    })
};

// READ DATA
const getCourses = async (req, res, next) => {
    Course.find().then((courses)=>{
        res.json(courses)

    }).catch((err)=>{
        console.log(err)

    })
};

// UPDATE DATA
const updateCourse = async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }

    let courseId = req.params.id;
    const {courseName, courseCode, courseDescription, courseCredits} = req.body;

    const updateCourse = {
        courseName,
        courseCode,
        courseDescription,
        courseCredits
    }
    const update = await Course.findByIdAndUpdate(courseId, updateCourse)
    .then(() =>{
        res.status(200).send({status: "Course updated"})

    }).catch((err) =>{
        console.log(err);
        res.status(500).send({status: "Error with updating data", error: err.message});

    })

};

// DELETE DATA
const deleteCourse = async (req, res, next) => {
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: "Forbidden - Insufficient permissions" });
    }
    
    let courseId = req.params.id;

    await Course.findByIdAndDelete(courseId)
    .then(() =>{
        res.status(200).send({status: "Course removed"});

    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete user", error: err.message});

    })

};

// FETCH DATA
const getCourse = async (req, res, next) => {
    let courseId = req.params.id;
    const course = await Course.findById(courseId)
    .then((course) => {
        res.status(200).send({status: "Course fetched", course});
    }).catch((err) =>{
        console.log(err.message);
        res.status(500).send({status: "Error with get course", error: err.message});
    })

};

const getCourseTimetable = async (req, res, next) => {
    let courseId = req.params.id;
    const userId = req.user._id;

    try {

        // Check if user is enrolled in the course
        const user = await User.findById(userId);
        if (!user.enrolledCourses.includes(courseId)) {
            return res.status(403).json({ message: "Forbidden - User is not enrolled in this course" });
        }

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Find all class sessions related to this course
        const timetable = await ClassSession.find({ course: courseId });
        res.status(200).json({ timetable });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

// ENROLL IN A COURSE
const enrollCourse = async (req, res, next) => {
    const courseId = req.params.id;
    const userId = req.user._id;

    try {
        // Check if user is already enrolled
        const user = await User.findById(userId);
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        // Update user's enrolledCourses array
        user.enrolledCourses.push(courseId);
        await user.save();

        // Find the course and update its enrolledUsers array
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        
        // Check if the user is already enrolled in the course (should not happen if frontend validation is in place)
        if (course.enrolledUsers.includes(userId)) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        course.enrolledUsers.push(userId);
        await course.save();

        res.status(200).json({ message: "Course enrolled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// VIEW ENROLLMENTS FOR A SPECIFIC COURSE
const viewEnrollments = async (req, res, next) => {
    try {
        const courseId = req.params.id;

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: "Course not found" });
        }

        // Return the list of enrolled users for the specific course
        res.status(200).json({ 
            courseName: course.courseName,
            courseId: course._id,
            enrolledUsers: course.enrolledUsers.map(user => ({
                userId: user._id
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    addCourse,
    getCourses,
    updateCourse,
    deleteCourse,
    getCourse,
    getCourseTimetable,
    enrollCourse,
    viewEnrollments
};