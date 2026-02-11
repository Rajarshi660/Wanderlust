const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  // FIXED: Image is defined as a String to handle direct URLs
  image: {
    type: String,
    default: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60",
    set: (v) => 
      v === "" 
        ? "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=60" 
        : v,
  },
  price: Number,
  location: String,
  country: String,
  // Linking reviews to the listing
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  // Linking an owner to the listing
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Middleware to delete all reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    const Review = require("./review"); // Import Review model here to avoid circular dependency
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;