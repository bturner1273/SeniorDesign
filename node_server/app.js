var express = require("express");
var app = express();

app.get("/esp_service_id", function (req, res) {
    res.json({espnum: 0});
});

app.listen(3000, function () {
    console.log("Server started");
});
