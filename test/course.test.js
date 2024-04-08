const supertest = require("supertest");
const app = require('../server');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { addCourse, updateCourse } = require('./utils/course.test.data');
const User = require('../models/User'); 
const Course = require('../models/Course'); 

const userId = courseId = new mongoose.Types.ObjectId().toString();

describe("Course Routes", () => {
    let token;

    beforeAll(() => {
        // Generate a valid token for testing
        token = jwt.sign({ _id: userId , role: "Admin" }, process.env.TOKEN_SECRET, { expiresIn: '1h' });
    });

    it("should create a course", async () => {
        const response = await supertest(app)
            .post("/api/courses/add")
            .set('Authorization', `Bearer ${token}`)
            .send(addCourse)
            .expect(200);
    });

    it("should return all courses and be accessible to every role", async () => {
        await supertest(app)
            .get("/api/courses/")
            .expect(200);
    });

    it("should return a specific course and be accessible to every role", async () => {
        // const courseId = "66002cb97c3532a164996bf0"; // Specific course ID
        await supertest(app)
            .get(`/api/courses/get/${courseId}`)
            .expect(200);
    });

    it("should update a course", async () => {
        // const courseId = "66002cb97c3532a164996bf0";
        const response = await supertest(app)
            .put(`/api/courses/update/${courseId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateCourse);

        expect(response.status).toBe(200);
    });

    it("should reject course creation without authentication", async () => {
        const response = await supertest(app)
            .post("/api/courses/add")
            .send(addCourse);

        expect(response.status).toBe(401);
    });
    
});
