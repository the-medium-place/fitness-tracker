const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExerciseSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Activity Name"
  },
  count: {
    type: Number,
    required: "Activity Count"
  },
  unit: {
    type: String,
    required: "Units"
  },
  notes: String
});

const Exercise = mongoose.model("Exercise", ExerciseSchema);

module.exports = Exercise;
