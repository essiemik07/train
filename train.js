var config = {
    apiKey: "AIzaSyBn-7OdnKYHOS99-STB3yiNlSyPOnv_nIU",
    authDomain: "train-3bfde.firebaseapp.com",
    databaseURL: "https://train-3bfde.firebaseio.com",
    projectId: "train-3bfde",
    storageBucket: "",
    messagingSenderId: "589148607118"
  };
  
  firebase.initializeApp(config);
  
  var database = firebase.database();

  var train = "";
  var trainDest = "";
  var trainFirst = "";
  var trainF = 0;
  var time = moment();
  var index = 0;

  var datetime = null,
  date = null;
  var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
  };

  $(document).ready(function(){
    datetime = $("#trainTable")
    update();
    setInterval(update, 1000);
  });
  
  $("#addTrainBtn").on("click", function(event) {
    event.preventDefault();
  
    train = $("#trainName").val().trim();
    trainDest = $("#dest").val().trim();
    trainFirst = moment($("#first").val().trim(), "HH:mm").format("X");
    trainF = $("#f").val().trim();

  
    var timeCon = moment(trainFirst, "hh:mm").subtract(1, "years");
  
    var timeDiff = moment().diff(moment(timeCon), "minutes");
  
    var timeRemain = timeDiff % trainF;
  
    var minLeft = trainF - timeRemain;
  
    var nextTrain = moment().add(minLeft, "minutes");
  
    var arrive = moment(nextTrain).format("hh:mm a");
    var nextArrivalUpdate = function() {
        date = moment(new Date())
        datetime.html(date.format('hh:mm a'));
    }

  database.ref().push({
    Name: train,
    destination: trainDest,
    First: trainFirst,
    frequency: trainF,
    minutes: minLeft,
    next: arrive,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
    $("#trainName").val("");
    $("#dest").val("");
    $("#first").val("");
    $("#f").val("");

  database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function(snapshot) {
    console.log("Train name: " + snapshot.val().train);
    console.log("Destination: " + snapshot.val().trainDest);
    console.log("First train: " + snapshot.val().trainFirst);
    console.log("Frequency: " + snapshot.val().trainF);
    console.log("Next train: " + snapshot.val().arrive);
    console.log("Minutes away: " + snapshot.val().minLeft);
  });
})
