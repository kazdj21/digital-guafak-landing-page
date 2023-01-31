const express = require("express");
const path = require("path");
const ejs = require("ejs");
const users = require("./routes/users");

const app = express();

const PORT = process.env.PORT || 3000;

app.use("/public", express.static(path.join(__dirname, "/public/")))
app.use(users);


app.set("view engine", "ejs");


app.get("/", function(req, res) {

    res.status(200).render("home");

});

app.get("*", function(req, res) {

    res.status(404).render("404");

})

app.listen(PORT, function() {

    console.log(__dirname);
    console.log("running");

})