// server.js
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const DB_URI = "mongodb://localhost:27017/db1"; // Optional: Move to environment variable for security

// Connect to MongoDB
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((error) => console.error("MongoDB connection error:", error));

// Define Schema and Model
const s = new mongoose.Schema({
    name: String,
    age: Number,
    email: String,
    password: String,
});
const m = mongoose.model("Vinay123", s);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve CSS
app.use(express.static(path.join(__dirname, "views"))); // Serve views

// Routes
app.post("/submit", (req, res) => {
    const { name, age, email, password } = req.body;
    const newUser = new m({ name, age, email, password });

    newUser
        .save()
        .then(() => {
            fs.readFile(path.join(__dirname, "views", "response.html"), "utf-8", (err, data) => {
                if (err) {
                    return res.status(500).send("Error loading the HTML file.");
                }

                // Replace placeholders with user data
                const modifiedHtml = data
                    .replace("{{name}}", name)
                    .replace("{{age}}", age)
                    .replace("{{email}}", email)
                    .replace("{{password}}", password);

                res.send(modifiedHtml);
            });
        })
        .catch((err) => {
            res.status(500).send("Error saving data: " + err);
        });
});

// Start Server
app.listen(3001, () => {
    console.log("The server is running at http://localhost:3001");
});
