const express = require("express");
const path = require("path");
const ejs = require("ejs");
const users = require("./routes/users");

const app = express();


app.use("/public", express.static(path.join(__dirname, "/public/")))
app.use(users);


app.set("view engine", "ejs");


app.get("/", function(req, res) {

    res.status(200).render("home");

});

app.get("*", function(req, res) {

    res.status(404).json({error: "404 not found"});

})

app.listen(8080, function() {

    console.log("running");

})