
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
        console.log(user);
        console.log(user.email);
      } else {
        // No user is signed in.
        window.location = "/";
      }
    });

    $("#connect_user_to_device").click(function () {
        var id_val = $("#device_id").val();
        notify.suc("User Connected");
    });


    // firebase.database().ref('/unclaimed_esps').once('value').then(function(snap){
    //     for(var key in snap.val()){
    //         console.log(key);
    //         console.log(snap.val()[key]);
    //         console.log(snap.val()[key].user_path);
    //     }
    // });
