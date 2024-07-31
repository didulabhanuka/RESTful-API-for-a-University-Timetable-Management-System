const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        });

        console.log(`mongodb connected:: ${conn.connect.host}`);

    } catch(error) {
        console.error(`Error: ${error.message}`);
        process.exit();

    }
}

module.exports = connectDB;
