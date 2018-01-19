$(document).ready(function () {

	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyAfwgybvMN5lmq_2cHeBkUrxlYr4ldlUW8",
	    authDomain: "trainscheduler-gt-dg.firebaseapp.com",
	    databaseURL: "https://trainscheduler-gt-dg.firebaseio.com",
	    projectId: "trainscheduler-gt-dg",
	    storageBucket: "trainscheduler-gt-dg.appspot.com",
	    messagingSenderId: "153017563398"
	  };
	
	firebase.initializeApp(config);

	var database = firebase.database();

	$("#add-train-btn").on("click", function(event){
		event.preventDefault();

		var trainName = $("#train-input").val().trim();
		var destinationName = $("#destination-input").val().trim();
		var trainTime = moment($("#first-train-input").val().trim(), "HH:mm").format("HH");
		var trainFrequency = $("#frequency-input").val().trim();

		var newTrain = {
			train: trainName,
			destination: destinationName,
			time: trainTime,
			frequency: trainFrequency
		};

		database.ref().push(newTrain);


		alert("Employee successfully added");

		//Clear text boxes
		$("#train-input").val("");
		$("#destination-input").val("");
		$("#first-train-input").val("");
		$("#frequency-input").val("");


		database.ref().on("child_added", function(childSnapshot){

			//Store everything into a variable
			var trnName = childSnapshot.val().train;
			var trnDestination = childSnapshot.val().destination;
			var trnTime = childSnapshot.val().time;
			var trnRate = childSnapshot.val().frequency;

			//Format time to military time
			var trnTimeFormatted = moment(trnTime).format("HH");

			//Calculations for next arrival and minutes away
			var firstTrainConverted = moment(trnTime, "HH").subtract(1,"years");

			var currentTime = moment();

		    var diffTime = moment().diff(moment(firstTrainConverted), "minutes");

		    // Time apart (remainder)
		    var tRemainder = diffTime % trnRate;

		    // Minutes away
		    var minutesAway = trnRate - tRemainder;

		    // Next arrival
		    var nextTrain = moment().add(minutesAway, "minutes").format("HH:mm");


			//Show train info in schedule table
			$("#train-schedule-table > tbody").append("<tr><td>" + trnName + "</td><td>" + trnDestination + "</td><td>" + trnRate + "</td><td>" + nextTrain + "</td><td>" + minutesAway + "</td></tr>");

		});
	});

});

