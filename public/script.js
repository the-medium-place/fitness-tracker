$(".new-workout").on("submit", function (event) {
    event.preventDefault();

    const newName = $("#reg-name-input").val().trim();

    $.ajax({
        url: "/api/workouts",
        method: "POST",
        data: { name: newName }
    }).then((dbWorkout) => {
        console.log(dbWorkout);
        location.reload();



    })
})


$(".new-exercise").on("submit", function(event) {
    event.preventDefault();
    console.log($(this).id);

    const exerName = $("#exer-name");
    const exerCount = $("#exer-count");
    const exerUnit = $("#exer-unit");
    const exerNotes = $("#exer-notes");




})



function populatePage() {
    $.ajax({
        url: "/populatedworkouts",
        method: "GET"
    })
        .then(dbWorkout => {

            for(i in dbWorkout){
                // console.log(test);
            //JQUERY TIME
            const titleDiv = $("<div>");
            titleDiv.attr("class", "workout-title");
            const title = dbWorkout[i].name;
            titleDiv.text(title);

            //make new div .workout-container #_id
            const workoutDiv = $("<div>");
            workoutDiv.attr("class", "workout-container");
            workoutDiv.attr("id", dbWorkout[i]._id);
            workoutDiv.append(titleDiv)

            //run through array of dbWorkout.exercises
            for(j in dbWorkout[i].exercises) {
                const exercises = dbWorkout[i].exercises[j];
                //for each exercise make new div .exercise-container
                const exerDiv = $("<div>");
                exerDiv.attr("class", "exercise-container");
                exerDiv.attr("id", exercises._id)

                //add exercise name
                const nameP = $("<p>");
                nameP.text(exercises.name);
                nameP.attr("class", "exercise-name")
                exerDiv.append(nameP);

                //add exercise count / units
                const countP = $("<p>");
                countP.text(`Repeat for ${exercises.count} ${exercises.unit}`);
                exerDiv.append(countP);

                //add exercise notes
                const notesP = $("<p>");
                notesP.text(`Notes: ${exercises.notes}`);
                exerDiv.append(notesP);

                //append div to parent div .workout-container
                workoutDiv.append(exerDiv);


            }
            //append workout div to div .workout-wrapper
            $(".workout-wrapper").append(workoutDiv);
        }
        })
}

populatePage();
