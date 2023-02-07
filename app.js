const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let tasks = [];
let workItems = [];

app.get("/", (req, res) => {
  let day = date.getDate();
  res.render("list", { kindOfDay: day, newItems: tasks });
});

app.post("/", (req, res) => {
  let task = req.body.task;
  console.log(req.body);
  if (req.body.list === "Work List") {
    workItems.push(task);
    res.redirect("/work");
  } else {
    tasks.push(task);
    res.redirect("/");
  }
});

// get and post requests for another page
app.get("/work", (req, res) => {
  res.render("list", { kindOfDay: "Work List", newItems: workItems });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.listen("3000", () => {
  console.log("server is running on port 3000");
});
