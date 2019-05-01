var uid;
var user_email;

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
        // console.log(user);
        // console.log(user.uid);
        uid = user.uid;
        user_email = user.email;
        console.log(uid + " " + user_email);
        firebase.database().ref("/private/users").once('value', function (snap) {
            if (snap.hasChild(uid)) {
                console.log("User already in db");
            } else firebase.database().ref("private/users/" + uid).set({email:user_email});
        })

      } else {
        // No user is signed in.
        window.location = "sign_in.html";
      }
    });



    $("#connect_user_to_device").click(function () {
        var id_val = $("#device_id").val();
        firebase.database().ref('/unclaimed_esps').once('value').then(function(snap){
            var connected = false;
            for(var key in snap.val()){
                if (key.replace('esp','') === id_val) {
                    firebase.database().ref("/unclaimed_esps/esp" + id_val + "/user_path").set("/private/users/" + uid);
                    notify.suc("User Connected to ESP" + id_val, 3000);
                    connected = true;
                }
            }
            if (!connected) {
                notify.err("ESP ID: " + id_val + " does not exist");
            }
        });
    });
