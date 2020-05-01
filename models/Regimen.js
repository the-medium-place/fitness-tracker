const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegimenSchema = new Schema({
    name: {
        type: String,
        required: "Please enter a name for this Exercise Regimen"
    },
    exercises: [
        {
            type: Schema.Types.ObjectId,
            ref: "Exercise"
        }
    ]
});

const Regimen = mongoose.model("Regimen", RegimenSchema);

module.exports = Regimen;