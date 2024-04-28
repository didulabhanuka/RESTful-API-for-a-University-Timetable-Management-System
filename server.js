const express = require('express');
const app = express();
const PORT = 3000;
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
require("dotenv").config();

//Import Routes
const authRoute = require(`./routes/auth`);
const coursesRoutes = require(`./routes/courses`);
const classSessionsRoutes = require(`./routes/classSessions`);
const resourcesRoutes = require(`./routes/resources`);
const bookingsRoutes = require(`./routes/bookings`);
const notificationRoutes = require(`./routes/notificationRoutes`);

//Connect to DB
const URL = process.env.MONGODB_URL;
mongoose.connect(URL)
  .then(() => console.log('MongoDB Connected Successfully!'));

//Middleware
app.use(express.json());
app.use(bodyParser.json());
  
//Route Middlewares 
app.use(`/api/user`, authRoute);
app.use(`/api/courses`, coursesRoutes);
app.use(`/api/sessions`, classSessionsRoutes);
app.use(`/api/resources`, resourcesRoutes);
app.use(`/api/bookings`, bookingsRoutes);
app.use(`/api/notifications`, notificationRoutes);

app.listen(PORT, ()=> {
    console.log(`Server is up and running on port number: ${PORT}`)
})

module.exports = app;



 

