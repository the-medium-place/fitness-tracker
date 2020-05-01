const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000

const db = require("./models");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitnessdb", {
    useNewUrlParser: true,
    useFindAndModify: false
});

//routes 
require("./routes/api-routes");


// dummy data
db.Workout.create({ name: "test workout" })
    .then(dbWorkout => {
        console.log(dbWorkout);
    })
    .catch(({ message }) => {
        console.log(message);
    });

const dummyObj = {
    name: "eat bananas",
    count: 20,
    unit: "bananas",
    notes: "only the green ones"
}

app.post("/api/exercises", (req, res) => {
    db.Exercise.create(dummyObj)
        .then(({ _id }) => db.Workout.findOneAndUpdate({}, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            console.log(dbWorkout);
        })
        .catch(err => {
            console.log(err);
        })

})

app.get("/populatedworkouts", (req, res) => {
    db.Workout.find({})
        .populate("exercises")
        .then(dbWorkout => {
            res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
})


// regimens routes
// app.get("/api/workouts", (req, res) => {
//     db.Workout.find()
//     .then(dbWorkout => {
//         res.json(dbWorkout);
//     })
//     .catch(err => {
//         res.json(err);
//     });
// });


app.post("/api/workouts", ({ body }, res) => {

    db.Workout.create({ name: body.name })
        .then(dbWorkout => {
            console.log(dbWorkout);

            res.send(dbWorkout)
            // displayWorkout();
        })
        .catch(({ message }) => {
            console.log(message);


        });
});




















app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
