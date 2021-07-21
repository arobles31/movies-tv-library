const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedBooks` array in User.js
const mediaSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  // saved book id from GoogleBooks
  mediaId: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
});

module.exports = mediaSchema;
