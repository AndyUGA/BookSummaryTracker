var ObjectID = require("mongodb").ObjectID;
const MongoClient = require("../../node_modules/mongodb").MongoClient;
const db = require("../../config/db");

module.exports = function(app, db) {
  var currentContent = "";
  var currentTitle = "";

  //Display home page
  app.get("/", (req, res) => {
    //Renders index.ejs in vikews directory
    res.redirect("/getListOfBooks");
  });

  //Display list of books being read by user (ListOfBooks.ejs)
  app.get("/getListOfBooks", (req, res) => {
    db.listCollections().toArray(function(err, result) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        //Render ListOfBooks.ejs in views directory
        res.render("ListOfBooks", { result: result });
      }
    });
  });

  //Dislay notes for book entry
  app.get("/:name/getNotes/", (req, res) => {
    const name = req.params.name;

    //Find info about book summary based on the object id
    db.collection(name)
      .find({})
      .toArray((err, BookInfo) => {
        if (err) {
          res.send({ error: " An error has occurred" });
        } else {
          res.render("BookNotes", { BookInfo: BookInfo, name: name });
        }
      });
  });

  //Display form to create book entry
  app.get("/BookEntryForm", (req, res) => {
    res.render("forms/createBookEntry");
  });

  //Display form to update to book note
  app.get("/updateBookNote/:id/:name", (req, res) => {
    const id = req.params.id;
    const name = req.params.name;
    var collection = db.collection(name);
    var content = "";

    collection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        console.log("75 Result is ");
        console.log(result);

        //Checks ot see
        for (var i = 0; i < result.length; i++) {
          if (result[i]._id == id) {
            content = result[i].content;
          }
        }

        res.render("forms/updateBookNote", {
          content: content,
          id: id,
          name: name
        });
      }
    });
  });

  //Display form to create new note for book entry
  app.get("/createNoteForm/:name", (req, res) => {
    const name = req.params.name;
    var collection = db.collection(name);

    collection.find({}).toArray(function(err, result) {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.render("forms/createNote", { BookInfo: result, name: name });
      }
    });
  });

  //Delete Book Entry
  app.delete("/:name/DeleteCollection", (req, res) => {
    console.log(req.params);
    const name = req.params.name;

    var collection = db.collection(name);
    collection.drop();

    res.redirect("/getListOfBooks");
  });

  //Delete Note based on id
  app.delete("/:name/:id", (req, res) => {
    const id = req.params.id;
    const name = req.params.name;

    const details = { _id: ObjectID(id) };

    db.collection(name).remove(details, (err, item) => {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        console.log("Note delete!");
        res.redirect("/" + name + "/getNotes/");
      }
    });
  });

  //Create book entry
  app.post("/createBookEntry", (req, res) => {
    MongoClient.connect(
      "mongodb://andy:test123@ds129085.mlab.com:29085/bookentries",
      function(err, db) {
        if (err) throw err;
        var dbo = db.db("bookentries");
        dbo.createCollection(req.body.title, function(err, res) {
          if (err) throw err;
          console.log("Collection created!");
          db.close();
        });
        res.redirect("/getListOfBooks");
      }
    );
  });

  //Create new note for book entry
  app.post("/createNote/:name", (req, res) => {
    const name = req.params.name;
    const note = { content: req.body.content };
    db.collection(name).insert(note, (err, item) => {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.redirect("/" + name + "/getNotes");
      }
    });
  });

  //Update book summary based on id

  app.put("/:id/:name/updateNotes", (req, res) => {
    const id = req.params.id;
    const name = req.params.name;

    const note = { content: req.body.content };

    const details = { _id: new ObjectID(id) };
    db.collection(name).update(details, note, (err, item) => {
      if (err) {
        res.send({ error: " An error has occurred" });
      } else {
        res.redirect("/" + name + "/getNotes");
      }
    });
  });
};
