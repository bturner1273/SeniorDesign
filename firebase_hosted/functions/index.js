const functions = require('firebase-functions');
const firebase = require('firebase-admin');
const express = require('express');
const engines = require('consolidate');
const app = express();

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

var esp_num = 0;


app.engine('hbs', engines.handlebars);
app.set('views', './views');
app.set('view engine', 'hbs');

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('sign_in');
});

app.get('/home.html', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.render('home');
});

app.get('/esp/unique_id', (req, res) => {
    // PUT CACHE CONTROL BACK AFTER TEST
    // res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.send({unique_id:esp_num});
    esp_num++;
})

app.get('/esp/service_key', (req, res) => {
    res.send({service_key:"W6ifglJeWnDehqxEDpRQK3HVeTbHVsVLMgtHl2Td"});
});

app.get('/key', (req, res) => {
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    res.send({key: "AIzaSyDi8KqMpIHqShxR2WJZO3eto5BL2mnObl0"});
});

app.get('*', (req, res) => {
  res.send('Sorry this page does not exist!', 404);
});


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.app = functions.https.onRequest(app);
