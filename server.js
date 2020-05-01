const express = require("express");
const mongoose = require("mongoose");
var exphbs = require("express-handlebars");

const PORT = process.env.PORT || 3000


const db = require("./models");

const app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/fitnessdb", {
    useNewUrlParser: true,
    useFindAndModify: false
});

app.get("/", (req,res) => {
    db.Workout.find({})
    .populate("exercises").lean() //.lean() to make JSON object from Mongoose object
    .then(dbWorkout => {   

        res.render("index", {workouts: dbWorkout})
        // res.json(dbWorkout);
    })
    .catch(err => {
        res.json(err);
    });

})


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

app.post("/api/exercises", ({ body }, res) => {
    const newObj = {
        name: body.name,
        count: body.count,
        unit: body.unit,
        notes: body.notes
    }

    db.Exercise.create(newObj)
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
            res.render({workouts: dbWorkout})
            // res.json(dbWorkout);
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
