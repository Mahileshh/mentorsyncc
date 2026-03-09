require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const users = await User.find({}).limit(5);
        console.log("Sample Users:");
        users.forEach(u => {
            console.log(`- Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`);
        });

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUsers();
