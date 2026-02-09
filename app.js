const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError.js");

// Routes
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");

// Database Connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => console.log("Connected to DB"))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// View Engine & Middleware Setup
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// 1. SESSION CONFIGURATION (Must be before Flash and Routes)
const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Security: Cookie not accessible via JS
    },
};

app.use(session(sessionOptions));
app.use(flash());

// 2. RES.LOCALS BRIDGE (Must be before Routes)
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// 3. MOUNTING ROUTES
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);

// Root Redirect
app.get("/", (req, res) => {
    res.redirect("/listings");
});

// 4. ERROR HANDLING

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