$(document).ready(function () {
    var uid;
    var user_email;
    var device_key;

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
            uid = user.uid;
            user_email = user.email;
            console.log(uid + " " + user_email);
            firebase.database().ref("/private/users").once('value', function (snap) {
                if (snap.hasChild(uid)) {
                    console.log("User already in db");
                } else firebase.database().ref("private/users/" + uid).set({email:user_email});
            }).then(function () {
                $("#user_email").text(user_email);
                has_device();
                get_datum();
                $("#user_city").val("New York");
                $("#search_weather").click();
            });
          } else {
            // No user is signed in.
            window.location = "/";
          }
        });

        function has_device () {
            firebase.database().ref("/private/users/" + uid).once("value", function (snap) {
                for (var key in snap.val()) {
                    if (key.includes("esp")){
                        device_key = key;
                        setInterval(function () {
                            location.reload();
                        }, 5*60000);
                        console.log("user has device");
                    }
                }
            });
        }

        $("#clear_data").click(function () {
            firebase.database().ref("/private/users/" + uid).child(device_key).remove();
            notify.suc("Graph will reset on next refresh")
        });

        function get_datum () {
            var co2 = [];
            var h2 = [];
            var hum = [];
            var o2 = [];
            var temp = [];
            firebase.database().ref("/private/users/" + uid).once("value", function (snap) {
                for (var key in snap.val()) {
                    if (key.includes("esp")){
                        firebase.database().ref("/private/users/" + uid + "/" + key).once("value", function(child_snap){
                            for (var child_key in child_snap.val()) {
                                switch (child_key) {
                                    case "co2":
                                        firebase.database().ref("/private/users/" + uid + "/" + key + "/" + child_key).once("value", function (grand_child_snap) {
                                            for (var grand_child_key in grand_child_snap.val()) {
                                                if (grand_child_key !== "val") {
                                                    co2.push(Number(grand_child_snap.val()[grand_child_key]));
                                                }
                                            }
                                        });
                                        break;
                                    case "h2":
                                        firebase.database().ref("/private/users/" + uid + "/" + key + "/" + child_key).once("value", function (grand_child_snap) {
                                            for (var grand_child_key in grand_child_snap.val()) {
                                                if (grand_child_key !== "val") {
                                                    h2.push(Number(grand_child_snap.val()[grand_child_key]));
                                                }
                                            }
                                        });
                                        break;
                                    case "hum":
                                        firebase.database().ref("/private/users/" + uid + "/" + key + "/" + child_key).once("value", function (grand_child_snap) {
                                            for (var grand_child_key in grand_child_snap.val()) {
                                                if (grand_child_key !== "val") {
                                                    hum.push(Number(grand_child_snap.val()[grand_child_key]));
                                                }
                                            }
                                        });
                                        break;
                                    case "o2":
                                        firebase.database().ref("/private/users/" + uid + "/" + key + "/" + child_key).once("value", function (grand_child_snap) {
                                            for (var grand_child_key in grand_child_snap.val()) {
                                                if (grand_child_key !== "val") {
                                                    o2.push(Number(grand_child_snap.val()[grand_child_key]));
                                                }
                                            }
                                        });
                                        break;
                                    case "temp":
                                        firebase.database().ref("/private/users/" + uid + "/" + key + "/" + child_key).once("value", function (grand_child_snap) {
                                            for (var grand_child_key in grand_child_snap.val()) {
                                                if (grand_child_key !== "val") {
                                                    temp.push(Number(grand_child_snap.val()[grand_child_key]));
                                                }
                                            }
                                        });
                                        break;
                                    default:
                                        break;
                                }
                            }
                        });
                    }
                }
            });
            setTimeout(function () {
                load_graph(co2, h2, hum, o2, temp);
            }, 1000);
        }

        $("#search_weather").click(function () {
            console.log("Searching for your weather");
            firebase.database().ref("/private/users/" + uid + "/city").set($("#user_city").val());
            find_weather_details();
        });

        function http_request_async(url, callback)
        {
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = () => {
                if (httpRequest.readyState == 4 && httpRequest.status == 200)
                    callback(httpRequest.responseText);
            }
            httpRequest.open("GET", url, true); // true for asynchronous
            httpRequest.send();
        }

        function find_weather_details() {
            var key = "f6a7895fe7c7452588589e1c728e95c4";
            if ($("#user_city").val() === "") {

            }else {
                let searchLink = "https://api.openweathermap.org/data/2.5/weather?q=" + $("#user_city").val() + "&appid="+key;
                http_request_async(searchLink, _response);
             }
         }
         function _response(response) {
             var temperature = $("#temperature");
             var humidity = $("#humidity");
             var icon = $("#icon");
             var jsonObject = JSON.parse(response);
             // cityName.innerHTML = jsonObject.name;
             icon.attr("src", "http://openweathermap.org/img/w/" + jsonObject.weather[0].icon + ".png");
             temperature.html(parseInt(1.8*(jsonObject.main.temp - 273)+32) + "°F");
             humidity.html(jsonObject.main.humidity + "%");
         }

        function load_graph (co2, h2, hum, o2, temp) {
            //do plotting here
            var co2_trace = {
                name: "Carbon Dioxide",
                y: co2,
                type: 'line'
            }
            var h2_trace = {
                name: "Hydrogen",
                y: h2,
                type: 'line'
            }
            var hum_trace = {
                name: "Humidity",
                y: hum,
                type: 'line'
            }
            var o2_trace = {
                name: "Oxygen",
                y: o2,
                type: 'line'
            }
            var temp_trace = {
                name: "Temperature",
                y: temp,
                type: 'line'
            }
            var data = [co2_trace, h2_trace, hum_trace, o2_trace, temp_trace];
            var layout = {
                title: {
                    text:'Your Home',
                    font: {
                      family: 'Courier New, monospace',
                      size: 24
                    },
                    xref: 'paper',
                    x: 0.05,
                },
              // autosize: false,
              // width: 500,
              height: 250,
              margin: {
                l: 50,
                r: 50,
                b: 50,
                t: 50,
                pad: 4
              },
              paper_bgcolor: '#7f7f7f',
              plot_bgcolor: '#c7c7c7'
            };
            if (co2.length !== 0 && h2.length !== 0 && hum.length !== 0 && o2.length !== 0 && temp.length !== 0) {
                if ($(".svg-container").length === 0) {
                    Plotly.newPlot('plot', data, layout, {responsive: true});
                }
            }
        }

        $("#connect_user_to_device").click(function () {
            var id_val = $("#device_id").val();
            firebase.database().ref('/unclaimed_esps').once('value').then(function(snap){
                var connected = false;
                for(var key in snap.val()){
                    if (key.replace('esp','') === id_val) {
                        firebase.database().ref("/unclaimed_esps/esp" + id_val + "/user_path").set("/private/users/" + uid);
                        notify.suc("User Connected to ESP" + id_val, 3000);
                        connected = true;
                        setTimeout(function () {
                            location.reload();
                        }, 2000);
                    }
                }
                if (!connected) {
                    notify.err("ESP ID: " + id_val + " does not exist");
                }
            });
        });

});
