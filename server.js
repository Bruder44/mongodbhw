var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require models
var db = require("./models");
// Set port
var PORT = 8000;

// Setup Express
var app = express();

// Configure middleware

// For logging requests
app.use(logger("dev"));
// Body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Makes the public folder as a static directory
app.use(express.static("public"));

// Connects to the Mongo DB
//mongoose.connect("mongodb://localhost/ArticlesDB");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/ArticlesDB";
// Routing
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
// GET route for WorldCupSite
app.get("/scrape", function(req, res) {

  axios.get("https://www.fifa.com/worldcup/news/").then(function(response) {
    
    var $ = cheerio.load(response.data);
    
    // Targeting div class for headlines
    $("div.d3-o-media-object__body").each(function(i, element) {
      // Save an empty result object
      
      var result = {};

      // Adds the text and the href of the link and headline title text
      result.title = $(this).children("a").children("h3").text();
      result.link = $(this).children("a").attr("href");
    
    
    console.log(results);

      // Create a new Article using the `result` object built from scraping
      db.ArticlesDB.create(result)
        .then(function(ArticlesDB) {
          // View the added result in the console
          console.log(ArticlesDB);
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape, send confimation message
    res.send("Scrape Complete");
  });
});
// Route for homepage
app.get("/", function(req, res) {
    db.ArticlesDB.find({})
    .then(function(ArticlesDB) {
        res.json(ArticlesDB);
        }
    )
    .catch(function(err) {
        res.json(err);
});
});
// Route for retriving articles from the Database
app.get("/articles", function(req, res) {
  // Grabs every document within the ArticlesDB collection
  db.ArticlesDB.find({})
    .then(function(ArticlesDB) {
      // If we were able to successfully find ArticlesDB, then return back to the client
      res.json(ArticlesDB);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, in order to populate the article with users notes
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, set a query that will match the article ID with the one in our database
  db.ArticlesDB.findOne({ _id: req.params.id })
    //  populate all of the notes associated with that particular article
    .populate("note")
    .then(function(ArticlesDB) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(ArticlesDB);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving and updating Articles after User Note's have been left
app.post("/articles/:id", function(req, res) {
  // Creates a new note and passes it through the req.body into the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.ArticlesDB.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(ArticlesDB) {
      // After successfully updating an Article, this send it back to the client
      res.json(ArticlesDB);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Starts the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
