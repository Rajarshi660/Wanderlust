const mongoose = require("mongoose");
const initData = require("./data.js"); // Ensure this matches your variable usage below
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then(() => {
        console.log("Connected to DB");
        initDB(); // Call the function only after connection is successful
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    try {
        await Listing.deleteMany({}); // Clears existing data
        await Listing.insertMany(initData.data); // Insert data from data.js
        console.log("Data was initialized");
    } catch (err) {
        console.log("Error initializing database:", err);
    }
};