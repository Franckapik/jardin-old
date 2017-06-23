const express = require('express'); 
const http = require('http');
const os = require('os');
const path = require('path');
const controller = require('./controller'); //controller.js
/**const cronData = require('./cronData'); //cronData.js permets d'écrire la base de donnée en arrière plan*/
const camera = require('raspberry-pi-mjpeg-server/raspberry-pi-mjpeg-server'); //port 8085

const app = express();


//routes
app.get ('/', controller.Index);
app.get ('/arrosage', controller.Arrosage);
app.get ('/niveaucuve', controller.MakeData);

app.listen(8080);
console.log("Le site du jardin est disponible sur le port 8080");

//configure app
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(__dirname + '/public'));