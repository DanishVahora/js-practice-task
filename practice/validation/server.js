const express = require("express");
const path = require("path");
const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// GET form
app.get("/", (req, res) => {
    res.render("index", { errors: [], success: null });
});

// POST form
app.post(
    "/register",
    [
        body("name").isLength({ min: 6 }).withMessage("Name must be at least 6 chars"),
        body("email").isEmail().withMessage("Invalid email"),
        body("password").isLength({ min: 8 }).withMessage("Password min 8 chars"),
        body("age").isInt({ min: 18 }).withMessage("Age must be 18+")
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.render("index", {
                errors: errors.array(),
                success: null
            });
        }

        res.render("index", {
            errors: [],
            success: "Registration Successful ✅"
        });
    }
);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});