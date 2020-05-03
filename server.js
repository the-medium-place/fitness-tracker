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
    .populate("exercises").sort({date:-1}).lean() //.lean() to make JSON object from Mongoose object
    .then(dbWorkout => {   

        res.render("index", {workouts: dbWorkout})
        // res.json(dbWorkout);
    })
    .catch(err => {
        res.json(err);
    });

})

app.post("/api/exercises", ({ body }, res) => {
    const newObj = {
        name: body.name,
        count: body.count,
        unit: body.unit,
        notes: body.notes
    }
    console.log("server side")
    console.table(newObj);

    db.Exercise.create(newObj)
        .then(({ _id }) => db.Workout.findOneAndUpdate({_id: body._id}, { $push: { exercises: _id } }, { new: true }))
        .then(dbWorkout => {
            console.log(dbWorkout);
            res.send(dbWorkout);
        })
        .catch(err => {
            console.log(err);
            res.send(err);
        })
})

app.put("/api/exercises", (req, res) => {
  
    db.Exercise.findOneAndUpdate({_id: req.body._id}, req.body, { new: true })
// WORKING HERE RIGHT NOW FIGURE OUT HOW TO UPDAT THE INFO ON THE FOUND INFO
    .then(dbExercise => {
        res.send(dbExercise);
        console.log(dbExercise);
    })
    .catch(err => {
        res.send(err);
        console.log(err);
    })

})

app.get("/populatedworkouts", (req, res) => {
    db.Workout.find({}).sort({date:'asc'})
        .populate("exercises")
        .then(dbWorkout => {
            // dbWorkout = dbWorkout.reverse();
            res.render({workouts: dbWorkout})
            // res.json(dbWorkout);
        })
        .catch(err => {
            res.json(err);
        });
})



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


app.delete("/api/exercises", ({ body }, res) => {
    db.Exercise.deleteOne({_id: body._id}, function(err) {
        if(err) throw err;
        console.log("successful deletion");
        res.redirect("/")
    })
})

app.delete("/api/workouts", ({ body }, res) => {
    db.Workout.deleteOne({_id: body._id}, function(err){
        if(err) throw err;
        console.log('successful deletion');
        res.redirect("/")
    })
})




















app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
});
