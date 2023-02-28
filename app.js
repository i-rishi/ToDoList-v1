const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const lodash = require("lodash");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
// connecting mongoose database
mongoose.set("strictQuery", false);
mongoose.connect(
  "mongodb+srv://admin-rishi:"+process.env.DB_PASS+"@atlascluster.e15qmbl.mongodb.net/?retryWrites=true&w=majority",
  { useNewUrlParser: true },
  () => {
    console.log("Database connected successfully");
  }
);
// getting updated date
const day = date.getDate();

// creating schema for todolist items
const itemSchema = mongoose.Schema({
  name: String,
});

const listSchema = mongoose.Schema({
  name: String,
  listItems: [itemSchema],
});

const Task = mongoose.model("Task", itemSchema);
const List = mongoose.model("List", listSchema);

// preloaded documents by default
const t1 = new Task({
  name: "Morning Pooja",
});

const t2 = new Task({
  name: "Study",
});

const t3 = new Task({
  name: "Play Game",
});

const preLoadItems = [t1, t2, t3];

app.get("/", (req, res) => {
  // getting data back from the database
  Task.find((err, task) => {
    if (task.length === 0) {
      Task.insertMany(preLoadItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Data inserted");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { kindOfDay: day, newItems: task });
    }
  });
});

// get request for creating dynamic pages
app.get("/:listId", (req, res) => {
  const listID = lodash.capitalize(req.params.listId);

  List.findOne({ name: listID }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // creating a new list
        const list = new List({
          name: listID,
          listItems: preLoadItems,
        });
        list.save();
        res.redirect("/" + listID);
      } else {
        res.render("list", {
          kindOfDay: foundList.name,
          newItems: foundList.listItems,
        });
      }
    }
  });
});

// post request for addding tasks in the list
app.post("/", (req, res) => {
  const taskName = req.body.task;
  const listName = req.body.list;
  // inserting new items by user

  if (taskName.length === 0) {
    res.render("error");
  } else {
    const task = new Task({
      name: taskName.substring(0, 15),
    });
    if (listName === day) {
      // saving the inserted item to data base
      task.save();
      // redirecting back to the home route
      res.redirect("/");
    } else {
      List.findOne({ name: listName }, (err, foundList) => {
        foundList.listItems.push(task);
        foundList.save();
        res.redirect("/" + listName);
      });
    }
  }
});

//post request for deleting item from the todo list
app.post("/delete", (req, res) => {
  const checkedItem = req.body.checkedItem;
  const listName = req.body.listName;

  if (listName === day) {
    const del = new Task({
      _id: checkedItem,
    });
    del.remove();
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { listItems: { _id: checkedItem } } },
      (err, foundList) => {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
  }
});

// get and post requests for another page
// app.get("/work", (req, res) => {
//   res.render("list", { kindOfDay: "Work List", newItems: workItems });
// });

// app.get("/about", (req, res) => {
//   res.render("about");
// });

app.listen("3000", () => {
  console.log("server is running on port 3000");
});
