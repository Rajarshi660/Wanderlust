const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => console.log("Connected to DB")).catch(err => console.log(err));
async function main() { await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust"); }

const initDB = async () => {
  await Listing.deleteMany({});
  
  const processedData = initData.data.map((obj) => ({
    ...obj,
    // Safety check: if price is missing in data.js, assign a default
    price: obj.price || 1000, 
    image: typeof obj.image === 'string' 
      ? { url: obj.image, filename: "listingimage" } 
      : obj.image
  }));

  await Listing.insertMany(processedData);
  console.log("Data was re-initialized safely.");
};

initDB();