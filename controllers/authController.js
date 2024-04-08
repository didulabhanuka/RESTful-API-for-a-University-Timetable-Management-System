const User = require(`../models/User`);
const jwt = require(`jsonwebtoken`);
const bcrypt = require(`bcryptjs`);
const {registerValidation, loginValidation} = require(`../validation`)

const signUp = async (req, res, next) => {
    //validation
    const {error} = registerValidation(req.body);
    if(error) return res.send(error.details[0].message);
    
    //check if the user is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return  res.status(400).send("Email already exists");
    
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        role: req.body.role 
    });
    try{
        const savedUser = await user.save();
        res.send(savedUser);
    }catch(err){
        res.status(400).send(err);
    }
};

const signIn = async (req, res, next) => {
    //validation
    const {error} = loginValidation(req.body);
    if(error) return res.send(error.details[0].message);
    
    //check if the user is already in the database
    const user = await User.findOne({ email: req.body.email });
    if(!user) return  res.status(400).send("Email doesn't exists");
    
    //check password
    const validPwd = await bcrypt.compare(req.body.password, user.password);
    if(!validPwd) return res.status(400).send("Invalid password")

    //create and assign a token
    const token = jwt.sign({_id: user.id, role: user.role }, process.env.TOKEN_SECRET, {expiresIn: "1h"});
    return res.status(200).json({
        message: "Auth successful",
        token: token
    });
    // res.header("auth-token", token).send(token);
};

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

        res.status(200).json({ message: "Course enrolled successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    signUp,
    signIn,
    enrollCourse
};