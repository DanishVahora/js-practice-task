const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

let data = {
    name: "Danish",
    hobbies: ["playing chess", "problem solving", "sleeping"]
}

app.get("/", (req, res) => {
    res.render("home", { data: data });
});

app.get("/grid", (req, res) => {
    res.render("grid", { data: data });
});

app.get("/traffic", (req, res) => {
    res.render("traffic", { data: data });
});

app.get("/form", (req, res) => {
    res.render("form", { data: data });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});