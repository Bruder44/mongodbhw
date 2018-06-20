var mongoose = require("mongoose");

// Saves the reference to the Schema constructor
var Schema = mongoose.Schema;

// Creating a new UserSchema object using the Schema constructor
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  Note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// This creates our model from the above schema, using mongoose schema model method
var ArticlesDB = mongoose.model("Article", ArticleSchema);

// Exports the ArticlesDB model
module.exports = ArticlesDB;