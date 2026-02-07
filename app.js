const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const ExpressError = require("./utils/ExpressError");

// --- ROUTER IMPORTS ---
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");

// --- DATABASE CONNECTION ---
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// --- VIEW ENGINE SETUP ---
app.engine("ejs", ejsMate); // Fixes 'layout is not defined' error
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- STANDARD MIDDLEWARES ---
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(cookieParser("secretcode")); // Requirement for signed cookies

// --- SESSION CONFIGURATION ---
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 Days from now
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevents XSS attacks
    },
};

// --- INITIALIZE SESSION & FLASH ---
// Order: Session must come before Flash!
app.use(session(sessionOptions));
app.use(flash());

// --- LOCALS MIDDLEWARE ---
// Passes flash messages to every single EJS template automatically
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// --- MOUNTING ROUTERS ---
// Must come after session/flash/locals middleware
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// --- 404 & ERROR HANDLING ---
app.use((req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});