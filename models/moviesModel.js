const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    minlength: [3, "movies should have at least 3 characters"],
    required: [true, "the name is required field"],
  },
  rate: {
    required: true,
    type: Number,
    min: [1, "The rating must be a number between 1 and 10 (inclusive)"],
    max: [10, "The rating must be a number between 1 and 10 (inclusive)"],
  },
  description: {
    type: String,
    enum: {
      values: [
        "action",
        "comedy",
        "drama",
        "romantic",
        "crim",
        "drama",
        "historic",
      ],
      message: `Invalid genre!,choose action comedy drama romantic crim drama historic `,
    },
    lowercase: true,
    required: true,
  },
});

const moviesModel = mongoose.model("movies", movieSchema);
module.exports = moviesModel;
