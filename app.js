const express = require('express');
const http = require('http');
const os = require('os');
const path = require('path');
const controller = require('./controller'); //controller.js
const cronData = require('./cronData'); //cronData.js permets d'écrire la base de donnée en arrière plan.

const app = express();


//routes
app.get ('/', controller.Index);

cronData.job;
app.listen(8080);
console.log("Le site du jardin est disponible sur le port 8080");

//configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(__dirname + '/public'));
