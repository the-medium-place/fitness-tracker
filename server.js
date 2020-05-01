const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000

const db = require("./models");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// dummy data
db.Regimen.create({name: "test regimen"})
.then(dbRegimen => {
    console.log(dbRegimen);
})
.catch(({ message }) => {
    console.log(message);
});


function displayRegiment(){
// regimens routes
app.get("/api/regimens", (req, res) => {
    db.Regimen.find()
    .then(dbRegimen => {
        res.json(dbRegimen);
    })
    .catch(err => {
        res.json(err);
    });
});
}

app.post("/api/regimens", (req, res) => {

    db.Regimen.create({name: req.name})
    .then(dbRegimen => {
        console.log(dbRegimen);
        displayRegiment();
    })
    .catch(({ message }) => {
        console.log(message);
    });
});




















app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
