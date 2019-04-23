$(document).ready(function () {
    var config = {
        apiKey: "AIzaSyDi8KqMpIHqShxR2WJZO3eto5BL2mnObl0",
        authDomain: "smart-air-810ae.firebaseapp.com",
        databaseURL: "https://smart-air-810ae.firebaseio.com",
        projectId: "smart-air-810ae",
        storageBucket: "smart-air-810ae.appspot.com",
        messagingSenderId: "495437676642"
    };
    firebase.initializeApp(config);

    $("#sign_out").click(function () {
        sign_out();
    });

    function sign_out () {
        firebase.auth().signOut().then(function () {

        }).catch(function (err) {

        });
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
      } else {
        // No user is signed in.
        window.location = "sign_in.html";
      }
    });

});
