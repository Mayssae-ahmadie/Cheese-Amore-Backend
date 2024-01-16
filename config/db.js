const mongoose = require("mongoose");
const MONGODB_URL = process.env.MONGODB_URL;

async function connection() {
    try {
        await mongoose.connect(MONGODB_URL);
        console.log("connected successfully to the database");
    } catch (error) {
        console.log("error connecting to the database", error);
    }
}

module.exports = connection;